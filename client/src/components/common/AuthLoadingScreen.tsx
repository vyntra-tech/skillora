import React from 'react';
import { motion } from 'framer-motion';
import { SkilloraLogo } from './SkilloraLogo';

export const AuthLoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-app text-text-primary transition-colors duration-200">
      {/* Ambient background glows */}
      <div className="absolute w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative flex flex-col items-center"
      >
        <div className="mb-6 relative">
          <SkilloraLogo size="lg" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-2.5 rounded-3xl border-2 border-brand-primary/30 border-t-brand-primary pointer-events-none"
          />
        </div>

        <p className="text-xs font-bold text-text-muted uppercase tracking-wider animate-pulse">
          Loading your experience...
        </p>
      </motion.div>
    </div>
  );
};

