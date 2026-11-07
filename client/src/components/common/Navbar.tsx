import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Search,
  Bookmark,
  FileCheck2,
  User as UserIcon,
  LogOut,
  Shield,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { siteConfig } from '../../config/site';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/api';
import { SkilloraLogo } from './SkilloraLogo';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin, isEditor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Detect scroll for dynamic glass appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Keyboard shortcut Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Global search debounced
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await analyticsService.globalSearch(searchQuery.trim());
        setSearchResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const navLinks = [
    { label: 'Jobs', href: '/jobs' },
    { label: 'Internships', href: '/internships' },
    { label: 'Companies', href: '/companies' },
    { label: 'Practice', href: '/practice' },
    { label: 'Career Tools', href: '/tools' },
    { label: 'Articles', href: '/articles' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav border-b border-border-color shadow-sm py-3'
            : 'bg-transparent border-b border-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* LEFT: Skillora Logo */}
            <div className="flex items-center">
              <SkilloraLogo size="md" />
            </div>

            {/* CENTER: Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/60 dark:bg-surface-2/60 border border-border-color/60 backdrop-blur-md">
              {navLinks.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-primary text-white shadow-sm'
                        : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* RIGHT: Search icon, Theme toggle, Login, Get Started / Profile */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Quick Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-text-muted bg-surface hover:bg-surface-2 border border-border-color transition-colors shadow-card-subtle group"
                title="Search (Ctrl + K)"
              >
                <Search className="w-3.5 h-3.5 text-text-muted group-hover:text-brand-primary transition-colors" />
                <span>Search...</span>
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-2 dark:bg-surface text-text-muted border border-border-color">
                  ⌘K
                </kbd>
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Auth Buttons or User Avatar */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-border-color hover:border-brand-primary/40 bg-surface transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <span className="text-xs font-semibold text-text-primary max-w-[90px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl bg-surface border border-border-color shadow-card-hover p-2 z-50"
                      >
                        <div className="px-3 py-2 border-b border-border-color/80 mb-1">
                          <p className="text-xs font-bold text-text-primary truncate">{user.name}</p>
                          <p className="text-[11px] text-text-muted truncate">{user.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-900/30 text-brand-primary">
                            {user.role}
                          </span>
                        </div>

                        {(isAdmin || isEditor) && (
                          <Link
                            to="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-brand-primary hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
                          >
                            <Shield className="w-4 h-4 text-brand-primary" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}

                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
                        >
                          <UserIcon className="w-4 h-4" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/saved-jobs"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
                        >
                          <Bookmark className="w-4 h-4" />
                          <span>Saved Jobs</span>
                        </Link>

                        <Link
                          to="/my-applications"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
                        >
                          <FileCheck2 className="w-4 h-4" />
                          <span>My Applications</span>
                        </Link>

                        <div className="border-t border-border-color/80 my-1 pt-1">
                          <button
                            onClick={() => {
                              logout();
                              setIsProfileOpen(false);
                              navigate('/login', { replace: true });
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-accent-error hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-95 shadow-sm hover:shadow transition-all duration-150 active:scale-95"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Controls: Theme toggle + Menu Icon */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-2"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <ThemeToggle compact />
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-xl text-text-primary hover:bg-surface-2 transition-colors focus:outline-none"
                aria-label="Open mobile navigation"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE FULL-HEIGHT NAVIGATION DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Full-height Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-surface border-l border-border-color shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-border-color">
                  <SkilloraLogo size="sm" showTagline />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <div className="py-6 flex flex-col gap-1.5">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-text-muted px-3 pb-2">
                    Explore Platform
                  </p>
                  {navLinks.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                          isActive
                            ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-primary'
                            : 'text-text-primary hover:bg-surface-2'
                        }`
                      }
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-4 h-4 opacity-40" />
                    </NavLink>
                  ))}
                </div>

                {(isAdmin || isEditor) && (
                  <div className="pt-2 border-t border-border-color">
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-brand-primary bg-brand-50 dark:bg-brand-900/30"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Management CMS</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Bottom Auth Section */}
              <div className="pt-6 border-t border-border-color flex flex-col gap-3">
                {isAuthenticated && user ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 px-2 py-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary text-white flex items-center justify-center font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-text-primary truncate">{user.name}</p>
                        <p className="text-xs text-text-muted truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="py-2 text-center rounded-xl text-xs font-semibold bg-surface-2 text-text-primary hover:bg-border-color"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                          navigate('/login', { replace: true });
                        }}
                        className="py-2 text-center rounded-xl text-xs font-semibold bg-red-50 dark:bg-red-950/30 text-accent-error hover:bg-red-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-2.5 text-center rounded-xl text-sm font-semibold border border-border-color text-text-primary hover:bg-surface-2"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-2.5 text-center rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-primary to-brand-secondary shadow-sm"
                    >
                      Get Started Free
                    </Link>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 text-xs text-text-muted">
                  <span>Theme Preference</span>
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GLOBAL SEARCH MODAL */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              className="relative w-full max-w-2xl rounded-2xl bg-surface border border-border-color shadow-2xl overflow-hidden z-10"
            >
              {/* Search input header */}
              <div className="flex items-center px-4 border-b border-border-color">
                <Search className="w-5 h-5 text-brand-primary mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs, skills, companies, internships, articles..."
                  autoFocus
                  className="w-full py-4 bg-transparent text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-none"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 text-xs"
                >
                  ESC
                </button>
              </div>

              {/* Search Results Body */}
              <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
                {isSearching && (
                  <div className="py-8 text-center text-xs text-text-muted flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                    <span>Searching Skillora database...</span>
                  </div>
                )}

                {!isSearching && !searchResults && (
                  <div className="py-6 text-center text-xs text-text-muted">
                    Type at least 2 characters to search across all jobs, companies, internships, and articles.
                  </div>
                )}

                {!isSearching && searchResults && (
                  <>
                    {/* Jobs */}
                    {searchResults.jobs?.length > 0 && (
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
                          Jobs ({searchResults.jobs.length})
                        </h4>
                        <div className="space-y-1">
                          {searchResults.jobs.map((job: any) => (
                            <Link
                              key={job._id}
                              to={`/jobs/${job.slug}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-2 transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                {job.companyLogo ? (
                                  <img
                                    src={job.companyLogo}
                                    alt={job.companyName}
                                    className="w-7 h-7 rounded-lg object-contain bg-white p-0.5 border border-border-color"
                                  />
                                ) : (
                                  <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-primary flex items-center justify-center font-bold text-xs">
                                    {job.companyName?.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <p className="text-xs font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                                    {job.title}
                                  </p>
                                  <p className="text-[11px] text-text-muted">
                                    {job.companyName} · {job.locationName || 'Remote'}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[11px] font-semibold text-brand-primary">
                                ₹{job.salaryMin}–{job.salaryMax} LPA
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Companies */}
                    {searchResults.companies?.length > 0 && (
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
                          Companies ({searchResults.companies.length})
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {searchResults.companies.map((comp: any) => (
                            <Link
                              key={comp._id}
                              to={`/companies/${comp.slug}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-surface-2 transition-colors"
                            >
                              <img
                                src={comp.logo}
                                alt={comp.name}
                                className="w-6 h-6 rounded-md object-contain bg-white p-0.5 border border-border-color"
                              />
                              <span className="text-xs font-semibold text-text-primary truncate">
                                {comp.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty search */}
                    {searchResults.jobs?.length === 0 && searchResults.companies?.length === 0 && (
                      <div className="py-6 text-center text-xs text-text-muted">
                        No results found for "{searchQuery}".
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
