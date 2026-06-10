import React from 'react';
import { motion } from 'framer-motion';

interface Phase {
  number: string;
  emoji: string;
  name: string;
  bullets: string[];
  accent: string;
  hero?: boolean;
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

const accentColors: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
  violet: { border: 'border-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-400', glow: 'shadow-violet-500/20' },
  emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
  teal: { border: 'border-teal-500/30', bg: 'bg-teal-500/10', text: 'text-teal-400', glow: 'shadow-teal-500/20' },
  cyan: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  green: { border: 'border-green-500/30', bg: 'bg-green-500/10', text: 'text-green-400', glow: 'shadow-green-500/20' },
  rose: { border: 'border-rose-500/30', bg: 'bg-rose-500/10', text: 'text-rose-400', glow: 'shadow-rose-500/20' },
};

export default function AdoptionSlide({ data, lang }: AdoptionSlideProps) {
  const isRTL = lang === 'he';

  return (
    <div className="w-full">
      {/* Hero header */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl sm:text-6xl font-black text-center mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
        >
          {data.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-white/60 text-center max-w-2xl mb-8"
        >
          {data.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-2 text-white/40"
        >
          <span className="text-sm">{isRTL ? 'גלול למטה' : 'Scroll down'}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-2xl"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>

      {/* Phase sections */}
      <div className="relative">
        <div
          className="absolute left-8 top-0 bottom-0 w-0.5 hidden lg:block"
          style={{
            background: 'linear-gradient(180deg, #10b981 0%, #8b5cf6 50%, #f59e0b 100%)',
            opacity: 0.2,
          }}
        />

        {data.phases.map((phase, idx) => {
          const colors = accentColors[phase.accent] || accentColors.teal;
          return (
            <motion.section
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="min-h-[70vh] py-16 flex items-center"
            >
              <div className="w-full max-w-5xl mx-auto px-6">
                {/* Phase number */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="inline-flex items-center gap-3 mb-6"
                >
                  <span className={`text-5xl font-black ${colors.text} opacity-40`}>{phase.number}</span>
                  <span className="text-3xl">{phase.emoji}</span>
                </motion.div>

                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">{phase.name}</h3>

                <ul className="space-y-3 mb-6 max-w-2xl">
                  {phase.bullets.map((bullet, bIdx) => (
                    <motion.li
                      key={bIdx}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: bIdx * 0.1, duration: 0.4 }}
                      className={`flex items-start gap-3 text-white/70 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${colors.text}`}
                        style={{ backgroundColor: 'currentColor' }} />
                      {bullet}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* ROI Metrics */}
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-16">
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-white mb-8 text-center"
        >
          {data.metricsTitle}
        </motion.h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mb-12">
          {data.metrics.map((metric, idx) => {
            const colors = accentColors[metric.accent] || accentColors.teal;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className={`${colors.bg} border ${colors.border} rounded-xl p-4`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{metric.icon}</span>
                  <span className={`font-bold text-sm ${colors.text}`}>{metric.title}</span>
                </div>
                <ul className="space-y-1">
                  {metric.items.map((item, iIdx) => (
                    <li key={iIdx} className="text-white/50 text-xs">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Closing quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          className="max-w-3xl text-center"
        >
          <p className="text-xl sm:text-2xl text-white/80 italic font-light leading-relaxed mb-3">
            "{data.closingQuote}"
          </p>
          <p className="text-white/30 text-sm">— {data.closingSource}</p>
        </motion.div>
      </div>
    </div>
  );
}
