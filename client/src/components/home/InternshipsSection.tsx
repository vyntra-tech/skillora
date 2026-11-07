import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { Internship } from '../../types';
import { InternshipCard } from '../common/InternshipCard';

interface InternshipsSectionProps {
  internships: Internship[];
  isLoading: boolean;
}

export const InternshipsSection: React.FC<InternshipsSectionProps> = ({ internships, isLoading }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-border-color">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-primary text-xs font-bold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Campus & Fresher Tracks</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Latest Internships
          </h2>
          <p className="text-sm text-text-muted mt-1 font-medium">
            Paid stipends, structured mentorship, and PPO pathways across top tech teams.
          </p>
        </div>

        <Link
          to="/internships"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-2 border border-border-color text-text-primary font-bold text-xs shadow-card-subtle transition-colors shrink-0"
        >
          <span>View All Internships</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-56 bg-surface-2 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : internships.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">
          No internship openings currently listed. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.slice(0, 6).map((item) => (
            <InternshipCard key={item._id} internship={item} />
          ))}
        </div>
      )}
    </section>
  );
};
