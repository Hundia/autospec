import React from 'react';
import { motion } from 'framer-motion';

interface Phase {
  number: string;
  emoji: string;
  name: string;
  timeline?: string;
  win?: string;
  milestone?: string;
  bullets: string[];
  accent: string;
}

interface Metric {
  icon: string;
  title: string;
  items: string[];
  accent: string;
}

interface AdoptionSlideProps {
  data: {
    title: string;
    subtitle: string;
    phases: Phase[];
    metricsTitle: string;
    metrics: Metric[];
    closingQuote: string;
    closingSource: string;
  };
  lang: 'en' | 'he';
}

const accentColors: Record<string, {
  border: string;
  bg: string;
  text: string;
  badge: string;
  stripe: string;
  milestoneBar: string;
}> = {
  blue:    { border: 'border-blue-500/30',    bg: 'bg-blue-500/8',    text: 'text-blue-400',    badge: 'bg-blue-500/20 text-blue-300',    stripe: 'bg-blue-500',    milestoneBar: 'border-blue-500/40 bg-blue-500/10' },
  violet:  { border: 'border-violet-500/30',  bg: 'bg-violet-500/8',  text: 'text-violet-400',  badge: 'bg-violet-500/20 text-violet-300',  stripe: 'bg-violet-500',  milestoneBar: 'border-violet-500/40 bg-violet-500/10' },
  emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/8', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300', stripe: 'bg-emerald-500', milestoneBar: 'border-emerald-500/40 bg-emerald-500/10' },
  amber:   { border: 'border-amber-500/30',   bg: 'bg-amber-500/8',   text: 'text-amber-400',   badge: 'bg-amber-500/20 text-amber-300',   stripe: 'bg-amber-500',   milestoneBar: 'border-amber-500/40 bg-amber-500/10' },
  teal:    { border: 'border-teal-500/30',    bg: 'bg-teal-500/8',    text: 'text-teal-400',    badge: 'bg-teal-500/20 text-teal-300',    stripe: 'bg-teal-500',    milestoneBar: 'border-teal-500/40 bg-teal-500/10' },
  green:   { border: 'border-green-500/30',   bg: 'bg-green-500/8',   text: 'text-green-400',   badge: 'bg-green-500/20 text-green-300',   stripe: 'bg-green-500',   milestoneBar: 'border-green-500/40 bg-green-500/10' },
};

const metricAccent: Record<string, { border: string; bg: string; text: string }> = {
  blue:   { border: 'border-blue-500/25',   bg: 'bg-blue-500/8',   text: 'text-blue-400' },
  green:  { border: 'border-green-500/25',  bg: 'bg-green-500/8',  text: 'text-green-400' },
  violet: { border: 'border-violet-500/25', bg: 'bg-violet-500/8', text: 'text-violet-400' },
  amber:  { border: 'border-amber-500/25',  bg: 'bg-amber-500/8',  text: 'text-amber-400' },
};

export default function AdoptionSlide({ data, lang }: AdoptionSlideProps) {
  const isRTL = lang === 'he';

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Compact header */}
      <div className="pt-10 pb-10 text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-black mb-3 bg-gradient-to-r from-emerald-400 via-blue-400 to-violet-400 bg-clip-text text-transparent"
        >
          {data.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-base text-white/55 max-w-xl mx-auto mb-6"
        >
          {data.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-1.5 text-white/35"
        >
          <span className="text-xs">{isRTL ? 'גלול למטה' : 'Scroll down'}</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-xl">↓</motion.div>
        </motion.div>
      </div>

      {/* Gradient progress bar — visual narrative of the journey */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mx-6 mb-8 h-1 rounded-full origin-left"
        style={{ background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)' }}
      />

      {/* Phase cards — responsive: stacked mobile, 3-col desktop */}
      <div className="px-6 grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
        {data.phases.map((phase, idx) => {
          const colors = accentColors[phase.accent] || accentColors.emerald;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: idx * 0.12, duration: 0.5 }}
              className={`flex flex-col rounded-2xl border ${colors.border} overflow-hidden`}
              style={{ background: 'rgba(15,23,42,0.6)' }}
            >
              {/* Colored top stripe */}
              <div className={`h-1 w-full ${colors.stripe} opacity-60`} />

              {/* Card body */}
              <div className="flex-1 p-5 pb-4">
                {/* Phase label + timeline */}
                <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className={`text-[10px] font-mono tracking-[0.3em] ${colors.text} uppercase`}>
                    {isRTL ? 'שלב' : 'Phase'} {phase.number}
                  </span>
                  {phase.timeline && (
                    <span className="text-[10px] text-white/30 font-mono bg-white/5 px-2 py-0.5 rounded-full">
                      {phase.timeline}
                    </span>
                  )}
                </div>

                {/* Emoji + name */}
                <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-3xl">{phase.emoji}</span>
                  <h3 className={`text-xl font-black ${colors.text} leading-tight`}>{phase.name}</h3>
                </div>

                {/* Win headline */}
                {phase.win && (
                  <p className="text-white/50 text-xs italic mb-4 leading-relaxed">
                    "{phase.win}"
                  </p>
                )}

                {/* Bullets */}
                <ul className="space-y-2">
                  {phase.bullets.map((bullet, bIdx) => (
                    <motion.li
                      key={bIdx}
                      initial={{ opacity: 0, x: isRTL ? 8 : -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 + bIdx * 0.05 }}
                      className={`flex items-start gap-2 text-xs text-white/65 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                    >
                      <span className={`shrink-0 mt-0.5 ${colors.text}`}>✓</span>
                      <span className="leading-relaxed">{bullet}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Milestone strip */}
              {phase.milestone && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12 + 0.3 }}
                  className={`px-5 py-3 border-t ${colors.milestoneBar} flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <span className={`shrink-0 text-sm ${colors.text}`}>★</span>
                  <span className="text-xs text-white/75 font-medium leading-snug">{phase.milestone}</span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Compounding message */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        className="mx-6 mb-10 text-center"
      >
        <div className="inline-flex items-center gap-3 text-xs text-white/35 font-mono">
          <span className="text-emerald-400/60">Risk ↓</span>
          <span className="text-white/15">────</span>
          <span className="text-blue-400/60">Coverage ↑</span>
          <span className="text-white/15">────</span>
          <span className="text-violet-400/60">Velocity ↑↑</span>
        </div>
      </motion.div>

      {/* ROI Metrics — compact grid */}
      <div className="px-6 pb-8">
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-bold text-white/40 text-center mb-5 uppercase tracking-widest"
        >
          {data.metricsTitle}
        </motion.h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.metrics.map((metric, idx) => {
            const mc = metricAccent[metric.accent] || metricAccent.blue;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className={`${mc.bg} border ${mc.border} rounded-xl p-3.5`}
              >
                <div className={`flex items-center gap-1.5 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-base">{metric.icon}</span>
                  <span className={`text-xs font-bold ${mc.text}`}>{metric.title}</span>
                </div>
                <ul className="space-y-1">
                  {metric.items.map((item, iIdx) => (
                    <li key={iIdx} className={`text-white/40 text-[11px] ${isRTL ? 'text-right' : ''}`}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Closing quote */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        className="px-6 pb-16 text-center"
      >
        <p className="text-lg sm:text-xl text-white/70 italic font-light leading-relaxed mb-3">
          "{data.closingQuote}"
        </p>
        <p className="text-white/25 text-sm">— {data.closingSource}</p>
      </motion.div>
    </div>
  );
}
