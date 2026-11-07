import React from 'react';
import { Link } from 'react-router-dom';

interface SkilloraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  to?: string;
}

export const SkilloraLogo: React.FC<SkilloraLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  to = '/',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Skillora Monogram Icon */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#6D5DFB] via-[#7B69FB] to-[#8B5CF6] text-white shadow-sm flex-shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 24 24"
          className="w-3/5 h-3/5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 7c-.5-1.5-1.8-2.5-3.8-2.5-2.4 0-4.2 1.5-4.2 3.5 0 2 1.6 2.8 3.5 3.3l1.2.3c2 .5 3.3 1.2 3.3 3.1 0 2-1.9 3.3-4.4 3.3-2.5 0-4-1.2-4.6-3" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-extrabold tracking-tight text-text-primary leading-none ${textSizes[size]}`}>
          Skill<span className="text-brand-primary">ora</span>
        </span>
        {showTagline && (
          <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted mt-0.5">
            Discover. Learn. Grow.
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return <Link to={to} className="focus:outline-none">{content}</Link>;
  }

  return content;
};

