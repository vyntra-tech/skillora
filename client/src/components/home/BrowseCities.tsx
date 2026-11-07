import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { Location } from '../../types';

interface BrowseCitiesProps {
  locations: Location[];
  isLoading: boolean;
}

export const BrowseCities: React.FC<BrowseCitiesProps> = ({ locations, isLoading }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-border-color">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-primary text-xs font-bold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Tech Hubs & Remote</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Explore Opportunities by Location
          </h2>
          <p className="text-sm text-text-muted mt-1 font-medium">
            Find high-impact roles in major tech hubs or worldwide flexible remote positions.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-2 border border-border-color text-text-primary font-bold text-xs shadow-card-subtle transition-colors shrink-0"
        >
          <span>All Locations</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-wrap gap-2.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-10 w-28 bg-surface-2 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {locations.map((loc) => (
            <Link
              key={loc._id}
              to={`/jobs?city=${encodeURIComponent(loc.city)}`}
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface hover:bg-surface-2 border border-border-color hover:border-brand-primary/40 text-text-primary text-xs font-semibold shadow-card-subtle hover:shadow-card-hover transition-all duration-150"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-primary group-hover:scale-110 transition-transform" />
              <span>{loc.city}</span>
              {loc.jobsCount !== undefined && loc.jobsCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-surface-2 dark:bg-surface text-text-muted font-bold">
                  {loc.jobsCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
