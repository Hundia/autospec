import React from 'react';
import Navigation from '../components/landing/Navigation';
import HeroSection from '../components/landing/HeroSection';
import ProblemSection from '../components/landing/ProblemSection';
import ThreePillarsSection from '../components/landing/ThreePillarsSection';
import PipelineSection from '../components/landing/PipelineSection';
import ViewerSection from '../components/landing/ViewerSection';
import QuickStartSection from '../components/landing/QuickStartSection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <ThreePillarsSection />
        <PipelineSection />
        <ViewerSection />
        <QuickStartSection />
      </main>
      <Footer />
    </div>
  );
}
