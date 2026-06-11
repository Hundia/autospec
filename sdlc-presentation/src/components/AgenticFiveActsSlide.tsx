import React from 'react';
import { motion } from 'framer-motion';
import TerminalVisualization from './pipeline/TerminalVisualization';
import SpecGridVisualization from './pipeline/SpecGridVisualization';
import SkillsVisualization from './pipeline/SkillsVisualization';
import WorktreeDiagram from './pipeline/WorktreeDiagram';
import QALoopVisualization from './pipeline/QALoopVisualization';
import SprintSummaryVisualization from './pipeline/SprintSummaryVisualization';

interface Phase {
  number: string;
  name: string;
  tagline: string;
  stageRef: string;
  owners: string[];
  hero: boolean;
  accent: string;
  bullets: string[];
  output: string;
}

interface AgenticFiveActsSlideProps {
  data: {
    title: string;
    subtitle: string;
    closingCallout: string;
    keyInsight?: { headline: string; body: string };
    phases: Phase[];
  };
  lang: 'en' | 'he';
}

const vizMap: Record<string, React.FC<{ lang: 'en' | 'he' }>> = {
  '1': TerminalVisualization,
  '2': SpecGridVisualization,
  '3': SkillsVisualization,
  '4': WorktreeDiagram,
  '5': QALoopVisualization,
  '6': SprintSummaryVisualization,
};

const accentMap: Record<string, {
  text: string;
  border: string;
  bg: string;
  badge: string;
  heroRing: string;
  bullet: string;
}> = {
  blue: {
    text: 'text-blue-400',
    border: 'border-blue-500/25',
    bg: 'bg-blue-500/5',
    badge: 'bg-blue-500/20 text-blue-300',
    heroRing: '',
    bullet: 'text-blue-400',
  },
  violet: {
    text: 'text-violet-400',
    border: 'border-violet-500/25',
    bg: 'bg-violet-500/5',
    badge: 'bg-violet-500/20 text-violet-300',
    heroRing: '',
    bullet: 'text-violet-400',
  },
  emerald: {
    text: 'text-emerald-400',
    border: 'border-emerald-500/25',
    bg: 'bg-emerald-500/5',
    badge: 'bg-emerald-500/20 text-emerald-300',
    heroRing: '',
    bullet: 'text-emerald-400',
  },
  indigo: {
    text: 'text-indigo-400',
    border: 'border-indigo-500/35',
    bg: 'bg-indigo-500/10',
    badge: 'bg-indigo-500/20 text-indigo-300',
    heroRing: 'ring-1 ring-inset ring-indigo-500/20',
    bullet: 'text-indigo-400',
  },
  cyan: {
    text: 'text-cyan-400',
    border: 'border-cyan-500/25',
    bg: 'bg-cyan-500/5',
    badge: 'bg-cyan-500/20 text-cyan-300',
    heroRing: '',
    bullet: 'text-cyan-400',
  },
  teal: {
    text: 'text-teal-400',
    border: 'border-teal-500/35',
    bg: 'bg-teal-500/10',
    badge: 'bg-teal-500/20 text-teal-300',
    heroRing: 'ring-1 ring-inset ring-teal-500/20',
    bullet: 'text-teal-400',
  },
  orange: {
    text: 'text-orange-400',
    border: 'border-orange-500/25',
    bg: 'bg-orange-500/5',
    badge: 'bg-orange-500/20 text-orange-300',
    heroRing: '',
    bullet: 'text-orange-400',
  },
};

function SteeringLoop({ isRTL }: { isRTL: boolean }) {
  const steps = isRTL
    ? [
        { icon: '📡', label: 'ניטור' },
        { icon: '📊', label: 'זיהוי סטייה' },
        { icon: '⚡', label: 'בולט תיקון' },
        { icon: '✅', label: 'בהתאמה ל-Spec' },
      ]
    : [
        { icon: '📡', label: 'Monitor' },
        { icon: '📊', label: 'Detect Drift' },
        { icon: '⚡', label: 'Correction Bolt' },
        { icon: '✅', label: 'Back to Spec' },
      ];

  return (
    <div className="bg-slate-800/60 rounded-xl border border-orange-500/20 p-5 max-w-lg">
      <div className="text-xs font-mono text-white/40 mb-4 tracking-wide uppercase">
        {isRTL ? 'לולאת התיקון העצמי' : 'The Self-Correction Loop'}
      </div>
      <div className="flex items-center gap-2 flex-wrap mb-4">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <span className="text-xs bg-slate-700/80 rounded-lg px-3 py-2 text-white/70 font-medium flex items-center gap-1.5">
              <span>{step.icon}</span>
              <span>{step.label}</span>
            </span>
            {i < steps.length - 1 && (
              <span className="text-white/20 text-sm">→</span>
            )}
          </React.Fragment>
        ))}
        <span className="text-orange-400/60 text-lg font-bold ml-1">↺</span>
      </div>
      <div className="text-xs text-orange-400/70 font-mono">
        {isRTL
          ? 'הלולאה לעולם לא נגמרת — סטייה הופכת לבולט חדש'
          : 'The loop never ends — drift becomes a new Bolt'}
      </div>
    </div>
  );
}

export default function AgenticFiveActsSlide({ data, lang }: AgenticFiveActsSlideProps) {
  const isRTL = lang === 'he';

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Cinematic intro screen */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-[11px] font-mono tracking-[0.35em] text-white/35 uppercase mb-5"
        >
          {isRTL ? 'שבעה שלבים · לולאה שלמה' : 'Seven Phases · One Complete Loop'}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl sm:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-violet-400 to-teal-400 bg-clip-text text-transparent leading-tight pb-2"
        >
          {data.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-lg sm:text-xl text-white/60 max-w-2xl mb-14 leading-relaxed"
        >
          {data.subtitle}
        </motion.p>

        {/* Phase roadmap — 2-column vertical timeline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-2xl mb-14"
        >
          <div className="grid grid-cols-2 gap-x-8 sm:gap-x-14 text-left">
            {/* Left column: phases 1–4 */}
            <div className="relative">
              <div
                className="absolute left-[11px] top-3 bottom-8 w-px pointer-events-none"
                style={{ background: 'linear-gradient(180deg, #60a5fa 0%, #a78bfa 33%, #34d399 66%, #818cf8 100%)' }}
              />
              {data.phases.slice(0, 4).map((phase, idx) => {
                const colors = accentMap[phase.accent] || accentMap.blue;
                return (
                  <motion.div
                    key={phase.number}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + idx * 0.09 }}
                    className={`relative flex items-start gap-3 ${idx < 3 ? 'mb-4' : ''}`}
                  >
                    <div className={`relative z-10 shrink-0 flex items-center justify-center rounded-full mt-0.5
                      ${phase.hero
                        ? `w-[26px] h-[26px] border-2 ${colors.border} ${colors.bg}`
                        : `w-[22px] h-[22px] border ${colors.border} bg-slate-950`}`}>
                      <span className={`font-mono font-black text-[9px] ${colors.text}`}>{phase.number}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className={`font-black leading-snug tracking-wide ${colors.text}
                        ${phase.hero ? 'text-[11px] sm:text-xs' : 'text-[10px] sm:text-[11px]'}`}>
                        {phase.name}
                      </span>
                      {phase.hero && (
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-sm ${colors.badge} font-mono tracking-wide w-fit`}>
                          {isRTL ? '★ שיא' : '★ KEY'}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              {/* Continues-to-right hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.05 }}
                className="mt-3 ml-1 text-[9px] font-mono text-white/15 tracking-widest"
              >
                {isRTL ? '← ממשיך' : 'continues →'}
              </motion.div>
            </div>

            {/* Right column: phases 5–7 + loop */}
            <div className="relative mt-6 sm:mt-8">
              <div
                className="absolute left-[11px] top-3 bottom-8 w-px pointer-events-none"
                style={{ background: 'linear-gradient(180deg, #22d3ee 0%, #2dd4bf 50%, #fb923c 100%)' }}
              />
              {data.phases.slice(4).map((phase, idx) => {
                const colors = accentMap[phase.accent] || accentMap.blue;
                return (
                  <motion.div
                    key={phase.number}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.95 + idx * 0.09 }}
                    className={`relative flex items-start gap-3 ${idx < 2 ? 'mb-4' : ''}`}
                  >
                    <div className={`relative z-10 shrink-0 flex items-center justify-center rounded-full mt-0.5
                      ${phase.hero
                        ? `w-[26px] h-[26px] border-2 ${colors.border} ${colors.bg}`
                        : `w-[22px] h-[22px] border ${colors.border} bg-slate-950`}`}>
                      <span className={`font-mono font-black text-[9px] ${colors.text}`}>{phase.number}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className={`font-black leading-snug tracking-wide ${colors.text}
                        ${phase.hero ? 'text-[11px] sm:text-xs' : 'text-[10px] sm:text-[11px]'}`}>
                        {phase.name}
                      </span>
                      {phase.hero && (
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-sm ${colors.badge} font-mono tracking-wide w-fit`}>
                          {isRTL ? '★ שיא' : '★ KEY'}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              {/* Loop indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="flex items-center gap-2 mt-3 ml-1"
              >
                <span className="text-white/25 text-sm leading-none">↺</span>
                <span className="text-[9px] font-mono text-white/20 tracking-[0.25em] uppercase">
                  {isRTL ? 'לולאה רציפה' : 'continuous loop'}
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="flex flex-col items-center gap-2 text-white/35"
        >
          <span className="text-sm">{isRTL ? 'גלול דרך השלבים' : 'Scroll through the phases'}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-2xl"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>

      {/* ── THE SEVEN PHASES ── */}
      {data.phases.map((phase) => {
        const colors = accentMap[phase.accent] || accentMap.blue;
        const VizComponent = vizMap[phase.number];

        return (
          <motion.section
            key={phase.number}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.5 }}
            className={`relative min-h-[85vh] flex flex-col justify-center px-6 py-16 border-t ${
              phase.hero
                ? `${colors.border} ${colors.bg} ${colors.heroRing}`
                : 'border-white/5'
            }`}
          >
            {/* Watermark phase number */}
            <div className="absolute inset-0 flex items-center justify-end pr-4 sm:pr-12 pointer-events-none select-none overflow-hidden">
              <span
                className={`text-[18vw] font-black ${colors.text}`}
                style={{ opacity: 0.022, lineHeight: 1 }}
              >
                {phase.number}
              </span>
            </div>

            {/* Phase label row */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="flex items-center gap-3 mb-3 flex-wrap"
            >
              <span className={`text-[10px] font-mono tracking-[0.3em] ${colors.text} uppercase`}>
                {isRTL ? 'שלב' : 'Phase'} {phase.number}
              </span>
              <span className="text-white/15">·</span>
              <span className="text-[11px] text-white/35 font-mono">{phase.stageRef}</span>
              {phase.hero && (
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full ${colors.badge} font-semibold tracking-wide`}>
                  {isRTL ? '★ שלב מפתח' : '★ KEY PHASE'}
                </span>
              )}
            </motion.div>

            {/* Phase name */}
            <motion.h3
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`font-black mb-3 tracking-tight ${colors.text} ${
                phase.hero ? 'text-5xl sm:text-6xl' : 'text-4xl sm:text-5xl'
              }`}
            >
              {phase.name}
            </motion.h3>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className={`text-white/65 italic mb-5 max-w-2xl leading-relaxed ${
                phase.hero ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
              }`}
            >
              "{phase.tagline}"
            </motion.p>

            {/* Owners */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 flex-wrap mb-8"
            >
              <span className="text-[11px] text-white/30 font-mono uppercase tracking-wider">
                {isRTL ? 'אחראים:' : 'Owners:'}
              </span>
              {phase.owners.map((owner) => (
                <span
                  key={owner}
                  className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-medium"
                >
                  {owner}
                </span>
              ))}
            </motion.div>

            {/* Body: bullets + visualization */}
            <div className={`grid gap-8 items-start ${VizComponent || phase.number === '7' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
              {/* Left: bullets + output */}
              <div>
                <ul className="space-y-2.5 mb-7">
                  {phase.bullets.map((bullet, bIdx) => (
                    <motion.li
                      key={bIdx}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.25 + bIdx * 0.06 }}
                      className="flex items-start gap-2.5 text-sm text-white/70 leading-relaxed"
                    >
                      <span className={`mt-1 shrink-0 text-xs ${colors.bullet}`}>▸</span>
                      <span>{bullet}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-lg border ${colors.border} ${colors.bg}`}
                >
                  <span className="text-[11px] text-white/40 font-mono uppercase tracking-wider">
                    {isRTL ? 'פלט:' : 'Output'}
                  </span>
                  <span className={`text-sm font-mono font-semibold ${colors.text}`}>{phase.output}</span>
                </motion.div>
              </div>

              {/* Right: visualization */}
              {VizComponent && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <VizComponent lang={lang} />
                </motion.div>
              )}

              {phase.number === '7' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <SteeringLoop isRTL={isRTL} />
                </motion.div>
              )}
            </div>
          </motion.section>
        );
      })}

      {/* Key Insight callout */}
      {data.keyInsight && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mx-6 my-8 bg-amber-500/5 border border-amber-500/30 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl shrink-0 mt-0.5">⚠️</span>
            <div>
              <h4 className="text-amber-400 font-black text-lg mb-2 tracking-tight">
                {data.keyInsight.headline}
              </h4>
              <p className="text-white/65 text-sm leading-relaxed">
                {data.keyInsight.body}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Closing callout */}
      <div className="min-h-[50vh] flex items-center justify-center px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-3xl text-center"
        >
          <div className="text-4xl mb-6">🎬</div>
          <p className="text-xl sm:text-2xl text-white/80 italic font-light leading-relaxed">
            "{data.closingCallout}"
          </p>
        </motion.div>
      </div>
    </div>
  );
}
