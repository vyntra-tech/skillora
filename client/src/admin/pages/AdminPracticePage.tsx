import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BrainCircuit, Plus, Edit, Trash2, X, Search } from 'lucide-react';
import { practiceService } from '../../services/api';
import { PracticeQuestion } from '../../types';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/SkeletonLoaders';

export const AdminPracticePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PracticeQuestion | null>(null);

  // Search, filter & Pagination state
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState<'DSA' | 'Aptitude' | 'Interview' | 'HR' | 'Technical' | 'Company Specific'>('Technical');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [company, setCompany] = useState('All');
  const [topic, setTopic] = useState('Algorithms');
  const [answer, setAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['adminPracticeList'],
    queryFn: () => practiceService.getPracticeQuestions({ allStatus: 'true', limit: 100 }),
  });

  const rawQuestions = data?.data || [];

  // Filter questions
  const filteredQuestions = rawQuestions.filter((q) => {
    const matchesKeyword =
      !keyword ||
      q.question.toLowerCase().includes(keyword.toLowerCase()) ||
      q.topic?.toLowerCase().includes(keyword.toLowerCase()) ||
      q.company?.toLowerCase().includes(keyword.toLowerCase());

    const matchesType = typeFilter === 'All' || q.questionType === typeFilter;

    return matchesKeyword && matchesType;
  });

  const totalItems = filteredQuestions.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedQuestions = filteredQuestions.slice((page - 1) * pageSize, page * pageSize);

  const openCreateModal = () => {
    setEditingItem(null);
    setQuestion('');
    setQuestionType('Technical');
    setDifficulty('Medium');
    setCompany('All');
    setTopic('Algorithms');
    setAnswer('');
    setExplanation('');
    setCodeSnippet('');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (q: PracticeQuestion) => {
    setEditingItem(q);
    setQuestion(q.question);
    setQuestionType(q.questionType);
    setDifficulty(q.difficulty);
    setCompany(q.company || 'All');
    setTopic(q.topic || 'General');
    setAnswer(q.answer);
    setExplanation(q.explanation || '');
    setCodeSnippet(q.codeSnippet || '');
    setError(null);
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingItem) {
        return practiceService.updatePracticeQuestion(editingItem._id, payload);
      } else {
        return practiceService.createPracticeQuestion(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPracticeList'] });
      queryClient.invalidateQueries({ queryKey: ['practiceQuestions'] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to save question.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => practiceService.deletePracticeQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPracticeList'] });
      queryClient.invalidateQueries({ queryKey: ['practiceQuestions'] });
      setDeleteTarget(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      setError('Please provide Question and Answer.');
      return;
    }
    saveMutation.mutate({
      question,
      questionType,
      difficulty,
      company,
      topic,
      answer,
      explanation,
      codeSnippet,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-color">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Practice & Question Bank
          </h1>
          <p className="text-xs text-text-muted mt-0.5 font-medium">
            Manage coding problems, interview solutions, and company-specific resources.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-2xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Question</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-3.5 rounded-3xl bg-surface border border-border-color shadow-card-subtle flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 relative flex items-center w-full">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            placeholder="Search questions by title, topic, company..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs font-medium"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-surface-2 border border-border-color text-text-primary text-xs font-medium focus:outline-none focus:border-brand-primary"
        >
          <option value="All">All Types</option>
          <option value="DSA">DSA</option>
          <option value="Technical">Technical</option>
          <option value="Interview">Interview</option>
          <option value="Aptitude">Aptitude</option>
          <option value="HR">HR</option>
          <option value="Company Specific">Company Specific</option>
        </select>
      </div>

      {/* Table Card */}
      <div className="bg-surface rounded-3xl border border-border-color shadow-card-subtle overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={3} cols={6} />
        ) : paginatedQuestions.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No questions found"
              description="Add your first practice question to help candidates prepare for interviews."
              actionText="Add Question"
              onAction={openCreateModal}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 border-b border-border-color text-text-muted font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Question</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Topic</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {paginatedQuestions.map((q) => (
                  <tr key={q._id} className="hover:bg-surface-2/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-text-primary line-clamp-1 max-w-sm">{q.question}</td>
                    <td className="py-3.5 px-4 text-brand-primary font-semibold">{q.questionType}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-rose-500/10 text-rose-500'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted">{q.company || 'All'}</td>
                    <td className="py-3.5 px-4 text-text-muted">{q.topic}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(q)}
                          className="p-1.5 text-text-muted hover:text-brand-primary rounded-lg hover:bg-surface-2 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: q._id, title: q.question })}
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
        title="Delete Question?"
        message={`Are you sure you want to delete this question? This action cannot be undone.`}
        confirmText="Delete Question"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Create / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-border-color">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-surface-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-text-primary mb-4">
              {editingItem ? 'Edit Practice Question' : 'Create Practice Question'}
            </h2>

            {error && <p className="text-xs text-rose-500 bg-rose-500/10 p-2.5 rounded-xl mb-4 border border-rose-500/20">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Question Title *</label>
                <textarea
                  rows={2}
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Type</label>
                  <select
                    value={questionType}
                    onChange={(e: any) => setQuestionType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                  >
                    <option value="DSA">DSA</option>
                    <option value="Technical">Technical</option>
                    <option value="Interview">Interview</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="HR">HR</option>
                    <option value="Company Specific">Company Specific</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e: any) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Company Target</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google, Amazon or All"
                    className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Model Answer / Solution *</label>
                <textarea
                  rows={4}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary resize-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Detailed Explanation (Optional)</label>
                <textarea
                  rows={3}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Code Snippet (Optional)</label>
                <textarea
                  rows={3}
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="// Paste JavaScript, Python or Java code"
                  className="w-full px-3.5 py-2 rounded-xl border border-border-color bg-surface text-text-primary text-xs focus:outline-none focus:border-brand-primary resize-none font-mono"
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
                  {saveMutation.isPending ? 'Saving...' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
