import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Mail,
  Calculator,
  Percent,
  HelpCircle,
  Compass,
  ArrowRight,
  Wrench,
  Sparkles,
} from 'lucide-react';
import { CareerTool } from '../../types';

interface CareerToolsSectionProps {
  tools: CareerTool[];
  isLoading: boolean;
}

const toolIconMap: Record<string, React.FC<{ className?: string }>> = {
  FileText,
  CheckCircle2,
  Mail,
  Calculator,
  Percent,
  HelpCircle,
  Compass,
  Wrench,
};

export const CareerToolsSection: React.FC<CareerToolsSectionProps> = ({ tools, isLoading }) => {
  // Built-in list if tools are empty or loading
  const defaultTools = [
    {
      title: 'Resume Builder',
      description: 'Craft ATS-friendly, professional resumes with modern formatting and export.',
      icon: 'FileText',
      slug: 'resume-builder',
      isFree: true,
    },
    {
      title: 'ATS Checker',
      description: 'Analyze keyword match and parseability to beat applicant tracking systems.',
      icon: 'CheckCircle2',
      slug: 'ats-checker',
      isFree: true,
    },
    {
      title: 'Cover Letter Generator',
      description: 'Draft tailored, compelling cover letters personalized to company and job description.',
      icon: 'Mail',
      slug: 'cover-letter',
      isFree: true,
    },
    {
      title: 'Salary Calculator',
      description: 'Calculate exact in-hand take-home salary from LPA with tax breakdown.',
      icon: 'Calculator',
      slug: 'salary-calculator',
      isFree: true,
    },
    {
      title: 'CGPA Calculator',
      description: 'Convert percentage to CGPA and determine eligibility criteria for top firms.',
      icon: 'Percent',
      slug: 'cgpa-calculator',
      isFree: true,
    },
    {
      title: 'Interview Generator',
      description: 'Generate customized technical and HR interview questions for any tech stack.',
      icon: 'HelpCircle',
      slug: 'interview-generator',
      isFree: true,
    },
  ];

  const displayTools = tools && tools.length > 0 ? tools : (defaultTools as any);

  return (
    <section className="py-16 sm:py-20 border-b border-border-color bg-surface/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-primary text-xs font-bold mb-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>Smart Utilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Powerful Career Tools
            </h2>
            <p className="text-sm text-text-muted mt-1 font-medium">
              Free automated utilities to calculate take-home salary, test ATS compatibility, and craft resumes.
            </p>
          </div>

          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-2 border border-border-color text-text-primary font-bold text-xs shadow-card-subtle transition-colors shrink-0"
          >
            <span>Explore All Tools</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTools.slice(0, 6).map((tool: any) => {
            const IconComponent = toolIconMap[tool.icon] || Wrench;
            return (
              <Link
                key={tool.slug || tool.title}
                to={`/tools?tool=${tool.slug}`}
                className="group relative flex flex-col justify-between p-6 rounded-3xl bg-surface border border-border-color hover:border-brand-primary/50 shadow-card-subtle hover:shadow-card-hover transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-brand-50 dark:bg-brand-900/30 text-brand-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-200">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent-success/10 text-accent-success border border-accent-success/20">
                      Free Tool
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors mb-1.5">
                    {tool.title}
                  </h3>

                  <p className="text-xs text-text-muted leading-relaxed font-normal">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border-color flex items-center justify-between text-xs font-semibold text-text-muted group-hover:text-brand-primary transition-colors">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
