import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Job } from '../../types';
import { JobCard } from '../common/JobCard';
import { JobCardSkeleton } from '../common/SkeletonLoaders';

interface LatestJobsProps {
  jobs: Job[];
  isLoading: boolean;
}

export const LatestJobs: React.FC<LatestJobsProps> = ({ jobs, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'internships' | 'remote' | 'freshers'>('all');

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'internships', label: 'Internships' },
    { id: 'remote', label: 'Remote' },
    { id: 'freshers', label: 'Freshers' },
  ];

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'jobs') return (job.jobType as string) !== 'Internship';
    if (activeTab === 'internships') return (job.jobType as string) === 'Internship';
    if (activeTab === 'remote') return job.workMode?.toLowerCase() === 'remote';
    if (activeTab === 'freshers') {
      const exp = (job.experience || '').toLowerCase();
      return exp.includes('0') || exp.includes('fresher') || exp.includes('entry');
    }
    return true;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-primary text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated For You</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Latest Opportunities
          </h2>
          <p className="text-sm text-text-muted mt-1 font-medium">
            Discover verified full-time roles, internships, and remote career opportunities.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface-2 border border-border-color self-start md:self-auto overflow-x-auto max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-surface text-brand-primary shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-surface border border-border-color text-text-muted text-sm">
          No opportunities match this tab right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.slice(0, 6).map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

      {/* View All Button */}
      <div className="mt-12 text-center">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface hover:bg-surface-2 border border-border-color text-text-primary font-bold text-xs shadow-card-subtle hover:shadow-card-hover transition-all"
        >
          <span>View All Opportunities</span>
          <ArrowRight className="w-4 h-4 text-brand-primary" />
        </Link>
      </div>
    </section>
  );
};
