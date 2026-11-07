import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, ArrowRight, ExternalLink } from 'lucide-react';
import { Company } from '../../types';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const companyLogoUrl =
    company.logo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name || 'Company')}&background=6D5DFB&color=fff&size=128&bold=true`;

  return (
    <div className="group relative flex flex-col justify-between p-6 rounded-3xl bg-surface border border-border-color hover:border-brand-primary/50 shadow-card-subtle hover:shadow-card-hover transition-all duration-200">
      <div>
        <div className="flex items-start gap-4 mb-4">
          <img
            src={companyLogoUrl}
            alt={company.name}
            className="w-13 h-13 w-12 h-12 rounded-2xl object-contain border border-border-color shadow-sm shrink-0 bg-white p-1"
            onError={(e) => {
              (e.target as HTMLElement).setAttribute(
                'src',
                `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name || 'Company')}&background=6D5DFB&color=fff`
              );
            }}
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-text-primary group-hover:text-brand-primary transition-colors text-base truncate">
              <Link to={`/companies/${company.slug}`}>{company.name}</Link>
            </h3>
            <p className="text-xs font-semibold text-brand-primary mt-0.5 truncate">
              {company.industry || 'Technology'}
            </p>
            <p className="text-xs text-text-muted flex items-center gap-1 mt-1 truncate">
              <MapPin className="w-3 h-3 text-text-muted flex-shrink-0" />
              {company.location || 'India'}
            </p>
          </div>
        </div>

        {company.description && (
          <p className="text-xs text-text-muted line-clamp-2 mb-4 leading-relaxed font-normal">
            {company.description}
          </p>
        )}

        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-surface-2 text-text-primary">
            <Briefcase className="w-3 h-3 text-brand-primary" />
            {company.activeJobsCount || 0} Open Roles
          </span>
          {company.companySize && (
            <span className="text-xs text-text-muted px-2 py-1 bg-surface-2 rounded-xl">
              {company.companySize}
            </span>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-border-color flex items-center justify-between">
        <Link
          to={`/companies/${company.slug}`}
          className="text-xs font-bold text-brand-primary hover:text-brand-secondary flex items-center gap-1 transition-colors group-hover:translate-x-0.5"
        >
          <span>View Company</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2"
            title="Visit Website"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
