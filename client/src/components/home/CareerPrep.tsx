import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Users2,
  Building,
  BrainCircuit,
  FileCheck,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const CareerPrep: React.FC = () => {
  const prepModules = [
    {
      title: 'DSA Practice',
      description: 'Master arrays, trees, graphs, dynamic programming, and high-frequency patterns.',
      icon: Code2,
      href: '/practice?type=DSA',
      tag: 'Coding Prep',
    },
    {
      title: 'Interview Preparation',
      description: 'System design, core concepts, behavioral rounds, and live technical blueprints.',
      icon: Users2,
      href: '/practice?type=Interview',
      tag: 'FAANG Ready',
    },
    {
      title: 'Aptitude & Reasoning',
      description: 'Quantitative aptitude, logical reasoning, and campus placement screening tests.',
      icon: BrainCircuit,
      href: '/practice?type=Aptitude',
      tag: 'Campus Placement',
    },
    {
      title: 'Company Specific',
      description: 'Curated previous interview questions from top tech firms and high-growth startups.',
      icon: Building,
      href: '/practice?type=Company Specific',
      tag: 'Real Questions',
    },
    {
      title: 'Career Roadmaps',
      description: 'Step-by-step career path roadmaps for Frontend, Backend, DevOps, and Data Science.',
      icon: Compass,
      href: '/articles',
      tag: 'Step-by-Step',
    },
    {
      title: 'Resume & Tools',
      description: 'Industry-standard ATS templates, salary calculators, and actionable candidate utilities.',
      icon: FileCheck,
      href: '/tools',
      tag: 'ATS Optimized',
    },
  ];

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden bg-surface-2/40 border-y border-border-color transition-colors duration-200">
      {/* Subtle brand backdrop glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-primary/10 dark:bg-brand-primary/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-secondary/10 dark:bg-brand-secondary/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800/40 text-brand-primary text-xs font-bold mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Skillora Learning Hub</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
              Build Skills. Get Hired.
            </h2>
            <p className="text-sm text-text-muted mt-2 font-medium max-w-xl">
              Equip yourself with comprehensive problem-solving skills, interview blueprints, and practice frameworks designed for top-tier careers.
            </p>
          </div>

          <Link
            to="/practice"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-surface hover:bg-surface-2 border border-border-color text-text-primary font-bold text-xs shadow-card-subtle transition-all shrink-0"
          >
            <span>Explore All Resources</span>
            <ArrowRight className="w-4 h-4 text-brand-primary" />
          </Link>
        </div>

        {/* 6 Preparation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prepModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.title}
                to={module.href}
                className="group relative flex flex-col justify-between p-7 rounded-3xl bg-surface border border-border-color hover:border-brand-primary/50 hover:bg-surface-2/40 shadow-card-subtle hover:shadow-card-hover transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-900/30 text-brand-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted px-2.5 py-1 rounded-full bg-surface-2 border border-border-color">
                      {module.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary group-hover:text-brand-primary transition-colors mb-2">
                    {module.title}
                  </h3>

                  <p className="text-xs text-text-muted leading-relaxed font-normal">
                    {module.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-border-color flex items-center justify-between text-xs font-semibold text-text-muted group-hover:text-text-primary transition-colors">
                  <span>Start Practicing</span>
                  <div className="w-7 h-7 rounded-full bg-surface-2 group-hover:bg-brand-primary text-brand-primary group-hover:text-white flex items-center justify-center group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
