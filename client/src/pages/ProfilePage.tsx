import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadService } from '../services/api';
import { User, Mail, Phone, FileText, Upload, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen pt-28 pb-20 max-w-md mx-auto text-center px-4">
        <p className="text-sm text-text-muted">Please sign in to view your Skillora profile.</p>
      </div>
    );
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setErrorMsg(null);
      const url = await uploadService.uploadFile(file, 'resumes');
      setResumeUrl(url);
      setSuccessMsg('Resume uploaded! Click "Save Changes" to apply.');
    } catch (err: any) {
      setErrorMsg('Failed to upload file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setErrorMsg(null);
      const url = await uploadService.uploadFile(file, 'avatars');
      setAvatar(url);
      setSuccessMsg('Avatar uploaded! Click "Save Changes" to apply.');
    } catch (err: any) {
      setErrorMsg('Failed to upload avatar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setErrorMsg(null);
      await updateUserProfile({
        name,
        phone,
        bio,
        resumeUrl,
        avatar,
      });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-bg-app">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-primary text-xs font-bold mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Account Settings</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Candidate Profile
          </h1>
          <p className="text-sm text-text-muted mt-1 font-medium">
            Manage your personal information, contact credentials, and default resume on Skillora.
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-accent-success/15 border border-accent-success/30 text-accent-success text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-accent-error/15 border border-accent-error/30 text-accent-error text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-surface border border-border-color shadow-card-subtle space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-5 pb-6 border-b border-border-color">
            <div className="relative">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-20 h-20 rounded-2xl object-cover border border-border-color shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white font-extrabold text-2xl flex items-center justify-center shadow-sm">
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-bold text-text-primary mb-1">Profile Photo</p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-2 hover:bg-border-color border border-border-color text-xs font-semibold text-text-primary transition-colors">
                <Upload className="w-3.5 h-3.5 text-brand-primary" />
                <span>{isUploading ? 'Uploading...' : 'Change Photo'}</span>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">Email Address</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2/50 border border-border-color text-xs font-medium text-text-muted cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">Bio / Professional Headline</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Full stack software engineer passionate about modern web apps..."
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">Default Resume URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="Google Drive link or upload below"
                className="flex-1 px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary"
              />
              <label className="cursor-pointer px-4 py-2.5 rounded-2xl bg-surface hover:bg-surface-2 border border-border-color text-text-primary text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-colors">
                <Upload className="w-4 h-4 text-brand-primary" />
                <span>Upload</span>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-border-color flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-2xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
