import React from 'react';
import { LucideIcon, Search } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No opportunities found',
  description = 'Try adjusting your search filters or browse other popular categories.',
  icon: Icon = Search,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface rounded-3xl border border-border-color shadow-card-subtle max-w-md mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/30 text-brand-primary flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-text-muted text-sm mb-6 leading-relaxed font-normal">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white font-bold rounded-2xl text-xs transition-all shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
