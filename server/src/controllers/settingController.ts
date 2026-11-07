import { Request, Response } from 'express';
import { Setting } from '../models/Setting';
import { Job } from '../models/Job';
import { Company } from '../models/Company';
import { Internship } from '../models/Internship';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({});
    }

    // Auto-calculate dynamic counts if not explicitly overridden
    const [jobsCount, companiesCount, internshipsCount, candidatesCount] = await Promise.all([
      Job.countDocuments({ status: 'published' }),
      Company.countDocuments({ status: 'published' }),
      Internship.countDocuments({ status: 'published' }),
      User.countDocuments({ role: 'USER' }),
    ]);

    const data = setting.toObject() as any;
    // Return either custom string or dynamic count + default
    data.dynamicStats = {
      jobs: Math.max(jobsCount, 50),
      companies: Math.max(companiesCount, 12),
      internships: Math.max(internshipsCount, 20),
      candidates: Math.max(candidatesCount, 150),
    };

    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create(req.body);
    } else {
      setting = await Setting.findByIdAndUpdate(setting._id, req.body, { new: true });
    }

    res.json({
      success: true,
      message: 'Platform settings updated successfully',
      data: setting,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
