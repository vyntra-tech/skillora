import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Hero } from '../components/home/Hero';
import { QuickCategories } from '../components/home/QuickCategories';
import { LatestJobs } from '../components/home/LatestJobs';
import { ClosingSoon } from '../components/home/ClosingSoon';
import { FeaturedCompanies } from '../components/home/FeaturedCompanies';
import { InternshipsSection } from '../components/home/InternshipsSection';
import { CareerPrep } from '../components/home/CareerPrep';
import { CareerToolsSection } from '../components/home/CareerToolsSection';
import { CareerInsights } from '../components/home/CareerInsights';
import { BrowseCities } from '../components/home/BrowseCities';
import { BrowseCategories } from '../components/home/BrowseCategories';
import { StatisticsSection } from '../components/home/StatisticsSection';
import { FaqSection } from '../components/home/FaqSection';
import { CtaSection } from '../components/home/CtaSection';
import {
  jobService,
  companyService,
  internshipService,
  categoryService,
  locationService,
  batchService,
  articleService,
  toolService,
  faqService,
  settingService,
} from '../services/api';

export const HomePage: React.FC = () => {
  // TanStack Queries for completely dynamic backend data
  const { data: categoriesData, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  });

  const { data: locationsData, isLoading: locLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationService.getLocations(),
  });

  const { data: batchesData } = useQuery({
    queryKey: ['batches'],
    queryFn: () => batchService.getBatches(),
  });

  const { data: latestJobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['latestJobs'],
    queryFn: () => jobService.getJobs({ limit: 9 }),
  });

  const { data: closingSoonData, isLoading: closingLoading } = useQuery({
    queryKey: ['closingSoonJobs'],
    queryFn: () => jobService.getClosingSoonJobs(6),
  });

  const { data: companiesData, isLoading: compLoading } = useQuery({
    queryKey: ['featuredCompanies'],
    queryFn: () => companyService.getCompanies({ featured: 'true', limit: 8 }),
  });

  const { data: internshipsData, isLoading: internLoading } = useQuery({
    queryKey: ['latestInternships'],
    queryFn: () => internshipService.getInternships({ limit: 6 }),
  });

  const { data: toolsData, isLoading: toolsLoading } = useQuery({
    queryKey: ['careerTools'],
    queryFn: () => toolService.getTools(),
  });

  const { data: articlesData, isLoading: articlesLoading } = useQuery({
    queryKey: ['careerArticles'],
    queryFn: () => articleService.getArticles({ limit: 3 }),
  });

  const { data: faqsData, isLoading: faqsLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => faqService.getFaqs(),
  });

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingService.getSettings(),
  });

  const categories = categoriesData?.data || [];
  const locations = locationsData?.data || [];
  const batches = batchesData?.data || [];
  const latestJobs = latestJobsData?.data || [];
  const closingJobs = closingSoonData?.data || [];
  const featuredCompanies = companiesData?.data || [];
  const internships = internshipsData?.data || [];
  const tools = toolsData?.data || [];
  const articles = articlesData?.data || [];
  const faqs = faqsData?.data || [];
  const settings = settingsData?.data || null;

  return (
    <div className="min-h-screen">
      <Hero categories={categories} locations={locations} batches={batches} />
      <QuickCategories categories={categories} isLoading={catLoading} />
      <LatestJobs jobs={latestJobs} isLoading={jobsLoading} />
      <ClosingSoon jobs={closingJobs} isLoading={closingLoading} />
      <FeaturedCompanies companies={featuredCompanies} isLoading={compLoading} />
      <InternshipsSection internships={internships} isLoading={internLoading} />
      <CareerPrep />
      <CareerToolsSection tools={tools} isLoading={toolsLoading} />
      <CareerInsights articles={articles} isLoading={articlesLoading} />
      <BrowseCities locations={locations} isLoading={locLoading} />
      <BrowseCategories categories={categories} isLoading={catLoading} />
      <StatisticsSection settings={settings} />
      <FaqSection faqs={faqs} isLoading={faqsLoading} />
      <CtaSection />
    </div>
  );
};
