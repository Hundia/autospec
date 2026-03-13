import React from 'react';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import PaperHeroSection from '../components/paper/PaperHeroSection';
import MethodologySection from '../components/paper/MethodologySection';
import RoleModelSection from '../components/paper/RoleModelSection';
import MultiAgentSection from '../components/paper/MultiAgentSection';
import PaperFinOpsSection from '../components/paper/PaperFinOpsSection';
import CaseStudiesSection from '../components/paper/CaseStudiesSection';
import ResultsConclusionSection from '../components/paper/ResultsConclusionSection';

export default function PaperPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navigation />
      <main>
        <PaperHeroSection />
        <MethodologySection />
        <RoleModelSection />
        <MultiAgentSection />
        <PaperFinOpsSection />
        <CaseStudiesSection />
        <ResultsConclusionSection />
      </main>
      <Footer />
    </div>
  );
}
