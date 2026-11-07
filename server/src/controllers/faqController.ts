import { Request, Response } from 'express';
import { Faq } from '../models/Faq';
import { AuthRequest } from '../middleware/auth';

export const getFaqs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { allStatus = 'false', category } = req.query;
    const query: any = {};

    if (allStatus !== 'true') {
      query.status = 'published';
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const faqs = await Faq.find(query).sort({ displayOrder: 1, createdAt: -1 }).lean();
    res.json({ success: true, data: faqs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFaq = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { question, answer, category = 'General', displayOrder = 0, status = 'published' } = req.body;
    if (!question || !answer) {
      res.status(400).json({ success: false, message: 'Question and answer are required' });
      return;
    }

    const faq = await Faq.create({
      question,
      answer,
      category,
      displayOrder: Number(displayOrder) || 0,
      status,
    });

    res.status(201).json({ success: true, message: 'FAQ created successfully', data: faq });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFaq = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const faq = await Faq.findByIdAndUpdate(id, req.body, { new: true });
    if (!faq) {
      res.status(404).json({ success: false, message: 'FAQ not found' });
      return;
    }
    res.json({ success: true, message: 'FAQ updated successfully', data: faq });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFaq = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Faq.findByIdAndDelete(id);
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

