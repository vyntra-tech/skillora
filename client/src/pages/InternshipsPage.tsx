import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, GraduationCap } from 'lucide-react';
import { internshipService, categoryService } from '../services/api';
import { InternshipCard } from '../components/common/InternshipCard';
import { EmptyState } from '../components/common/EmptyState';

export const InternshipsPage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [workMode, setWorkMode] = useState('All');
  const [category, setCategory] = useState('All');

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['internshipsList', keyword, workMode, category],
    queryFn: () =>
      internshipService.getInternships({
        keyword,
        workMode: workMode === 'All' ? '' : workMode,
        category: category === 'All' ? '' : category,
        limit: 30,
      }),
  });

  const internships = data?.data || [];
  const categories = categoriesData?.data || [];
  const workModes = ['All', 'Remote', 'Hybrid', 'On-site'];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-bg-app">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-primary text-xs font-bold mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student & Graduate Pathways</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight mb-3">
            Explore Latest Internships
          </h1>
          <p className="text-sm text-text-muted font-medium">
            Gain hands-on industry experience, monthly stipends, and pre-placement offer opportunities on Skillora.
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
              placeholder="Search by role or company..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs font-medium"
            />
          </div>

          <div className="w-full sm:w-44">
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-text-primary text-xs font-semibold focus:outline-none focus:border-brand-primary"
            >
              {workModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode === 'All' ? 'All Work Modes' : mode}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-48">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-text-primary text-xs font-semibold focus:outline-none focus:border-brand-primary"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-60 bg-surface rounded-3xl border border-border-color animate-pulse" />
            ))}
          </div>
        ) : internships.length === 0 ? (
          <EmptyState
            title="No Internships Found"
            description="Try searching with different keywords or reset your filters."
            actionText="Reset Filters"
            onAction={() => {
              setKeyword('');
              setWorkMode('All');
              setCategory('All');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((internship) => (
              <InternshipCard key={internship._id} internship={internship} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
