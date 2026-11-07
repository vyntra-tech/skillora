import mongoose, { Document, Schema } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  slug: string;
  coverImage: string;
  category: string;
  author: string;
  shortDescription: string;
  content: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  publishedDate: Date;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  readTime: string;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    coverImage: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    author: { type: String, default: 'Editorial Team' },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    publishedDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    featured: { type: Boolean, default: false },
    readTime: { type: String, default: '5 min read' },
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Article = mongoose.model<IArticle>('Article', ArticleSchema);

