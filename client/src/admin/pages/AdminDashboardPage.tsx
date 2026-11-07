import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  GraduationCap,
  Building2,
  Users,
  FileCheck2,
  BookOpen,
  Layers,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { analyticsService } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { DashboardSkeleton } from '../../components/common/SkeletonLoaders';

export const AdminDashboardPage: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const { data, isLoading } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => analyticsService.getDashboardStats(),
  });

  const stats = data?.data?.cards || {
    totalJobs: 0,
    activeJobs: 0,
    draftJobs: 0,
    expiredJobs: 0,
    totalInternships: 0,
    totalCompanies: 0,
    totalUsers: 0,
    totalApplications: 0,
    totalArticles: 0,
    totalCategories: 0,
  };

  const charts = data?.data?.charts || {
    jobsOverTime: [],
    jobsByCategory: [],
    jobsByCity: [],
    topCompanies: [],
  };

  const recent = data?.data?.recent || {
    jobs: [],
    applications: [],
    users: [],
  };

  // Recharts theme colors
  const primaryColor = isDark ? '#8B7CFF' : '#6D5DFB';
  const secondaryColor = isDark ? '#22C55E' : '#16A34A';
  const gridColor = isDark ? '#1E293B' : '#E2E8F0';
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const tooltipBg = isDark ? '#0D1321' : '#FFFFFF';
  const tooltipBorder = isDark ? '#1E293B' : '#E2E8F0';

  const metricCards = [
    {
      label: 'Total Jobs',
      value: stats.totalJobs,
      subtext: `${stats.activeJobs} active · ${stats.expiredJobs} expired`,
      icon: Briefcase,
      trend: 'Live in database',
    },
    {
      label: 'Applications',
      value: stats.totalApplications,
      subtext: 'ATS submissions',
      icon: FileCheck2,
      trend: 'Pipeline tracked',
    },
    {
      label: 'Verified Companies',
      value: stats.totalCompanies,
      subtext: 'Active employers',
      icon: Building2,
      trend: 'Direct employers',
    },
    {
      label: 'Internships',
      value: stats.totalInternships,
      subtext: 'Campus tracks',
      icon: GraduationCap,
      trend: 'Active listings',
    },
    {
      label: 'Registered Users',
      value: stats.totalUsers,
      subtext: 'Candidates & admins',
      icon: Users,
      trend: 'Verified accounts',
    },
    {
      label: 'Published Articles',
      value: stats.totalArticles,
      subtext: 'Editorial guides',
      icon: BookOpen,
      trend: 'Published content',
    },
  ];

  const pieColors = ['#6D5DFB', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-primary text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-text-muted mt-1 font-medium">
            Live metrics, application telemetry, and recruiting pipeline for Skillora.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/jobs/new"
            className="px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-2xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job</span>
          </Link>
          <Link
            to="/admin/companies"
            className="px-4 py-2.5 bg-surface hover:bg-surface-2 border border-border-color text-text-primary rounded-2xl text-xs font-bold transition-colors"
          >
            Companies
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {metricCards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-surface border border-border-color shadow-card-subtle flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-text-muted">{c.label}</span>
                <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-primary flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                  {c.value}
                </span>
                <p className="text-[11px] text-text-muted mt-0.5">{c.subtext}</p>
                <div className="mt-2 text-[10px] font-bold text-accent-success flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-accent-success" />
                  <span>{c.trend}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RECHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Jobs Growth & Applications (AreaChart) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-text-primary text-sm">Job Postings & Application Velocity</h3>
              <p className="text-xs text-text-muted mt-0.5">Monthly platform activity comparison</p>
            </div>
            <span className="text-xs font-bold text-accent-success bg-accent-success/15 px-3 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+34% Overall</span>
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.jobsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="jobsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="appsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={secondaryColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="month" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                />
                <Area type="monotone" dataKey="jobs" stroke={primaryColor} strokeWidth={2.5} fillOpacity={1} fill="url(#jobsGradient)" name="Jobs Posted" />
                <Area type="monotone" dataKey="applications" stroke={secondaryColor} strokeWidth={2.5} fillOpacity={1} fill="url(#appsGradient)" name="Applications" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Top Hiring Companies */}
        <div className="p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-text-primary text-sm mb-1">Top Hiring Employers</h3>
            <p className="text-xs text-text-muted mb-4">Ranked by active published job listings</p>

            <div className="space-y-3">
              {charts.topCompanies.map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-2xl bg-surface-2 hover:bg-border-color/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-extrabold text-brand-primary w-4">{i + 1}</span>
                    <span className="font-bold text-xs text-text-primary truncate">{c.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-brand-primary bg-brand-50 dark:bg-brand-900/30 px-2.5 py-1 rounded-xl shrink-0">
                    {c.count} Open
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border-color mt-4">
            <Link to="/admin/companies" className="text-xs font-bold text-brand-primary hover:underline flex items-center justify-between">
              <span>View all companies</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Chart 3 & 4: Jobs by Category and Jobs by City */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs by Category BarChart */}
        <div className="p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle">
          <h3 className="font-bold text-text-primary text-sm mb-1">Opportunities by Functional Domain</h3>
          <p className="text-xs text-text-muted mb-4">Distribution across industry disciplines</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.jobsByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="category" stroke={textColor} fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" height={45} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                />
                <Bar dataKey="count" fill={primaryColor} radius={[8, 8, 0, 0]} name="Active Jobs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jobs by City BarChart */}
        <div className="p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle">
          <h3 className="font-bold text-text-primary text-sm mb-1">Opportunities by Location Hub</h3>
          <p className="text-xs text-text-muted mb-4">Top tech cities and worldwide remote</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.jobsByCity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="city" stroke={textColor} fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" height={45} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Open Positions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text-primary text-sm">Recent Job Postings</h3>
            <Link to="/admin/jobs" className="text-xs font-bold text-brand-primary hover:underline">
              View All Jobs →
            </Link>
          </div>

          <div className="space-y-2.5">
            {recent.jobs.map((job: any) => (
              <div
                key={job._id}
                className="flex items-center justify-between p-3 rounded-2xl bg-surface-2 hover:bg-border-color/50 transition-colors"
              >
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-text-primary truncate">{job.title}</h4>
                  <p className="text-[11px] text-text-muted truncate">{job.companyName}</p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${job.status === 'published'
                      ? 'bg-accent-success/15 text-accent-success'
                      : 'bg-surface text-text-muted border border-border-color'
                      }`}
                  >
                    {job.status}
                  </span>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {job.viewsCount || 0} views · {job.applicationsCount || 0} apps
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text-primary text-sm">Recent Candidate Applications</h3>
            <Link to="/admin/applications" className="text-xs font-bold text-brand-primary hover:underline">
              View ATS Pipeline →
            </Link>
          </div>

          <div className="space-y-2.5">
            {recent.applications.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-8">No applications submitted yet.</p>
            ) : (
              recent.applications.map((app: any) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-surface-2 hover:bg-border-color/50 transition-colors"
                >
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-text-primary truncate">{app.candidateName}</h4>
                    <p className="text-[11px] text-text-muted truncate">
                      {app.jobTitle} at {app.companyName}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-primary rounded-xl uppercase tracking-wider shrink-0">
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
