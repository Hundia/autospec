import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackgroundEffect from '../components/backgrounds/BackgroundEffects';

// Slide data
import { slidesEN } from '../data/slides-en';
import { slidesHE } from '../data/slides-he';

// Reused slide components
import TitleSlide from '../components/TitleSlide';
import EraTraditionalSlide from '../components/EraTraditionalSlide';
import EraAssistantSlide from '../components/EraAssistantSlide';
import EraAgenticSlide from '../components/EraAgenticSlide';
import ContextPoisoningSlide from '../components/ContextPoisoningSlide';
import SecondFeatureSlide from '../components/SecondFeatureSlide';
import SDDCostOfChaosSlide from '../components/SDDCostOfChaosSlide';
import BridgeSlide from '../components/BridgeSlide';
import SDDThreePillarsSlide from '../components/SDDThreePillarsSlide';
import SprintMemorySlide from '../components/SprintMemorySlide';
import OrchestratorSlide from '../components/OrchestratorSlide';
import ClosingSlide from '../components/ClosingSlide';
import FinalTaglineSlide from '../components/FinalTaglineSlide';
import PipelineSlide from '../components/pipeline/PipelineSlide';
import ScrollProgressBar from '../components/pipeline/ScrollProgressBar';

// New slide components
import PhilosophySlide from '../components/PhilosophySlide';
import NotVibeCodingSlide from '../components/NotVibeCodingSlide';
import SixStagesSlide from '../components/SixStagesSlide';
import HarnessSlide from '../components/HarnessSlide';
import SdlcRolesSlide from '../components/SdlcRolesSlide';
import ToolingSlide from '../components/ToolingSlide';
import AdoptionSlide from '../components/AdoptionSlide';
import AgenticFiveActsSlide from '../components/AgenticFiveActsSlide';
import SpecRotSlide from '../components/SpecRotSlide';
import OpenSpecSlide from '../components/OpenSpecSlide';
import DemoIntroSlide from '../components/DemoIntroSlide';

// Per-slide accent color — follows the deck's thermal identity
const slideAccent: Record<string, string> = {
  title: '#60a5fa',
  eraTraditional: '#94a3b8',
  eraAssistant: '#34d399',
  eraAgentic: '#fb923c',
  contextPoisoning: '#f59e0b',
  secondFeature: '#ef4444',
  sddCostOfChaos: '#22d3ee',
  bridge: '#2dd4bf',
  sddThreePillars: '#34d399',
  philosophy: '#a78bfa',
  notVibeCoding: '#2dd4bf',
  sixStages: '#60a5fa',
  agentic5Acts: '#60a5fa',
  harness: '#34d399',
  sdlcRoles: '#818cf8',
  pipeline: '#22d3ee',
  sprintMemorySlide: '#a78bfa',
  orchestrator: '#818cf8',
  specRot: '#f59e0b',
  tooling: '#2dd4bf',
  adoption: '#34d399',
  closing: '#a78bfa',
  openSpecWhat: '#2dd4bf',
  openSpecAnatomy: '#22d3ee',
  demoIntro: '#34d399',
  finalTagline: '#60a5fa',
};

interface ZapMenuProps {
  lang: 'en' | 'he';
  setLang: (l: 'en' | 'he') => void;
  accentColor: string;
  isRTL: boolean;
}

function ZapMenu({ lang, setLang, accentColor, isRTL }: ZapMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {/* ── Lightning bolt button ── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="relative w-11 h-11 rounded-full flex items-center justify-center bg-slate-900/75 backdrop-blur-sm cursor-pointer"
        aria-label="Open menu"
        style={{ border: `1.5px solid ${accentColor}50` }}
      >
        {/* Pulsing outer glow */}
        <motion.span
          className="absolute inset-[-3px] rounded-full pointer-events-none"
          animate={{ opacity: [0.35, 0.85, 0.35] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ boxShadow: `0 0 14px ${accentColor}75, 0 0 30px ${accentColor}35` }}
        />
        {/* Radial inner glow disc */}
        <span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${accentColor}25 0%, transparent 68%)` }}
        />
        {/* Bolt icon — stroke follows animated color; fill toggles on open */}
        <motion.span
          animate={{ color: accentColor }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="relative z-10 flex items-center justify-center"
        >
          <Zap
            size={19}
            strokeWidth={2.2}
            fill={open ? accentColor : 'none'}
            className="transition-all duration-200"
          />
        </motion.span>
      </motion.button>

      {/* ── Drop-down menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: -6 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={`absolute top-[54px] ${isRTL ? 'left-0' : 'right-0'} w-44 rounded-2xl overflow-hidden`}
            style={{
              background: 'rgba(10, 15, 30, 0.96)',
              backdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: `0 18px 52px rgba(0,0,0,0.60), 0 0 28px ${accentColor}20`,
            }}
          >
            {/* Language toggle */}
            <div className="p-2 flex gap-1.5">
              {(['en', 'he'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setOpen(false); }}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold transition-colors duration-150"
                  style={
                    lang === l
                      ? { background: `${accentColor}25`, color: accentColor, border: `1px solid ${accentColor}48` }
                      : { color: 'rgba(255,255,255,0.38)', border: '1px solid transparent' }
                  }
                >
                  {l === 'en' ? 'EN' : 'עב'}
                </button>
              ))}
            </div>

            <div className="mx-3 h-px" style={{ background: 'rgba(255,255,255,0.09)' }} />

            {/* Go Home */}
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-white/55 hover:text-white hover:bg-white/5 transition-colors duration-150"
            >
              <Home size={14} />
              <span>{isRTL ? 'עמוד הבית' : 'Go Home'}</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const slideComponents = {
  title: TitleSlide,
  eraTraditional: EraTraditionalSlide,
  eraAssistant: EraAssistantSlide,
  eraAgentic: EraAgenticSlide,
  contextPoisoning: ContextPoisoningSlide,
  secondFeature: SecondFeatureSlide,
  sddCostOfChaos: SDDCostOfChaosSlide,
  bridge: BridgeSlide,
  sddThreePillars: SDDThreePillarsSlide,
  philosophy: PhilosophySlide,
  notVibeCoding: NotVibeCodingSlide,
  sixStages: SixStagesSlide,
  agentic5Acts: AgenticFiveActsSlide,
  harness: HarnessSlide,
  sdlcRoles: SdlcRolesSlide,
  pipeline: PipelineSlide,
  sprintMemorySlide: SprintMemorySlide,
  orchestrator: OrchestratorSlide,
  specRot: SpecRotSlide,
  tooling: ToolingSlide,
  adoption: AdoptionSlide,
  closing: ClosingSlide,
  openSpecWhat: OpenSpecSlide,
  openSpecAnatomy: OpenSpecSlide,
  demoIntro: DemoIntroSlide,
  finalTagline: FinalTaglineSlide,
};

export default function PresentationPage() {
  const [lang, setLang] = useState<'en' | 'he'>('en');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const slides = lang === 'en' ? slidesEN : slidesHE;
  const isRTL = lang === 'he';

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentSlide]);

  const currentSlideData = slides[currentSlide];
  const isScrollable = !!(currentSlideData as any).scrollable;
  const SlideComponent = slideComponents[currentSlideData.type as keyof typeof slideComponents];
  const accentColor = slideAccent[currentSlideData.type] ?? '#60a5fa';

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
      className={`relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white ${isScrollable ? 'h-screen overflow-y-auto overflow-x-hidden' : 'min-h-screen overflow-hidden'}`}
    >
      {/* Floating Grid keyframe */}
      <style>{`@keyframes floatingGrid { 0% { background-position: 0 0; } 100% { background-position: 40px 40px; } }`}</style>

      {/* Animated Background */}
      <BackgroundEffect activeId="particles" />

      {/* Lightning bolt nav menu */}
      <div className={`fixed top-4 z-50 ${isRTL ? 'left-4' : 'right-4'}`}>
        <ZapMenu lang={lang} setLang={setLang} accentColor={accentColor} isRTL={isRTL} />
      </div>

      {/* Slide Counter */}
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
          <SlideComponent
            data={currentSlideData as any}
            lang={lang}
            onNavigateTo={(type: string) => {
              const targetIdx = slides.findIndex((s: any) => s.type === type);
              if (targetIdx !== -1) {
                setDirection(targetIdx > currentSlide ? 1 : -1);
                setCurrentSlide(targetIdx);
              }
            }}
          />
        </motion.div>
      </AnimatePresence>

      <ScrollProgressBar containerRef={scrollRef} visible={isScrollable} />

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
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

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors"
          aria-label={isRTL ? 'הקודם' : 'Next'}
        >
          {isRTL ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>

      {/* Trademark */}
      <div className={`fixed bottom-4 text-xs text-white/30 ${isRTL ? 'right-4' : 'left-4'}`}>
        The Agentic SDLC · AutoSpec™ by Eli Hundia
      </div>

      {/* Keyboard hint */}
      <div className={`fixed bottom-4 text-xs text-white/40 ${isRTL ? 'left-4' : 'right-4'}`}>
        {lang === 'en' ? '← → to navigate' : '← → לניווט'}
      </div>
    </div>
  );
}
