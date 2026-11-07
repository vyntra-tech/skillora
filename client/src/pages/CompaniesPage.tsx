import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Building2, SlidersHorizontal } from 'lucide-react';
import { companyService } from '../services/api';
import { CompanyCard } from '../components/common/CompanyCard';
import { CompanyCardSkeleton } from '../components/common/SkeletonLoaders';
import { EmptyState } from '../components/common/EmptyState';

export const CompaniesPage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [industry, setIndustry] = useState('All');

  const { data, isLoading } = useQuery({
    queryKey: ['companiesList', keyword, industry],
    queryFn: () => companyService.getCompanies({ keyword, industry, limit: 30 }),
  });

  const companies = data?.data || [];

  const industries = [
    'All',
    'Enterprise Software & Cloud',
    'Healthcare & Life Sciences',
    'FinTech & WealthTech',
    'Robotics & Automation',
    'Big Data & Analytics',
    'E-Commerce & Quick Commerce',
    'Cybersecurity',
    'Gaming & Interactive Entertainment',
    'CleanTech & Renewable Energy',
    'EdTech & Learning',
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-bg-app">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-primary text-xs font-bold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Employer Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight mb-3">
            Explore Hiring Companies
          </h1>
          <p className="text-sm text-text-muted font-medium">
            Discover top startups, tech innovators, and global enterprises currently building teams on Skillora.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="p-3 rounded-3xl bg-surface border border-border-color shadow-card-subtle mb-10 max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative flex items-center">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search companies by name or keywords..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs font-medium"
            />
          </div>

          <div className="w-full sm:w-64">
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-text-primary text-xs font-semibold focus:outline-none focus:border-brand-primary"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Companies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CompanyCardSkeleton key={i} />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <EmptyState
            title="No Companies Found"
            description="Try modifying your keyword search or selecting a different industry."
            actionText="Clear Filters"
            onAction={() => {
              setKeyword('');
              setIndustry('All');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {companies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
