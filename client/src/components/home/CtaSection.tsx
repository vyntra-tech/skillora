import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CtaSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 sm:py-24 relative overflow-hidden bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden bg-gradient-to-br from-brand-primary/10 via-surface to-brand-secondary/10 border border-brand-primary/20 text-center shadow-card-subtle">
          {/* Subtle ambient glows */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-brand-primary/15 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-brand-secondary/15 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-primary text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Skillora Career Network</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight mb-4">
              Ready to take the next step?
            </h2>

            <p className="text-sm sm:text-base text-text-muted mb-8 leading-relaxed font-medium">
              Find opportunities that match your skills, goals and ambitions. Join thousands of candidates who accelerated their careers with Skillora.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/jobs"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs shadow-sm hover:shadow transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Explore Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-surface hover:bg-surface-2 border border-border-color text-text-primary font-bold text-xs shadow-card-subtle transition-colors inline-flex items-center justify-center gap-2"
                >
                  <span>Create Account</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

