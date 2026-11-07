import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, ArrowRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const publishedDate = article.publishedDate || article.createdAt
    ? format(new Date(article.publishedDate || article.createdAt), 'MMM d, yyyy')
    : '';

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl bg-surface border border-border-color hover:border-brand-primary/50 shadow-card-subtle hover:shadow-card-hover transition-all duration-200 overflow-hidden">
      <div>
        {/* Cover Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-2">
          <img
            src={
              article.coverImage ||
              'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80'
            }
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-surface/90 dark:bg-surface/95 backdrop-blur-md text-brand-primary text-xs font-bold rounded-lg shadow-sm border border-border-color/50">
            {article.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 text-[11px] text-text-muted mb-3">
            <span className="flex items-center gap-1 font-medium">
              <User className="w-3 h-3 text-text-muted" />
              {article.author}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-text-muted" />
              {article.readTime || '5 min read'}
            </span>
            {publishedDate && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3 text-text-muted" />
                  {publishedDate}
                </span>
              </>
            )}
          </div>

          <Link to={`/articles/${article.slug}`}>
            <h3 className="font-bold text-text-primary group-hover:text-brand-primary transition-colors text-base line-clamp-2 mb-2 leading-snug">
              {article.title}
            </h3>
          </Link>

          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed font-normal">
            {article.shortDescription}
          </p>
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-5 pt-2 flex items-center justify-between border-t border-border-color">
        <Link
          to={`/articles/${article.slug}`}
          className="text-xs font-bold text-brand-primary hover:text-brand-secondary flex items-center gap-1 transition-colors"
        >
          <span>Read Article</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
