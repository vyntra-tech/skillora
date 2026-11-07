import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, User, AlertCircle, Loader2, Eye, EyeOff, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please provide all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service to continue.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await register(name.trim(), email.trim(), password);
      navigate(from, { replace: true });
    } catch (err: any) {
      if (!err.response) {
        setError('Unable to connect to the server. Please try again.');
      } else {
        setError(err.response?.data?.message || 'Registration failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* LEFT SIDE: Skillora Branding (Desktop & Tablet) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden lg:flex lg:col-span-6 flex-col justify-between p-8 xl:p-12 rounded-3xl bg-surface-2/60 border border-border-color relative overflow-hidden min-h-[580px]"
      >
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-brand-secondary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800/40 text-brand-primary text-xs font-bold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover. Learn. Grow.</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-text-primary tracking-tight leading-[1.2] mb-4">
            Build your career with <span className="text-gradient">Skillora</span>.
          </h2>

          <p className="text-sm text-text-muted leading-relaxed font-medium">
            Create your account to unlock curated jobs, campus internships, interview prep questions, and career tools.
          </p>
        </div>

        {/* Benefits list */}
        <div className="relative z-10 space-y-3 my-8">
          <div className="flex items-center gap-3 text-xs font-semibold text-text-primary">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>Apply to verified full-time & remote tech jobs</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-text-primary">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>Practice 500+ curated DSA and interview questions</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-text-primary">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>Track all your candidate applications in one place</span>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-text-muted font-medium">
          <ShieldCheck className="w-4 h-4 text-brand-primary shrink-0" />
          <span>Free membership for students and job seekers</span>
        </div>
      </motion.div>

      {/* RIGHT SIDE: Clean Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="lg:col-span-6 w-full max-w-md mx-auto"
      >
        <div className="rounded-3xl bg-surface border border-border-color shadow-card-hover p-6 sm:p-10 relative overflow-hidden">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
              Create an account
            </h1>
            <p className="text-xs text-text-muted mt-1 font-medium">
              Start your career journey with Skillora today.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-accent-error/10 border border-accent-error/20 flex items-start gap-2.5 text-xs text-accent-error font-medium animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-text-primary text-xs font-medium focus:outline-none focus:border-brand-primary placeholder:text-text-muted/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-text-primary text-xs font-medium focus:outline-none focus:border-brand-primary placeholder:text-text-muted/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-text-primary text-xs font-medium focus:outline-none focus:border-brand-primary placeholder:text-text-muted/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-text-primary text-xs font-medium focus:outline-none focus:border-brand-primary placeholder:text-text-muted/60 transition-colors"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-brand-primary border-border-color focus:ring-brand-primary"
                />
                <span className="text-[11px] text-text-muted leading-tight">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold shadow-sm transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border-color text-center">
            <p className="text-xs text-text-muted font-medium">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-brand-primary hover:text-brand-hover transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
