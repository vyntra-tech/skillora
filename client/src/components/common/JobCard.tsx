import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Briefcase,
  Clock,
  Bookmark,
  Share2,
  Sparkles,
  ArrowRight,
  Building2,
  Timer,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Job } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ApplyModal } from './ApplyModal';
import { JobShareModal } from './JobShareModal';

interface JobCardProps {
  job: Job;
  onBookmarkChange?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onBookmarkChange }) => {
  const { isJobSaved, toggleBookmark, isAuthenticated } = useAuth();
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const saved = isJobSaved(job._id);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    try {
      setIsSaving(true);
      await toggleBookmark(job._id);
      if (onBookmarkChange) onBookmarkChange();
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = job.createdAt
    ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
    : 'Recently';

  return (
    <>
      <div className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-surface border border-border-color hover:border-brand-primary/50 shadow-card-subtle hover:shadow-card-hover transition-all duration-200">
        <div>
          {/* Header: Company Logo, Meta, Bookmark */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="w-12 h-12 rounded-2xl object-contain bg-white p-1 border border-border-color shadow-sm"
                  loading="lazy"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-900/30 text-brand-primary border border-border-color flex items-center justify-center font-bold text-base">
                  {job.companyName?.charAt(0) || 'C'}
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-text-muted">
                  {job.companyName}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-text-muted" />
                    {job.locationName || 'Remote'}
                  </span>
                  <span className="text-text-muted/40">·</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-2 text-text-muted">
                    {job.workMode || 'On-site'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Featured Badge */}
              {job.featured && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-900/30 text-brand-primary border border-brand-200 dark:border-brand-800/40">
                  <Sparkles className="w-3 h-3 text-brand-primary" />
                  Featured
                </span>
              )}

              {/* Bookmark Button */}
              <button
                type="button"
                onClick={handleBookmark}
                disabled={isSaving}
                className={`p-2 rounded-xl border transition-colors ${
                  saved
                    ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-primary/40 text-brand-primary'
                    : 'bg-surface border-border-color text-text-muted hover:text-text-primary hover:bg-surface-2'
                }`}
                title={saved ? 'Remove from saved' : 'Save job'}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Job Title */}
          <Link to={`/jobs/${job.slug}`} className="block group-hover:text-brand-primary transition-colors">
            <h3 className="text-base sm:text-lg font-bold text-text-primary leading-snug line-clamp-1 mb-2">
              {job.title}
            </h3>
          </Link>

          {/* Highlights Row: Experience, Salary, Closing Soon */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-2 text-text-primary">
              <Briefcase className="w-3 h-3 text-text-muted" />
              {job.experience || '0-2 Years'}
            </span>

            {job.salaryMin !== undefined && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-50 dark:bg-brand-900/30 text-brand-primary">
                {job.salaryCurrency || '₹'}{job.salaryMin}–{job.salaryMax} {job.salaryPeriod || 'LPA'}
              </span>
            )}

            {job.isClosingSoon && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-amber-50 dark:bg-amber-950/30 text-accent-warning border border-amber-200 dark:border-amber-900/40">
                <Timer className="w-3 h-3" />
                Closes in {job.remainingDays}d
              </span>
            )}
          </div>

          {/* Skills Badges */}
          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {job.skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-2 text-text-muted border border-border-color"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-2 text-text-muted">
                  +{job.skills.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer: Posted date, View Details, Apply */}
        <div className="pt-4 border-t border-border-color flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium text-text-muted flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formattedDate}
          </span>

          <div className="flex items-center gap-2">
            <Link
              to={`/jobs/${job.slug}`}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-text-primary bg-surface-2 hover:bg-border-color transition-colors"
            >
              View Job
            </Link>
            <button
              onClick={() => setIsApplyOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-primary hover:bg-brand-hover shadow-sm transition-all"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isApplyOpen && (
        <ApplyModal
          isOpen={isApplyOpen}
          onClose={() => setIsApplyOpen(false)}
          itemType="job"
          itemTitle={job.title}
          companyName={job.companyName}
          companyLogo={job.companyLogo}
          itemId={job._id}
          applicationUrl={job.applicationUrl}
        />
      )}

      {isShareOpen && (
        <JobShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          title={job.title}
          company={job.companyName}
          url={window.location.origin + `/jobs/${job.slug}`}
        />
      )}
    </>
  );
};
