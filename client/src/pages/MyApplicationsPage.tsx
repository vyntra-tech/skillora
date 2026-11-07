import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileCheck2, Building2, Calendar, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { applicationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/common/EmptyState';
import { ApplicationStatus } from '../types';

export const MyApplicationsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['myApplications'],
    queryFn: () => applicationService.getMyApplications(),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-28 pb-20 max-w-md mx-auto text-center px-4">
        <EmptyState
          title="Sign in required"
          description="Please log in to track your job application submissions on Skillora."
          actionText="Log In"
          onAction={() => (window.location.href = '/login')}
        />
      </div>
    );
  }

  const applications = data?.data || [];

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Shortlisted':
      case 'Interview':
        return 'bg-brand-50 dark:bg-brand-900/30 text-brand-primary border-brand-200 dark:border-brand-800/40';
      case 'Selected':
        return 'bg-accent-success/15 text-accent-success border-accent-success/30';
      case 'Rejected':
        return 'bg-accent-error/15 text-accent-error border-accent-error/30';
      case 'Under Review':
        return 'bg-accent-warning/15 text-accent-warning border-accent-warning/30';
      default:
        return 'bg-surface-2 text-text-muted border-border-color';
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-bg-app">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-primary text-xs font-bold mb-2">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Applications Tracker</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            My Job Applications
          </h1>
          <p className="text-sm text-text-muted mt-1 font-medium">
            Monitor review stages, interview schedules, and recruiter communications.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-surface rounded-3xl border border-border-color animate-pulse" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <EmptyState
            title="No Applications Submitted"
            description="You haven't submitted any job or internship applications yet. Browse openings and apply with one click!"
            actionText="Browse Jobs"
            onAction={() => (window.location.href = '/jobs')}
          />
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const jobData = typeof app.jobId === 'object' && app.jobId !== null ? (app.jobId as any) : null;
              const title = jobData?.title || 'Position';
              const company = jobData?.companyName || 'Company';
              const slug = jobData?.slug;
              const date = app.createdAt ? format(new Date(app.createdAt), 'MMM dd, yyyy') : '';

              return (
                <div
                  key={app._id}
                  className="p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle hover:shadow-card-hover transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                      {date && (
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-text-muted" />
                          Applied {date}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-text-primary truncate">
                      {slug ? (
                        <Link to={`/jobs/${slug}`} className="hover:text-brand-primary transition-colors">
                          {title}
                        </Link>
                      ) : (
                        title
                      )}
                    </h3>

                    <p className="text-xs text-text-muted flex items-center gap-1 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-text-muted" />
                      {company}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-border-color">
                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-surface-2 hover:bg-border-color text-text-primary text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-brand-primary" />
                        <span>Resume</span>
                      </a>
                    )}
                    {slug && (
                      <Link
                        to={`/jobs/${slug}`}
                        className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <span>View Job</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
