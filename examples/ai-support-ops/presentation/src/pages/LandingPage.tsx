import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github } from 'lucide-react';
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

function SecondaryCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 rounded-2xl p-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to make AI think before it codes?
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8">
            Get the template, add your requirements, and let your AI generate everything.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#quickstart"
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
            >
              Get the Template
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="https://github.com/Hundia/autospec"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-all"
            >
              <Github size={18} />
              Star on GitHub
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

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
        <SecondaryCTA />
      </main>
      <Footer />
    </div>
  );
}
