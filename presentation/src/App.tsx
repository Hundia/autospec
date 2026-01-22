import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';

// Slide data
import { slidesEN } from './data/slides-en';
import { slidesHE } from './data/slides-he';

// Components
import TitleSlide from './components/TitleSlide';
import ProblemSlide from './components/ProblemSlide';
import SolutionSlide from './components/SolutionSlide';
import WorkflowSlide from './components/WorkflowSlide';
import RolesSlide from './components/RolesSlide';
import MultiAgentSlide from './components/MultiAgentSlide';
import BacklogSlide from './components/BacklogSlide';
import ExampleSlide from './components/ExampleSlide';
import ResultsSlide from './components/ResultsSlide';
import DemoSlide from './components/DemoSlide';
import ClosingSlide from './components/ClosingSlide';

const slideComponents = {
  title: TitleSlide,
  problem: ProblemSlide,
  solution: SolutionSlide,
  workflow: WorkflowSlide,
  roles: RolesSlide,
  multiagent: MultiAgentSlide,
  backlog: BacklogSlide,
  example: ExampleSlide,
  results: ResultsSlide,
  demo: DemoSlide,
  closing: ClosingSlide,
};

export default function App() {
  const [lang, setLang] = useState<'en' | 'he'>('en');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

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
      e.preventDefault();
      nextSlide();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isRTL]);

  const currentSlideData = slides[currentSlide];
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
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden"
    >
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

      {/* Slide Counter - opposite corner from language toggle */}
      <div className={`fixed top-4 z-50 text-sm text-white/60 ${isRTL ? 'right-4' : 'left-4'}`}>
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
          className="min-h-screen flex items-center justify-center p-8"
        >
          <SlideComponent data={currentSlideData} lang={lang} />
        </motion.div>
      </AnimatePresence>

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
        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentSlide ? 1 : -1);
                setCurrentSlide(idx);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide
                  ? 'bg-blue-500 w-8'
                  : 'bg-white/30 hover:bg-white/50 w-2'
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
