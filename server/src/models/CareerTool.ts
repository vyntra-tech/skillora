import mongoose, { Document, Schema } from 'mongoose';

export interface ICareerTool extends Document {
  title: string;
  slug: string;
  description: string;
  icon: string;
  url: string;
  isExternal: boolean;
  isEnabled: boolean;
  displayOrder: number;
  badge?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CareerToolSchema = new Schema<ICareerTool>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'Wrench' },
    url: { type: String, required: true },
    isExternal: { type: Boolean, default: false },
    isEnabled: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    badge: { type: String, default: '' },
  },
  { timestamps: true }
);

export const CareerTool = mongoose.model<ICareerTool>('CareerTool', CareerToolSchema);

