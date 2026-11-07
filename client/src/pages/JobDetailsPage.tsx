import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin,
  Briefcase,
  Clock,
  Bookmark,
  Share2,
  Calendar,
  Building2,
  CheckCircle2,
  Gift,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  Timer,
  Send,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { jobService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ApplyModal } from '../components/common/ApplyModal';
import { JobShareModal } from '../components/common/JobShareModal';
import { JobCard } from '../components/common/JobCard';
import { EmptyState } from '../components/common/EmptyState';

export const JobDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isJobSaved, toggleBookmark, isAuthenticated } = useAuth();
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['jobDetails', slug],
    queryFn: () => jobService.getJobBySlug(slug!),
    enabled: Boolean(slug),
  });

  const job = data?.data;
  const relatedJobs = data?.relatedJobs || [];
  const saved = job ? isJobSaved(job._id) : false;

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (!job) return;
    try {
      setIsSaving(true);
      await toggleBookmark(job._id);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-28 animate-pulse space-y-6">
        <div className="h-6 w-36 bg-surface-2 rounded-xl" />
        <div className="h-48 bg-surface rounded-3xl p-8 border border-border-color" />
        <div className="h-96 bg-surface rounded-3xl p-8 border border-border-color" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-28">
        <EmptyState
          title="Job Position Not Found"
          description="The job opening you are looking for may have expired or was removed by the employer."
          actionText="Back to Job Listings"
          onAction={() => (window.location.href = '/jobs')}
        />
      </div>
    );
  }

  const postedDate = job.createdAt
    ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
    : 'Recently';

  const deadlineFormatted = job.deadline
    ? format(new Date(job.deadline), 'MMMM dd, yyyy')
    : 'Open until filled';

  return (
    <div className="min-h-screen pt-28 pb-20 bg-bg-app">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-brand-primary mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to all opportunities</span>
        </Link>

        {/* TOP HERO CARD */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border-color shadow-card-subtle mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="w-16 h-16 rounded-2xl object-contain bg-white p-1.5 border border-border-color shadow-sm shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/30 text-brand-primary border border-border-color flex items-center justify-center font-bold text-xl shrink-0">
                  {job.companyName?.charAt(0)}
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary">
                    {job.title}
                  </h1>
                  {job.featured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-900/30 text-brand-primary border border-brand-200 dark:border-brand-800/40">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted font-medium">
                  <span className="font-bold text-brand-primary text-sm">
                    {job.companyName}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.locationName || 'Remote'}
                  </span>
                  <span>·</span>
                  <span className="px-2 py-0.5 rounded-md bg-surface-2 font-semibold">
                    {job.workMode}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Posted {postedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions (Desktop) */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <button
                onClick={handleBookmark}
                disabled={isSaving}
                className={`p-3 rounded-2xl border transition-colors ${
                  saved
                    ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-primary text-brand-primary'
                    : 'bg-surface border-border-color text-text-muted hover:text-text-primary hover:bg-surface-2'
                }`}
                title={saved ? 'Saved' : 'Save Job'}
              >
                <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => setIsShareOpen(true)}
                className="p-3 rounded-2xl bg-surface border border-border-color text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
                title="Share Job"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsApplyOpen(true)}
                className="px-6 py-3 rounded-2xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              >
                <span>Apply Now</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 pt-6 border-t border-border-color grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-text-muted font-semibold">Compensation</p>
              <p className="text-text-primary font-bold text-sm mt-0.5">
                {job.salaryCurrency || '₹'}{job.salaryMin}–{job.salaryMax} {job.salaryPeriod || 'LPA'}
              </p>
            </div>
            <div>
              <p className="text-text-muted font-semibold">Experience</p>
              <p className="text-text-primary font-bold text-sm mt-0.5">
                {job.experience || 'Fresher'}
              </p>
            </div>
            <div>
              <p className="text-text-muted font-semibold">Job Type</p>
              <p className="text-text-primary font-bold text-sm mt-0.5">
                {job.jobType || 'Full-time'}
              </p>
            </div>
            <div>
              <p className="text-text-muted font-semibold">Deadline</p>
              <p className="text-text-primary font-bold text-sm mt-0.5 flex items-center gap-1.5">
                {job.isClosingSoon && (
                  <Timer className="w-3.5 h-3.5 text-accent-warning animate-pulse" />
                )}
                <span>{job.remainingDays !== undefined ? `${job.remainingDays} days left` : deadlineFormatted}</span>
              </p>
            </div>
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT & SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description & Requirements */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border-color shadow-card-subtle">
              <h2 className="text-lg font-bold text-text-primary mb-4">
                About the Role
              </h2>
              <div className="text-sm text-text-muted leading-relaxed whitespace-pre-line font-normal">
                {job.description}
              </div>

              {/* Required Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border-color">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-3">
                    Technologies & Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border-color shadow-card-subtle">
                <h2 className="text-lg font-bold text-text-primary mb-4">
                  Key Responsibilities
                </h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-text-muted">
                      <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border-color shadow-card-subtle">
                <h2 className="text-lg font-bold text-text-primary mb-4">
                  Qualifications & Requirements
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((req: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-text-muted">
                      <CheckCircle2 className="w-4 h-4 text-accent-success shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border-color shadow-card-subtle">
                <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-brand-primary" />
                  <span>Perks & Benefits</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.benefits.map((benefit: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary flex items-center gap-2.5"
                    >
                      <Sparkles className="w-4 h-4 text-brand-primary shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Overview Card */}
            <div className="p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle space-y-4">
              <h3 className="font-bold text-text-primary text-sm pb-3 border-b border-border-color">
                Job Overview
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-text-muted">Company</span>
                  <span className="font-bold text-text-primary">{job.companyName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-muted">Location</span>
                  <span className="font-bold text-text-primary">{job.locationName || 'Remote'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-muted">Work Mode</span>
                  <span className="font-bold text-text-primary">{job.workMode}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-muted">Experience</span>
                  <span className="font-bold text-text-primary">{job.experience}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-muted">Salary</span>
                  <span className="font-bold text-brand-primary">₹{job.salaryMin}–{job.salaryMax} LPA</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-muted">Deadline</span>
                  <span className="font-bold text-text-primary">{deadlineFormatted}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border-color">
                <button
                  onClick={() => setIsApplyOpen(true)}
                  className="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Apply For This Position</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <div className="p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle">
                <h3 className="font-bold text-text-primary text-sm mb-4">
                  Similar Opportunities
                </h3>
                <div className="space-y-3">
                  {relatedJobs.slice(0, 3).map((rel: any) => (
                    <Link
                      key={rel._id}
                      to={`/jobs/${rel.slug}`}
                      className="block p-3 rounded-2xl bg-surface-2 hover:bg-border-color transition-colors group"
                    >
                      <p className="text-xs font-bold text-text-primary group-hover:text-brand-primary transition-colors truncate">
                        {rel.title}
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {rel.companyName} · ₹{rel.salaryMin}–{rel.salaryMax} LPA
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE STICKY APPLY BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-surface/90 backdrop-blur-xl border-t border-border-color z-30 flex items-center justify-between gap-3 shadow-2xl">
        <div className="min-w-0">
          <p className="text-xs font-bold text-text-primary truncate">{job.title}</p>
          <p className="text-[11px] text-brand-primary font-semibold truncate">
            ₹{job.salaryMin}–{job.salaryMax} LPA
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleBookmark}
            className={`p-2.5 rounded-xl border ${
              saved
                ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-primary border-brand-primary'
                : 'bg-surface-2 text-text-muted border-border-color'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => setIsApplyOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-sm"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Modals */}
      {isApplyOpen && (
        <ApplyModal
          isOpen={isApplyOpen}
          onClose={() => setIsApplyOpen(false)}
          job={job}
        />
      )}

      {isShareOpen && (
        <JobShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          job={job}
        />
      )}
    </div>
  );
};
