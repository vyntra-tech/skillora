import { Request, Response } from 'express';
import slugify from 'slugify';
import { Category } from '../models/Category';
import { Job } from '../models/Job';
import { AuthRequest } from '../middleware/auth';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { allStatus = 'false', featured } = req.query;
    const query: any = {};

    if (allStatus !== 'true') {
      query.status = 'published';
    }

    if (featured === 'true') {
      query.featured = true;
    }

    const categories = await Category.find(query).sort({ displayOrder: 1, name: 1 }).lean();

    // Dynamically calculate active jobs for each category
    const categoryIds = categories.map((c) => c._id);
    const jobsAgg = await Job.aggregate([
      { $match: { categoryId: { $in: categoryIds }, status: 'published', deadline: { $gte: new Date() } } },
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
    ]);

    const jobsMap = new Map(jobsAgg.map((j) => [String(j._id), j.count]));
    const result = categories.map((cat) => ({
      ...cat,
      jobsCount: jobsMap.get(String(cat._id)) || 0,
    }));

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, icon, description, status = 'published', displayOrder = 0, featured = false } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: 'Category name is required' });
      return;
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existing = await Category.findOne({ slug });
    if (existing) {
      res.status(400).json({ success: false, message: 'A category with this name already exists' });
      return;
    }

    const category = await Category.create({
      name,
      slug,
      icon: icon || 'Briefcase',
      description: description || '',
      status,
      displayOrder: Number(displayOrder) || 0,
      featured: Boolean(featured),
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, icon, description, status, displayOrder, featured } = req.body;

    const cat = await Category.findById(id);
    if (!cat) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    if (name && name !== cat.name) {
      cat.name = name;
      cat.slug = slugify(name, { lower: true, strict: true });
      // update categoryName in jobs
      await Job.updateMany({ categoryId: id }, { $set: { categoryName: name } });
    }

    if (icon) cat.icon = icon;
    if (description !== undefined) cat.description = description;
    if (status) cat.status = status;
    if (displayOrder !== undefined) cat.displayOrder = Number(displayOrder);
    if (featured !== undefined) cat.featured = Boolean(featured);

    await cat.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: cat,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

