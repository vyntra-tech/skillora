import { Request, Response } from 'express';
import slugify from 'slugify';
import { Company } from '../models/Company';
import { Job } from '../models/Job';
import { Internship } from '../models/Internship';
import { AuthRequest } from '../middleware/auth';

const generateUniqueSlug = async (name: string, currentId?: string): Promise<string> => {
  const baseSlug = slugify(name, { lower: true, strict: true }) || 'company';
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Company.findOne({ slug });
    if (!existing || (currentId && existing._id.toString() === currentId)) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

export const getCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { keyword, industry, featured, status = 'published', page = 1, limit = 12, allStatus = 'false' } = req.query;

    const query: any = {};
    if (allStatus !== 'true') {
      query.status = 'published';
    } else if (status && status !== 'all') {
      query.status = status;
    }

    if (keyword) {
      const regex = new RegExp(String(keyword), 'i');
      query.$or = [{ name: regex }, { industry: regex }, { location: regex }, { description: regex }];
    }

    if (industry && industry !== 'All') {
      query.industry = new RegExp(String(industry), 'i');
    }

    if (featured === 'true') {
      query.featured = true;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(100, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [companies, total] = await Promise.all([
      Company.find(query)
        .sort({ featured: -1, name: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Company.countDocuments(query),
    ]);

    // Attach active jobs and internships counts dynamically
    const companyIds = companies.map((c) => c._id);
    const [jobsAgg, internshipsAgg] = await Promise.all([
      Job.aggregate([
        { $match: { companyId: { $in: companyIds }, status: 'published', deadline: { $gte: new Date() } } },
        { $group: { _id: '$companyId', count: { $sum: 1 } } },
      ]),
      Internship.aggregate([
        { $match: { companyId: { $in: companyIds }, status: 'published', deadline: { $gte: new Date() } } },
        { $group: { _id: '$companyId', count: { $sum: 1 } } },
      ]),
    ]);

    const jobsMap = new Map(jobsAgg.map((j) => [String(j._id), j.count]));
    const internMap = new Map(internshipsAgg.map((i) => [String(i._id), i.count]));

    const enriched = companies.map((c) => ({
      ...c,
      activeJobsCount: jobsMap.get(String(c._id)) || 0,
      activeInternshipsCount: internMap.get(String(c._id)) || 0,
    }));

    res.json({
      success: true,
      data: enriched,
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

export const getCompanyBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const company = await Company.findOne({ slug }).lean();

    if (!company) {
      res.status(404).json({ success: false, message: 'Company not found' });
      return;
    }

    const [jobs, internships] = await Promise.all([
      Job.find({ companyId: company._id, status: 'published' }).sort({ createdAt: -1 }).lean(),
      Internship.find({ companyId: company._id, status: 'published' }).sort({ createdAt: -1 }).lean(),
    ]);

    res.json({
      success: true,
      data: {
        ...company,
        jobs,
        internships,
        stats: {
          totalJobs: jobs.length,
          totalInternships: internships.length,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCompany = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      logo,
      website,
      industry,
      location,
      description,
      companySize,
      foundedYear,
      socialLinks,
      featured = false,
      status = 'published',
    } = req.body;

    if (!name || !industry || !location || !description) {
      res.status(400).json({ success: false, message: 'Name, industry, location, and description are required.' });
      return;
    }

    const slug = await generateUniqueSlug(name);

    const company = await Company.create({
      name,
      slug,
      logo: logo || '',
      website: website || '',
      industry,
      location,
      description,
      companySize: companySize || '50-200',
      foundedYear: Number(foundedYear) || 2018,
      socialLinks: socialLinks || {},
      featured: Boolean(featured),
      status: status || 'published',
    });

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCompany = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const company = await Company.findById(id);
    if (!company) {
      res.status(404).json({ success: false, message: 'Company not found' });
      return;
    }

    if (updateData.name && updateData.name !== company.name && !updateData.slug) {
      updateData.slug = await generateUniqueSlug(updateData.name, id);
    }

    const updated = await Company.findByIdAndUpdate(id, updateData, { new: true });

    // Update company name/logo across active jobs and internships if changed
    if (updateData.name || updateData.logo) {
      const patchObj: any = {};
      if (updateData.name) patchObj.companyName = updateData.name;
      if (updateData.logo) patchObj.companyLogo = updateData.logo;

      await Promise.all([
        Job.updateMany({ companyId: id }, { $set: patchObj }),
        Internship.updateMany({ companyId: id }, { $set: patchObj }),
      ]);
    }

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCompany = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Company.findByIdAndDelete(id);
    res.json({ success: true, message: 'Company deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

