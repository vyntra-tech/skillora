import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HelpCircle, Plus, Edit, Trash2, X, Search } from 'lucide-react';
import { faqService } from '../../services/api';
import { Faq } from '../../types';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/SkeletonLoaders';

export const AdminFaqsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

  // Search & Pagination state
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['adminFaqs'],
    queryFn: () => faqService.getFaqs({ allStatus: 'true' }),
  });

  const rawFaqs = data?.data || [];

  // Filter faqs
  const filteredFaqs = rawFaqs.filter((f) => {
    return (
      !keyword ||
      f.question.toLowerCase().includes(keyword.toLowerCase()) ||
      f.answer.toLowerCase().includes(keyword.toLowerCase()) ||
      f.category.toLowerCase().includes(keyword.toLowerCase())
    );
  });

  const totalItems = filteredFaqs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedFaqs = filteredFaqs.slice((page - 1) * pageSize, page * pageSize);

  const openCreateModal = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setCategory('General');
    setDisplayOrder(rawFaqs.length + 1);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (f: Faq) => {
    setEditingFaq(f);
    setQuestion(f.question);
    setAnswer(f.answer);
    setCategory(f.category);
    setDisplayOrder(f.displayOrder || 0);
    setError(null);
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingFaq) {
        return faqService.updateFaq(editingFaq._id, payload);
      } else {
        return faqService.createFaq(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFaqs'] });
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to save FAQ.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => faqService.deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFaqs'] });
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      setDeleteTarget(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      setError('Please provide Question and Answer.');
      return;
    }
    saveMutation.mutate({ question, answer, category, displayOrder });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-color">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            FAQ Management
          </h1>
          <p className="text-xs text-text-muted mt-0.5 font-medium">
            Manage public homepage accordion questions and candidate guides.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-2xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* Search Bar */}
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
            placeholder="Search FAQs by question or answer keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs font-medium"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-surface rounded-3xl border border-border-color shadow-card-subtle overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={3} cols={4} />
        ) : paginatedFaqs.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No FAQs found"
              description="Add frequently asked questions to help job seekers understand how Skillora works."
              actionText="Add FAQ"
              onAction={openCreateModal}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 border-b border-border-color text-text-muted font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Question</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Display Order</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {paginatedFaqs.map((f) => (
                  <tr key={f._id} className="hover:bg-surface-2/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-text-primary block line-clamp-1">{f.question}</span>
                      <span className="text-[11px] text-text-muted line-clamp-1 mt-0.5">{f.answer}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold">
                        {f.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted font-mono">{f.displayOrder}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(f)}
                          className="p-1.5 text-text-muted hover:text-brand-primary rounded-lg hover:bg-surface-2 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: f._id, title: f.question })}
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
        title="Delete FAQ?"
        message={`Are you sure you want to delete this FAQ? This action cannot be undone.`}
        confirmText="Delete FAQ"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-border-color">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-surface-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-text-primary mb-4">
              {editingFaq ? 'Edit FAQ Item' : 'New FAQ Item'}
            </h2>

            {error && <p className="text-xs text-rose-500 bg-rose-500/10 p-2.5 rounded-xl mb-4 border border-rose-500/20">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
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
                  <label className="block text-xs font-semibold text-text-primary mb-1">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary resize-none"
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
                  {saveMutation.isPending ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
