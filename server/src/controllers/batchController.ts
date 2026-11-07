import { Request, Response } from 'express';
import { Batch } from '../models/Batch';
import { AuthRequest } from '../middleware/auth';

export const getBatches = async (_req: Request, res: Response): Promise<void> => {
  try {
    const batches = await Batch.find({ status: 'active' }).sort({ displayOrder: 1, year: 1 }).lean();
    res.json({ success: true, data: batches });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { year, status = 'active', displayOrder = 0 } = req.body;
    if (!year) {
      res.status(400).json({ success: false, message: 'Batch year is required' });
      return;
    }

    const existing = await Batch.findOne({ year: String(year).trim() });
    if (existing) {
      res.status(400).json({ success: false, message: 'This batch already exists' });
      return;
    }

    const batch = await Batch.create({
      year: String(year).trim(),
      status,
      displayOrder: Number(displayOrder) || 0,
    });

    res.status(201).json({ success: true, message: 'Batch added successfully', data: batch });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { year, status, displayOrder } = req.body;
    const batch = await Batch.findById(id);
    if (!batch) {
      res.status(404).json({ success: false, message: 'Batch not found' });
      return;
    }

    if (year) batch.year = String(year).trim();
    if (status) batch.status = status;
    if (displayOrder !== undefined) batch.displayOrder = Number(displayOrder);

    await batch.save();
    res.json({ success: true, message: 'Batch updated successfully', data: batch });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Batch.findByIdAndDelete(id);
    res.json({ success: true, message: 'Batch deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

