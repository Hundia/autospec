import React from 'react';
import Navigation from '../components/landing/Navigation';
import HeroSection from '../components/landing/HeroSection';
import ProblemSolutionSection from '../components/landing/ProblemSolutionSection';
import CompetitiveSection from '../components/landing/CompetitiveSection';
import RolesSection from '../components/landing/RolesSection';
import SprintMemorySection from '../components/landing/SprintMemorySection';
import ViewerSection from '../components/landing/ViewerSection';
import FinOpsSection from '../components/landing/FinOpsSection';
import StatsSection from '../components/landing/StatsSection';
import CaseStudiesSection from '../components/landing/CaseStudiesSection';
import QuickStartSection from '../components/landing/QuickStartSection';
import ToolsSection from '../components/landing/ToolsSection';
import DocumentationSection from '../components/landing/DocumentationSection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSolutionSection />
        <CompetitiveSection />
        <RolesSection />
        <SprintMemorySection />
        <ViewerSection />
        <FinOpsSection />
        <StatsSection />
        <CaseStudiesSection />
        <QuickStartSection />
        <ToolsSection />
        <DocumentationSection />
      </main>
      <Footer />
    </div>
  );
}
