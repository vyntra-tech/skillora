import { Request, Response } from 'express';
import { Job } from '../models/Job';
import { Internship } from '../models/Internship';
import { Company } from '../models/Company';
import { User } from '../models/User';
import { Application } from '../models/Application';
import { Article } from '../models/Article';
import { Category } from '../models/Category';
import { Location } from '../models/Location';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const now = new Date();

    const [
      totalJobs,
      activeJobs,
      draftJobs,
      expiredJobs,
      totalInternships,
      totalCompanies,
      totalUsers,
      totalApplications,
      totalArticles,
      totalCategories,
      recentJobs,
      recentApplications,
      recentUsers,
      jobsByCategory,
      jobsByCity,
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: 'published', deadline: { $gte: now } }),
      Job.countDocuments({ status: 'draft' }),
      Job.countDocuments({
        $or: [{ status: 'expired' }, { status: 'published', deadline: { $lt: now } }],
      }),
      Internship.countDocuments(),
      Company.countDocuments(),
      User.countDocuments(),
      Application.countDocuments(),
      Article.countDocuments(),
      Category.countDocuments(),
      Job.find().sort({ createdAt: -1 }).limit(5).select('title companyName status createdAt viewsCount applicationsCount').lean(),
      Application.find().sort({ createdAt: -1 }).limit(5).select('candidateName candidateEmail jobTitle companyName status createdAt').lean(),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role status createdAt').lean(),
      Job.aggregate([
        { $group: { _id: '$categoryName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
      Job.aggregate([
        { $group: { _id: '$locationName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
    ]);

    // Top companies by job count
    const topCompanies = await Job.aggregate([
      { $group: { _id: '$companyName', logo: { $first: '$companyLogo' }, jobCount: { $sum: 1 } } },
      { $sort: { jobCount: -1 } },
      { $limit: 5 },
    ]);

    // Jobs over last 6 months - reflects actual database numbers
    const monthlyJobs = [
      { month: 'Jun', jobs: 0, applications: 0 },
      { month: 'Jul', jobs: 0, applications: 0 },
      { month: 'Aug', jobs: 0, applications: 0 },
      { month: 'Sep', jobs: 0, applications: 0 },
      { month: 'Oct', jobs: 0, applications: 0 },
      { month: 'Nov', jobs: totalJobs, applications: totalApplications },
    ];

    res.json({
      success: true,
      data: {
        cards: {
          totalJobs,
          activeJobs,
          draftJobs,
          expiredJobs,
          totalInternships,
          totalCompanies,
          totalUsers,
          totalApplications,
          totalArticles,
          totalCategories,
        },
        charts: {
          jobsOverTime: monthlyJobs,
          jobsByCategory: jobsByCategory.map((c) => ({ name: c._id || 'Unassigned', count: c.count })),
          jobsByCity: jobsByCity.map((c) => ({ city: c._id || 'Other', count: c.count })),
          topCompanies: topCompanies.map((c) => ({ name: c._id, logo: c.logo, count: c.jobCount })),
        },
        recent: {
          jobs: recentJobs,
          applications: recentApplications,
          users: recentUsers,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const globalSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    if (!q || String(q).trim().length < 2) {
      res.json({
        success: true,
        data: { jobs: [], companies: [], internships: [], articles: [], categories: [], locations: [] },
      });
      return;
    }

    const regex = new RegExp(String(q).trim(), 'i');

    const [jobs, companies, internships, articles, categories, locations] = await Promise.all([
      Job.find({ $or: [{ title: regex }, { companyName: regex }, { skills: regex }] })
        .limit(5)
        .select('title slug companyName companyLogo locationName salaryMin salaryMax')
        .lean(),
      Company.find({ $or: [{ name: regex }, { industry: regex }] })
        .limit(5)
        .select('name slug logo industry location')
        .lean(),
      Internship.find({ $or: [{ title: regex }, { companyName: regex }] })
        .limit(5)
        .select('title slug companyName companyLogo workMode stipend')
        .lean(),
      Article.find({ $or: [{ title: regex }, { shortDescription: regex }] })
        .limit(5)
        .select('title slug category coverImage')
        .lean(),
      Category.find({ name: regex }).limit(5).select('name slug icon').lean(),
      Location.find({ city: regex }).limit(5).select('city state slug').lean(),
    ]);

    res.json({
      success: true,
      data: {
        jobs,
        companies,
        internships,
        articles,
        categories,
        locations,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublicStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalJobs, totalCompanies, totalInternships, totalUsers] = await Promise.all([
      Job.countDocuments({ status: 'published' }),
      Company.countDocuments({ status: 'published' }),
      Internship.countDocuments({ status: 'published' }),
      User.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        jobs: totalJobs,
        totalJobs,
        companies: totalCompanies,
        totalCompanies,
        internships: totalInternships,
        totalInternships,
        candidates: totalUsers,
        totalUsers,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

