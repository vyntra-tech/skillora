import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { settingService } from '../../services/api';
import { Setting } from '../../types';

export const AdminSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [siteName, setSiteName] = useState('Skillora');
  const [tagline, setTagline] = useState('Discover. Learn. Grow.');
  const [contactEmail, setContactEmail] = useState('support@skillora.com');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [footerAbout, setFooterAbout] = useState(
    'Skillora connects passionate learners, graduates, and professionals with leading employers, tech internships, and career roadmaps.'
  );
  const [jobsText, setJobsText] = useState('50K+');
  const [companiesText, setCompaniesText] = useState('10K+');
  const [internshipsText, setInternshipsText] = useState('25K+');
  const [candidatesText, setCandidatesText] = useState('100K+');
  const [linkedin, setLinkedin] = useState('https://linkedin.com');
  const [twitter, setTwitter] = useState('https://twitter.com');
  const [instagram, setInstagram] = useState('https://instagram.com');
  const [youtube, setYoutube] = useState('https://youtube.com');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['settingsAdmin'],
    queryFn: () => settingService.getSettings(),
  });

  useEffect(() => {
    if (data?.data) {
      const s = data.data;
      setSiteName(s.siteName || 'Skillora');
      setTagline(s.tagline || 'Discover. Learn. Grow.');
      setContactEmail(s.contactEmail || 'support@skillora.com');
      setContactPhone(s.contactPhone || '');
      setFooterAbout(s.footerAbout || '');
      if (s.stats) {
        setJobsText(s.stats.jobsCountText || '50K+');
        setCompaniesText(s.stats.companiesCountText || '10K+');
        setInternshipsText(s.stats.internshipsCountText || '25K+');
        setCandidatesText(s.stats.candidatesCountText || '100K+');
      }
      if (s.socialLinks) {
        setLinkedin(s.socialLinks.linkedin || '');
        setTwitter(s.socialLinks.twitter || '');
        setInstagram(s.socialLinks.instagram || '');
        setYoutube(s.socialLinks.youtube || '');
      }
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (payload: any) => settingService.updateSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settingsAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setSuccessMsg('Platform settings updated! Changes are now live on public website.');
      setTimeout(() => setSuccessMsg(null), 4000);
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      siteName,
      tagline,
      contactEmail,
      contactPhone,
      footerAbout,
      stats: {
        jobsCountText: jobsText,
        companiesCountText: companiesText,
        internshipsCountText: internshipsText,
        candidatesCountText: candidatesText,
      },
      socialLinks: {
        linkedin,
        twitter,
        instagram,
        youtube,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border-color">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Platform Settings & Branding
          </h1>
          <p className="text-xs text-text-muted mt-0.5 font-medium">
            Configure global website name, brand taglines, contact info, and public statistics for Skillora.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="px-5 py-2.5 rounded-2xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Settings</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-accent-success/15 border border-accent-success/30 text-accent-success text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Information */}
        <div className="p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider text-brand-primary pb-2 border-b border-border-color">
            General Branding
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Site / Platform Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Main Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Support Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Contact Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-text-primary mb-1">Footer About Description</label>
              <textarea
                rows={3}
                value={footerAbout}
                onChange={(e) => setFooterAbout(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary resize-none"
              />
            </div>
          </div>
        </div>

        {/* Public Statistics */}
        <div className="p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider text-brand-primary pb-2 border-b border-border-color">
            Public Platform Statistics Display
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Jobs Count</label>
              <input
                type="text"
                value={jobsText}
                onChange={(e) => setJobsText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Companies Count</label>
              <input
                type="text"
                value={companiesText}
                onChange={(e) => setCompaniesText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Internships Count</label>
              <input
                type="text"
                value={internshipsText}
                onChange={(e) => setInternshipsText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Candidates Count</label>
              <input
                type="text"
                value={candidatesText}
                onChange={(e) => setCandidatesText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider text-brand-primary pb-2 border-b border-border-color">
            Social Channels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Twitter / X URL</label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Instagram URL</label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">YouTube URL</label>
              <input
                type="url"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
