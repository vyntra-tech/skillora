import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Briefcase,
  Search,
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Filter,
  CheckSquare,
  Square,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { jobService } from '../../services/api';
import { Job } from '../../types';
import { format } from 'date-fns';
import { TableSkeleton } from '../../components/common/SkeletonLoaders';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminJobsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Search, Filter, Sort, Pagination state
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [workModeFilter, setWorkModeFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['adminJobs', keyword, statusFilter, workModeFilter, featuredFilter, sortBy, page, pageSize],
    queryFn: () =>
      jobService.getJobs({
        keyword,
        status: statusFilter === 'all' ? '' : statusFilter,
        workMode: workModeFilter === 'all' ? '' : workModeFilter,
        featured: featuredFilter === 'all' ? '' : featuredFilter,
        sort: sortBy,
        page,
        limit: pageSize,
        allStatus: 'true',
      }),
  });

  const jobs = data?.data || [];
  const totalItems = data?.pagination?.total ?? jobs.length;
  const totalPages = (data?.pagination?.totalPages ?? Math.ceil(totalItems / pageSize)) || 1;

  // Mutations
  const duplicateMutation = useMutation({
    mutationFn: (id: string) => jobService.duplicateJob(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminJobs'] }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      jobService.updateJobStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminJobs'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => jobService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
      setDeleteTarget(null);
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget?.id));
    },
  });

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.length === jobs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(jobs.map((j) => j._id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkStatus = async (newStatus: string) => {
    for (const id of selectedIds) {
      await statusMutation.mutateAsync({ id, status: newStatus });
    }
    setSelectedIds([]);
  };

  const handleConfirmBulkDelete = async () => {
    for (const id of selectedIds) {
      await deleteMutation.mutateAsync(id);
    }
    setSelectedIds([]);
    setIsBulkDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-color">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Job Opportunities Management
          </h1>
          <p className="text-xs text-text-muted mt-0.5 font-medium">
            Manage all active, draft, and expired roles published to Skillora.
          </p>
        </div>

        <Link
          to="/admin/jobs/new"
          className="px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-2xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Opportunity</span>
        </Link>
      </div>

      {/* Filter, Search, and Sort Bar */}
      <div className="p-3.5 rounded-3xl bg-surface border border-border-color shadow-card-subtle flex flex-col lg:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="flex-1 relative flex items-center w-full">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title, company, skills..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs font-medium"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-2xl bg-surface-2 border border-border-color text-text-primary text-xs font-semibold focus:outline-none focus:border-brand-primary cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="expired">Expired</option>
          </select>

          {/* Work Mode Filter */}
          <select
            value={workModeFilter}
            onChange={(e) => {
              setWorkModeFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-2xl bg-surface-2 border border-border-color text-text-primary text-xs font-semibold focus:outline-none focus:border-brand-primary cursor-pointer"
          >
            <option value="all">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-surface-2 border border-border-color">
            <ArrowUpDown className="w-3.5 h-3.5 text-text-muted" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-text-primary text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="latest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="deadline">Closing Soonest</option>
              <option value="salary_high">Salary: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Banner */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center justify-between text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="font-bold text-brand-primary">{selectedIds.length}</span>
            <span className="text-text-primary font-medium">selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatus('published')}
              className="px-3 py-1 rounded-xl bg-surface hover:bg-surface-2 border border-border-color text-text-primary font-semibold transition-colors"
            >
              Mark Published
            </button>
            <button
              onClick={() => handleBulkStatus('draft')}
              className="px-3 py-1 rounded-xl bg-surface hover:bg-surface-2 border border-border-color text-text-primary font-semibold transition-colors"
            >
              Mark Draft
            </button>
            <button
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="px-3 py-1 rounded-xl bg-accent-error text-white font-semibold hover:bg-red-700 transition-colors"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-surface rounded-3xl border border-border-color shadow-card-subtle overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={4} cols={8} />
        ) : jobs.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No jobs found"
              description="Create your first job opening to start publishing roles."
              actionText="Add Job"
              onAction={() => navigate('/admin/jobs/new')}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 border-b border-border-color text-text-muted font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 w-10 text-center">
                    <button onClick={handleSelectAll} className="text-text-muted hover:text-text-primary">
                      {selectedIds.length === jobs.length && jobs.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-brand-primary" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Job Title</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Work Mode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {jobs.map((job) => {
                  const isSelected = selectedIds.includes(job._id);
                  const isClosing = job.remainingDays !== undefined && job.remainingDays <= 5 && job.remainingDays >= 0;

                  return (
                    <tr
                      key={job._id}
                      className={`hover:bg-surface-2/60 transition-colors ${isSelected ? 'bg-brand-primary/5' : ''
                        }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleSelect(job._id)}
                          className="text-text-muted hover:text-text-primary"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-brand-primary" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Job Title */}
                      <td className="py-3 px-4 font-bold text-text-primary">
                        <Link
                          to={`/jobs/${job.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-brand-primary transition-colors flex items-center gap-1 group"
                        >
                          <span className="line-clamp-1">{job.title}</span>
                          <ExternalLink className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </td>

                      {/* Company */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              job.companyLogo ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyName)}&background=6D5DFB&color=fff&size=64`
                            }
                            alt=""
                            className="w-6 h-6 rounded-lg object-cover border border-border-color bg-surface-2 shrink-0"
                          />
                          <span className="font-medium text-text-secondary line-clamp-1">{job.companyName}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-text-secondary font-medium">
                        {job.categoryName || 'General'}
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 text-text-muted font-medium">
                        {job.locationName || 'Remote'}
                      </td>

                      {/* Work Mode */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-surface-2 text-text-secondary border border-border-color">
                          {job.workMode || 'Hybrid'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${job.status === 'published'
                              ? 'bg-accent-success/10 text-accent-success'
                              : job.status === 'draft'
                                ? 'bg-amber-500/10 text-amber-500'
                                : 'bg-accent-error/10 text-accent-error'
                            }`}
                        >
                          {job.status === 'published' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span className="capitalize">{job.status}</span>
                        </span>
                      </td>

                      {/* Deadline */}
                      <td className="py-3 px-4 text-text-muted">
                        <div>
                          {job.deadline ? format(new Date(job.deadline), 'MMM dd, yyyy') : '-'}
                          {isClosing && (
                            <span className="block text-[9px] font-bold text-accent-error">
                              Closing in {job.remainingDays}d
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Featured */}
                      <td className="py-3 px-4">
                        {job.featured ? (
                          <span className="text-amber-500 font-bold text-[10px] bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                            <Sparkles className="w-3 h-3" /> Yes
                          </span>
                        ) : (
                          <span className="text-text-muted text-[10px]">No</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Toggle Publish / Unpublish */}
                          <button
                            onClick={() =>
                              statusMutation.mutate({
                                id: job._id,
                                status: job.status === 'published' ? 'draft' : 'published',
                              })
                            }
                            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
                            title={job.status === 'published' ? 'Unpublish (set to draft)' : 'Publish job'}
                          >
                            {job.status === 'published' ? (
                              <XCircle className="w-4 h-4 text-amber-500" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-accent-success" />
                            )}
                          </button>

                          {/* View on Public Frontend */}
                          <Link
                            to={`/jobs/${job.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-text-muted hover:text-brand-primary hover:bg-surface-2 transition-colors"
                            title="View Public Page"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Edit */}
                          <Link
                            to={`/admin/jobs/${job._id}/edit`}
                            className="p-1.5 rounded-lg text-text-muted hover:text-brand-primary hover:bg-surface-2 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* Duplicate */}
                          <button
                            onClick={() => duplicateMutation.mutate(job._id)}
                            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteTarget({ id: job._id, title: job.title })}
                            className="p-1.5 rounded-lg text-accent-error hover:bg-accent-error/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Reusable Pagination Component (Always rendered per Requirement 21) */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1);
          }}
        />
      </div>

      {/* Delete Confirmation Modal (Requirement 29) */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title={`Delete "${deleteTarget?.title || 'job opening'}"?`}
        message="This action cannot be undone. The opportunity will be permanently removed from Skillora."
        confirmLabel="Delete Job"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Bulk Delete Modal */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        title={`Delete ${selectedIds.length} selected job openings?`}
        message="All selected opportunities will be permanently removed from Skillora. This action cannot be undone."
        confirmLabel="Delete Selected"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setIsBulkDeleteModalOpen(false)}
      />
    </div>
  );
};
