import { Request, Response } from 'express';
import slugify from 'slugify';
import { CareerTool } from '../models/CareerTool';
import { AuthRequest } from '../middleware/auth';

export const getTools = async (req: Request, res: Response): Promise<void> => {
  try {
    const { all = 'false' } = req.query;
    const query: any = {};
    if (all !== 'true') {
      query.isEnabled = true;
    }

    const tools = await CareerTool.find(query).sort({ displayOrder: 1 }).lean();
    res.json({ success: true, data: tools });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTool = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, icon = 'Wrench', url, isExternal = false, isEnabled = true, displayOrder = 0, badge = '' } = req.body;

    if (!title || !description || !url) {
      res.status(400).json({ success: false, message: 'Title, description, and URL are required' });
      return;
    }

    const slug = slugify(title, { lower: true, strict: true });
    const tool = await CareerTool.create({
      title,
      slug,
      description,
      icon,
      url,
      isExternal: Boolean(isExternal),
      isEnabled: Boolean(isEnabled),
      displayOrder: Number(displayOrder) || 0,
      badge,
    });

    res.status(201).json({ success: true, message: 'Tool created successfully', data: tool });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTool = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tool = await CareerTool.findByIdAndUpdate(id, req.body, { new: true });
    if (!tool) {
      res.status(404).json({ success: false, message: 'Tool not found' });
      return;
    }
    res.json({ success: true, message: 'Tool updated successfully', data: tool });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTool = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await CareerTool.findByIdAndDelete(id);
    res.json({ success: true, message: 'Tool deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

