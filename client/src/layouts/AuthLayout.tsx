import React from 'react';
import { Outlet } from 'react-router-dom';
import { SkilloraLogo } from '../components/common/SkilloraLogo';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-bg-app text-text-primary transition-colors duration-200 overflow-x-hidden">
      {/* Top Bar: Minimal Auth Navigation (Logo + Direct Theme Toggle only) */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between z-20">
        <SkilloraLogo size="md" />
        <ThemeToggle />
      </header>

      {/* Main Authentication Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Minimal Footer: Copyright only (No public footer links) */}
      <footer className="w-full py-4 text-center text-[11px] text-text-muted z-20">
        <p>© {new Date().getFullYear()} Skillora. All rights reserved.</p>
      </footer>
    </div>
  );
};

