import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bookmark, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { JobCard } from '../components/common/JobCard';
import { JobCardSkeleton } from '../components/common/SkeletonLoaders';
import { EmptyState } from '../components/common/EmptyState';
import { Job } from '../types';

export const SavedJobsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['savedJobs'],
    queryFn: async () => {
      const res = await apiClient.get('/auth/me');
      return res.data?.user?.savedJobs as Job[];
    },
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-28 pb-20 max-w-md mx-auto text-center px-4">
        <EmptyState
          title="Sign in required"
          description="Please log in to your account to view your bookmarked job openings on Skillora."
          actionText="Log In"
          onAction={() => (window.location.href = '/login')}
        />
      </div>
    );
  }

  const savedJobs = (data || []).filter((j) => typeof j === 'object' && j !== null && j.title);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-bg-app">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-primary text-xs font-bold mb-2">
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Saved Opportunities</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Your Bookmarked Jobs
          </h1>
          <p className="text-sm text-text-muted mt-1 font-medium">
            Review saved positions and submit applications before deadlines close.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : savedJobs.length === 0 ? (
          <EmptyState
            title="No Saved Jobs"
            description="You haven't bookmarked any jobs yet. Browse our directory and save roles to keep track of them."
            actionText="Discover Jobs"
            onAction={() => (window.location.href = '/jobs')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((job) => (
              <JobCard key={job._id} job={job} onBookmarkChange={() => refetch()} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
