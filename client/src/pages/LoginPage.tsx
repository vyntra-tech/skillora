import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, Loader2, Eye, EyeOff, Sparkles, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect to home or requested path
  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide your email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err: any) {
      if (!err.response) {
        setError('Unable to connect to the server. Please try again.');
      } else {
        setError(err.response?.data?.message || 'Invalid email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* LEFT SIDE: Skillora Branding & Visual (Desktop & Tablet) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden lg:flex lg:col-span-6 flex-col justify-between p-8 xl:p-12 rounded-3xl bg-surface-2/60 border border-border-color relative overflow-hidden min-h-[540px]"
      >
        {/* Subtle decorative radial gradients */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-brand-secondary/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Brand Tagline Badge */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800/40 text-brand-primary text-xs font-bold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover. Learn. Grow.</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-text-primary tracking-tight leading-[1.2] mb-4">
            Your next opportunity <span className="text-gradient">starts here</span>.
          </h2>

          <p className="text-sm text-text-muted leading-relaxed font-medium">
            Sign in to discover jobs, internships, companies and career opportunities tailored to your goals.
          </p>
        </div>

        {/* Abstract Career Visual Micro-cards */}
        <div className="relative z-10 space-y-3.5 my-8">
          <div className="p-4 rounded-2xl bg-surface/80 backdrop-blur-md border border-border-color shadow-card-subtle flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-primary">Curated Tech Roles</p>
              <p className="text-[11px] text-text-muted">Direct listings with salary transparency</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface/80 backdrop-blur-md border border-border-color shadow-card-subtle flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-primary">Internships & PPOs</p>
              <p className="text-[11px] text-text-muted">College placement and fresher opportunities</p>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-text-muted font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Verified recruiters and direct applications on Skillora</span>
        </div>
      </motion.div>

      {/* RIGHT SIDE: Clean Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="lg:col-span-6 w-full max-w-md mx-auto"
      >
        <div className="rounded-3xl bg-surface border border-border-color shadow-card-hover p-6 sm:p-10 relative overflow-hidden">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs text-text-muted mt-1 font-medium">
              Sign in to continue to Skillora.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-accent-error/10 border border-accent-error/20 flex items-start gap-2.5 text-xs text-accent-error font-medium animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                Email
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-text-primary">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-brand-primary hover:text-brand-hover transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-primary border-border-color focus:ring-brand-primary"
                />
                <span className="text-xs font-medium text-text-muted">Remember me</span>
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
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border-color text-center">
            <p className="text-xs text-text-muted font-medium">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-brand-primary hover:text-brand-hover transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
