import mongoose, { Document, Schema } from 'mongoose';

export interface IInternship extends Document {
  title: string;
  slug: string;
  companyId: mongoose.Types.ObjectId;
  companyName: string;
  companyLogo: string;
  categoryId: mongoose.Types.ObjectId;
  categoryName: string;
  locationId: mongoose.Types.ObjectId;
  locationName: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  duration: string;
  stipend: string;
  skills: string[];
  description: string;
  requirements: string[];
  perks: string[];
  deadline: Date;
  applyUrl: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipSchema = new Schema<IInternship>(
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
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'On-site',
    },
    duration: { type: String, default: '3 Months' },
    stipend: { type: String, default: '₹15,000 /month' },
    skills: [{ type: String, trim: true }],
    description: { type: String, required: true },
    requirements: [{ type: String }],
    perks: [{ type: String }],
    deadline: { type: Date, required: true },
    applyUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

InternshipSchema.index({ status: 1, deadline: 1, featured: -1, createdAt: -1 });

export const Internship = mongoose.model<IInternship>('Internship', InternshipSchema);

