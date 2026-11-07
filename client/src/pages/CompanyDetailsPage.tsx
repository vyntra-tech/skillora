import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Globe, Users, Calendar, Briefcase, GraduationCap, ChevronLeft, ExternalLink } from 'lucide-react';
import { companyService } from '../services/api';
import { JobCard } from '../components/common/JobCard';
import { InternshipCard } from '../components/common/InternshipCard';
import { EmptyState } from '../components/common/EmptyState';

export const CompanyDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['companyDetails', slug],
    queryFn: () => companyService.getCompanyBySlug(slug!),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-28 animate-pulse space-y-6">
        <div className="h-44 bg-surface rounded-3xl p-8 border border-border-color" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-28">
        <EmptyState
          title="Company Not Found"
          description="The company profile you are searching for does not exist."
          actionText="Back to Companies"
          onAction={() => (window.location.href = '/companies')}
        />
      </div>
    );
  }

  const company = data.data;
  const jobs = company.jobs || [];
  const internships = company.internships || [];

  const companyLogoUrl =
    company.logo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name || 'Company')}&background=6D5DFB&color=fff&size=128&bold=true`;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-bg-app">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/companies"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-brand-primary mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to all companies</span>
        </Link>

        {/* Company Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border-color shadow-card-subtle mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={companyLogoUrl}
                alt={company.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-contain border border-border-color shadow-sm bg-white p-2"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                  {company.name}
                </h1>
                <p className="text-sm font-semibold text-brand-primary mt-0.5">
                  {company.industry}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {company.location}
                  </span>
                  {company.companySize && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {company.companySize} Employees
                    </span>
                  )}
                  {company.foundedYear && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Founded {company.foundedYear}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-surface-2 hover:bg-border-color border border-border-color text-text-primary text-xs font-bold transition-colors"
              >
                <span>Visit Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-brand-primary" />
              </a>
            )}
          </div>

          {company.description && (
            <div className="mt-8 pt-6 border-t border-border-color">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                About {company.name}
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed whitespace-pre-line font-normal">
                {company.description}
              </p>
            </div>
          )}
        </div>

        {/* Open Positions Tabs / Section */}
        <div className="space-y-12">
          {/* Jobs */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="w-5 h-5 text-brand-primary" />
              <h2 className="text-xl font-bold text-text-primary">
                Open Positions at {company.name} ({jobs.length})
              </h2>
            </div>

            {jobs.length === 0 ? (
              <div className="p-8 rounded-3xl bg-surface border border-border-color text-center text-xs text-text-muted">
                No active job openings currently posted by {company.name}.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job: any) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </div>

          {/* Internships */}
          {internships.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="w-5 h-5 text-brand-primary" />
                <h2 className="text-xl font-bold text-text-primary">
                  Internships at {company.name} ({internships.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {internships.map((internship: any) => (
                  <InternshipCard key={internship._id} internship={internship} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
