import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Building2, CheckCircle2, Terminal } from 'lucide-react';
import { PracticeQuestion } from '../../types';

interface PracticeCardProps {
  item: PracticeQuestion;
}

export const PracticeCard: React.FC<PracticeCardProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40';
      case 'Hard':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40';
      default:
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40';
    }
  };

  return (
    <div className="rounded-3xl p-6 bg-surface border border-border-color shadow-card-subtle hover:shadow-card-hover transition-all duration-200">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-900/30 text-brand-primary">
            {item.questionType}
          </span>
          <span
            className={`px-2 py-0.5 rounded-lg text-xs font-semibold border ${getDifficultyBadge(
              item.difficulty
            )}`}
          >
            {item.difficulty}
          </span>
        </div>

        {item.company && (
          <span className="text-xs text-text-muted flex items-center gap-1 font-medium">
            <Building2 className="w-3.5 h-3.5 text-text-muted" />
            {item.company}
          </span>
        )}
      </div>

      <h3 className="font-bold text-text-primary text-base mb-3 leading-snug">{item.question}</h3>

      {item.topic && (
        <span className="inline-block text-[11px] font-semibold text-text-muted bg-surface-2 px-2.5 py-0.5 rounded-md mb-4">
          Topic: {item.topic}
        </span>
      )}

      {/* Accordion toggle for solution/explanation */}
      <div className="pt-3 border-t border-border-color">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-xs font-bold text-brand-primary hover:text-brand-hover transition-colors py-1 focus:outline-none"
        >
          <span>{isOpen ? 'Hide Solution & Explanation' : 'View Detailed Solution'}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-3 pt-3 border-t border-border-color/60"
            >
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-surface-2 border border-border-color text-xs leading-relaxed text-text-primary font-normal">
                  <p className="font-bold mb-1.5 flex items-center gap-1.5 text-text-primary">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-success" />
                    Explanation:
                  </p>
                  <p className="whitespace-pre-line text-text-muted">{item.answer}</p>
                </div>

                {item.codeSnippet && (
                  <div className="rounded-2xl overflow-hidden border border-border-color bg-[#070B14]">
                    <div className="px-4 py-2 bg-[#0D1321] border-b border-[#1E293B] text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-brand-primary" />
                      <span>Code Solution</span>
                    </div>
                    <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                      <code>{item.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
