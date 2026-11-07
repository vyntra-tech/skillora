import { Response } from 'express';
import { Application, ApplicationStatus } from '../models/Application';
import { Job } from '../models/Job';
import { AuthRequest } from '../middleware/auth';

export const submitApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      jobId,
      candidateName,
      candidateEmail,
      candidatePhone = '',
      resumeUrl,
      coverLetter = '',
    } = req.body;

    if (!jobId || !candidateName || !candidateEmail || !resumeUrl) {
      res.status(400).json({
        success: false,
        message: 'Job ID, candidate name, candidate email, and resume URL are required.',
      });
      return;
    }

    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    // Check for duplicate application
    const existing = await Application.findOne({
      jobId,
      candidateEmail: candidateEmail.toLowerCase().trim(),
    });

    if (existing) {
      res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this position.',
      });
      return;
    }

    const application = await Application.create({
      candidateId: req.user?._id || undefined,
      candidateName: candidateName.trim(),
      candidateEmail: candidateEmail.toLowerCase().trim(),
      candidatePhone: candidatePhone.trim(),
      jobId: job._id,
      jobTitle: job.title,
      companyId: job.companyId,
      companyName: job.companyName,
      resumeUrl,
      coverLetter,
      status: 'Applied',
    });

    // Increment application count on the job
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Good luck!',
      data: application,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: any = {
      $or: [
        { candidateId: req.user!._id },
        { candidateEmail: req.user!.email.toLowerCase() },
      ],
    };

    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .populate('jobId')
      .populate('companyId')
      .lean();

    res.json({ success: true, data: applications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { keyword, status, jobId, companyId, page = 1, limit = 20 } = req.query;
    const query: any = {};

    if (keyword) {
      const regex = new RegExp(String(keyword), 'i');
      query.$or = [
        { candidateName: regex },
        { candidateEmail: regex },
        { jobTitle: regex },
        { companyName: regex },
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (jobId) {
      query.jobId = jobId;
    }

    if (companyId) {
      query.companyId = companyId;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(100, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [applications, total] = await Promise.all([
      Application.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('jobId', 'title slug companyLogo salaryMin salaryMax locationName')
        .populate('candidateId', 'name email avatar')
        .lean(),
      Application.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: applications,
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

export const updateApplicationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses: ApplicationStatus[] = [
      'Applied',
      'Under Review',
      'Shortlisted',
      'Interview',
      'Selected',
      'Rejected',
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }

    const updateObj: any = { status };
    if (notes !== undefined) updateObj.notes = notes;

    const updated = await Application.findByIdAndUpdate(id, updateObj, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    res.json({
      success: true,
      message: `Application marked as ${status}`,
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

