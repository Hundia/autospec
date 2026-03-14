import React from 'react';
import Navigation from '../components/landing/Navigation';
import HeroSection from '../components/landing/HeroSection';
import EvolutionSection from '../components/landing/EvolutionSection';
import ContextPoisoningSection from '../components/landing/ContextPoisoningSection';
import BreakingPointSection from '../components/landing/BreakingPointSection';
import CostOfNoSpecsSection from '../components/landing/CostOfNoSpecsSection';
import QuickStartSection from '../components/landing/QuickStartSection';
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
        <QuickStartSection />
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
        <ToolsSection />
        <DocumentationSection />

        {/* Secondary CTA */}
        <section className="py-16 px-4 text-center bg-gradient-to-r from-blue-900/30 via-slate-900/50 to-purple-900/30 border-t border-white/5">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to make AI think before it codes?
          </h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">
            Get the template, add your requirements, and let AI generate the full architecture — specs, backlog, and docs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://github.com/Hundia/autospec-starter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
            >
              Get the Template
            </a>
            <a
              href="https://github.com/Hundia/autospec"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-all"
            >
              Star on GitHub
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
