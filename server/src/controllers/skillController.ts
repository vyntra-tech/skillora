import { Request, Response } from 'express';
import slugify from 'slugify';
import { Skill } from '../models/Skill';
import { AuthRequest } from '../middleware/auth';

export const getSkills = async (_req: Request, res: Response): Promise<void> => {
  try {
    const skills = await Skill.find({ status: 'active' }).sort({ name: 1 }).lean();
    res.json({ success: true, data: skills });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createSkill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category = 'General', status = 'active' } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: 'Skill name is required' });
      return;
    }

    const slug = slugify(name, { lower: true, strict: true });
    const existing = await Skill.findOne({ slug });
    if (existing) {
      res.status(400).json({ success: false, message: 'Skill already exists' });
      return;
    }

    const skill = await Skill.create({ name, slug, category, status });
    res.status(201).json({ success: true, message: 'Skill created successfully', data: skill });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSkill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, category, status } = req.body;
    const skill = await Skill.findById(id);
    if (!skill) {
      res.status(404).json({ success: false, message: 'Skill not found' });
      return;
    }

    if (name) {
      skill.name = name;
      skill.slug = slugify(name, { lower: true, strict: true });
    }
    if (category) skill.category = category;
    if (status) skill.status = status;

    await skill.save();
    res.json({ success: true, message: 'Skill updated successfully', data: skill });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSkill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Skill.findByIdAndDelete(id);
    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

