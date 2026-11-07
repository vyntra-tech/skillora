import React from 'react';
import { SkilloraLogo } from './SkilloraLogo';

export const BrandedLoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-app">
      <div className="relative flex flex-col items-center">
        <SkilloraLogo size="lg" showTagline />
        <div className="mt-8 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export const JobCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface rounded-3xl p-6 border border-border-color shadow-card-subtle animate-pulse space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-2" />
          <div className="space-y-2">
            <div className="w-28 h-3.5 bg-surface-2 rounded-md" />
            <div className="w-20 h-3 bg-surface-2 rounded-md" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-xl bg-surface-2" />
      </div>
      <div className="w-48 h-5 bg-surface-2 rounded-md" />
      <div className="flex gap-2">
        <div className="w-20 h-6 bg-surface-2 rounded-lg" />
        <div className="w-24 h-6 bg-surface-2 rounded-lg" />
      </div>
      <div className="pt-3 flex items-center justify-between border-t border-border-color">
        <div className="w-20 h-3.5 bg-surface-2 rounded-md" />
        <div className="w-24 h-7 bg-surface-2 rounded-xl" />
      </div>
    </div>
  );
};

export const CompanyCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface rounded-3xl p-6 border border-border-color shadow-card-subtle animate-pulse space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-surface-2 shrink-0" />
        <div className="space-y-2 w-full">
          <div className="w-3/4 h-4 bg-surface-2 rounded-md" />
          <div className="w-1/2 h-3 bg-surface-2 rounded-md" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="w-full h-3 bg-surface-2 rounded-md" />
        <div className="w-5/6 h-3 bg-surface-2 rounded-md" />
      </div>
      <div className="pt-3 border-t border-border-color flex justify-between">
        <div className="w-24 h-4 bg-surface-2 rounded-md" />
      </div>
    </div>
  );
};

export const ArticleCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface rounded-3xl overflow-hidden border border-border-color shadow-card-subtle animate-pulse">
      <div className="w-full aspect-[16/9] bg-surface-2" />
      <div className="p-6 space-y-3">
        <div className="w-28 h-3 bg-surface-2 rounded-md" />
        <div className="w-full h-5 bg-surface-2 rounded-md" />
        <div className="w-4/5 h-3 bg-surface-2 rounded-md" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-2 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-surface-2 rounded-2xl w-full" />
      ))}
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-surface rounded-3xl border border-border-color p-4" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-surface rounded-3xl border border-border-color p-4" />
        <div className="h-80 bg-surface rounded-3xl border border-border-color p-4" />
      </div>
    </div>
  );
};
