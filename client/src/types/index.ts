export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'EDITOR' | 'MODERATOR';

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'blocked';
  avatar?: string;
  bio?: string;
  phone?: string;
  resumeUrl?: string;
  savedJobs?: (string | Job)[];
  createdAt: string;
}

export interface Company {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  website: string;
  industry: string;
  location: string;
  description: string;
  companySize: string;
  foundedYear: number;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    github?: string;
  };
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  activeJobsCount?: number;
  activeInternshipsCount?: number;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  displayOrder: number;
  featured: boolean;
  jobsCount?: number;
}

export interface Location {
  _id: string;
  city: string;
  state: string;
  country: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  displayOrder: number;
  isPopular: boolean;
  jobsCount?: number;
}

export interface Skill {
  _id: string;
  name: string;
  slug: string;
  category: string;
  status: 'active' | 'inactive';
}

export interface Batch {
  _id: string;
  year: string;
  status: 'active' | 'inactive';
  displayOrder: number;
}

export interface Job {
  _id: string;
  title: string;
  slug: string;
  companyId: Company | string;
  companyName: string;
  companyLogo: string;
  categoryId: Category | string;
  categoryName: string;
  locationId: Location | string;
  locationName: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  experience: string;
  batchIds?: (Batch | string)[];
  batchYears?: string[];
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
  deadline: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived' | 'expired' | 'closed';
  viewsCount: number;
  applicationsCount: number;
  seoTitle?: string;
  seoDescription?: string;
  remainingDays?: number;
  isClosingSoon?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Internship {
  _id: string;
  title: string;
  slug: string;
  companyId: Company | string;
  companyName: string;
  companyLogo: string;
  categoryId: Category | string;
  categoryName: string;
  locationId: Location | string;
  locationName: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  duration: string;
  stipend: string;
  skills: string[];
  description: string;
  requirements: string[];
  perks: string[];
  deadline: string;
  applyUrl: string;
  applicationUrl?: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  viewsCount: number;
  remainingDays?: number;
  createdAt: string;
}

export interface Article {
  _id: string;
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
  publishedDate: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  readTime: string;
  viewsCount: number;
  createdAt: string;
}

export interface PracticeQuestion {
  _id: string;
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
}

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  status: 'draft' | 'published' | 'archived';
}

export interface CareerTool {
  _id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  url: string;
  isExternal: boolean;
  isEnabled: boolean;
  displayOrder: number;
  badge?: string;
}

export type ApplicationStatus = 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';

export interface Application {
  _id: string;
  candidateId?: User | string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  jobId: Job | string;
  jobTitle: string;
  companyId: Company | string;
  companyName: string;
  resumeUrl: string;
  coverLetter?: string;
  status: ApplicationStatus;
  notes?: string;
  appliedDate: string;
  createdAt: string;
}

export interface Setting {
  _id?: string;
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
  dynamicStats?: {
    jobs: number;
    companies: number;
    internships: number;
    candidates: number;
  };
  footerAbout: string;
  features: {
    enableResumeBuilder: boolean;
    enableAtsChecker: boolean;
    enableSalaryCalculator: boolean;
    enablePracticeModule: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

