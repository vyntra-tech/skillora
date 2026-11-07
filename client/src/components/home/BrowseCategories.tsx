import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  Cpu,
  Sparkles,
  DollarSign,
  TrendingUp,
  Palette,
  Briefcase,
  Users,
  Truck,
  Headphones,
  Globe,
  Layers,
  ArrowRight,
  Brain,
} from 'lucide-react';
import { Category } from '../../types';

interface BrowseCategoriesProps {
  categories: Category[];
  isLoading: boolean;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Code,
  Cpu,
  Sparkles,
  DollarSign,
  TrendingUp,
  Palette,
  Briefcase,
  Users,
  Truck,
  Headphones,
  Globe,
  Brain,
};

export const BrowseCategories: React.FC<BrowseCategoriesProps> = ({ categories, isLoading }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-border-color">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-primary text-xs font-bold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Functional Disciplines</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Explore Jobs By Category
          </h2>
          <p className="text-sm text-text-muted mt-1 font-medium">
            Browse by engineering, design, marketing, data, and business specializations.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-2 border border-border-color text-text-primary font-bold text-xs shadow-card-subtle transition-colors shrink-0"
        >
          <span>All Categories</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || Briefcase;
          return (
            <Link
              key={cat._id}
              to={`/jobs?category=${cat.slug}`}
              className="group p-4 rounded-2xl bg-surface hover:bg-surface-2 border border-border-color hover:border-brand-primary/40 transition-all shadow-card-subtle hover:shadow-card-hover flex items-center justify-between"
            >
              <div className="flex items-center gap-3 truncate">
                <div className="w-9 h-9 rounded-xl bg-surface-2 group-hover:bg-brand-primary group-hover:text-white text-brand-primary flex items-center justify-center shrink-0 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <h4 className="font-bold text-text-primary group-hover:text-brand-primary text-xs truncate transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {cat.jobsCount || 0} jobs
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
            </Link>
          );
        })}
      </div>
    </section>
  );
};
