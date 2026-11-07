import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Loader2, AlertCircle, Sparkles, Eye, EyeOff, KeyRound, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SkilloraLogo } from '../../components/common/SkilloraLogo';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const AdminLoginPage: React.FC = () => {
  const { login, user, isAuthenticated, isAdmin, isEditor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filledLabel, setFilledLabel] = useState<string | null>(null);

  const handleAutoFill = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setError(null);
    setFilledLabel(fillEmail);
    setTimeout(() => setFilledLabel(null), 2500);
  };

  // If already authenticated as admin, redirect to /admin
  React.useEffect(() => {
    if (isAuthenticated && (isAdmin || isEditor)) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isAdmin, isEditor, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your admin email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await login(email, password);

      const cached = localStorage.getItem('user');
      if (cached) {
        const u = JSON.parse(cached);
        if (u.role === 'ADMIN' || u.role === 'SUPER_ADMIN' || u.role === 'EDITOR') {
          navigate('/admin');
          return;
        } else {
          setError('Access denied. This portal is strictly for administrators.');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid admin credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-app flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative transition-colors duration-200">
      {/* Top Bar with theme toggle & logo */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link to="/" className="focus:outline-none">
          <SkilloraLogo size="md" />
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto">
        <div className="bg-surface rounded-3xl p-8 sm:p-10 border border-border-color shadow-2xl relative overflow-hidden">
          {/* Subtle top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-primary to-brand-secondary" />

          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-3 border border-brand-primary/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
              Skillora Admin
            </h1>
            <p className="text-xs text-text-muted mt-1 font-medium">
              Sign in to manage your platform.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-accent-error/10 border border-accent-error/20 flex items-start gap-2.5 text-xs text-accent-error">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick 1-Click Auto-Fill Demo Credentials */}
          <div className="mb-6 p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/50 shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-primary" />
                Quick Admin Login
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary">
                1-Click Auto Fill
              </span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleAutoFill('admin@skillora.com', 'admin123456')}
                className="w-full text-left p-2.5 rounded-xl bg-surface border border-border-color hover:border-brand-primary hover:shadow-sm transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-text-primary text-xs group-hover:text-brand-primary transition-colors truncate">
                    admin@skillora.com
                  </p>
                  <p className="text-[11px] text-text-muted font-mono mt-0.5">
                    Password: <span className="font-semibold text-text-primary">admin123456</span>
                  </p>
                </div>
                <span className="shrink-0 text-xs font-bold text-white bg-brand-primary hover:bg-brand-hover px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-xs">
                  {filledLabel === 'admin@skillora.com' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Filled!</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Auto Fill</span>
                    </>
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleAutoFill('admin@talentpulse.com', 'admin123456')}
                className="w-full text-left p-2.5 rounded-xl bg-surface border border-border-color hover:border-brand-primary hover:shadow-sm transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-text-primary text-xs group-hover:text-brand-primary transition-colors truncate">
                    admin@talentpulse.com
                  </p>
                  <p className="text-[11px] text-text-muted font-mono mt-0.5">
                    Password: <span className="font-semibold text-text-primary">admin123456</span>
                  </p>
                </div>
                <span className="shrink-0 text-xs font-bold text-white bg-brand-primary hover:bg-brand-hover px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-xs">
                  {filledLabel === 'admin@talentpulse.com' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Filled!</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Auto Fill</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@skillora.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border-color text-text-primary text-xs focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary placeholder:text-text-muted/60 transition-colors"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface border border-border-color text-text-primary text-xs focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary placeholder:text-text-muted/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1 rounded-lg transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
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
                  className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary/20 border-border-color bg-surface cursor-pointer"
                />
                <span className="text-xs text-text-muted font-medium">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold shadow-sm transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border-color text-center">
            <Link
              to="/"
              className="text-xs text-text-muted hover:text-text-primary font-medium transition-colors"
            >
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-text-muted">
        © 2026 Skillora Inc. Restricted administrator access only.
      </div>
    </div>
  );
};

