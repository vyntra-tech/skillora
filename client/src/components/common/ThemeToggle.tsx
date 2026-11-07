import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', compact = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-2 border border-border-color/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${className}`}
    >
      {isDark ? (
        <Moon className="w-4 h-4 text-brand-primary transition-transform duration-300 hover:-rotate-12" />
      ) : (
        <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 hover:rotate-45" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
