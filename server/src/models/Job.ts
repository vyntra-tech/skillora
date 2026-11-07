import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  slug: string;
  companyId: mongoose.Types.ObjectId;
  companyName: string;
  companyLogo: string;
  categoryId: mongoose.Types.ObjectId;
  categoryName: string;
  locationId: mongoose.Types.ObjectId;
  locationName: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  experience: string;
  batchIds: mongoose.Types.ObjectId[];
  batchYears: string[];
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  salaryPeriod: string;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  applicationUrl: string;
  deadline: Date;
  featured: boolean;
  status: 'draft' | 'published' | 'archived' | 'expired' | 'closed';
  viewsCount: number;
  applicationsCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    companyName: { type: String, required: true },
    companyLogo: { type: String, default: '' },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    categoryName: { type: String, required: true },
    locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    locationName: { type: String, required: true },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Freelance'],
      default: 'Full-time',
    },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'On-site',
    },
    experience: { type: String, default: '0-2 Years' },
    batchIds: [{ type: Schema.Types.ObjectId, ref: 'Batch' }],
    batchYears: [{ type: String }],
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    salaryCurrency: { type: String, default: '₹' },
    salaryPeriod: { type: String, default: 'LPA' },
    skills: [{ type: String, trim: true }],
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    benefits: [{ type: String }],
    applicationUrl: { type: String, default: '' },
    deadline: { type: Date, required: true },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived', 'expired', 'closed'],
      default: 'published',
    },
    viewsCount: { type: Number, default: 0 },
    applicationsCount: { type: Number, default: 0 },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  { timestamps: true }
);

// Virtual index for fast searching
JobSchema.index({ title: 'text', description: 'text', skills: 'text', companyName: 'text' });
JobSchema.index({ status: 1, deadline: 1, featured: -1, createdAt: -1 });

export const Job = mongoose.model<IJob>('Job', JobSchema);

