import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle2, AlertCircle, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Job } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { applicationService, uploadService } from '../../services/api';

interface ApplyModalProps {
  job?: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  itemType?: 'job' | 'internship';
  itemTitle?: string;
  companyName?: string;
  companyLogo?: string;
  itemId?: string;
  applicationUrl?: string;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  isOpen,
  onClose,
  onSuccess,
  itemType = 'job',
  itemTitle,
  companyName,
  companyLogo,
  itemId,
  applicationUrl,
}) => {
  const { user } = useAuth();
  const [candidateName, setCandidateName] = useState(user?.name || '');
  const [candidateEmail, setCandidateEmail] = useState(user?.email || '');
  const [candidatePhone, setCandidatePhone] = useState(user?.phone || '');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [coverLetter, setCoverLetter] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const title = itemTitle || job?.title || 'Open Role';
  const company = companyName || job?.companyName || 'Company';
  const effectiveId = itemId || job?._id;
  const externalUrl = applicationUrl || job?.applicationUrl;

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      const url = await uploadService.uploadFile(file, 'resumes');
      setResumeUrl(url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload resume file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !candidateEmail.trim() || !resumeUrl.trim()) {
      setError('Please fill all required fields and provide a resume.');
      return;
    }

    if (!effectiveId) {
      setError('Invalid job identifier.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await applicationService.submitApplication({
        jobId: effectiveId,
        candidateName,
        candidateEmail,
        candidatePhone,
        resumeUrl,
        coverLetter,
      });

      // Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Application submission failed. You may have already applied.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-surface rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-border-color shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-accent-success/15 text-accent-success rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary">Application Submitted!</h3>
              <p className="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">
                Your application for <span className="font-semibold text-text-primary">{title}</span> at{' '}
                <span className="font-semibold text-text-primary">{company}</span> has been received on Skillora.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white font-bold rounded-2xl text-xs transition-all shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary bg-brand-50 dark:bg-brand-900/30 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-800/40">
                  Quick Apply
                </span>
                <h3 className="text-xl font-bold text-text-primary mt-2">{title}</h3>
                <p className="text-xs text-text-muted mt-0.5">{company}</p>
              </div>

              {externalUrl && (
                <div className="mb-4 p-3.5 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/40 flex items-center justify-between gap-3">
                  <span className="text-xs text-text-primary font-medium">
                    This employer also accepts external applications directly.
                  </span>
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline flex-shrink-0"
                  >
                    <span>Visit Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3.5 bg-accent-error/10 border border-accent-error/20 text-accent-error text-xs rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={candidatePhone}
                      onChange={(e) => setCandidatePhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">Resume / CV (PDF or Link) *</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      placeholder="Google Drive link or upload below"
                      className="flex-1 px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs font-medium"
                    />
                    <label className="cursor-pointer px-4 py-2.5 rounded-2xl bg-surface hover:bg-surface-2 border border-border-color text-text-primary text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-colors">
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-brand-primary" /> : <Upload className="w-4 h-4 text-brand-primary" />}
                      <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">Note or Cover Note (Optional)</label>
                  <textarea
                    rows={3}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Briefly highlight relevant projects or notice period..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs font-medium resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-text-muted hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="px-6 py-2.5 bg-brand-primary hover:bg-brand-hover text-white font-bold rounded-2xl text-xs transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Application</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
