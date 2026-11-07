import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

interface QuickCategoriesProps {
  categories: Category[];
  isLoading?: boolean;
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
  Layers,
  Brain,
};

export const QuickCategories: React.FC<QuickCategoriesProps> = ({ categories, isLoading }) => {
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-surface-2 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 border-b border-border-color bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Explore Opportunities
            </h2>
            <p className="text-sm text-text-muted mt-1.5 font-medium">
              Find the right opportunity across industries and skills.
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-secondary transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Categories Grid (Premium horizontal cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((cat) => {
            const IconComponent = iconMap[cat.icon] || Briefcase;
            return (
              <Link
                key={cat._id}
                to={`/jobs?category=${cat.slug}`}
                className="group relative flex items-center justify-between p-4 rounded-2xl bg-surface border border-border-color hover:border-brand-primary/50 shadow-card-subtle hover:shadow-card-hover transition-all duration-200"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-200">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-text-primary group-hover:text-brand-primary transition-colors truncate">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-text-muted font-medium mt-0.5">
                      {cat.jobsCount || 0} active roles
                    </p>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center text-text-muted group-hover:text-brand-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-2">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
