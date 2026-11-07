import mongoose from 'mongoose';
import slugify from 'slugify';
import { connectDB } from '../config/db';
import { User } from '../models/User';
import { Company } from '../models/Company';
import { Category } from '../models/Category';
import { Location } from '../models/Location';
import { Skill } from '../models/Skill';
import { Batch } from '../models/Batch';
import { Job } from '../models/Job';
import { Internship } from '../models/Internship';
import { Article } from '../models/Article';
import { PracticeQuestion } from '../models/PracticeQuestion';
import { Faq } from '../models/Faq';
import { CareerTool } from '../models/CareerTool';
import { Application } from '../models/Application';
import { Setting } from '../models/Setting';

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('[Seeder] Connecting to database...');
    await connectDB();

    console.log('[Seeder] Clearing old collections completely...');

    // Clear previous seed data
    await Promise.all([
      User.deleteMany({}),
      Company.deleteMany({}),
      Category.deleteMany({}),
      Location.deleteMany({}),
      Skill.deleteMany({}),
      Batch.deleteMany({}),
      Job.deleteMany({}),
      Internship.deleteMany({}),
      Article.deleteMany({}),
      PracticeQuestion.deleteMany({}),
      Faq.deleteMany({}),
      CareerTool.deleteMany({}),
      Application.deleteMany({}),
      Setting.deleteMany({}),
    ]);

    console.log('[Seeder] Cleared all old database data.');

    // 1. Seed Users (Super Admin & Candidate)
    const adminUser = await User.create({
      name: 'Aditya Verma (Super Admin)',
      email: 'admin@skillora.com',
      password: 'admin123456',
      role: 'SUPER_ADMIN',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Platform Lead & Head of Talent Operations at Skillora.',
      phone: '+91 98765 00001',
    });

    const candidateUser = await User.create({
      name: 'Rahul Sharma',
      email: 'candidate@skillora.com',
      password: 'candidate123456',
      role: 'USER',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      bio: 'Aspiring Full-Stack Software Engineer & Open Source Contributor. Passionate about React, TypeScript, and modern web architectures.',
      phone: '+91 98765 43210',
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    });

    console.log('[Seeder] Seeded 2 users (Admin & Candidate).');

    // 2. Seed 1 Demo Category
    const demoCategory = await Category.create({
      name: 'Software Development',
      slug: 'software-development',
      icon: 'Code2',
      description: 'Frontend, backend, cloud, and full-stack software engineering careers.',
      status: 'published',
      displayOrder: 1,
      featured: true,
      jobsCount: 1,
    });

    // 3. Seed 1 Demo Location
    const demoLocation = await Location.create({
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      slug: 'bengaluru',
      status: 'published',
      displayOrder: 1,
      isPopular: true,
      jobsCount: 1,
    });

    // 4. Seed 1 Demo Skill
    const demoSkill = await Skill.create({
      name: 'React.js',
      slug: 'react-js',
      category: 'Frontend',
      status: 'active',
    });

    // 5. Seed 1 Demo Batch
    const demoBatch = await Batch.create({
      year: '2025',
      status: 'active',
      displayOrder: 1,
    });

    // 6. Seed 1 Demo Company
    const demoCompany = await Company.create({
      name: 'Skillora Demo Technologies',
      slug: 'skillora-demo-technologies',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
      website: 'https://skillora.demo',
      industry: 'IT & Software Services',
      location: 'Bengaluru, India',
      description: 'Skillora Demo Technologies builds modern talent infrastructure, developer tools, and scalable career platforms.',
      companySize: '50-200',
      foundedYear: 2024,
      featured: true,
      status: 'published',
      activeJobsCount: 1,
      activeInternshipsCount: 1,
      socialLinks: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
      },
    });

    // 7. Seed 1 Demo Job
    const deadlineJob = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days ahead
    const demoJob = await Job.create({
      title: 'Frontend Developer — Demo',
      slug: 'frontend-developer-demo',
      companyId: demoCompany._id,
      companyName: demoCompany.name,
      companyLogo: demoCompany.logo,
      categoryId: demoCategory._id,
      categoryName: demoCategory.name,
      locationId: demoLocation._id,
      locationName: demoLocation.city,
      jobType: 'Full-time',
      workMode: 'Hybrid',
      experience: '0-2 Years',
      batchIds: [demoBatch._id],
      batchYears: [demoBatch.year],
      salaryMin: 8,
      salaryMax: 14,
      salaryCurrency: 'INR',
      salaryPeriod: 'Annual',
      skills: [demoSkill.name, 'TypeScript', 'Tailwind CSS'],
      description: 'Join Skillora Demo Technologies as a Frontend Developer. You will help build responsive, accessible, high-performance web applications using modern React and TypeScript architecture.',
      responsibilities: [
        'Develop responsive web interfaces with React, TypeScript, and Tailwind CSS.',
        'Collaborate closely with UI/UX designers and backend engineers.',
        'Optimize components for maximum performance across diverse devices and browsers.',
        'Write clean, testable, and maintainable code adhering to best industry standards.',
      ],
      requirements: [
        'Solid foundational understanding of React, JavaScript (ES6+), and CSS layout models.',
        'Experience with TypeScript and modern state management.',
        'Familiarity with REST APIs, Git version control, and responsive design principles.',
        'Strong problem-solving skills and proactive communication.',
      ],
      benefits: [
        'Competitive CTC (₹8–14 LPA) with flexible performance incentives.',
        'Comprehensive health insurance for you and your dependents.',
        'Hybrid working model with modern home office allowance.',
        'Annual learning and professional certification budget.',
      ],
      applicationUrl: 'https://skillora.demo/jobs/frontend-developer-demo/apply',
      deadline: deadlineJob,
      featured: true,
      status: 'published',
      viewsCount: 42,
      applicationsCount: 1,
      seoTitle: 'Frontend Developer — Demo | Skillora Demo Technologies',
      seoDescription: 'Apply now for Frontend Developer — Demo at Skillora Demo Technologies in Bengaluru. 0-2 Years experience, ₹8-14 LPA.',
    });

    // 8. Seed 1 Demo Internship
    const deadlineInternship = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000); // 20 days ahead
    const demoInternship = await Internship.create({
      title: 'React Developer Intern — Demo',
      slug: 'react-developer-intern-demo',
      companyId: demoCompany._id,
      companyName: demoCompany.name,
      companyLogo: demoCompany.logo,
      categoryId: demoCategory._id,
      categoryName: demoCategory.name,
      locationId: demoLocation._id,
      locationName: demoLocation.city,
      workMode: 'Remote',
      duration: '3 Months',
      stipend: '₹25,000 /month',
      skills: [demoSkill.name, 'JavaScript', 'HTML/CSS'],
      description: 'A 3-month immersive internship opportunity for aspiring web engineers. Work directly with senior frontend engineers building real-world features and user interfaces.',
      requirements: [
        'Good grasp of React components, props, hooks, and lifecycle.',
        'Basic familiarity with Git, GitHub, and browser developer tools.',
        'Strong eagerness to learn, take feedback, and ship user-facing code.',
      ],
      perks: [
        '₹25,000 monthly stipend with performance bonus.',
        'Direct 1:1 mentorship from seasoned engineering leaders.',
        'Pre-Placement Offer (PPO) opportunity upon successful internship completion.',
        'Flexible working hours with fully remote setup.',
      ],
      deadline: deadlineInternship,
      applyUrl: 'https://skillora.demo/internships/react-developer-intern-demo/apply',
      featured: true,
      status: 'published',
      viewsCount: 28,
    });

    // 9. Seed 1 Demo Article
    const demoArticle = await Article.create({
      title: 'How to Start Your Software Development Career',
      slug: 'how-to-start-your-software-development-career',
      coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
      category: 'Career Guide',
      author: 'Skillora Editorial Team',
      shortDescription: 'A practical, step-by-step roadmap to mastering web fundamentals, building standout projects, and acing technical interviews in modern tech companies.',
      content: `# How to Start Your Software Development Career

Breaking into software development can feel overwhelming, with dozens of frameworks and roadmaps released every year. However, successful software careers are anchored on timeless engineering principles.

## 1. Master the Fundamentals First
Before jumping into advanced meta-frameworks, build solid intuition in:
- **JavaScript & TypeScript**: Understand closures, asynchronous event loops, promises, and the type system.
- **Data Structures**: Arrays, maps, hash tables, and common search/sort patterns.
- **HTTP & REST Protocols**: Request headers, status codes, CORS, and API contracts.

## 2. Build Real Projects, Not Just Tutorials
A generic to-do list doesn't stand out. Instead, build apps that solve specific user friction:
- Real-time collaborative tools using WebSockets.
- Dashboard analytics platforms consuming live APIs with pagination and caching.
- Accessible, responsive applications adhering to WCAG 2.1 guidelines.

## 3. Learn How to Read and Review Code
Senior engineers spend more time reading and evaluating code than writing new lines. Participate in open-source discussions, read codebase pull requests, and practice systematic debugging.

## Conclusion
Stay consistent, build in public, and focus on clean, maintainable engineering habits. Skillora provides all the roadmaps, practice sets, and opportunities to support your growth.`,
      tags: ['React.js', 'Career Roadmap', 'Frontend Development'],
      seoTitle: 'How to Start Your Software Development Career | Skillora',
      seoDescription: 'Read the complete beginner-to-professional software development roadmap on Skillora.',
      publishedDate: new Date(),
      status: 'published',
      featured: true,
      readTime: '5 min read',
      viewsCount: 85,
    });

    // 10. Seed 1 Demo FAQ
    const demoFaq = await Faq.create({
      question: 'What is Skillora?',
      answer: 'Skillora is a modern career platform designed to help students, graduates, and professionals discover vetted jobs and internships, prepare for technical interviews, and accelerate their career growth through dynamic tools and verified opportunities.',
      category: 'General',
      displayOrder: 1,
      status: 'published',
    });

    // 11. Seed 1 Demo Practice Question
    const demoPractice = await PracticeQuestion.create({
      question: 'Explain the Virtual DOM and Reconciliation in React',
      slug: 'explain-virtual-dom-reconciliation-react',
      questionType: 'Technical',
      category: 'Frontend',
      difficulty: 'Medium',
      company: 'Skillora Demo Technologies',
      topic: 'React Core',
      answer: 'The Virtual DOM (VDOM) is an in-memory lightweight representation of the real DOM. React uses VDOM to minimize costly direct browser DOM manipulations through Reconciliation.',
      explanation: `When a component's state or props change, React:
1. Creates a new Virtual DOM tree representing the updated UI.
2. Performs a reconciliation "diffing" pass between the new VDOM and the previous snapshot using an O(n) heuristic algorithm.
3. Computes the minimal set of real DOM operations and applies them in a batched commit phase.

This avoids full page repaints and yields smooth 60fps browser rendering.`,
      codeSnippet: `import React, { useState } from 'react';

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <button 
      onClick={() => setCount((prev) => prev + 1)}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
    >
      Count: {count}
    </button>
  );
};`,
      tags: ['React', 'Virtual DOM', 'Reconciliation'],
      status: 'published',
      viewsCount: 54,
    });

    // 12. Seed 1 Demo Career Tool
    const demoTool = await CareerTool.create({
      title: 'In-Hand Salary Calculator',
      slug: 'in-hand-salary-calculator',
      description: 'Calculate your exact monthly take-home salary after Indian income tax regimes, Employee PF, and standard allowances.',
      icon: 'Calculator',
      url: '/tools?tool=salary',
      badge: 'Popular',
      isEnabled: true,
      isExternal: false,
      status: 'published',
    });

    // 13. Seed 1 Demo Application
    await Application.create({
      jobId: demoJob._id,
      candidateId: candidateUser._id,
      candidateName: candidateUser.name,
      candidateEmail: candidateUser.email,
      candidatePhone: candidateUser.phone,
      jobTitle: demoJob.title,
      companyId: demoCompany._id,
      companyName: demoCompany.name,
      resumeUrl: candidateUser.resumeUrl,
      coverLetter: 'I am excited to apply for the Frontend Developer position at Skillora Demo Technologies. With hands-on experience building React applications and a passion for clean UI design, I look forward to contributing to your team.',
      status: 'Under Review',
      appliedDate: new Date(),
    });

    // 14. Seed Setting
    await Setting.create({
      siteName: 'Skillora',
      tagline: 'Discover. Learn. Grow.',
      supportEmail: 'support@skillora.com',
      contactPhone: '+91 80 4000 1234',
      address: 'Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
        telegram: 'https://telegram.org',
      },
      stats: {
        jobsCountText: '1+',
        companiesCountText: '1+',
        internshipsCountText: '1+',
        candidatesCountText: '1+',
      },
      footerAbout: 'Skillora is a modern career platform helping students, graduates, and professionals discover high-impact jobs, internships, and interview preparation resources.',
      features: {
        enableResumeBuilder: true,
        enableAtsChecker: true,
        enableSalaryCalculator: true,
        enablePracticeModule: true,
      },
    });

    console.log('----------------------------------------------------');
    console.log('✅ DATABASE SEEDING COMPLETED WITH EXACT DEMO DATA!');
    console.log('----------------------------------------------------');
    console.log('Super Admin: admin@skillora.com     / admin123456');
    console.log('Candidate:   candidate@skillora.com / candidate123456');
    console.log('1 Demo Job, 1 Demo Internship, 1 Demo Company, 1 Demo Category seeded.');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Allow standalone execution: npm run seed
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('[Seeder] Seeding finished successfully.');
    process.exit(0);
  });
}
