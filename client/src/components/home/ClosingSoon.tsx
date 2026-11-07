import React from 'react';
import { Link } from 'react-router-dom';
import { Timer, ArrowRight, AlertCircle, Clock } from 'lucide-react';
import { Job } from '../../types';
import { JobCard } from '../common/JobCard';
import { JobCardSkeleton } from '../common/SkeletonLoaders';

interface ClosingSoonProps {
  jobs: Job[];
  isLoading: boolean;
}

export const ClosingSoon: React.FC<ClosingSoonProps> = ({ jobs, isLoading }) => {
  if (!isLoading && jobs.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 border-b border-border-color bg-amber-500/[0.03] dark:bg-amber-400/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-accent-warning border border-amber-200 dark:border-amber-800/40 text-xs font-bold mb-2">
              <Timer className="w-3.5 h-3.5 animate-pulse" />
              <span>Urgent Deadlines</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Closing Soon
            </h2>
            <p className="text-sm text-text-muted mt-1 font-medium">
              Don't miss opportunities before applications close.
            </p>
          </div>

          <Link
            to="/jobs?closingSoon=true"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-2 border border-border-color text-text-primary font-bold text-xs shadow-card-subtle transition-colors shrink-0"
          >
            <span>View All Closing Soon</span>
            <ArrowRight className="w-3.5 h-3.5 text-accent-warning" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.slice(0, 3).map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
