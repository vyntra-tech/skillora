import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Plus, Edit, Trash2, X, Upload, Loader2, Sparkles, Search } from 'lucide-react';
import { articleService, uploadService } from '../../services/api';
import { Article } from '../../types';
import { format } from 'date-fns';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/SkeletonLoaders';

export const AdminArticlesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Search & Pagination state
  const [keyword, setKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Interview Preparation');
  const [author, setAuthor] = useState('Editorial Team');
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('React, Career, System Design');
  const [readTime, setReadTime] = useState('5 min read');
  const [featured, setFeatured] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['adminArticlesPage'],
    queryFn: () => articleService.getArticles({ allStatus: 'true', limit: 100 }),
  });

  const rawArticles = data?.data || [];

  // Filter articles
  const filteredArticles = rawArticles.filter((a) => {
    const matchesKeyword =
      !keyword ||
      a.title.toLowerCase().includes(keyword.toLowerCase()) ||
      a.author.toLowerCase().includes(keyword.toLowerCase()) ||
      a.shortDescription.toLowerCase().includes(keyword.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || a.category === categoryFilter;

    return matchesKeyword && matchesCategory;
  });

  const totalItems = filteredArticles.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedArticles = filteredArticles.slice((page - 1) * pageSize, page * pageSize);

  const categories = Array.from(new Set(rawArticles.map((a) => a.category).filter(Boolean)));

  const openCreateModal = () => {
    setEditingArticle(null);
    setTitle('');
    setCategory('Interview Preparation');
    setAuthor('Skillora Editorial Team');
    setShortDescription('');
    setContent('');
    setCoverImage('');
    setTags('React, Career, Tips');
    setReadTime('5 min read');
    setFeatured(false);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (a: Article) => {
    setEditingArticle(a);
    setTitle(a.title);
    setCategory(a.category);
    setAuthor(a.author);
    setShortDescription(a.shortDescription);
    setContent(a.content);
    setCoverImage(a.coverImage || '');
    setTags(Array.isArray(a.tags) ? a.tags.join(', ') : '');
    setReadTime(a.readTime || '5 min read');
    setFeatured(Boolean(a.featured));
    setError(null);
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingArticle) {
        return articleService.updateArticle(editingArticle._id, payload);
      } else {
        return articleService.createArticle(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminArticlesPage'] });
      queryClient.invalidateQueries({ queryKey: ['careerArticles'] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to save article.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => articleService.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminArticlesPage'] });
      queryClient.invalidateQueries({ queryKey: ['careerArticles'] });
      setDeleteTarget(null);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const url = await uploadService.uploadFile(file, 'articles');
      setCoverImage(url);
    } catch {
      setError('Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDescription.trim() || !content.trim()) {
      setError('Please provide title, short description, and content.');
      return;
    }

    saveMutation.mutate({
      title,
      category,
      author,
      shortDescription,
      content,
      coverImage,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      readTime,
      featured,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-color">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Article & Guide Management
          </h1>
          <p className="text-xs text-text-muted mt-0.5 font-medium">
            Author and publish career guides, roadmaps, and placement masterclasses.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-2xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Write Article</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-3.5 rounded-3xl bg-surface border border-border-color shadow-card-subtle flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 relative flex items-center w-full">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            placeholder="Search articles by title, author, or keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs font-medium"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-surface-2 border border-border-color text-text-primary text-xs font-medium focus:outline-none focus:border-brand-primary"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Table Card */}
      <div className="bg-surface rounded-3xl border border-border-color shadow-card-subtle overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={3} cols={6} />
        ) : paginatedArticles.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No articles found"
              description="Write your first career roadmap or interview guide to educate candidates."
              actionText="Write Article"
              onAction={openCreateModal}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 border-b border-border-color text-text-muted font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Title & Category</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Read Time</th>
                  <th className="py-3.5 px-4">Published</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {paginatedArticles.map((a) => (
                  <tr key={a._id} className="hover:bg-surface-2/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-text-primary block line-clamp-1">{a.title}</span>
                      <span className="text-[11px] text-brand-primary font-medium">{a.category}</span>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted">{a.author}</td>
                    <td className="py-3.5 px-4 text-text-muted">{a.readTime}</td>
                    <td className="py-3.5 px-4 text-text-muted">
                      {a.publishedDate ? format(new Date(a.publishedDate), 'MMM dd, yyyy') : '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      {a.featured ? (
                        <span className="text-amber-500 font-bold text-[10px] bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                          <Sparkles className="w-3 h-3" /> Yes
                        </span>
                      ) : (
                        <span className="text-text-muted text-[10px]">No</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(a)}
                          className="p-1.5 text-text-muted hover:text-brand-primary rounded-lg hover:bg-surface-2 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: a._id, title: a.title })}
                          className="p-1.5 text-accent-error hover:bg-accent-error/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reusable Pagination Component */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1);
          }}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Article?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete Article"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Create / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-border-color">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-surface-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-text-primary mb-4">
              {editingArticle ? 'Edit Article' : 'Compose New Article'}
            </h2>

            {error && <p className="text-xs text-rose-500 bg-rose-500/10 p-2.5 rounded-xl mb-4 border border-rose-500/20">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Cover Image URL / Upload</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                  />
                  <label className="cursor-pointer px-3 py-2 bg-surface-2 hover:bg-surface-2/80 text-text-primary rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors border border-border-color">
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-brand-primary" /> : <Upload className="w-4 h-4" />}
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Short Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Full Article Content (Markdown / Text) *</label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary resize-none font-mono"
                />
              </div>

              <div className="pt-3 border-t border-border-color flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border-color text-text-muted hover:text-text-primary text-xs font-semibold hover:bg-surface-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-5 py-2 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-semibold transition-all"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
