import mongoose, { Document, Schema } from 'mongoose';

export interface ISetting extends Document {
  siteName: string;
  tagline: string;
  siteUrl: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    telegram?: string;
  };
  seoMeta: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
  stats: {
    jobsCountText: string;
    companiesCountText: string;
    internshipsCountText: string;
    candidatesCountText: string;
  };
  footerAbout: string;
  features: {
    enableResumeBuilder: boolean;
    enableAtsChecker: boolean;
    enableSalaryCalculator: boolean;
    enablePracticeModule: boolean;
  };
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    siteName: { type: String, default: 'TalentPulse' },
    tagline: { type: String, default: 'Find Your Next Career Opportunity' },
    siteUrl: { type: String, default: 'http://localhost:5173' },
    logoUrl: { type: String, default: '' },
    contactEmail: { type: String, default: 'support@talentpulse.com' },
    contactPhone: { type: String, default: '+91 98765 43210' },
    socialLinks: {
      linkedin: { type: String, default: 'https://linkedin.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      instagram: { type: String, default: 'https://instagram.com' },
      youtube: { type: String, default: 'https://youtube.com' },
      telegram: { type: String, default: 'https://telegram.org' },
    },
    seoMeta: {
      metaTitle: { type: String, default: 'TalentPulse | Jobs, Internships & Career Growth' },
      metaDescription: { type: String, default: 'Discover top jobs, internships, hiring companies, and interview preparation resources.' },
      ogImage: { type: String, default: '' },
    },
    stats: {
      jobsCountText: { type: String, default: '50K+' },
      companiesCountText: { type: String, default: '10K+' },
      internshipsCountText: { type: String, default: '25K+' },
      candidatesCountText: { type: String, default: '100K+' },
    },
    footerAbout: {
      type: String,
      default: 'TalentPulse is a premier career discovery platform helping students, fresh graduates, and experienced professionals unlock high-impact opportunities at world-class companies.',
    },
    features: {
      enableResumeBuilder: { type: Boolean, default: true },
      enableAtsChecker: { type: Boolean, default: true },
      enableSalaryCalculator: { type: Boolean, default: true },
      enablePracticeModule: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const Setting = mongoose.model<ISetting>('Setting', SettingSchema);

