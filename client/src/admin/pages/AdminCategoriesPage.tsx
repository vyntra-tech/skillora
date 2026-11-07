import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layers, Plus, Edit, Trash2, X, Sparkles, Search } from 'lucide-react';
import { categoryService } from '../../services/api';
import { Category } from '../../types';
import { TableSkeleton } from '../../components/common/SkeletonLoaders';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminCategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  // Search & Pagination state
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Code2');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['adminCategoriesPage'],
    queryFn: () => categoryService.getCategories({ allStatus: 'true' }),
  });

  const allCategories = data?.data || [];
  const filtered = allCategories.filter((c) =>
    keyword ? c.name.toLowerCase().includes(keyword.toLowerCase()) : true
  );
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const categories = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openCreateModal = () => {
    setEditingCat(null);
    setName('');
    setIcon('Code2');
    setDescription('');
    setFeatured(false);
    setStatus('published');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setIcon(cat.icon || 'Code2');
    setDescription(cat.description || '');
    setFeatured(Boolean(cat.featured));
    setStatus(cat.status || 'published');
    setError(null);
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingCat) {
        return categoryService.updateCategory(editingCat._id, payload);
      } else {
        return categoryService.createCategory(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategoriesPage'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to save category.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategoriesPage'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeleteTarget(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }
    saveMutation.mutate({ name, icon, description, featured, status });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-color">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Job Category Management
          </h1>
          <p className="text-xs text-text-muted mt-0.5 font-medium">
            Manage industry verticals, icons, and homepage category chips.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-2xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3.5 rounded-3xl bg-surface border border-border-color shadow-card-subtle flex items-center gap-3">
        <div className="flex-1 relative flex items-center w-full">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            placeholder="Search categories by name..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs font-medium"
          />
        </div>
      </div>

      <div className="rounded-3xl bg-surface border border-border-color shadow-card-subtle overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={4} cols={6} />
        ) : categories.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No categories found"
              description="Create a category to group jobs and internships."
              actionText="Add Category"
              onAction={openCreateModal}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-2 border-b border-border-color text-text-muted font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 w-12">Icon</th>
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color font-medium">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-surface-2/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs">
                        {cat.icon?.slice(0, 2) || 'CA'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-text-primary whitespace-nowrap">
                      {cat.name}
                    </td>
                    <td className="py-3.5 px-4 text-text-muted font-mono text-[11px] whitespace-nowrap">
                      {cat.slug}
                    </td>
                    <td className="py-3.5 px-4 text-text-muted max-w-xs truncate">
                      {cat.description || '—'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 bg-accent-success/10 text-accent-success rounded-full font-bold text-[10px] capitalize">
                        {cat.status || 'published'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {cat.featured ? (
                        <span className="text-amber-500 font-bold text-[10px] bg-amber-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
                          <Sparkles className="w-3 h-3" /> Featured
                        </span>
                      ) : (
                        <span className="text-text-muted text-[10px]">Standard</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 text-text-muted hover:text-brand-primary rounded-lg hover:bg-surface-2 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: cat._id, name: cat.name })}
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
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title={`Delete "${deleteTarget?.name || 'category'}"?`}
        message="This action cannot be undone. Jobs linked to this category may lose their categorization."
        confirmLabel="Delete Category"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface rounded-3xl max-w-md w-full p-6 sm:p-8 border border-border-color shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary rounded-xl hover:bg-surface-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-text-primary mb-4">
              {editingCat ? 'Edit Category' : 'Create New Category'}
            </h2>

            {error && (
              <p className="text-xs text-accent-error bg-accent-error/10 p-2.5 rounded-xl mb-4 border border-accent-error/20 font-medium">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Software Development"
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Icon Key</label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="e.g. Code2, Database, Shield"
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of this vertical..."
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary/20 border-border-color bg-surface"
                  />
                  <span className="text-xs font-semibold text-text-primary">Featured (Show in Homepage Quick Categories)</span>
                </label>
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
                  className="px-5 py-2 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
