import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Globe,
  MapPin,
  X,
  Upload,
  Loader2,
  Sparkles,
  ExternalLink,
  Search,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { companyService, uploadService } from '../../services/api';
import { Company } from '../../types';
import { TableSkeleton } from '../../components/common/SkeletonLoaders';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminCompaniesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Search & Pagination state
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('Enterprise Software & Cloud');
  const [location, setLocation] = useState('Bengaluru, India');
  const [description, setDescription] = useState('');
  const [companySize, setCompanySize] = useState('100-250');
  const [foundedYear, setFoundedYear] = useState<number>(2024);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['adminCompaniesList', keyword, page, pageSize],
    queryFn: () =>
      companyService.getCompanies({
        keyword,
        page,
        limit: pageSize,
        allStatus: 'true',
      }),
  });

  const companies = data?.data || [];
  const totalItems = data?.pagination?.total ?? companies.length;
  const totalPages = (data?.pagination?.totalPages ?? Math.ceil(totalItems / pageSize)) || 1;

  const openCreateModal = () => {
    setEditingCompany(null);
    setName('');
    setLogo('');
    setWebsite('https://');
    setIndustry('IT & Software Services');
    setLocation('Bengaluru, India');
    setDescription('');
    setCompanySize('50-200');
    setFoundedYear(2024);
    setFeatured(false);
    setStatus('published');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (c: Company) => {
    setEditingCompany(c);
    setName(c.name);
    setLogo(c.logo || '');
    setWebsite(c.website || '');
    setIndustry(c.industry || 'IT & Software Services');
    setLocation(c.location || 'Bengaluru, India');
    setDescription(c.description || '');
    setCompanySize(c.companySize || '50-200');
    setFoundedYear(c.foundedYear || 2024);
    setFeatured(Boolean(c.featured));
    setStatus(c.status || 'published');
    setError(null);
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingCompany) {
        return companyService.updateCompany(editingCompany._id, payload);
      } else {
        return companyService.createCompany(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCompaniesList'] });
      queryClient.invalidateQueries({ queryKey: ['featuredCompanies'] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to save company.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => companyService.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCompaniesList'] });
      queryClient.invalidateQueries({ queryKey: ['featuredCompanies'] });
      setDeleteTarget(null);
    },
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadService.uploadFile(file, 'company-logos');
      setLogo(url);
    } catch {
      setError('Logo upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Company name is required.');
      return;
    }

    saveMutation.mutate({
      name,
      logo,
      website,
      industry,
      location,
      description,
      companySize,
      foundedYear,
      featured,
      status,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-color">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Company Management
          </h1>
          <p className="text-xs text-text-muted mt-0.5 font-medium">
            Register and manage hiring partner profiles, logos, and verification status on Skillora.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-2xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Company</span>
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
            placeholder="Search companies by name, industry, or location..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs font-medium"
          />
        </div>
      </div>

      {/* Companies List Table */}
      <div className="rounded-3xl bg-surface border border-border-color shadow-card-subtle overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={4} cols={8} />
        ) : companies.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No companies found"
              description="Register your first hiring company to begin posting jobs and internships."
              actionText="Add Company"
              onAction={openCreateModal}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-2 border-b border-border-color text-text-muted font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Logo</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Industry</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Jobs</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color font-medium">
                {companies.map((company) => (
                  <tr key={company._id} className="hover:bg-surface-2/60 transition-colors">
                    {/* Logo */}
                    <td className="py-3.5 px-4 w-12">
                      <img
                        src={
                          company.logo ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=6D5DFB&color=fff&size=64`
                        }
                        alt=""
                        className="w-9 h-9 rounded-xl object-contain bg-white p-1 border border-border-color shrink-0"
                      />
                    </td>

                    {/* Company Name & Website */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-text-primary block truncate max-w-xs">{company.name}</span>
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-brand-primary hover:underline flex items-center gap-1"
                          >
                            <span>{company.website.replace('https://', '')}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Industry */}
                    <td className="py-3.5 px-4 text-text-secondary whitespace-nowrap">{company.industry}</td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-text-muted whitespace-nowrap">{company.location}</td>

                    {/* Jobs Count */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-brand-primary/10 text-brand-primary rounded-xl font-bold text-[11px]">
                        {company.activeJobsCount || 0} active
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${company.status === 'published'
                            ? 'bg-accent-success/10 text-accent-success'
                            : 'bg-amber-500/10 text-amber-500'
                          }`}
                      >
                        <span className="capitalize">{company.status || 'published'}</span>
                      </span>
                    </td>

                    {/* Featured */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {company.featured ? (
                        <span className="text-amber-500 font-bold text-[10px] bg-amber-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
                          <Sparkles className="w-3 h-3" /> Featured
                        </span>
                      ) : (
                        <span className="text-text-muted text-[10px]">Standard</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(company)}
                          className="p-1.5 text-text-muted hover:text-brand-primary rounded-lg hover:bg-surface-2 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: company._id, name: company.name })}
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
        title={`Delete "${deleteTarget?.name || 'company'}"?`}
        message="This action cannot be undone. All active job postings linked to this company will also be affected."
        confirmLabel="Delete Company"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-border-color shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary rounded-xl hover:bg-surface-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-text-primary mb-4">
              {editingCompany ? 'Edit Company Profile' : 'Add New Hiring Company'}
            </h2>

            {error && (
              <p className="text-xs text-accent-error bg-accent-error/10 p-2.5 rounded-xl mb-4 border border-accent-error/20 font-medium">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Skillora Demo Technologies"
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Logo URL / Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    placeholder="https://... logo URL"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                  />
                  <label className="cursor-pointer px-3.5 py-2 bg-surface-2 hover:bg-border-color text-text-primary rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-border-color shrink-0">
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-brand-primary" /> : <Upload className="w-4 h-4" />}
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. IT & Software Services"
                    className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">Headquarters</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, India"
                    className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">Official Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">Company Size</label>
                  <input
                    type="text"
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    placeholder="e.g. 50-200 Employees"
                    className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">About Company</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of company culture, products, and vision..."
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
                  <span className="text-xs font-semibold text-text-primary">Featured Partner (Shows on Homepage)</span>
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
                  {saveMutation.isPending ? 'Saving...' : 'Save Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
