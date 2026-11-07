import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { User, Clock, Calendar, ChevronLeft, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { articleService } from '../services/api';
import { ArticleCard } from '../components/common/ArticleCard';
import { EmptyState } from '../components/common/EmptyState';

export const ArticleDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['articleDetails', slug],
    queryFn: () => articleService.getArticleBySlug(slug!),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 animate-pulse space-y-6">
        <div className="h-64 bg-surface-2 rounded-3xl" />
        <div className="h-8 w-2/3 bg-surface-2 rounded-xl" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-28">
        <EmptyState
          title="Article Not Found"
          description="The article you are searching for does not exist or has been archived."
          actionText="Back to Articles"
          onAction={() => (window.location.href = '/articles')}
        />
      </div>
    );
  }

  const article = data.data;
  const related = data.relatedArticles || [];
  const publishedDate = article.publishedDate ? format(new Date(article.publishedDate), 'MMMM dd, yyyy') : 'Recent';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <article className="min-h-screen pt-28 pb-20 bg-bg-app">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/articles"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-brand-primary mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to all insights</span>
        </Link>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden mb-8 shadow-card-subtle border border-border-color">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <div className="mb-8">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-900/30 text-brand-primary mb-4 border border-brand-200 dark:border-brand-800/40">
            {article.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight leading-tight mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border-color text-xs text-text-muted">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-bold text-text-primary">
                <User className="w-3.5 h-3.5 text-brand-primary" />
                {article.author}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {publishedDate}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime || '5 min read'}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 hover:bg-border-color text-text-primary text-xs font-semibold transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-10 rounded-3xl bg-surface border border-border-color shadow-card-subtle mb-12">
          <div className="text-sm sm:text-base text-text-muted leading-relaxed font-normal whitespace-pre-line space-y-4">
            {article.content}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border-color flex flex-wrap gap-2">
              {article.tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-surface-2 text-text-muted border border-border-color"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-6">
              Recommended Reading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.slice(0, 2).map((item: any) => (
                <ArticleCard key={item._id} article={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
