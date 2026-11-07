export const siteConfig = {
  name: 'Skillora',
  tagline: 'Discover. Learn. Grow.',
  supportingText: 'Your smarter path to jobs, internships and career growth.',
  description: 'Skillora helps you discover jobs, internships, companies and career resources to build your future.',
  url: 'http://localhost:5174',
  backendUrl: (import.meta as any).env?.VITE_BACKEND_URL || 'https://skillora-1-qx0w.onrender.com',
  apiUrl: (import.meta as any).env?.VITE_API_URL || 'https://skillora-1-qx0w.onrender.com/api/v1',
  navItems: [
    { label: 'Jobs', href: '/jobs' },
    { label: 'Internships', href: '/internships' },
    { label: 'Companies', href: '/companies' },
    { label: 'Practice', href: '/practice' },
    { label: 'Career Tools', href: '/tools' },
    { label: 'Articles', href: '/articles' },
  ],
  footerLinks: {
    platform: [
      { label: 'Jobs', href: '/jobs' },
      { label: 'Internships', href: '/internships' },
      { label: 'Companies', href: '/companies' },
      { label: 'Practice', href: '/practice' },
    ],
    career: [
      { label: 'Career Tools', href: '/tools' },
      { label: 'Articles', href: '/articles' },
      { label: 'Roadmaps', href: '/practice?type=Roadmap' },
      { label: 'Interview Prep', href: '/practice?type=Interview' },
    ],
    company: [
      { label: 'About', href: '/#about' },
      { label: 'Contact', href: '/#contact' },
      { label: 'Privacy', href: '/#privacy' },
      { label: 'Terms', href: '/#terms' },
    ],
  },
};
