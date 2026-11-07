import mongoose, { Document, Schema } from 'mongoose';

export interface IPracticeQuestion extends Document {
  question: string;
  slug: string;
  questionType: 'DSA' | 'Aptitude' | 'Interview' | 'HR' | 'Technical' | 'Company Specific';
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  company: string;
  topic: string;
  answer: string;
  explanation: string;
  codeSnippet?: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PracticeQuestionSchema = new Schema<IPracticeQuestion>(
  {
    question: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    questionType: {
      type: String,
      enum: ['DSA', 'Aptitude', 'Interview', 'HR', 'Technical', 'Company Specific'],
      default: 'Technical',
    },
    category: { type: String, default: 'General' },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    company: { type: String, default: 'All' },
    topic: { type: String, default: 'Algorithms' },
    answer: { type: String, required: true },
    explanation: { type: String, default: '' },
    codeSnippet: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const PracticeQuestion = mongoose.model<IPracticeQuestion>('PracticeQuestion', PracticeQuestionSchema);

