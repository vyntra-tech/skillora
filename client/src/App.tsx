import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthLayout } from './layouts/AuthLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { PublicLayout } from './layouts/PublicLayout';
import { HomePage } from './pages/HomePage';
import { JobsPage } from './pages/JobsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { CompanyDetailsPage } from './pages/CompanyDetailsPage';
import { InternshipsPage } from './pages/InternshipsPage';
import { InternshipDetailsPage } from './pages/InternshipDetailsPage';
import { PracticePage } from './pages/PracticePage';
import { CareerToolsPage } from './pages/CareerToolsPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ArticleDetailsPage } from './pages/ArticleDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { SavedJobsPage } from './pages/SavedJobsPage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin imports
import { AdminLayout } from './admin/layouts/AdminLayout';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { AdminDashboardPage } from './admin/pages/AdminDashboardPage';
import { AdminJobsPage } from './admin/pages/AdminJobsPage';
import { AdminJobFormPage } from './admin/pages/AdminJobFormPage';
import { AdminCompaniesPage } from './admin/pages/AdminCompaniesPage';
import { AdminInternshipsPage } from './admin/pages/AdminInternshipsPage';
import { AdminCategoriesPage } from './admin/pages/AdminCategoriesPage';
import { AdminLocationsPage } from './admin/pages/AdminLocationsPage';
import { AdminSkillsPage } from './admin/pages/AdminSkillsPage';
import { AdminBatchesPage } from './admin/pages/AdminBatchesPage';
import { AdminArticlesPage } from './admin/pages/AdminArticlesPage';
import { AdminPracticePage } from './admin/pages/AdminPracticePage';
import { AdminFaqsPage } from './admin/pages/AdminFaqsPage';
import { AdminToolsPage } from './admin/pages/AdminToolsPage';
import { AdminUsersPage } from './admin/pages/AdminUsersPage';
import { AdminApplicationsPage } from './admin/pages/AdminApplicationsPage';
import { AdminReportsPage } from './admin/pages/AdminReportsPage';
import { AdminSettingsPage } from './admin/pages/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* 1. Standalone Candidate Authentication Routes (NO Navbar, NO Footer) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* 2. Standalone Admin Login Route (NO Public Navbar, NO Public Footer) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* 3. Protected Candidate / Platform Routes (Requires Authentication First) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:slug" element={<JobDetailsPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:slug" element={<CompanyDetailsPage />} />
          <Route path="/internships" element={<InternshipsPage />} />
          <Route path="/internships/:slug" element={<InternshipDetailsPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/tools" element={<CareerToolsPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticleDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/saved-jobs" element={<SavedJobsPage />} />
          <Route path="/applications" element={<MyApplicationsPage />} />
        </Route>
      </Route>

      {/* 4. Admin CMS Protected Routes (ADMIN / SUPER_ADMIN / EDITOR Only) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="jobs" element={<AdminJobsPage />} />
        <Route path="jobs/new" element={<AdminJobFormPage />} />
        <Route path="jobs/:id/edit" element={<AdminJobFormPage />} />
        <Route path="companies" element={<AdminCompaniesPage />} />
        <Route path="internships" element={<AdminInternshipsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="locations" element={<AdminLocationsPage />} />
        <Route path="skills" element={<AdminSkillsPage />} />
        <Route path="batches" element={<AdminBatchesPage />} />
        <Route path="articles" element={<AdminArticlesPage />} />
        <Route path="practice" element={<AdminPracticePage />} />
        <Route path="faqs" element={<AdminFaqsPage />} />
        <Route path="tools" element={<AdminToolsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="applications" element={<AdminApplicationsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* 5. 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
