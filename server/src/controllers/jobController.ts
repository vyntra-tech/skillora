import { Request, Response } from 'express';
import slugify from 'slugify';
import { Job } from '../models/Job';
import { Company } from '../models/Company';
import { Category } from '../models/Category';
import { Location } from '../models/Location';
import { Batch } from '../models/Batch';
import { AuthRequest } from '../middleware/auth';

const generateUniqueSlug = async (title: string, currentId?: string): Promise<string> => {
  const baseSlug = slugify(title, { lower: true, strict: true }) || 'job-opening';
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Job.findOne({ slug });
    if (!existing || (currentId && existing._id.toString() === currentId)) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      keyword,
      category,
      location,
      city,
      workMode,
      jobType,
      experience,
      batch,
      company,
      minSalary,
      maxSalary,
      featured,
      status,
      closingSoon,
      sort = 'latest',
      page = 1,
      limit = 12,
      allStatus = 'false',
    } = req.query;

    const query: any = {};

    // For public website, only show published jobs whose deadline hasn't passed unless admin requests all
    if (allStatus !== 'true') {
      query.status = 'published';
      query.deadline = { $gte: new Date() };
    } else if (status) {
      query.status = status;
    }

    if (keyword) {
      const searchRegex = new RegExp(String(keyword), 'i');
      query.$or = [
        { title: searchRegex },
        { companyName: searchRegex },
        { skills: searchRegex },
        { description: searchRegex },
        { locationName: searchRegex },
      ];
    }

    if (category) {
      // Find category by slug or id or name
      const catDoc = await Category.findOne({
        $or: [{ slug: category }, { name: new RegExp(`^${category}$`, 'i') }],
      });
      if (catDoc) {
        query.categoryId = catDoc._id;
      } else {
        query.categoryName = new RegExp(String(category), 'i');
      }
    }

    const cityParam = city || location;
    if (cityParam) {
      const locDoc = await Location.findOne({
        $or: [{ slug: cityParam }, { city: new RegExp(`^${cityParam}$`, 'i') }],
      });
      if (locDoc) {
        query.locationId = locDoc._id;
      } else {
        query.locationName = new RegExp(String(cityParam), 'i');
      }
    }

    if (workMode && workMode !== 'All') {
      query.workMode = workMode;
    }

    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    if (experience && experience !== 'All') {
      query.experience = new RegExp(String(experience), 'i');
    }

    if (batch && batch !== 'All') {
      const batchDoc = await Batch.findOne({ year: batch });
      if (batchDoc) {
        query.batchIds = batchDoc._id;
      } else {
        query.batchYears = batch;
      }
    }

    if (company) {
      query.companyName = new RegExp(String(company), 'i');
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (minSalary) {
      query.salaryMin = { $gte: Number(minSalary) };
    }

    if (maxSalary) {
      query.salaryMax = { $lte: Number(maxSalary) };
    }

    // Closing soon logic: deadline within next 7 days
    if (closingSoon === 'true') {
      const now = new Date();
      const inSevenDays = new Date();
      inSevenDays.setDate(inSevenDays.getDate() + 7);
      query.deadline = { $gte: now, $lte: inSevenDays };
    }

    // Sorting
    let sortObj: any = { featured: -1, createdAt: -1 };
    if (sort === 'latest') {
      sortObj = { createdAt: -1 };
    } else if (sort === 'salary_high') {
      sortObj = { salaryMax: -1, salaryMin: -1 };
    } else if (sort === 'salary_low') {
      sortObj = { salaryMin: 1 };
    } else if (sort === 'deadline') {
      sortObj = { deadline: 1 };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(100, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .populate('companyId', 'name slug logo website industry')
        .populate('categoryId', 'name slug icon')
        .populate('locationId', 'city state country')
        .lean(),
      Job.countDocuments(query),
    ]);

    // Attach remaining days calculation
    const now = new Date().getTime();
    const formattedJobs = jobs.map((job) => {
      const deadlineTime = new Date(job.deadline).getTime();
      const diffDays = Math.max(0, Math.ceil((deadlineTime - now) / (1000 * 60 * 60 * 24)));
      return {
        ...job,
        remainingDays: diffDays,
        isClosingSoon: diffDays <= 7 && diffDays >= 0,
      };
    });

    res.json({
      success: true,
      data: formattedJobs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClosingSoonJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 6;
    const now = new Date();
    const inSevenDays = new Date();
    inSevenDays.setDate(inSevenDays.getDate() + 10);

    const jobs = await Job.find({
      status: 'published',
      deadline: { $gte: now, $lte: inSevenDays },
    })
      .sort({ deadline: 1 })
      .limit(limit)
      .populate('companyId', 'name slug logo')
      .lean();

    const formattedJobs = jobs.map((job) => {
      const deadlineTime = new Date(job.deadline).getTime();
      const diffDays = Math.max(0, Math.ceil((deadlineTime - now.getTime()) / (1000 * 60 * 60 * 24)));
      return {
        ...job,
        remainingDays: diffDays,
      };
    });

    res.json({
      success: true,
      data: formattedJobs,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const job = await Job.findOne({ slug })
      .populate('companyId')
      .populate('categoryId')
      .populate('locationId')
      .populate('batchIds');

    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    // Increment views asynchronously
    Job.findByIdAndUpdate(job._id, { $inc: { viewsCount: 1 } }).exec();

    // Related jobs in the same category or company
    const relatedJobs = await Job.find({
      _id: { $ne: job._id },
      status: 'published',
      $or: [{ categoryId: job.categoryId }, { companyId: job.companyId }],
    })
      .limit(4)
      .lean();

    const deadlineTime = new Date(job.deadline).getTime();
    const now = new Date().getTime();
    const remainingDays = Math.max(0, Math.ceil((deadlineTime - now) / (1000 * 60 * 60 * 24)));

    res.json({
      success: true,
      data: {
        ...job.toObject(),
        remainingDays,
      },
      relatedJobs,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      companyId,
      categoryId,
      locationId,
      jobType,
      workMode,
      experience,
      batchIds = [],
      batchYears = [],
      salaryMin,
      salaryMax,
      salaryCurrency,
      salaryPeriod,
      skills = [],
      description,
      responsibilities = [],
      requirements = [],
      benefits = [],
      applicationUrl,
      deadline,
      featured = false,
      status = 'published',
      seoTitle,
      seoDescription,
    } = req.body;

    if (!title || !companyId || !categoryId || !locationId || !deadline || !description) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, company, category, location, deadline, description.',
      });
      return;
    }

    const [company, category, location] = await Promise.all([
      Company.findById(companyId),
      Category.findById(categoryId),
      Location.findById(locationId),
    ]);

    if (!company) {
      res.status(400).json({ success: false, message: 'Selected company does not exist.' });
      return;
    }

    const slug = await generateUniqueSlug(title);

    const job = await Job.create({
      title,
      slug,
      companyId,
      companyName: company.name,
      companyLogo: company.logo,
      categoryId,
      categoryName: category?.name || 'General',
      locationId,
      locationName: location?.city || 'India',
      jobType: jobType || 'Full-time',
      workMode: workMode || 'On-site',
      experience: experience || '0-2 Years',
      batchIds,
      batchYears,
      salaryMin: Number(salaryMin) || 0,
      salaryMax: Number(salaryMax) || 0,
      salaryCurrency: salaryCurrency || '₹',
      salaryPeriod: salaryPeriod || 'LPA',
      skills: Array.isArray(skills) ? skills : typeof skills === 'string' ? skills.split(',').map((s) => s.trim()) : [],
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      applicationUrl: applicationUrl || '',
      deadline: new Date(deadline),
      featured: Boolean(featured),
      status: status || 'published',
      seoTitle: seoTitle || `${title} at ${company.name} | TalentPulse`,
      seoDescription: seoDescription || `${title} job vacancy at ${company.name}. Apply now!`,
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const job = await Job.findById(id);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    if (updateData.title && updateData.title !== job.title && !updateData.slug) {
      updateData.slug = await generateUniqueSlug(updateData.title, id);
    }

    if (updateData.companyId && updateData.companyId !== String(job.companyId)) {
      const company = await Company.findById(updateData.companyId);
      if (company) {
        updateData.companyName = company.name;
        updateData.companyLogo = company.logo;
      }
    }

    if (updateData.categoryId && updateData.categoryId !== String(job.categoryId)) {
      const cat = await Category.findById(updateData.categoryId);
      if (cat) updateData.categoryName = cat.name;
    }

    if (updateData.locationId && updateData.locationId !== String(job.locationId)) {
      const loc = await Location.findById(updateData.locationId);
      if (loc) updateData.locationName = loc.city;
    }

    if (typeof updateData.skills === 'string') {
      updateData.skills = updateData.skills.split(',').map((s: string) => s.trim());
    }

    const updatedJob = await Job.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const duplicateJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const original = await Job.findById(id);

    if (!original) {
      res.status(404).json({ success: false, message: 'Job to duplicate not found' });
      return;
    }

    const newTitle = `${original.title} (Copy)`;
    const newSlug = await generateUniqueSlug(newTitle);

    const copyData = original.toObject();
    delete copyData._id;
    delete (copyData as any).id;
    delete (copyData as any).createdAt;
    delete (copyData as any).updatedAt;

    copyData.title = newTitle;
    copyData.slug = newSlug;
    copyData.status = 'draft';
    copyData.viewsCount = 0;
    copyData.applicationsCount = 0;

    const duplicatedJob = await Job.create(copyData);

    res.status(201).json({
      success: true,
      message: 'Job duplicated as draft successfully',
      data: duplicatedJob,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJobStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published', 'archived', 'expired', 'closed'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status value' });
      return;
    }

    const job = await Job.findByIdAndUpdate(id, { status }, { new: true });
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    res.json({
      success: true,
      message: `Job status updated to ${status}`,
      data: job,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

