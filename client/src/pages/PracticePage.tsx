import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, BrainCircuit, Code2, Users, Building, ShieldCheck, CheckSquare, Sparkles } from 'lucide-react';
import { practiceService } from '../services/api';
import { PracticeCard } from '../components/common/PracticeCard';
import { EmptyState } from '../components/common/EmptyState';

export const PracticePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentType = searchParams.get('type') || 'All';
  const currentDiff = searchParams.get('difficulty') || 'All';
  const [keyword, setKeyword] = useState('');

  const types = [
    { label: 'All Resources', value: 'All', icon: CheckSquare },
    { label: 'DSA', value: 'DSA', icon: Code2 },
    { label: 'Technical', value: 'Technical', icon: BrainCircuit },
    { label: 'Interview', value: 'Interview', icon: ShieldCheck },
    { label: 'HR Rounds', value: 'HR', icon: Users },
    { label: 'Company Specific', value: 'Company Specific', icon: Building },
    { label: 'Aptitude', value: 'Aptitude', icon: BrainCircuit },
  ];

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const { data, isLoading } = useQuery({
    queryKey: ['practiceQuestions', currentType, currentDiff, keyword],
    queryFn: () =>
      practiceService.getPracticeQuestions({
        questionType: currentType === 'All' ? '' : currentType,
        difficulty: currentDiff === 'All' ? '' : currentDiff,
        keyword,
        limit: 50,
      }),
  });

  const questions = data?.data || [];

  const handleTypeSelect = (typeVal: string) => {
    const next = new URLSearchParams(searchParams);
    if (typeVal === 'All') next.delete('type');
    else next.set('type', typeVal);
    setSearchParams(next);
  };

  const handleDiffSelect = (diffVal: string) => {
    const next = new URLSearchParams(searchParams);
    if (diffVal === 'All') next.delete('difficulty');
    else next.set('difficulty', diffVal);
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-bg-app">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-primary text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Problem Sets</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight mb-3">
            Interview & Practice Hub
          </h1>
          <p className="text-sm text-text-muted font-medium">
            Master Data Structures & Algorithms, System Design, and Behavioral Rounds with verified solutions.
          </p>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {types.map((t) => {
            const Icon = t.icon;
            const isSelected = currentType === t.value;
            return (
              <button
                key={t.value}
                onClick={() => handleTypeSelect(t.value)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'bg-surface border border-border-color text-text-muted hover:text-text-primary hover:bg-surface-2'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Difficulty Filter Bar */}
        <div className="p-3 rounded-3xl bg-surface border border-border-color shadow-card-subtle mb-10 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative flex items-center">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search problems, topics or algorithms..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs font-medium"
            />
          </div>

          <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-2xl border border-border-color">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => handleDiffSelect(diff)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  currentDiff === diff
                    ? 'bg-surface text-brand-primary shadow-xs'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 bg-surface rounded-3xl border border-border-color animate-pulse" />
            ))}
          </div>
        ) : questions.length === 0 ? (
          <EmptyState
            title="No Problems Found"
            description="Try switching categories or clearing your search term."
            actionText="View All Questions"
            onAction={() => {
              setKeyword('');
              setSearchParams(new URLSearchParams());
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questions.map((q) => (
              <PracticeCard key={q._id} item={q} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
