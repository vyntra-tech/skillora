import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { JobCard } from '../components/common/JobCard';
import { JobCardSkeleton } from '../components/common/SkeletonLoaders';
import { EmptyState } from '../components/common/EmptyState';
import {
  jobService,
  categoryService,
  locationService,
  batchService,
} from '../services/api';

export const JobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Read URL parameters
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const city = searchParams.get('city') || '';
  const workMode = searchParams.get('workMode') || '';
  const jobType = searchParams.get('jobType') || '';
  const experience = searchParams.get('experience') || '';
  const batch = searchParams.get('batch') || '';
  const sort = searchParams.get('sort') || 'latest';
  const page = Number(searchParams.get('page')) || 1;
  const closingSoon = searchParams.get('closingSoon') || '';

  // Local state for search bar input
  const [searchInput, setSearchInput] = useState(keyword);

  useEffect(() => {
    setSearchInput(keyword);
  }, [keyword]);

  // Update query params helper
  const updateFilter = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    nextParams.set('page', '1'); // reset to page 1 on filter change
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchInput('');
  };

  // Queries
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  });

  const { data: locationsData } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationService.getLocations(),
  });

  const { data: batchesData } = useQuery({
    queryKey: ['batches'],
    queryFn: () => batchService.getBatches(),
  });

  const { data: jobsResponse, isLoading } = useQuery({
    queryKey: ['jobs', { keyword, category, city, workMode, jobType, experience, batch, sort, page, closingSoon }],
    queryFn: () =>
      jobService.getJobs({
        keyword: keyword || undefined,
        category: category || undefined,
        city: city || undefined,
        workMode: workMode || undefined,
        jobType: jobType || undefined,
        experience: experience || undefined,
        batch: batch || undefined,
        sort,
        page,
        limit: 9,
        closingSoon: closingSoon ? 'true' : undefined,
      }),
  });

  const jobs = jobsResponse?.data || [];
  const pagination = jobsResponse?.pagination;
  const categories = categoriesData?.data || [];
  const locations = locationsData?.data || [];
  const batches = batchesData?.data || [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('keyword', searchInput.trim());
  };

  const hasActiveFilters = Boolean(keyword || category || city || workMode || jobType || experience || batch || closingSoon);

  // Filter Sidebar Content (shared between desktop & mobile drawer)
  const FilterContent = (
    <div className="space-y-6">
      {/* Header with clear button */}
      <div className="flex items-center justify-between pb-4 border-b border-border-color">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-primary" />
          <h3 className="font-bold text-text-primary text-sm">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-[11px] font-bold text-accent-error hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Work Mode */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2.5">
          Work Mode
        </label>
        <div className="space-y-1.5">
          {['All', 'Remote', 'Hybrid', 'On-site'].map((mode) => (
            <label
              key={mode}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                (mode === 'All' && !workMode) || workMode === mode
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-primary'
                  : 'text-text-muted hover:bg-surface-2 hover:text-text-primary'
              }`}
            >
              <span>{mode}</span>
              <input
                type="radio"
                name="workMode"
                checked={(mode === 'All' && !workMode) || workMode === mode}
                onChange={() => updateFilter('workMode', mode === 'All' ? '' : mode)}
                className="hidden"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Job Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2.5">
          Job Type
        </label>
        <div className="space-y-1.5">
          {['All', 'Full-time', 'Internship', 'Contract', 'Part-time'].map((type) => (
            <label
              key={type}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                (type === 'All' && !jobType) || jobType === type
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-primary'
                  : 'text-text-muted hover:bg-surface-2 hover:text-text-primary'
              }`}
            >
              <span>{type}</span>
              <input
                type="radio"
                name="jobType"
                checked={(type === 'All' && !jobType) || jobType === type}
                onChange={() => updateFilter('jobType', type === 'All' ? '' : type)}
                className="hidden"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2.5">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface-2 border border-border-color text-text-primary focus:outline-none focus:border-brand-primary"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Location Dropdown */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2.5">
          City / Location
        </label>
        <select
          value={city}
          onChange={(e) => updateFilter('city', e.target.value)}
          className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface-2 border border-border-color text-text-primary focus:outline-none focus:border-brand-primary"
        >
          <option value="">All Locations</option>
          {locations.map((l) => (
            <option key={l._id} value={l.city}>
              {l.city}
            </option>
          ))}
        </select>
      </div>

      {/* Experience */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2.5">
          Experience Level
        </label>
        <div className="space-y-1.5">
          {['All', '0-1 Years', '1-3 Years', '3-5 Years', '5+ Years'].map((exp) => (
            <label
              key={exp}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                (exp === 'All' && !experience) || experience === exp
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-primary'
                  : 'text-text-muted hover:bg-surface-2 hover:text-text-primary'
              }`}
            >
              <span>{exp}</span>
              <input
                type="radio"
                name="experience"
                checked={(exp === 'All' && !experience) || experience === exp}
                onChange={() => updateFilter('experience', exp === 'All' ? '' : exp)}
                className="hidden"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Graduation Batch */}
      {batches.length > 0 && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2.5">
            Eligible Batch
          </label>
          <select
            value={batch}
            onChange={(e) => updateFilter('batch', e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface-2 border border-border-color text-text-primary focus:outline-none focus:border-brand-primary"
          >
            <option value="">All Batches</option>
            {batches.map((b) => (
              <option key={b._id} value={b.year}>
                Class of {b.year}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-20 bg-bg-app">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Top Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-primary text-xs font-bold mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Opportunities Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Find Your Next Career Move
          </h1>
          <p className="text-sm text-text-muted mt-1 font-medium">
            Explore curated tech jobs, remote positions, and high-impact startup opportunities.
          </p>
        </div>

        {/* Search Bar & Controls Bar */}
        <div className="p-3 rounded-3xl bg-surface border border-border-color shadow-card-subtle mb-8 flex flex-col sm:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full flex items-center">
            <Search className="w-4 h-4 text-text-muted ml-3 mr-2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by role, skill, tech stack, or employer..."
              className="w-full py-2.5 bg-transparent text-xs sm:text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateFilter('keyword', '');
                }}
                className="p-1 text-text-muted hover:text-text-primary mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-2xl transition-colors shadow-sm"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-border-color pt-2 sm:pt-0">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-surface-2 border border-border-color text-xs font-bold text-text-primary"
            >
              <Filter className="w-3.5 h-3.5 text-brand-primary" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-brand-primary" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted font-medium hidden sm:inline">Sort:</span>
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="px-3 py-2 rounded-2xl text-xs font-semibold bg-surface-2 border border-border-color text-text-primary focus:outline-none focus:border-brand-primary"
              >
                <option value="latest">Latest First</option>
                <option value="salary">Salary: High to Low</option>
                <option value="deadline">Closing Soonest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-bold text-text-muted">Active:</span>
            {keyword && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-900/30 text-brand-primary border border-brand-200 dark:border-brand-800/40">
                <span>Keyword: {keyword}</span>
                <button onClick={() => updateFilter('keyword', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-900/30 text-brand-primary border border-brand-200 dark:border-brand-800/40">
                <span>Category: {category}</span>
                <button onClick={() => updateFilter('category', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {city && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-900/30 text-brand-primary border border-brand-200 dark:border-brand-800/40">
                <span>City: {city}</span>
                <button onClick={() => updateFilter('city', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {workMode && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-900/30 text-brand-primary border border-brand-200 dark:border-brand-800/40">
                <span>Mode: {workMode}</span>
                <button onClick={() => updateFilter('workMode', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {jobType && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-900/30 text-brand-primary border border-brand-200 dark:border-brand-800/40">
                <span>Type: {jobType}</span>
                <button onClick={() => updateFilter('jobType', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-text-muted hover:text-accent-error font-bold ml-2 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* 2-Column Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT: Desktop Sticky Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle">
              {FilterContent}
            </div>
          </aside>

          {/* RIGHT: Results Grid & Pagination */}
          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4 text-xs font-semibold text-text-muted">
              <span>
                Showing {jobs.length} of {pagination?.total || 0} opportunities
              </span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <EmptyState
                title="No opportunities match your criteria"
                description="Try loosening some of your filters or search for another keyword or location."
                actionText="Reset All Filters"
                onAction={clearAllFilters}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => updateFilter('page', String(pagination.page - 1))}
                  className="px-4 py-2 rounded-2xl bg-surface border border-border-color text-xs font-bold text-text-primary disabled:opacity-40 hover:bg-surface-2 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }).map((_, idx) => {
                    const p = idx + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => updateFilter('page', String(p))}
                        className={`w-9 h-9 rounded-2xl text-xs font-bold transition-all ${
                          p === pagination.page
                            ? 'bg-brand-primary text-white shadow-sm'
                            : 'bg-surface border border-border-color text-text-muted hover:text-text-primary hover:bg-surface-2'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => updateFilter('page', String(pagination.page + 1))}
                  className="px-4 py-2 rounded-2xl bg-surface border border-border-color text-xs font-bold text-text-primary disabled:opacity-40 hover:bg-surface-2 transition-colors flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-full max-w-sm h-full bg-surface border-l border-border-color p-6 overflow-y-auto shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border-color mb-6">
                  <h3 className="font-bold text-text-primary text-base">Filter Opportunities</h3>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {FilterContent}
              </div>

              <div className="pt-6 border-t border-border-color mt-6">
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full py-3 bg-brand-primary text-white rounded-2xl text-xs font-bold shadow-sm"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
