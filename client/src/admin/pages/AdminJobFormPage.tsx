import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Save, Sparkles, Loader2, AlertCircle, Eye, X, CheckCircle2, MapPin, Briefcase } from 'lucide-react';
import {
  jobService,
  companyService,
  categoryService,
  locationService,
  batchService,
} from '../../services/api';
import { Job } from '../../types';
import { JobCard } from '../../components/common/JobCard';

export const AdminJobFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Queries for relations
  const { data: companiesData } = useQuery({ queryKey: ['adminCompanies'], queryFn: () => companyService.getCompanies({ limit: 100 }) });
  const { data: categoriesData } = useQuery({ queryKey: ['adminCategories'], queryFn: () => categoryService.getCategories({ allStatus: 'true' }) });
  const { data: locationsData } = useQuery({ queryKey: ['adminLocations'], queryFn: () => locationService.getLocations({ allStatus: 'true' }) });
  const { data: batchesData } = useQuery({ queryKey: ['adminBatches'], queryFn: () => batchService.getBatches() });

  const companies = companiesData?.data || [];
  const categories = categoriesData?.data || [];
  const locations = locationsData?.data || [];
  const batches = batchesData?.data || [];

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [jobType, setJobType] = useState<Job['jobType']>('Full-time');
  const [workMode, setWorkMode] = useState<Job['workMode']>('Hybrid');
  const [experience, setExperience] = useState('0-2 Years');
  const [selectedBatch, setSelectedBatch] = useState<string>('2025');
  const [salaryMin, setSalaryMin] = useState<number>(8);
  const [salaryMax, setSalaryMax] = useState<number>(14);
  const [skills, setSkills] = useState('React, TypeScript, Node.js');
  const [description, setDescription] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState(
    'Architect and build maintainable frontend/backend features.\nCollaborate across squads with designers and product managers.\nConduct comprehensive code reviews and unit test coverage.'
  );
  const [requirementsText, setRequirementsText] = useState(
    '1+ years experience in TypeScript, React, and modern web frameworks.\nDeep understanding of async JavaScript, REST APIs, and state management.\nSolid communication skills and proactive problem solving.'
  );
  const [benefitsText, setBenefitsText] = useState(
    'Comprehensive Health & Family Insurance\nFlexible Work Hours & Hybrid Schedule\nAnnual Learning Budget (₹50,000)'
  );
  const [applicationUrl, setApplicationUrl] = useState('');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<Job['status']>('published');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // If editing, load job data
  const { data: existingJobData } = useQuery({
    queryKey: ['jobEdit', id],
    queryFn: async () => {
      const res = await jobService.getJobs({ allStatus: 'true', limit: 100 });
      return res.data.find((j) => j._id === id);
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (existingJobData) {
      setTitle(existingJobData.title || '');
      setSlug(existingJobData.slug || '');
      setCompanyId(
        typeof existingJobData.companyId === 'string'
          ? existingJobData.companyId
          : existingJobData.companyId?._id || ''
      );
      setCategoryId(
        typeof existingJobData.categoryId === 'string'
          ? existingJobData.categoryId
          : existingJobData.categoryId?._id || ''
      );
      setLocationId(
        typeof existingJobData.locationId === 'string'
          ? existingJobData.locationId
          : existingJobData.locationId?._id || ''
      );
      setJobType(existingJobData.jobType || 'Full-time');
      setWorkMode(existingJobData.workMode || 'Hybrid');
      setExperience(existingJobData.experience || '0-2 Years');
      setSalaryMin(existingJobData.salaryMin || 0);
      setSalaryMax(existingJobData.salaryMax || 0);
      setSkills(Array.isArray(existingJobData.skills) ? existingJobData.skills.join(', ') : '');
      setDescription(existingJobData.description || '');
      setResponsibilitiesText((existingJobData.responsibilities || []).join('\n'));
      setRequirementsText((existingJobData.requirements || []).join('\n'));
      setBenefitsText((existingJobData.benefits || []).join('\n'));
      setApplicationUrl(existingJobData.applicationUrl || '');
      if (existingJobData.deadline) {
        setDeadline(new Date(existingJobData.deadline).toISOString().split('T')[0]);
      }
      setFeatured(Boolean(existingJobData.featured));
      setStatus(existingJobData.status || 'published');
      setSeoTitle(existingJobData.seoTitle || '');
      setSeoDescription(existingJobData.seoDescription || '');
    }
  }, [existingJobData]);

  // Set default relations when loaded
  useEffect(() => {
    if (!companyId && companies.length > 0) setCompanyId(companies[0]._id);
    if (!categoryId && categories.length > 0) setCategoryId(categories[0]._id);
    if (!locationId && locations.length > 0) setLocationId(locations[0]._id);
  }, [companies, categories, locations]);

  // Selected company object
  const selectedCompany = companies.find((c) => c._id === companyId);
  const selectedLocation = locations.find((l) => l._id === locationId);

  // Mutation
  const saveMutation = useMutation({
    mutationFn: async (targetStatus?: 'published' | 'draft') => {
      const payload = {
        title,
        slug: slug.trim() || undefined,
        companyId,
        categoryId,
        locationId,
        jobType,
        workMode,
        experience,
        batchYears: [selectedBatch],
        salaryMin: Number(salaryMin),
        salaryMax: Number(salaryMax),
        salaryCurrency: '₹',
        salaryPeriod: 'LPA',
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        description,
        responsibilities: responsibilitiesText.split('\n').map((s) => s.trim()).filter(Boolean),
        requirements: requirementsText.split('\n').map((s) => s.trim()).filter(Boolean),
        benefits: benefitsText.split('\n').map((s) => s.trim()).filter(Boolean),
        applicationUrl,
        deadline: new Date(deadline).toISOString(),
        featured,
        status: targetStatus || status,
        seoTitle: seoTitle || `${title} at ${selectedCompany?.name || 'Skillora'}`,
        seoDescription: seoDescription || `${title} opening in ${selectedLocation?.city || 'Remote'}. Apply now on Skillora.`,
      };

      if (isEdit) {
        return jobService.updateJob(id!, payload);
      } else {
        return jobService.createJob(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      navigate('/admin/jobs');
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to save job opening.');
    },
  });

  const handleSave = (targetStatus?: 'published' | 'draft') => {
    if (!title.trim() || !companyId || !categoryId || !locationId) {
      setErrorMsg('Please fill in Job Title, Company, Category, and Location.');
      return;
    }
    setErrorMsg(null);
    saveMutation.mutate(targetStatus);
  };

  // Construct mock preview job object
  const previewJob: any = {
    _id: 'preview-id',
    title: title || 'Frontend Engineer',
    slug: slug || 'preview-slug',
    companyName: selectedCompany?.name || 'Skillora Partner',
    companyLogo: selectedCompany?.logo || '',
    locationName: selectedLocation?.city || 'Remote',
    workMode,
    experience,
    salaryMin,
    salaryMax,
    salaryCurrency: '₹',
    salaryPeriod: 'LPA',
    skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
    featured,
    createdAt: new Date().toISOString(),
    remainingDays: 14,
    isClosingSoon: false,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border-color">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/jobs"
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
              {isEdit ? 'Edit Opportunity' : 'Create New Opportunity'}
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              Everything configured here renders dynamically on the Skillora public platform.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-2 border border-border-color text-text-primary text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-brand-primary" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={saveMutation.isPending}
            className="px-3.5 py-2 rounded-xl bg-surface-2 hover:bg-border-color text-text-primary text-xs font-bold transition-colors"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={saveMutation.isPending}
            className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Publish Job</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-accent-error/10 border border-accent-error/20 text-accent-error text-xs rounded-2xl flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* MULTI-SECTION FORM */}
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider text-brand-primary pb-2 border-b border-border-color">
            1. Role & Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-text-primary mb-1">Job Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Backend Engineer (Node.js & Distributed Systems)"
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Custom Slug (Optional)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-if-blank"
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Hiring Company *</label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              >
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.industry || 'Tech'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Classification & Location */}
        <div className="p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider text-brand-primary pb-2 border-b border-border-color">
            2. Classification & Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Location Hub *</label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              >
                {locations.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.city} ({l.state || l.country})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Experience Required</label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 1-3 Years or Fresher"
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Eligible Batch</label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              >
                <option value="2024">Class of 2024</option>
                <option value="2025">Class of 2025</option>
                <option value="2026">Class of 2026</option>
                <option value="2027">Class of 2027</option>
                <option value="All">All Batches</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Compensation & Skills */}
        <div className="p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider text-brand-primary pb-2 border-b border-border-color">
            3. Compensation & Skills
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Min Salary (₹ LPA)</label>
              <input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Max Salary (₹ LPA)</label>
              <input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-text-primary mb-1">Required Skills (Comma separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. React, Node.js, TypeScript, PostgreSQL, Docker"
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Detailed Content */}
        <div className="p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider text-brand-primary pb-2 border-b border-border-color">
            4. Role Description & Requirements
          </h2>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">Job Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of product impact, engineering culture, and day-to-day focus..."
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">Key Responsibilities (One per line)</label>
            <textarea
              rows={3}
              value={responsibilitiesText}
              onChange={(e) => setResponsibilitiesText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">Qualifications / Requirements (One per line)</label>
            <textarea
              rows={3}
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">Perks & Benefits (One per line)</label>
            <textarea
              rows={3}
              value={benefitsText}
              onChange={(e) => setBenefitsText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary resize-none"
            />
          </div>
        </div>

        {/* Section 5: Publishing & Metadata */}
        <div className="p-6 rounded-3xl bg-surface border border-border-color shadow-card-subtle space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider text-brand-primary pb-2 border-b border-border-color">
            5. Application & Publishing Settings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Application Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">External Application URL (Optional)</label>
              <input
                type="url"
                value={applicationUrl}
                onChange={(e) => setApplicationUrl(e.target.value)}
                placeholder="https://company.com/apply (leave blank for native ATS)"
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Publication Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
              >
                <option value="published">Published (Live on Skillora)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="expired">Expired (Archived)</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2.5 text-xs font-bold text-text-primary cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-border-color text-brand-primary focus:ring-0 w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                  Mark as Featured Role
                </span>
              </label>
            </div>
          </div>
        </div>
      </form>

      {/* LIVE PREVIEW MODAL (Section 31) */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-border-color shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border-color mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-50 dark:bg-brand-900/30 px-2.5 py-0.5 rounded-full">
                  Skillora Public Preview
                </span>
                <h3 className="text-lg font-bold text-text-primary mt-1">Live Card Preview</h3>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-xs text-text-muted mb-3 font-medium">How this card will appear on the public Skillora website:</p>
              <JobCard job={previewJob} />
            </div>

            <div className="pt-4 border-t border-border-color flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface-2 text-text-primary text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
