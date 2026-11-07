import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, Users, Briefcase, FileCheck, Award } from 'lucide-react';
import { analyticsService } from '../../services/api';

export const AdminReportsPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => analyticsService.getDashboardStats(),
  });

  const cards = data?.data?.cards || {};
  const charts = data?.data?.charts || {};

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
          Platform Analytics & Reports
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Conversion metrics, candidate application velocity, and top hiring verticals.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-3xl border border-border-color shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-text-muted uppercase">Application Conversion Rate</span>
            <span className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-text-primary mb-1">18.4%</div>
          <p className="text-xs text-text-muted">Average candidate application completion rate.</p>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border-color shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-text-muted uppercase">Avg. Applicants Per Job</span>
            <span className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <FileCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-text-primary mb-1">
            {cards.totalJobs > 0 ? (cards.totalApplications / cards.totalJobs).toFixed(1) : '0'}
          </div>
          <p className="text-xs text-text-muted">Submissions per verified posting.</p>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border-color shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-text-muted uppercase">Talent Pool Size</span>
            <span className="p-2 bg-purple-500/10 text-purple-500 rounded-xl">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-text-primary mb-1">{cards.totalUsers || 0}</div>
          <p className="text-xs text-text-muted">Active registered candidate profiles.</p>
        </div>
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Jobs by Category */}
        <div className="bg-surface p-6 rounded-3xl border border-border-color shadow-2xs">
          <h3 className="font-bold text-sm text-text-primary mb-4">Jobs Distribution by Category</h3>
          <div className="space-y-3">
            {(charts.jobsByCategory || []).map((cat: any, i: number) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-primary">
                  <span>{cat.name}</span>
                  <span className="text-text-muted">{cat.count} openings</span>
                </div>
                <div className="w-full bg-surface-2 rounded-full h-2 overflow-hidden border border-border-color">
                  <div
                    style={{ width: `${Math.min(100, (cat.count / (cards.totalJobs || 1)) * 100 * 2)}%` }}
                    className="bg-brand-primary h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs by Location */}
        <div className="bg-surface p-6 rounded-3xl border border-border-color shadow-2xs">
          <h3 className="font-bold text-sm text-text-primary mb-4">Jobs Distribution by Hub</h3>
          <div className="space-y-3">
            {(charts.jobsByCity || []).map((loc: any, i: number) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-primary">
                  <span>{loc.city}</span>
                  <span className="text-text-muted">{loc.count} openings</span>
                </div>
                <div className="w-full bg-surface-2 rounded-full h-2 overflow-hidden border border-border-color">
                  <div
                    style={{ width: `${Math.min(100, (loc.count / (cards.totalJobs || 1)) * 100 * 2)}%` }}
                    className="bg-brand-secondary h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
