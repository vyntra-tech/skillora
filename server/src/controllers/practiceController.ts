import { Request, Response } from 'express';
import slugify from 'slugify';
import { PracticeQuestion } from '../models/PracticeQuestion';
import { AuthRequest } from '../middleware/auth';

export const getPracticeQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      keyword,
      questionType,
      difficulty,
      company,
      topic,
      page = 1,
      limit = 20,
      allStatus = 'false',
    } = req.query;

    const query: any = {};
    if (allStatus !== 'true') {
      query.status = 'published';
    }

    if (keyword) {
      const regex = new RegExp(String(keyword), 'i');
      query.$or = [{ question: regex }, { topic: regex }, { company: regex }, { tags: regex }];
    }

    if (questionType && questionType !== 'All') {
      query.questionType = questionType;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (company && company !== 'All') {
      query.company = new RegExp(String(company), 'i');
    }

    if (topic && topic !== 'All') {
      query.topic = new RegExp(String(topic), 'i');
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(100, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [questions, total] = await Promise.all([
      PracticeQuestion.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      PracticeQuestion.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: questions,
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

export const createPracticeQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      question,
      questionType = 'Technical',
      category = 'General',
      difficulty = 'Medium',
      company = 'All',
      topic = 'General',
      answer,
      explanation = '',
      codeSnippet = '',
      tags = [],
      status = 'published',
    } = req.body;

    if (!question || !answer) {
      res.status(400).json({ success: false, message: 'Question and answer are required' });
      return;
    }

    const slug = slugify(question.substring(0, 50), { lower: true, strict: true }) + '-' + Date.now().toString().slice(-5);

    const created = await PracticeQuestion.create({
      question,
      slug,
      questionType,
      category,
      difficulty,
      company,
      topic,
      answer,
      explanation,
      codeSnippet,
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [],
      status,
    });

    res.status(201).json({
      success: true,
      message: 'Practice question created successfully',
      data: created,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePracticeQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map((t: string) => t.trim());
    }

    const updated = await PracticeQuestion.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Question not found' });
      return;
    }

    res.json({ success: true, message: 'Question updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePracticeQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await PracticeQuestion.findByIdAndDelete(id);
    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

