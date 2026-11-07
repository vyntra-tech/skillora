import { Request, Response } from 'express';
import slugify from 'slugify';
import { Article } from '../models/Article';
import { AuthRequest } from '../middleware/auth';

const generateUniqueSlug = async (title: string, currentId?: string): Promise<string> => {
  const baseSlug = slugify(title, { lower: true, strict: true }) || 'article';
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Article.findOne({ slug });
    if (!existing || (currentId && existing._id.toString() === currentId)) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

export const getArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { keyword, category, tag, featured, status, page = 1, limit = 9, allStatus = 'false' } = req.query;

    const query: any = {};
    if (allStatus !== 'true') {
      query.status = 'published';
    } else if (status) {
      query.status = status;
    }

    if (keyword) {
      const regex = new RegExp(String(keyword), 'i');
      query.$or = [{ title: regex }, { shortDescription: regex }, { content: regex }, { tags: regex }];
    }

    if (category && category !== 'All') {
      query.category = new RegExp(String(category), 'i');
    }

    if (tag) {
      query.tags = tag;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(50, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [articles, total] = await Promise.all([
      Article.find(query)
        .sort({ featured: -1, publishedDate: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Article.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: articles,
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

export const getArticleBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const article = await Article.findOne({ slug });

    if (!article) {
      res.status(404).json({ success: false, message: 'Article not found' });
      return;
    }

    Article.findByIdAndUpdate(article._id, { $inc: { viewsCount: 1 } }).exec();

    const related = await Article.find({
      _id: { $ne: article._id },
      category: article.category,
      status: 'published',
    })
      .limit(3)
      .lean();

    res.json({
      success: true,
      data: article,
      relatedArticles: related,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      coverImage,
      category,
      author,
      shortDescription,
      content,
      tags = [],
      seoTitle,
      seoDescription,
      status = 'published',
      featured = false,
      readTime,
    } = req.body;

    if (!title || !shortDescription || !content) {
      res.status(400).json({ success: false, message: 'Title, short description, and content are required' });
      return;
    }

    const slug = await generateUniqueSlug(title);

    const article = await Article.create({
      title,
      slug,
      coverImage: coverImage || '',
      category: category || 'Career Guide',
      author: author || 'TalentPulse Editorial Team',
      shortDescription,
      content,
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [],
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || shortDescription,
      status: status || 'published',
      featured: Boolean(featured),
      readTime: readTime || '5 min read',
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const article = await Article.findById(id);
    if (!article) {
      res.status(404).json({ success: false, message: 'Article not found' });
      return;
    }

    if (updateData.title && updateData.title !== article.title && !updateData.slug) {
      updateData.slug = await generateUniqueSlug(updateData.title, id);
    }

    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map((t: string) => t.trim());
    }

    const updated = await Article.findByIdAndUpdate(id, updateData, { new: true });

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Article.findByIdAndDelete(id);
    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

