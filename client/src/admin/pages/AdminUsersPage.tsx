import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Search, ShieldCheck, Ban, Trash2, CheckCircle2 } from 'lucide-react';
import { userService } from '../../services/api';
import { User, UserRole } from '../../types';
import { format } from 'date-fns';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/SkeletonLoaders';

export const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['adminUsers', keyword, roleFilter],
    queryFn: () => userService.getUsers({ keyword, role: roleFilter === 'All' ? '' : roleFilter }),
  });

  const rawUsers = data?.data || [];

  const totalItems = rawUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedUsers = rawUsers.slice((page - 1) * pageSize, page * pageSize);

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => userService.updateUserRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminUsers'] }),
  });

  const blockMutation = useMutation({
    mutationFn: (id: string) => userService.toggleUserBlock(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminUsers'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setDeleteTarget(null);
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-color">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            User & Role Management
          </h1>
          <p className="text-xs text-text-muted mt-0.5 font-medium">
            Manage candidates, assign permissions (ADMIN, SUPER_ADMIN, EDITOR), and enforce security.
          </p>
        </div>
      </div>

      {/* Search and Role Filter */}
      <div className="p-3.5 rounded-3xl bg-surface border border-border-color shadow-card-subtle flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-border-color bg-surface-2 text-text-primary text-xs font-medium focus:outline-none focus:border-brand-primary placeholder:text-text-muted/60"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-auto px-4 py-2 rounded-2xl border border-border-color bg-surface-2 text-text-primary text-xs font-medium focus:outline-none focus:border-brand-primary"
        >
          <option value="All">All Roles</option>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          <option value="EDITOR">EDITOR</option>
        </select>
      </div>

      {/* Table Card */}
      <div className="bg-surface rounded-3xl border border-border-color shadow-card-subtle overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={3} cols={5} />
        ) : paginatedUsers.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No users found"
              description="No registered user profiles matched your criteria."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 border-b border-border-color text-text-muted font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {paginatedUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-surface-2/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            u.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=6D5DFB&color=fff`
                          }
                          alt=""
                          className="w-8 h-8 rounded-xl object-cover border border-border-color bg-surface-2"
                        />
                        <div>
                          <span className="font-bold text-text-primary block">{u.name}</span>
                          <span className="text-[11px] text-text-muted">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => roleMutation.mutate({ id: u._id, role: e.target.value })}
                        className="px-2.5 py-1 rounded-xl border border-border-color text-xs font-bold bg-surface text-text-primary cursor-pointer focus:outline-none focus:border-brand-primary"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        <option value="EDITOR">EDITOR</option>
                        <option value="MODERATOR">MODERATOR</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-rose-500/10 text-rose-500'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted">
                      {u.createdAt ? format(new Date(u.createdAt), 'MMM dd, yyyy') : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => blockMutation.mutate(u._id)}
                          className="p-1.5 text-text-muted hover:text-amber-500 rounded-lg hover:bg-amber-500/10 transition-colors"
                          title={u.status === 'active' ? 'Block User' : 'Unblock User'}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: u._id, name: u.name })}
                          className="p-1.5 text-accent-error hover:bg-accent-error/10 rounded-lg transition-colors"
                          title="Delete User"
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

      {/* Delete User Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete User?"
        message={`Are you sure you want to delete user "${deleteTarget?.name}"? All related data will be removed.`}
        confirmText="Delete User"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
