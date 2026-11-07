import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  X,
  Sparkles,
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { internshipService, companyService, categoryService, locationService } from '../../services/api';
import { Internship } from '../../types';
import { format } from 'date-fns';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/SkeletonLoaders';

export const AdminInternshipsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Internship | null>(null);

  // Search & Pagination state
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const { data: companiesData } = useQuery({ queryKey: ['adminCompanies'], queryFn: () => companyService.getCompanies({ limit: 100 }) });
  const { data: categoriesData } = useQuery({ queryKey: ['adminCategories'], queryFn: () => categoryService.getCategories() });
  const { data: locationsData } = useQuery({ queryKey: ['adminLocations'], queryFn: () => locationService.getLocations() });

  const companies = companiesData?.data || [];
  const categories = categoriesData?.data || [];
  const locations = locationsData?.data || [];

  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [duration, setDuration] = useState('3 Months');
  const [stipend, setStipend] = useState('₹25,000 /month');
  const [skills, setSkills] = useState('React, TypeScript');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['adminInternshipsList', keyword, page, pageSize],
    queryFn: () =>
      internshipService.getInternships({
        keyword,
        page,
        limit: pageSize,
        allStatus: 'true',
      }),
  });

  const internships = data?.data || [];
  const totalItems = data?.pagination?.total ?? internships.length;
  const totalPages = (data?.pagination?.totalPages ?? Math.ceil(totalItems / pageSize)) || 1;

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    if (companies.length > 0) setCompanyId(companies[0]._id);
    if (categories.length > 0) setCategoryId(categories[0]._id);
    if (locations.length > 0) setLocationId(locations[0]._id);
    setWorkMode('Hybrid');
    setDuration('3 Months');
    setStipend('₹25,000 /month');
    setSkills('React, TypeScript');
    setDescription('Hands-on internship opportunity for college students.');
    setDeadline(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setFeatured(false);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Internship) => {
    setEditingItem(item);
    setTitle(item.title);
    setCompanyId(typeof item.companyId === 'string' ? item.companyId : item.companyId?._id || '');
    setCategoryId(typeof item.categoryId === 'string' ? item.categoryId : item.categoryId?._id || '');
    setLocationId(typeof item.locationId === 'string' ? item.locationId : item.locationId?._id || '');
    setWorkMode(item.workMode);
    setDuration(item.duration);
    setStipend(item.stipend);
    setSkills(Array.isArray(item.skills) ? item.skills.join(', ') : '');
    setDescription(item.description);
    if (item.deadline) {
      setDeadline(new Date(item.deadline).toISOString().split('T')[0]);
    }
    setFeatured(Boolean(item.featured));
    setError(null);
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingItem) {
        return internshipService.updateInternship(editingItem._id, payload);
      } else {
        return internshipService.createInternship(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminInternshipsList'] });
      queryClient.invalidateQueries({ queryKey: ['latestInternships'] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to save internship.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => internshipService.deleteInternship(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminInternshipsList'] });
      queryClient.invalidateQueries({ queryKey: ['latestInternships'] });
      setDeleteTarget(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !companyId || !categoryId || !locationId || !deadline) {
      setError('Please fill in title, company, category, location, and deadline.');
      return;
    }

    saveMutation.mutate({
      title,
      companyId,
      categoryId,
      locationId,
      workMode,
      duration,
      stipend,
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      description,
      deadline,
      featured,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-color">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Internship Management
          </h1>
          <p className="text-xs text-text-muted mt-0.5 font-medium">
            Publish and manage campus internships, stipends, and student opportunities.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-2xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Internship</span>
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
            placeholder="Search internships by role, company, or skills..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs font-medium"
          />
        </div>
      </div>

      <div className="bg-surface rounded-3xl border border-border-color shadow-card-subtle overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={3} cols={8} />
        ) : internships.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No internships found"
              description="Create your first internship listing to start accepting student applications."
              actionText="Add Internship"
              onAction={openCreateModal}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 border-b border-border-color text-text-muted font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Internship</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Stipend</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Deadline</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {internships.map((item) => (
                  <tr key={item._id} className="hover:bg-surface-2/60 transition-colors">
                    {/* Internship Title */}
                    <td className="py-3.5 px-4 font-bold text-text-primary">
                      <span className="line-clamp-1">{item.title}</span>
                    </td>

                    {/* Company */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            item.companyLogo ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(item.companyName)}&background=6D5DFB&color=fff&size=64`
                          }
                          alt=""
                          className="w-6 h-6 rounded-lg object-cover border border-border-color shrink-0 bg-surface-2"
                        />
                        <span className="text-text-secondary font-medium">{item.companyName}</span>
                      </div>
                    </td>

                    {/* Location & Work Mode */}
                    <td className="py-3.5 px-4 text-text-muted font-medium">
                      {item.locationName} · {item.workMode}
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 text-text-secondary">{item.duration}</td>

                    {/* Stipend */}
                    <td className="py-3.5 px-4 font-bold text-accent-success">{item.stipend}</td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'published'
                            ? 'bg-accent-success/10 text-accent-success'
                            : 'bg-amber-500/10 text-amber-500'
                          }`}
                      >
                        <span className="capitalize">{item.status || 'published'}</span>
                      </span>
                    </td>

                    {/* Deadline */}
                    <td className="py-3.5 px-4 text-text-muted">
                      {item.deadline ? format(new Date(item.deadline), 'MMM dd, yyyy') : '-'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-text-muted hover:text-brand-primary rounded-lg hover:bg-surface-2 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: item._id, title: item.title })}
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
        title={`Delete "${deleteTarget?.title || 'internship'}"?`}
        message="This action cannot be undone. The internship opportunity will be permanently removed."
        confirmLabel="Delete Internship"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
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
              {editingItem ? 'Edit Internship' : 'Post New Internship'}
            </h2>

            {error && (
              <p className="text-xs text-accent-error bg-accent-error/10 p-2.5 rounded-xl mb-4 border border-accent-error/20 font-medium">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Internship Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. React Developer Intern — Demo"
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">Hiring Company *</label>
                  <select
                    required
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    {companies.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">Work Mode</label>
                  <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 Months"
                    className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">Stipend</label>
                  <input
                    type="text"
                    value={stipend}
                    onChange={(e) => setStipend(e.target.value)}
                    placeholder="e.g. ₹25,000 /month"
                    className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React.js, JavaScript, Tailwind"
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Deadline Date *</label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
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
                  className="px-5 py-2 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save Internship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
