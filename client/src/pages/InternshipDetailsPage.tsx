import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin,
  Calendar,
  Banknote,
  CheckCircle2,
  Gift,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  Share2,
} from 'lucide-react';
import { format } from 'date-fns';
import { internshipService } from '../services/api';
import { InternshipCard } from '../components/common/InternshipCard';
import { ApplyModal } from '../components/common/ApplyModal';
import { EmptyState } from '../components/common/EmptyState';

export const InternshipDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['internshipDetails', slug],
    queryFn: () => internshipService.getInternshipBySlug(slug!),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-44 bg-white rounded-3xl p-8 border border-slate-200" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <EmptyState
          title="Internship Not Found"
          description="This internship opening has closed or does not exist."
          actionText="Back to Internships"
          onAction={() => (window.location.href = '/internships')}
        />
      </div>
    );
  }

  const internship = data.data;
  const related = data.relatedInternships || [];

  const companyLogoUrl =
    internship.companyLogo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(internship.companyName || 'Company')}&background=4f46e5&color=fff&size=128&bold=true`;

  const formattedDeadline = internship.deadline ? format(new Date(internship.deadline), 'MMMM dd, yyyy') : 'Rolling basis';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/internships"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to all internships</span>
      </Link>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <img
              src={companyLogoUrl}
              alt={internship.companyName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-100 shadow-sm shrink-0 bg-slate-50"
            />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                  Internship
                </span>
                {internship.featured && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                {internship.title}
              </h1>
              <p className="text-sm font-semibold text-slate-600">{internship.companyName}</p>
            </div>
          </div>

          <button
            onClick={() => setIsApplyOpen(true)}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 shrink-0 self-start"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Highlights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Monthly Stipend</span>
            <span className="font-extrabold text-emerald-600 text-sm sm:text-base">{internship.stipend}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Duration</span>
            <span className="font-bold text-slate-900 text-sm">{internship.duration}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Work Mode</span>
            <span className="font-bold text-slate-900 text-sm">
              {internship.locationName} · {internship.workMode}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Apply By</span>
            <span className="font-bold text-slate-900 text-sm">{formattedDeadline}</span>
          </div>
        </div>
      </div>

      {/* Grid: Description & Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Skills Required */}
          {internship.skills && internship.skills.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-3">Skills & Prerequisites</h2>
              <div className="flex flex-wrap gap-2">
                {internship.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Internship Description</h2>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {internship.description}
              </div>
            </div>

            {internship.requirements && internship.requirements.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">Eligibility & Requirements</h3>
                <ul className="space-y-2">
                  {internship.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {internship.perks && internship.perks.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">Perks & Learning Benefits</h3>
                <ul className="space-y-2">
                  {internship.perks.map((perk, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                      <Gift className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Ready to Apply?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Submit your profile directly to the hiring squad at {internship.companyName}.
            </p>
            <button
              onClick={() => setIsApplyOpen(true)}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Submit Application
            </button>
          </div>

          {/* Related Internships */}
          {related.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-4">Other Open Internships</h3>
              <div className="space-y-3">
                {related.map((item) => (
                  <Link
                    key={item._id}
                    to={`/internships/${item.slug}`}
                    className="block p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                    <p className="text-[11px] text-slate-400">{item.companyName}</p>
                    <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">{item.stipend}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ApplyModal
        job={internship as any}
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
      />
    </div>
  );
};

