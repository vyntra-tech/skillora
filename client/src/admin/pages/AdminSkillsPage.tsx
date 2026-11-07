import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, Plus, Trash2, Search } from 'lucide-react';
import { skillService } from '../../services/api';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminSkillsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['adminSkills'],
    queryFn: () => skillService.getSkills(),
  });

  const allSkills = data?.data || [];
  const filtered = allSkills.filter((s) =>
    keyword
      ? s.name.toLowerCase().includes(keyword.toLowerCase()) ||
      s.category.toLowerCase().includes(keyword.toLowerCase())
      : true
  );
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const skills = filtered.slice((page - 1) * pageSize, page * pageSize);

  const addMutation = useMutation({
    mutationFn: (payload: { name: string; category: string }) => skillService.createSkill(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSkills'] });
      setName('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => skillService.deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSkills'] });
      setDeleteTarget(null);
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addMutation.mutate({ name: name.trim(), category });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-4 border-b border-border-color">
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
          Skills Management
        </h1>
        <p className="text-xs text-text-muted mt-0.5 font-medium">
          Add or remove technical skills available across Job and Internship posting forms.
        </p>
      </div>

      {/* Add Skill Form */}
      <div className="bg-surface p-5 rounded-3xl border border-border-color shadow-card-subtle">
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add new skill (e.g. Next.js, PyTorch, GraphQL)..."
            className="flex-1 px-4 py-2.5 rounded-2xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary placeholder:text-text-muted/60"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-2xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary cursor-pointer font-semibold"
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
            <option value="Cloud/DevOps">Cloud/DevOps</option>
            <option value="AI/Data">AI/Data</option>
            <option value="Design">Design</option>
            <option value="Core">Core</option>
          </select>
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-2xl text-xs font-bold shadow-sm flex items-center gap-1.5 justify-center transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </form>
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
            placeholder="Filter registered skills..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs font-medium"
          />
        </div>
      </div>

      {/* Skills Pill Cloud with Pagination */}
      <div className="bg-surface rounded-3xl border border-border-color shadow-card-subtle overflow-hidden">
        <div className="p-6">
          <h3 className="font-bold text-text-primary text-xs mb-4">
            Registered Skills ({totalItems})
          </h3>

          {isLoading ? (
            <p className="text-xs text-text-muted">Loading skills...</p>
          ) : skills.length === 0 ? (
            <EmptyState
              title="No skills found"
              description="Add your first technical skill using the form above."
            />
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill) => (
                <span
                  key={skill._id}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-surface-2 hover:bg-surface-2/80 border border-border-color rounded-2xl text-xs font-semibold text-text-primary group transition-colors shadow-2xs"
                >
                  <span>{skill.name}</span>
                  <span className="text-[10px] text-text-muted font-normal">({skill.category})</span>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id: skill._id, name: skill.name })}
                    className="text-text-muted hover:text-accent-error transition-colors ml-1 p-0.5 rounded-md hover:bg-accent-error/10"
                    title="Delete skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
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
        title={`Delete "${deleteTarget?.name || 'skill'}"?`}
        message="This technical skill tag will be removed from future autocomplete filters."
        confirmLabel="Delete Skill"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
