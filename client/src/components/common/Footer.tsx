import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Instagram, Youtube, Send, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { settingService } from '../../services/api';
import { Setting } from '../../types';
import { SkilloraLogo } from './SkilloraLogo';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<Setting | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    settingService.getSettings().then((res) => {
      if (res.data) setSettings(res.data);
    }).catch(() => {});
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-surface border-t border-border-color text-text-muted transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <SkilloraLogo size="lg" showTagline />

            <p className="text-sm text-text-muted leading-relaxed max-w-sm pt-2">
              Skillora connects passionate learners, graduates, and professionals with leading employers, tech internships, and career roadmaps.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
                Stay updated with weekly jobs
              </p>
              {subscribed ? (
                <div className="px-3.5 py-2.5 rounded-xl bg-accent-success/10 border border-accent-success/30 text-accent-success text-xs font-semibold">
                  ✓ Thanks for subscribing! You'll receive our weekly digest.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-surface-2 border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:opacity-95 transition-opacity flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={settings?.socialLinks?.linkedin || 'https://linkedin.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-surface-2 hover:bg-brand-primary hover:text-white text-text-muted flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={settings?.socialLinks?.twitter || 'https://twitter.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-surface-2 hover:bg-brand-primary hover:text-white text-text-muted flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={settings?.socialLinks?.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-surface-2 hover:bg-brand-primary hover:text-white text-text-muted flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings?.socialLinks?.youtube || 'https://youtube.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-surface-2 hover:bg-brand-primary hover:text-white text-text-muted flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {siteConfig.footerLinks.platform.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="hover:text-brand-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Career */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-4">
              Career
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {siteConfig.footerLinks.career.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="hover:text-brand-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {siteConfig.footerLinks.company.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="hover:text-brand-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-color flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-text-muted">
            © 2026 Skillora. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/#privacy" className="hover:text-text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/#terms" className="hover:text-text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/#security" className="hover:text-text-primary transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
