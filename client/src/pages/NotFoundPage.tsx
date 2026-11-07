import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SkilloraLogo } from '../components/common/SkilloraLogo';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 flex items-center justify-center px-4 text-center bg-bg-app">
      <div className="max-w-md mx-auto space-y-5">
        <SkilloraLogo size="lg" />
        <h1 className="text-6xl font-extrabold text-brand-primary tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-text-primary">Page Not Found</h2>
        <p className="text-xs text-text-muted leading-relaxed font-normal">
          The page or career opportunity you are looking for does not exist or has been relocated on Skillora.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-2xl transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Skillora Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
