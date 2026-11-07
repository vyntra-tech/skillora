import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileCheck2, Search, FileText, ExternalLink, Calendar, Building2 } from 'lucide-react';
import { applicationService } from '../../services/api';
import { ApplicationStatus } from '../../types';
import { format } from 'date-fns';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/SkeletonLoaders';

export const AdminApplicationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ['adminApplications', keyword, statusFilter],
    queryFn: () =>
      applicationService.getAdminApplications({
        keyword,
        status: statusFilter === 'All' ? '' : statusFilter,
        limit: 100,
      }),
  });

  const rawApplications = data?.data || [];

  const totalItems = rawApplications.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedApplications = rawApplications.slice((page - 1) * pageSize, page * pageSize);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      applicationService.updateApplicationStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminApplications'] }),
  });

  const statuses: ApplicationStatus[] = [
    'Applied',
    'Under Review',
    'Shortlisted',
    'Interview',
    'Selected',
    'Rejected',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-color">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Applicant Tracking (ATS Pipeline)
          </h1>
          <p className="text-xs text-text-muted mt-0.5 font-medium">
            Review incoming candidate applications, assess resumes, and advance recruitment stages.
          </p>
        </div>
      </div>

      {/* Search and Pipeline Stage Filters */}
      <div className="p-3.5 rounded-3xl bg-surface border border-border-color shadow-card-subtle flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search candidate name, email, job title, company..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-border-color bg-surface-2 text-text-primary text-xs font-medium focus:outline-none focus:border-brand-primary placeholder:text-text-muted/60"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-auto px-4 py-2 rounded-2xl border border-border-color bg-surface-2 text-text-primary text-xs font-medium focus:outline-none focus:border-brand-primary"
        >
          <option value="All">All Application Stages</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Table Card */}
      <div className="bg-surface rounded-3xl border border-border-color shadow-card-subtle overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={3} cols={5} />
        ) : paginatedApplications.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No applications found"
              description="Candidates who apply for jobs or internships will appear here in your hiring pipeline."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 border-b border-border-color text-text-muted font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">Role & Company</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4">Resume</th>
                  <th className="py-3.5 px-4">Status Pipeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {paginatedApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-surface-2/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-text-primary block">{app.candidateName}</span>
                      <span className="text-[11px] text-text-muted">{app.candidateEmail}</span>
                      {app.candidatePhone && (
                        <span className="text-[10px] text-text-muted block">{app.candidatePhone}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-text-primary block">{app.jobTitle}</span>
                      <span className="text-[11px] text-brand-primary font-medium">{app.companyName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted">
                      {app.appliedDate ? format(new Date(app.appliedDate), 'MMM dd, yyyy') : '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      {app.resumeUrl ? (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-2 hover:bg-surface-2/80 border border-border-color text-text-primary rounded-xl text-[11px] font-semibold transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-brand-primary" />
                          <span>Resume</span>
                          <ExternalLink className="w-3 h-3 text-text-muted" />
                        </a>
                      ) : (
                        <span className="text-text-muted text-[11px]">No link</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={app.status}
                        onChange={(e) => statusMutation.mutate({ id: app._id, status: e.target.value })}
                        className="px-2.5 py-1.5 rounded-xl border border-border-color text-xs font-bold bg-surface text-text-primary cursor-pointer focus:outline-none focus:border-brand-primary"
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
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
    </div>
  );
};
