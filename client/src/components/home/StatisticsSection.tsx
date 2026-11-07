import React, { useState, useEffect } from 'react';
import { Briefcase, Building2, GraduationCap, Users } from 'lucide-react';
import { Setting } from '../../types';
import { analyticsService } from '../../services/api';

interface StatisticsSectionProps {
  settings: Setting | null;
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({ settings }) => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    analyticsService
      .getPublicStats()
      .then((res) => {
        if (res.data) setStats(res.data);
      })
      .catch(() => {});
  }, []);

  const statsData = [
    {
      value: stats?.jobs !== undefined ? stats.jobs.toLocaleString() : (settings?.stats?.jobsCountText && !settings.stats.jobsCountText.includes('50K') ? settings.stats.jobsCountText : '1'),
      label: 'Verified Jobs',
      subtext: 'Across tech, engineering, design and data roles',
      icon: Briefcase,
    },
    {
      value: stats?.companies !== undefined ? stats.companies.toLocaleString() : (settings?.stats?.companiesCountText && !settings.stats.companiesCountText.includes('10K') ? settings.stats.companiesCountText : '1'),
      label: 'Hiring Companies',
      subtext: 'Directly verified employer partner profiles',
      icon: Building2,
    },
    {
      value: stats?.internships !== undefined ? stats.internships.toLocaleString() : (settings?.stats?.internshipsCountText && !settings.stats.internshipsCountText.includes('25K') ? settings.stats.internshipsCountText : '1'),
      label: 'Internship Roles',
      subtext: 'Paid stipends & real-world project experience',
      icon: GraduationCap,
    },
    {
      value: stats?.candidates !== undefined ? stats.candidates.toLocaleString() : (settings?.stats?.candidatesCountText && !settings.stats.candidatesCountText.includes('100K') ? settings.stats.candidatesCountText : '2'),
      label: 'Active Candidates',
      subtext: 'Students, graduates & skilled developers',
      icon: Users,
    },
  ];

  return (
    <section className="py-20 sm:py-24 border-b border-border-color bg-surface/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
            Platform Metrics
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary mb-3">
            Real Careers, Verified Listings
          </h2>
          <p className="text-text-muted text-sm font-medium">
            Discover opportunities directly published and managed on Skillora.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle hover:shadow-card-hover transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-2xl bg-brand-50 dark:bg-brand-900/30 text-brand-primary flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-text-primary mt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-text-muted mt-1 leading-relaxed">
                  {stat.subtext}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
