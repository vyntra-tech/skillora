import { Request, Response } from 'express';
import slugify from 'slugify';
import { Internship } from '../models/Internship';
import { Company } from '../models/Company';
import { Category } from '../models/Category';
import { Location } from '../models/Location';
import { AuthRequest } from '../middleware/auth';

const generateUniqueSlug = async (title: string, currentId?: string): Promise<string> => {
  const baseSlug = slugify(title, { lower: true, strict: true }) || 'internship-opening';
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Internship.findOne({ slug });
    if (!existing || (currentId && existing._id.toString() === currentId)) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

export const getInternships = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      keyword,
      category,
      location,
      workMode,
      featured,
      status,
      page = 1,
      limit = 12,
      allStatus = 'false',
    } = req.query;

    const query: any = {};

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
      ];
    }

    if (category) {
      query.categoryName = new RegExp(String(category), 'i');
    }

    if (location) {
      query.locationName = new RegExp(String(location), 'i');
    }

    if (workMode && workMode !== 'All') {
      query.workMode = workMode;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(100, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [internships, total] = await Promise.all([
      Internship.find(query)
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('companyId', 'name slug logo')
        .populate('categoryId', 'name slug')
        .populate('locationId', 'city state')
        .lean(),
      Internship.countDocuments(query),
    ]);

    const now = new Date().getTime();
    const formatted = internships.map((item) => {
      const deadlineTime = new Date(item.deadline).getTime();
      const diffDays = Math.max(0, Math.ceil((deadlineTime - now) / (1000 * 60 * 60 * 24)));
      return {
        ...item,
        remainingDays: diffDays,
      };
    });

    res.json({
      success: true,
      data: formatted,
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

export const getInternshipBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const internship = await Internship.findOne({ slug })
      .populate('companyId')
      .populate('categoryId')
      .populate('locationId');

    if (!internship) {
      res.status(404).json({ success: false, message: 'Internship not found' });
      return;
    }

    Internship.findByIdAndUpdate(internship._id, { $inc: { viewsCount: 1 } }).exec();

    const related = await Internship.find({
      _id: { $ne: internship._id },
      status: 'published',
    })
      .limit(4)
      .lean();

    res.json({
      success: true,
      data: internship,
      relatedInternships: related,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createInternship = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      companyId,
      categoryId,
      locationId,
      workMode,
      duration,
      stipend,
      skills = [],
      description,
      requirements = [],
      perks = [],
      deadline,
      applyUrl,
      featured = false,
      status = 'published',
    } = req.body;

    const [company, category, location] = await Promise.all([
      Company.findById(companyId),
      Category.findById(categoryId),
      Location.findById(locationId),
    ]);

    if (!company) {
      res.status(400).json({ success: false, message: 'Invalid company selected' });
      return;
    }

    const slug = await generateUniqueSlug(title);

    const internship = await Internship.create({
      title,
      slug,
      companyId,
      companyName: company.name,
      companyLogo: company.logo,
      categoryId,
      categoryName: category?.name || 'General',
      locationId,
      locationName: location?.city || 'India',
      workMode: workMode || 'On-site',
      duration: duration || '3 Months',
      stipend: stipend || 'Unpaid / Certificate',
      skills: Array.isArray(skills) ? skills : typeof skills === 'string' ? skills.split(',').map((s) => s.trim()) : [],
      description,
      requirements: Array.isArray(requirements) ? requirements : [],
      perks: Array.isArray(perks) ? perks : [],
      deadline: new Date(deadline),
      applyUrl: applyUrl || '',
      featured: Boolean(featured),
      status: status || 'published',
    });

    res.status(201).json({
      success: true,
      message: 'Internship created successfully',
      data: internship,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInternship = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const internship = await Internship.findById(id);
    if (!internship) {
      res.status(404).json({ success: false, message: 'Internship not found' });
      return;
    }

    if (updateData.title && updateData.title !== internship.title && !updateData.slug) {
      updateData.slug = await generateUniqueSlug(updateData.title, id);
    }

    if (updateData.companyId && updateData.companyId !== String(internship.companyId)) {
      const company = await Company.findById(updateData.companyId);
      if (company) {
        updateData.companyName = company.name;
        updateData.companyLogo = company.logo;
      }
    }

    if (typeof updateData.skills === 'string') {
      updateData.skills = updateData.skills.split(',').map((s: string) => s.trim());
    }

    const updated = await Internship.findByIdAndUpdate(id, updateData, { new: true });

    res.json({
      success: true,
      message: 'Internship updated successfully',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInternship = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Internship.findByIdAndDelete(id);
    res.json({ success: true, message: 'Internship deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

