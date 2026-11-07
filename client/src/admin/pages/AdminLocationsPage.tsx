import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Plus, Edit, Trash2, X, Sparkles, Search } from 'lucide-react';
import { locationService } from '../../services/api';
import { Location } from '../../types';
import { TableSkeleton } from '../../components/common/SkeletonLoaders';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminLocationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<Location | null>(null);

  // Search & Pagination state
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; city: string } | null>(null);

  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [isPopular, setIsPopular] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['adminLocationsPage'],
    queryFn: () => locationService.getLocations({ allStatus: 'true' }),
  });

  const allLocations = data?.data || [];
  const filtered = allLocations.filter((l) =>
    keyword
      ? l.city.toLowerCase().includes(keyword.toLowerCase()) ||
      (l.state && l.state.toLowerCase().includes(keyword.toLowerCase()))
      : true
  );
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const locations = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openCreateModal = () => {
    setEditingLoc(null);
    setCity('');
    setState('');
    setCountry('India');
    setIsPopular(false);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (l: Location) => {
    setEditingLoc(l);
    setCity(l.city);
    setState(l.state || '');
    setCountry(l.country || 'India');
    setIsPopular(Boolean(l.isPopular));
    setError(null);
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingLoc) {
        return locationService.updateLocation(editingLoc._id, payload);
      } else {
        return locationService.createLocation(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminLocationsPage'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to save location.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => locationService.deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminLocationsPage'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setDeleteTarget(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      setError('City name is required.');
      return;
    }
    saveMutation.mutate({ city, state, country, isPopular });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-color">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Location Hubs Management
          </h1>
          <p className="text-xs text-text-muted mt-0.5 font-medium">
            Manage tech city hubs, state regions, and popular location filters.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-2xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Location Hub</span>
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
            placeholder="Search locations by city or state..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs font-medium"
          />
        </div>
      </div>

      <div className="rounded-3xl bg-surface border border-border-color shadow-card-subtle overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={4} cols={6} />
        ) : locations.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No locations found"
              description="Add a tech hub to enable regional job searches."
              actionText="Add Location"
              onAction={openCreateModal}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-2 border-b border-border-color text-text-muted font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 w-12">Hub</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">State / Region</th>
                  <th className="py-3.5 px-4">Country</th>
                  <th className="py-3.5 px-4">Popular Hub</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color font-medium">
                {locations.map((loc) => (
                  <tr key={loc._id} className="hover:bg-surface-2/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs">
                        <MapPin className="w-4 h-4" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-text-primary whitespace-nowrap">
                      {loc.city}
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary whitespace-nowrap">
                      {loc.state || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-text-muted whitespace-nowrap">
                      {loc.country || 'India'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {loc.isPopular ? (
                        <span className="text-amber-500 font-bold text-[10px] bg-amber-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
                          <Sparkles className="w-3 h-3" /> Popular Hub
                        </span>
                      ) : (
                        <span className="text-text-muted text-[10px]">Standard</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(loc)}
                          className="p-1.5 text-text-muted hover:text-brand-primary rounded-lg hover:bg-surface-2 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: loc._id, city: loc.city })}
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
        title={`Delete "${deleteTarget?.city || 'location'}"?`}
        message="This action cannot be undone. Jobs linked to this location hub will lose regional indexing."
        confirmLabel="Delete Location"
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
              {editingLoc ? 'Edit Location Hub' : 'Add New Location Hub'}
            </h2>

            {error && (
              <p className="text-xs text-accent-error bg-accent-error/10 p-2.5 rounded-xl mb-4 border border-accent-error/20 font-medium">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">City Name *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru, Pune, Hyderabad"
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">State / Province</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Karnataka, Maharashtra"
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. India"
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary/20 border-border-color bg-surface"
                  />
                  <span className="text-xs font-semibold text-text-primary">Featured / Popular Hub on Homepage</span>
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
                  {saveMutation.isPending ? 'Saving...' : 'Save Hub'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
