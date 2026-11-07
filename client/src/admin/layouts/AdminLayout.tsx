import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Building2,
  Layers,
  MapPin,
  Sparkles,
  Calendar,
  BookOpen,
  BrainCircuit,
  HelpCircle,
  Wrench,
  Users,
  FileCheck2,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Bell,
  Search,
  ChevronLeft,
  Sun,
  Moon,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SkilloraLogo } from '../../components/common/SkilloraLogo';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const AdminLayout: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin, isEditor, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Protected route check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-app flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!isAuthenticated || (!isAdmin && !isEditor)) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navLinks = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Jobs', href: '/admin/jobs', icon: Briefcase },
    { label: 'Internships', href: '/admin/internships', icon: GraduationCap },
    { label: 'Companies', href: '/admin/companies', icon: Building2 },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Locations', href: '/admin/locations', icon: MapPin },
    { label: 'Skills', href: '/admin/skills', icon: Sparkles },
    { label: 'Batches', href: '/admin/batches', icon: Calendar },
    { label: 'Articles', href: '/admin/articles', icon: BookOpen },
    { label: 'Practice', href: '/admin/practice', icon: BrainCircuit },
    { label: 'Career Tools', href: '/admin/tools', icon: Wrench },
    { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Applications', href: '/admin/applications', icon: FileCheck2 },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const currentPath = location.pathname;
  const currentNav = navLinks.find((n) => n.href === currentPath) || { label: 'Admin Management' };

  const SidebarContent = ({ collapsed }: { collapsed: boolean }) => (
    <div className="flex flex-col h-full bg-surface border-r border-border-color text-text-primary select-none">
      {/* Brand Header */}
      <div className={`p-4 border-b border-border-color flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <SkilloraLogo size="sm" />
            <span className="text-[10px] font-bold text-brand-primary bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
              CMS
            </span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
            S
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-1.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1 scrollbar-thin">
        {!collapsed && (
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-2">
            Platform Management
          </span>
        )}
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/admin'
              ? currentPath === '/admin'
              : currentPath.startsWith(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setIsMobileSidebarOpen(false)}
              className={`relative group flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2 rounded-2xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </div>

              {!collapsed && isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}

              {/* Hover Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-surface border border-border-color text-text-primary text-xs font-bold rounded-xl shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Footer & Theme Toggle */}
      <div className="p-3 border-t border-border-color space-y-2 bg-surface-2/40">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-1`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-text-primary truncate">{user?.name}</p>
                <p className="text-[10px] text-text-muted uppercase font-semibold">{user?.role}</p>
              </div>
            </div>
          )}
          <ThemeToggle compact />
        </div>

        <div className="flex items-center gap-1">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className={`flex-1 flex items-center ${collapsed ? 'justify-center' : ''} gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-semibold text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors`}
            title="Open Public Website"
          >
            <ExternalLink className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            {!collapsed && <span>View Site</span>}
          </Link>
          <button
            onClick={handleLogout}
            className={`p-1.5 rounded-xl text-accent-error hover:bg-accent-error/10 transition-colors ${collapsed ? 'w-full flex justify-center' : ''}`}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-app flex">
      {/* DESKTOP FIXED SIDEBAR */}
      <aside
        className={`hidden lg:block fixed top-0 bottom-0 left-0 z-30 transition-all duration-200 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarContent collapsed={isCollapsed} />
      </aside>

      {/* MAIN CONTAINER */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* TOPBAR */}
        <header className="sticky top-0 z-20 h-16 bg-surface/80 backdrop-blur-xl border-b border-border-color px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-2"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Link to="/admin" className="text-text-muted hover:text-text-primary">
                Dashboard
              </Link>
              {currentPath !== '/admin' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
                  <span className="text-text-primary font-bold">{currentNav.label}</span>
                </>
              )}
            </div>
          </div>

          {/* Right Header Icons */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-surface-2 hover:bg-border-color text-text-primary text-xs font-bold transition-colors"
            >
              <span>View Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-brand-primary" />
            </Link>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-2 relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-primary" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-surface border border-border-color shadow-card-hover p-4 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-border-color mb-2">
                    <span className="text-xs font-bold text-text-primary">Admin Notifications</span>
                    <span className="text-[10px] text-brand-primary font-bold">2 New</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-xl bg-surface-2">
                      <p className="font-bold text-text-primary">New Job Application</p>
                      <p className="text-[11px] text-text-muted">A candidate applied for Site Reliability Engineer</p>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-2">
                      <p className="font-bold text-text-primary">Database Sync</p>
                      <p className="text-[11px] text-text-muted">Dynamic statistics successfully refreshed</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Topbar Theme Toggle */}
            <ThemeToggle compact />

            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
          </div>
        </header>

        {/* OUTLET MAIN CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-72 h-full bg-surface shadow-2xl flex flex-col"
            >
              <SidebarContent collapsed={false} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
