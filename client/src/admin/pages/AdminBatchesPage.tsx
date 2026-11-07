import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { batchService } from '../../services/api';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminBatchesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [year, setYear] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; year: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['adminBatches'],
    queryFn: () => batchService.getBatches(),
  });

  const allBatches = data?.data || [];
  const totalItems = allBatches.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const batches = allBatches.slice((page - 1) * pageSize, page * pageSize);

  const addMutation = useMutation({
    mutationFn: (newYear: string) => batchService.createBatch({ year: newYear }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBatches'] });
      setYear('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => batchService.deleteBatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBatches'] });
      setDeleteTarget(null);
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year.trim()) return;
    addMutation.mutate(year.trim());
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="pb-4 border-b border-border-color">
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
          Batch Management
        </h1>
        <p className="text-xs text-text-muted mt-0.5 font-medium">
          Manage graduation batches available in job search filters and eligibility forms.
        </p>
      </div>

      <div className="bg-surface p-5 rounded-3xl border border-border-color shadow-card-subtle">
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="text"
            required
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 2026, 2027..."
            className="flex-1 px-4 py-2.5 rounded-2xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary placeholder:text-text-muted/60 font-medium"
          />
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-2xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Batch</span>
          </button>
        </form>
      </div>

      <div className="bg-surface rounded-3xl border border-border-color shadow-card-subtle overflow-hidden">
        <div className="p-6">
          <h3 className="font-bold text-text-primary text-xs mb-4">Configured Batches ({totalItems})</h3>
          {isLoading ? (
            <p className="text-xs text-text-muted">Loading batches...</p>
          ) : batches.length === 0 ? (
            <EmptyState
              title="No batches found"
              description="Add a graduation year batch above."
            />
          ) : (
            <div className="space-y-2">
              {batches.map((b) => (
                <div
                  key={b._id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-border-color bg-surface-2/40 hover:bg-surface-2 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-text-primary">Graduation Batch {b.year}</span>
                  </div>
                  <button
                    onClick={() => setDeleteTarget({ id: b._id, year: b.year })}
                    className="p-1.5 text-text-muted hover:text-accent-error rounded-lg hover:bg-accent-error/10 transition-colors"
                    title="Remove Batch"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reusable Pagination */}
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
        title={`Delete Batch "${deleteTarget?.year}"?`}
        message="This graduation batch filter will be permanently removed from Skillora."
        confirmLabel="Delete Batch"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
