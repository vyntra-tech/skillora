import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  slug: string;
  logo: string;
  website: string;
  industry: string;
  location: string;
  description: string;
  companySize: string;
  foundedYear: number;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    github?: string;
  };
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  jobsCount?: number;
  internshipsCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    logo: { type: String, default: '' },
    website: { type: String, default: '' },
    industry: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    companySize: { type: String, default: '50-200' },
    foundedYear: { type: Number, default: 2018 },
    socialLinks: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      facebook: { type: String, default: '' },
      github: { type: String, default: '' },
    },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
  },
  { timestamps: true }
);

export const Company = mongoose.model<ICompany>('Company', CompanySchema);

