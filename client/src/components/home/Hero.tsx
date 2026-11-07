import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, GraduationCap, Briefcase, ArrowRight, Sparkles, Building2, Users } from 'lucide-react';
import { Category, Location, Batch } from '../../types';
import { analyticsService } from '../../services/api';

interface HeroProps {
  categories: Category[];
  locations: Location[];
  batches: Batch[];
}

export const Hero: React.FC<HeroProps> = ({ locations, batches }) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [batch, setBatch] = useState('');
  const [jobType, setJobType] = useState('');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    analyticsService.getPublicStats().then((res) => {
      if (res.data) setStats(res.data);
    }).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (city) params.append('city', city);
    if (batch) params.append('batch', batch);
    if (jobType) params.append('jobType', jobType);
    navigate(`/jobs?${params.toString()}`);
  };

  const popularTags = [
    'React',
    'Node.js',
    'Java',
    'Python',
    'Data Analyst',
    'Internship',
  ];

  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-mesh-pattern border-b border-border-color">
      {/* Subtle radial ambient gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-primary/10 dark:bg-brand-primary/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[200px] bg-brand-secondary/10 dark:bg-brand-secondary/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Floating subtle micro-cards (decorations) */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden xl:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl glass-card border border-border-color shadow-card-subtle absolute top-36 left-12 z-10 pointer-events-none"
      >
        <span className="w-2 h-2 rounded-full bg-accent-success animate-ping" />
        <span className="text-xs font-semibold text-text-primary">✦ Verified Active Roles</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="hidden xl:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl glass-card border border-border-color shadow-card-subtle absolute top-48 right-12 z-10 pointer-events-none"
      >
        <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
        <span className="text-xs font-semibold text-text-primary">⚡ Vetted Employer Profiles</span>
      </motion.div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Small badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800/40 text-brand-primary text-xs font-bold tracking-wide mb-6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>✦ Smarter Career Opportunities</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.15] mb-6"
        >
          Your Next{' '}
          <span className="text-gradient">Opportunity</span>{' '}
          Starts Here.
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Discover jobs, internships, companies and learning resources designed to help you build the career you want.
        </motion.p>

        {/* Search Box & Multi-Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <form
            onSubmit={handleSearch}
            className="p-2 sm:p-2.5 rounded-3xl bg-surface border border-border-color shadow-card-hover text-left flex flex-col md:flex-row items-center gap-2"
          >
            {/* Keyword Search */}
            <div className="relative flex-1 w-full flex items-center px-3 py-2.5">
              <Search className="w-4 h-4 text-text-muted mr-3 flex-shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search jobs, skills, companies..."
                className="w-full bg-transparent text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-none"
              />
            </div>

            <div className="hidden md:block w-px h-8 bg-border-color" />

            {/* Batch Filter */}
            <div className="w-full md:w-36 flex items-center px-3 py-1.5 border-t md:border-t-0 border-border-color">
              <GraduationCap className="w-4 h-4 text-text-muted mr-2 flex-shrink-0" />
              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-text-primary focus:outline-none cursor-pointer py-1.5"
              >
                <option value="" className="bg-surface text-text-primary">Batch / Year</option>
                {batches?.map((b) => (
                  <option key={b._id} value={b.year} className="bg-surface text-text-primary">
                    Class of {b.year}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden md:block w-px h-8 bg-border-color" />

            {/* City / Location */}
            <div className="w-full md:w-36 flex items-center px-3 py-1.5 border-t md:border-t-0 border-border-color">
              <MapPin className="w-4 h-4 text-text-muted mr-2 flex-shrink-0" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-text-primary focus:outline-none cursor-pointer py-1.5"
              >
                <option value="" className="bg-surface text-text-primary">Location</option>
                {locations?.map((loc) => (
                  <option key={loc._id} value={loc.city} className="bg-surface text-text-primary">
                    {loc.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden md:block w-px h-8 bg-border-color" />

            {/* Job Type */}
            <div className="w-full md:w-36 flex items-center px-3 py-1.5 border-t md:border-t-0 border-border-color">
              <Briefcase className="w-4 h-4 text-text-muted mr-2 flex-shrink-0" />
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-text-primary focus:outline-none cursor-pointer py-1.5"
              >
                <option value="" className="bg-surface text-text-primary">Job Type</option>
                <option value="Full-time" className="bg-surface text-text-primary">Full-time</option>
                <option value="Internship" className="bg-surface text-text-primary">Internship</option>
                <option value="Contract" className="bg-surface text-text-primary">Contract</option>
                <option value="Part-time" className="bg-surface text-text-primary">Part-time</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all duration-150 flex-shrink-0"
            >
              <span>Search Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Popular searches */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="font-semibold text-text-muted">Popular:</span>
            {popularTags.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(term)}`)}
                className="px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-2 border border-border-color text-text-muted hover:text-text-primary transition-colors font-medium text-[11px]"
              >
                {term}
              </button>
            ))}
          </div>
        </motion.div>

        {/* SECTION 8: HERO STATS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 pt-8 border-t border-border-color/80 grid grid-cols-2 sm:grid-cols-4 gap-6"
        >
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              {stats?.jobs !== undefined ? stats.jobs.toLocaleString() : '1'}
            </p>
            <p className="text-xs font-semibold text-text-muted mt-1 uppercase tracking-wider">
              Jobs Available
            </p>
          </div>

          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              {stats?.companies !== undefined ? stats.companies.toLocaleString() : '1'}
            </p>
            <p className="text-xs font-semibold text-text-muted mt-1 uppercase tracking-wider">
              Hiring Companies
            </p>
          </div>

          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              {stats?.internships !== undefined ? stats.internships.toLocaleString() : '1'}
            </p>
            <p className="text-xs font-semibold text-text-muted mt-1 uppercase tracking-wider">
              Internships
            </p>
          </div>

          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              {stats?.candidates !== undefined ? stats.candidates.toLocaleString() : '2'}
            </p>
            <p className="text-xs font-semibold text-text-muted mt-1 uppercase tracking-wider">
              Candidates Joined
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
