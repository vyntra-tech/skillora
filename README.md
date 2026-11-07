# TalentPulse — Full-Stack Talent, Jobs & Career Platform

A production-ready, full-stack Talent / Jobs & Career platform inspired by modern career portals, featuring a public frontend website and a comprehensive SaaS-style Admin Dashboard / CMS where **all public content is 100% dynamic and database-driven**.

---

## 🌟 Architecture Overview

The project is structured as a unified monorepo:

```
├── client/                     # React + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── admin/              # Complete SaaS Admin Dashboard & CMS
│   │   │   ├── layouts/        # AdminLayout with collapsible sidebar & mobile drawer
│   │   │   └── pages/          # 16 Admin Management Pages (CRUD for all resources)
│   │   ├── api/                # Axios client with JWT interceptor
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Navbar, Footer, JobCard, InternshipCard, ApplyModal, etc.
│   │   │   └── home/           # Dynamic home sections (Hero, Categories, Closing Soon, etc.)
│   │   ├── config/             # Central site branding & config (site.ts)
│   │   ├── context/            # AuthContext (JWT tokens, bookmarks, RBAC checks)
│   │   ├── pages/              # Public pages (/jobs, /companies, /internships, /practice, etc.)
│   │   ├── services/           # Typed API service layer (TanStack Query ready)
│   │   └── types/              # Full TypeScript schemas matching MongoDB models
│   └── vite.config.ts          # Reverse proxy to backend API & static uploads
│
├── server/                     # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/             # Environment, DB connection (Atlas + Memory fallback)
│   │   ├── controllers/        # Controllers for 17 resource endpoints
│   │   ├── middleware/         # JWT verification, Role-based access control, Error handling
│   │   ├── models/             # 13 Mongoose models (Job, Company, Category, Location, etc.)
│   │   ├── routes/             # RESTful API route definitions (/api/v1/*)
│   │   ├── seed/               # Realistic seed dataset & CLI runner
│   │   ├── services/           # Cloudinary image storage with local fallback
│   │   └── server.ts           # Express application with Helmet, CORS, Morgan
│   └── dist/                   # Compiled TypeScript production output
│
└── package.json                # Root orchestrator with dev / build / seed commands
```

---

## 🔑 Demo Credentials

The database comes pre-seeded with three accounts:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Super Admin** | `admin@talentpulse.com` | `admin123456` | Full CRUD access to all CMS modules, settings, users, and reports |
| **Editor** | `editor@talentpulse.com` | `editor123456` | Content authoring & publishing (Jobs, Internships, Articles, Practice) |
| **Candidate** | `candidate@talentpulse.com` | `candidate123456` | Job search, quick apply, bookmarking, and application tracking |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node.js v22)
- **npm** v9+

### 2. Running Locally

To run both backend API and frontend client concurrently:

```bash
# In the root project directory:
npm run dev
```

Or run each part individually in separate terminals:

**Backend Server:**
```bash
cd server
npm run dev      # Runs with ts-node-dev on http://localhost:6001
# Or in production mode:
npm start        # Runs compiled server on http://localhost:6001
```

**Frontend Client:**
```bash
cd client
npm run dev      # Runs Vite dev server on http://localhost:5173 (or next free port)
```

### 3. Accessing the Platform

- **Public Website**: `http://localhost:5174/` (or `http://localhost:5173/`)
- **Admin Dashboard**: `http://localhost:5174/admin` (Sign in with `admin@talentpulse.com` / `admin123456`)
- **Backend API**: `http://localhost:6001/api/v1`
- **Health Check**: `http://localhost:6001/api/health`

### 4. Database Re-seeding (Optional)

To reset and re-seed the MongoDB database with realistic jobs, companies, internships, articles, questions, and categories:

```bash
cd server
npm run seed
```

---

## 🌐 Dynamic Public Website Modules

Every single section on the website fetches live data from the backend:

1. **Hero Section**: Career search with multi-filter bar (Graduation year, City, Job type) and popular search tags.
2. **Quick Categories**: Dynamic horizontal category chips with icons and live job count badges.
3. **Latest Jobs**: Dynamic grid of job cards with hover animations, salary chips, badges, and quick actions.
4. **Closing Soon**: Jobs filtered dynamically where application deadlines are approaching with calculated remaining days.
5. **Featured Companies**: Hiring companies grid displaying active job counts and industry tags.
6. **Latest Internships**: Dedicated internships section with stipends, duration, and apply buttons.
7. **Career Preparation**: DSA, Aptitude, System Design, and Interview questions with difficulty filters.
8. **Career Tools**: Interactive Salary Calculator, CGPA Calculator, ATS Resume Checker, and Cover Letter Generator.
9. **Career Insights (Articles)**: Career guides, interview roadmaps, and salary negotiation strategies.
10. **Browse by City & Category**: Dynamic exploration grid linking to filtered search results.
11. **Platform Statistics**: Live candidate, job, and company stats backed by database aggregation.
12. **FAQ Accordion**: Fully dynamic and re-orderable questions and answers.
13. **Quick Apply & Share Modals**: Direct resume/application submission with confetti celebration and clipboard sharing.

---

## 🛠️ Admin Dashboard / CMS Modules

Access at `/admin`:

- **Overview Dashboard**: Live counters for Jobs, Internships, Companies, Applications, Users, and interactive charts.
- **Job Management**: Complete CRUD, publish/unpublish, duplicate, featured flag toggle, and search.
- **Company Management**: Company profile, logo upload, active jobs count, and hiring status.
- **Internship Management**: Stipend, duration, eligibility, and direct application links.
- **Category Management**: Categories with icons, display order, and featured flags.
- **Location Management**: City, state, country, and active status.
- **Skills Management**: Skill tags usable across jobs and internships.
- **Batch Management**: Graduation years for eligibility filtering (2024–2028).
- **Articles & Insights**: Rich content editor, tags, cover images, read times, and author profiles.
- **Practice & Questions**: DSA, Aptitude, HR, and technical questions with difficulty levels and answers.
- **Career Tools**: Toggle tools visibility and update descriptions.
- **FAQ Management**: Create, edit, and reorder accordion FAQs.
- **User Management**: Search users, toggle roles (USER, ADMIN, EDITOR), and toggle account status.
- **Applications Tracking**: Review submitted candidate applications, change status (Pending, Reviewed, Shortlisted, Rejected), and download resumes.
- **Reports & Analytics**: High-level platform metrics and visual breakdowns.
- **Platform Settings**: Change site name, logo, contact emails, social links, and SEO defaults dynamically.
