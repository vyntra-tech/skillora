import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Article } from '../../types';
import { ArticleCard } from '../common/ArticleCard';
import { ArticleCardSkeleton } from '../common/SkeletonLoaders';

interface CareerInsightsProps {
  articles: Article[];
  isLoading: boolean;
}

export const CareerInsights: React.FC<CareerInsightsProps> = ({ articles, isLoading }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-border-color">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-primary text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Editorial & Guides</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Career Insights
          </h2>
          <p className="text-sm text-text-muted mt-1 font-medium">
            Actionable advice on salary negotiation, tech interviews, and accelerated career growth.
          </p>
        </div>

        <Link
          to="/articles"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-2 border border-border-color text-text-primary font-bold text-xs shadow-card-subtle transition-colors shrink-0"
        >
          <span>View All Articles</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">
          No articles published at this moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
};
