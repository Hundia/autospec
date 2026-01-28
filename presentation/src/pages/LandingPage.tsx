import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/landing/Navigation';
import HeroSection from '../components/landing/HeroSection';
import ProblemSolutionSection from '../components/landing/ProblemSolutionSection';
import QuickStartSection from '../components/landing/QuickStartSection';
import RolesSection from '../components/landing/RolesSection';
import StatsSection from '../components/landing/StatsSection';
import CaseStudiesSection from '../components/landing/CaseStudiesSection';
import DocumentationSection from '../components/landing/DocumentationSection';
import ToolsSection from '../components/landing/ToolsSection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navigation />

      <main>
        <HeroSection />
        <ProblemSolutionSection />
        <QuickStartSection />
        <RolesSection />
        <StatsSection />
        <CaseStudiesSection />
        <ToolsSection />
        <DocumentationSection />
      </main>

      <Footer />
    </div>
  );
}
