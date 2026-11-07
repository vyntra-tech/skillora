import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-border-color shadow-card-hover text-center relative overflow-hidden">
        {submitted ? (
          <div className="space-y-4">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">
              Reset Instructions Sent
            </h2>
            <p className="text-xs text-text-muted leading-relaxed font-normal">
              If an account is associated with <span className="font-semibold text-text-primary">{email}</span>, a password recovery link has been dispatched to your inbox.
            </p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-block w-full py-3 bg-brand-primary hover:bg-brand-hover text-white rounded-2xl text-xs font-bold transition-all shadow-sm"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 text-left">
              <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
                Reset your password
              </h1>
              <p className="text-xs text-text-muted mt-1 font-medium">
                Enter your registered email address and we'll send you recovery instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-brand-primary text-xs font-medium transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-border-color text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-hover transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
