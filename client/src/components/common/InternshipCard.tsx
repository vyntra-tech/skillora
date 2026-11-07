import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Banknote, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { Internship } from '../../types';
import { ApplyModal } from './ApplyModal';
import { getMediaUrl } from '../../utils/url';

interface InternshipCardProps {
  internship: Internship;
}

export const InternshipCard: React.FC<InternshipCardProps> = ({ internship }) => {
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const companyLogoUrl =
    getMediaUrl(internship.companyLogo) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(internship.companyName || 'Company')}&background=6D5DFB&color=fff&size=128&bold=true`;

  return (
    <>
      <div className="group relative flex flex-col justify-between p-6 rounded-3xl bg-surface border border-border-color hover:border-brand-primary/50 shadow-card-subtle hover:shadow-card-hover transition-all duration-200">
        <div>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <img
                src={companyLogoUrl}
                alt={internship.companyName}
                className="w-12 h-12 rounded-2xl object-contain border border-border-color shadow-sm shrink-0 bg-white p-1"
                onError={(e) => {
                  (e.target as HTMLElement).setAttribute(
                    'src',
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(internship.companyName || 'Company')}&background=6D5DFB&color=fff`
                  );
                }}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-muted truncate">
                  {internship.companyName}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-text-muted" />
                    {internship.locationName || 'Remote'}
                  </span>
                  <span className="text-text-muted/40">·</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-2 text-text-muted">
                    {internship.workMode || 'Internship'}
                  </span>
                </div>
              </div>
            </div>

            {internship.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-900/30 text-brand-primary border border-brand-200 dark:border-brand-800/40 shrink-0">
                <Sparkles className="w-3 h-3 text-brand-primary" />
                Featured
              </span>
            )}
          </div>

          <Link to={`/internships/${internship.slug}`} className="block group-hover:text-brand-primary transition-colors">
            <h3 className="font-bold text-text-primary text-base line-clamp-1 mb-3">
              {internship.title}
            </h3>
          </Link>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-2 text-xs font-semibold text-text-primary">
              <Banknote className="w-3.5 h-3.5 text-accent-success" />
              <span className="truncate">{internship.stipend || 'Performance Stipend'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-2 text-xs font-semibold text-text-muted">
              <Calendar className="w-3.5 h-3.5" />
              <span className="truncate">{internship.duration || '3 Months'}</span>
            </div>
          </div>

          {internship.skills && internship.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {internship.skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-2 text-text-muted border border-border-color"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border-color flex items-center justify-between gap-2">
          <Link
            to={`/internships/${internship.slug}`}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-text-primary bg-surface-2 hover:bg-border-color transition-colors"
          >
            Details
          </Link>
          <button
            onClick={() => setIsApplyOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-primary hover:bg-brand-hover shadow-sm transition-all"
          >
            Apply Now
          </button>
        </div>
      </div>

      {isApplyOpen && (
        <ApplyModal
          isOpen={isApplyOpen}
          onClose={() => setIsApplyOpen(false)}
          itemType="internship"
          itemTitle={internship.title}
          companyName={internship.companyName}
          companyLogo={internship.companyLogo}
          itemId={internship._id}
          applicationUrl={internship.applicationUrl || internship.applyUrl}
        />
      )}
    </>
  );
};
