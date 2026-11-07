import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2, Linkedin, Twitter } from 'lucide-react';
import { Job } from '../../types';

interface JobShareModalProps {
  job?: Job | null;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  company?: string;
  url?: string;
}

export const JobShareModal: React.FC<JobShareModalProps> = ({
  job,
  isOpen,
  onClose,
  title: propTitle,
  company: propCompany,
  url: propUrl,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const title = propTitle || job?.title || 'Career Opportunity';
  const company = propCompany || job?.companyName || 'Company';
  const shareUrl = propUrl || (job ? `${window.location.origin}/jobs/${job.slug}` : window.location.href);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`Check out this role: ${title} at ${company} on Skillora!`);
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${text}`, '_blank');
  };

  const handleLinkedinShare = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-surface rounded-3xl max-w-md w-full p-6 border border-border-color shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary rounded-xl hover:bg-surface-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-900/30 text-brand-primary flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">Share Opportunity</h3>
              <p className="text-xs text-text-muted">Spread the word with your network</p>
            </div>
          </div>

          <div className="mb-4 p-3 rounded-2xl bg-surface-2 border border-border-color">
            <p className="text-xs font-bold text-text-primary truncate">{title}</p>
            <p className="text-[11px] text-text-muted truncate">{company}</p>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-xs bg-surface-2 border border-border-color rounded-xl text-text-muted select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-hover transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleLinkedinShare}
              className="py-2.5 px-3 rounded-xl border border-border-color hover:border-brand-primary/40 bg-surface-2 text-text-primary text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Linkedin className="w-4 h-4 text-[#0077b5]" />
              <span>LinkedIn</span>
            </button>
            <button
              onClick={handleTwitterShare}
              className="py-2.5 px-3 rounded-xl border border-border-color hover:border-brand-primary/40 bg-surface-2 text-text-primary text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Twitter className="w-4 h-4 text-[#1da1f2]" />
              <span>Twitter / X</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
