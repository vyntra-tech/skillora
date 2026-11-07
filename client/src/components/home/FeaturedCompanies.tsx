import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import { Company } from '../../types';
import { CompanyCard } from '../common/CompanyCard';
import { CompanyCardSkeleton } from '../common/SkeletonLoaders';

interface FeaturedCompaniesProps {
  companies: Company[];
  isLoading: boolean;
}

export const FeaturedCompanies: React.FC<FeaturedCompaniesProps> = ({ companies, isLoading }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-border-color">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-primary text-xs font-bold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Verified Employers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Top Companies Hiring
          </h2>
          <p className="text-sm text-text-muted mt-1 font-medium">
            Explore high-growth tech firms, funded startups, and enterprise innovators.
          </p>
        </div>

        <Link
          to="/companies"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-2 border border-border-color text-text-primary font-bold text-xs shadow-card-subtle transition-colors shrink-0"
        >
          <span>View All Companies</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">
          No featured companies currently listed.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.slice(0, 4).map((company) => (
            <CompanyCard key={company._id} company={company} />
          ))}
        </div>
      )}
    </section>
  );
};
