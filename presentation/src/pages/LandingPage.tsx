import React from 'react';
import Navigation from '../components/landing/Navigation';
import HeroSection from '../components/landing/HeroSection';
import EvolutionSection from '../components/landing/EvolutionSection';
import ContextPoisoningSection from '../components/landing/ContextPoisoningSection';
import BreakingPointSection from '../components/landing/BreakingPointSection';
import CostOfNoSpecsSection from '../components/landing/CostOfNoSpecsSection';
import ThreePillarsSection from '../components/landing/ThreePillarsSection';
import RolesSection from '../components/landing/RolesSection';
import SprintMemorySection from '../components/landing/SprintMemorySection';
import PipelineSection from '../components/landing/PipelineSection';
import OrchestratorSection from '../components/landing/OrchestratorSection';
import QASection from '../components/landing/QASection';
import ViewerSection from '../components/landing/ViewerSection';
import FinOpsSection from '../components/landing/FinOpsSection';
import StatsSection from '../components/landing/StatsSection';
import CompetitiveSection from '../components/landing/CompetitiveSection';
import CaseStudiesSection from '../components/landing/CaseStudiesSection';
import FutureVisionSection from '../components/landing/FutureVisionSection';
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
        <EvolutionSection />
        <ContextPoisoningSection />
        <BreakingPointSection />
        <CostOfNoSpecsSection />
        <ThreePillarsSection />
        <RolesSection />
        <SprintMemorySection />
        <PipelineSection />
        <OrchestratorSection />
        <QASection />
        <ViewerSection />
        <FinOpsSection />
        <StatsSection />
        <CompetitiveSection />
        <CaseStudiesSection />
        <FutureVisionSection />
        <QuickStartSection />
        <ToolsSection />
        <DocumentationSection />
      </main>
      <Footer />
    </div>
  );
}
