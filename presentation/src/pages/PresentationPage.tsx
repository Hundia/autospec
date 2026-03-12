import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Globe, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

// Slide data
import { slidesEN } from '../data/slides-en';
import { slidesHE } from '../data/slides-he';

// Components
import TitleSlide from '../components/TitleSlide';
import ThreeErasSlide from '../components/ThreeErasSlide';
import ContextPoisoningSlide from '../components/ContextPoisoningSlide';
import ReverseTaxSlide from '../components/ReverseTaxSlide';
import BreakingPointSlide from '../components/BreakingPointSlide';
import BridgeSlide from '../components/BridgeSlide';
import SolutionSlide from '../components/SolutionSlide';
import SDDCostOfChaosSlide from '../components/SDDCostOfChaosSlide';
import WorkflowSlide from '../components/WorkflowSlide';
import PipelineSlide from '../components/pipeline/PipelineSlide';
import ScrollProgressBar from '../components/pipeline/ScrollProgressBar';
import RolesSlide from '../components/RolesSlide';
import OrchestratorSlide from '../components/OrchestratorSlide';
import ModelOptimizationSlide from '../components/ModelOptimizationSlide';
import ViewerSlide from '../components/ViewerSlide';
import ExampleSlide from '../components/ExampleSlide';
import ResultsSlide from '../components/ResultsSlide';
import DemoSlide from '../components/DemoSlide';
import FutureWaterfallSlide from '../components/FutureWaterfallSlide';
import FutureMonolithSlide from '../components/FutureMonolithSlide';
import ClosingSlide from '../components/ClosingSlide';
import FinalTaglineSlide from '../components/FinalTaglineSlide';

const slideComponents = {
  title: TitleSlide,
  threeEras: ThreeErasSlide,
  contextPoisoning: ContextPoisoningSlide,
  reverseTax: ReverseTaxSlide,
  breakingPoint: BreakingPointSlide,
  bridge: BridgeSlide,
  sddCostOfChaos: SDDCostOfChaosSlide,
  solution: SolutionSlide,
  workflow: WorkflowSlide,
  pipeline: PipelineSlide,
  roles: RolesSlide,
  orchestrator: OrchestratorSlide,
  modelOptimization: ModelOptimizationSlide,
  viewer: ViewerSlide,
  example: ExampleSlide,
  results: ResultsSlide,
  demo: DemoSlide,
  futureWaterfall: FutureWaterfallSlide,
  futureMonolith: FutureMonolithSlide,
  closing: ClosingSlide,
  finalTagline: FinalTaglineSlide,
};

export default function PresentationPage() {
  const [lang, setLang] = useState<'en' | 'he'>('en');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const slides = lang === 'en' ? slidesEN : slidesHE;
  const isRTL = lang === 'he';

  // Go to next slide (forward in presentation)
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    }
  };

  // Go to previous slide (backward in presentation)
  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Handle keyboard navigation
  // In RTL: Right arrow = back, Left arrow = forward
  // In LTR: Right arrow = forward, Left arrow = back
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      if (isRTL) {
        prevSlide();
      } else {
        nextSlide();
      }
    } else if (e.key === 'ArrowLeft') {
      if (isRTL) {
        nextSlide();
      } else {
        prevSlide();
      }
    } else if (e.key === ' ') {
      const isScrollable = !!(slides[currentSlide] as any).scrollable;
      if (!isScrollable) {
        e.preventDefault();
        nextSlide();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isRTL]);

  // Reset scroll position when slide changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentSlide]);

  const currentSlideData = slides[currentSlide];
  const isScrollable = !!(currentSlideData as any).scrollable;
  const SlideComponent = slideComponents[currentSlideData.type as keyof typeof slideComponents];

  // Animation variants based on direction and RTL
  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir * (isRTL ? -100 : 100),
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir * (isRTL ? 100 : -100),
    }),
  };

  return (
    <div
      ref={scrollRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white ${isScrollable ? 'h-screen overflow-y-auto overflow-x-hidden' : 'min-h-screen overflow-hidden'}`}
    >
      {/* Back to Home */}
      <Link
        to="/"
        className={`fixed top-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors ${
          isRTL ? 'right-4' : 'left-4'
        }`}
      >
        <Home size={18} />
        <span className="text-sm">Home</span>
      </Link>

      {/* Language Toggle - always in top corner */}
      <button
        onClick={() => setLang(lang === 'en' ? 'he' : 'en')}
        className={`fixed top-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors ${
          isRTL ? 'left-4' : 'right-4'
        }`}
      >
        <Globe size={18} />
        <span>{lang === 'en' ? 'עברית' : 'English'}</span>
      </button>

      {/* Slide Counter - center top */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 text-sm text-white/60">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${lang}-${currentSlide}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`min-h-screen ${isScrollable ? 'pt-16' : 'flex items-center justify-center'} p-8`}
        >
          <SlideComponent data={currentSlideData} lang={lang} />
        </motion.div>
      </AnimatePresence>

      <ScrollProgressBar containerRef={scrollRef} visible={isScrollable} />

      {/* Navigation - centered at bottom */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        {/* Previous button (left in LTR, right in RTL) */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors"
          aria-label={isRTL ? 'הבא' : 'Previous'}
        >
          {isRTL ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>

        {/* Progress Dots */}
        <div className={`flex gap-1 sm:gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentSlide ? 1 : -1);
                setCurrentSlide(idx);
              }}
              className={`rounded-full transition-all ${
                idx === currentSlide
                  ? 'bg-blue-500 w-4 sm:w-8 h-1.5 sm:h-2'
                  : 'bg-white/30 hover:bg-white/50 w-1.5 sm:w-2 h-1.5 sm:h-2'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next button (right in LTR, left in RTL) */}
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors"
          aria-label={isRTL ? 'הקודם' : 'Next'}
        >
          {isRTL ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>

      {/* Keyboard hint */}
      <div className={`fixed bottom-4 text-xs text-white/40 ${isRTL ? 'left-4' : 'right-4'}`}>
        {lang === 'en' ? '← → to navigate' : '← → לניווט'}
      </div>
    </div>
  );
}
