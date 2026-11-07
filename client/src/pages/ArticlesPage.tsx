import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, BookOpen } from 'lucide-react';
import { articleService } from '../services/api';
import { ArticleCard } from '../components/common/ArticleCard';
import { ArticleCardSkeleton } from '../components/common/SkeletonLoaders';
import { EmptyState } from '../components/common/EmptyState';

export const ArticlesPage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');

  const { data, isLoading } = useQuery({
    queryKey: ['articlesList', keyword, category],
    queryFn: () =>
      articleService.getArticles({
        keyword,
        category: category === 'All' ? '' : category,
        limit: 30,
      }),
  });

  const articles = data?.data || [];
  const categories = [
    'All',
    'Interview Preparation',
    'Resume & Career',
    'DSA & Coding',
    'Tech Trends',
    'Compensation',
    'Work Culture',
    'Career Transition',
    'Portfolio',
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-bg-app">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-primary text-xs font-bold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Knowledge & Insights</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight mb-3">
            Career Insights & Articles
          </h1>
          <p className="text-sm text-text-muted font-medium">
            In-depth technical guides, salary negotiation tactics, placement strategies, and industry roadmaps on Skillora.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="p-3 rounded-3xl bg-surface border border-border-color shadow-card-subtle mb-10 max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative flex items-center">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search guides, interview tips, salaries..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs font-medium"
            />
          </div>

          <div className="w-full sm:w-60">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-text-primary text-xs font-semibold focus:outline-none focus:border-brand-primary"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <EmptyState
            title="No Articles Found"
            description="Try searching with different keywords or choosing a different category."
            actionText="View All Articles"
            onAction={() => {
              setKeyword('');
              setCategory('All');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
