import React from 'react';
import { motion } from 'framer-motion';

interface Stage {
  number: number;
  emoji: string;
  name: string;
  tag: string;
  owner: string;
  hero: boolean;
  accent: string;
  bullets: string[];
  output: string;
}

interface SixStagesSlideProps {
  data: {
    title: string;
    subtitle: string;
    stages: Stage[];
    closingCallout: string;
  };
  lang: 'en' | 'he';
}

const accentColors: Record<string, { border: string; bg: string; text: string; glow: string; tag: string }> = {
  blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400', glow: 'shadow-blue-500/20', tag: 'bg-blue-500/20 text-blue-300' },
  violet: { border: 'border-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-400', glow: 'shadow-violet-500/20', tag: 'bg-violet-500/20 text-violet-300' },
  emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'shadow-emerald-500/20', tag: 'bg-emerald-500/20 text-emerald-300' },
  indigo: { border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', text: 'text-indigo-400', glow: 'shadow-indigo-500/20', tag: 'bg-indigo-500/20 text-indigo-300' },
  cyan: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-400', glow: 'shadow-cyan-500/20', tag: 'bg-cyan-500/20 text-cyan-300' },
  orange: { border: 'border-orange-500/30', bg: 'bg-orange-500/10', text: 'text-orange-400', glow: 'shadow-orange-500/20', tag: 'bg-orange-500/20 text-orange-300' },
  teal: { border: 'border-teal-500/30', bg: 'bg-teal-500/10', text: 'text-teal-400', glow: 'shadow-teal-500/20', tag: 'bg-teal-500/20 text-teal-300' },
  amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400', glow: 'shadow-amber-500/20', tag: 'bg-amber-500/20 text-amber-300' },
};

export default function SixStagesSlide({ data, lang }: SixStagesSlideProps) {
  const isRTL = lang === 'he';

  return (
    <div className="w-full">
      {/* Hero header */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl sm:text-6xl font-black text-center mb-4 bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent"
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
          transition={{ delay: 0.6 }}
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

      {/* Connecting line */}
      <div className="relative">
        <div
          className="absolute left-8 top-0 bottom-0 w-0.5 hidden lg:block"
          style={{
            background: 'linear-gradient(180deg, #3b82f6 0%, #8b5cf6 20%, #06b6d4 40%, #f59e0b 60%, #6366f1 80%, #22c55e 100%)',
            opacity: 0.2,
          }}
        />

        {/* Stage sections */}
        {data.stages.map((stage) => {
          const colors = accentColors[stage.accent] || accentColors.blue;
          return (
            <motion.section
              key={stage.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`relative ${stage.hero ? 'min-h-[120vh] py-20' : 'min-h-[80vh] py-16'} flex items-center`}
            >
              <div
                className={`w-full max-w-5xl mx-auto px-6 ${
                  stage.hero
                    ? `border-2 ${colors.border} rounded-2xl p-8 shadow-2xl ${colors.glow}`
                    : ''
                }`}
                style={stage.hero ? { background: 'linear-gradient(to bottom, rgba(255,255,255,0.04), transparent)' } : {}}
              >
                {/* Stage number + badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="inline-flex items-center gap-3 mb-6"
                >
                  <span className={`text-5xl font-black ${colors.text} opacity-40`}>
                    0{stage.number}
                  </span>
                  <span className="text-3xl">{stage.emoji}</span>
                  {stage.hero && (
                    <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full">
                      Gate
                    </span>
                  )}
                </motion.div>

                {/* Name */}
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2">{stage.name}</h3>

                {/* Tag + Owner row */}
                <div className={`flex flex-wrap gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className={`text-xs px-3 py-1 rounded-full font-mono ${colors.tag}`}>
                    {stage.tag}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-white/50">
                    👤 {stage.owner}
                  </span>
                </div>

                {/* Bullets */}
                <ul className="space-y-3 mb-8 max-w-2xl">
                  {stage.bullets.map((bullet, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                      className={`flex items-start gap-3 text-white/70 text-sm ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.text} flex-shrink-0 mt-1.5`}
                        style={{ backgroundColor: 'currentColor' }} />
                      {bullet}
                    </motion.li>
                  ))}
                </ul>

                {/* Output artifact */}
                <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-green-400">📄</span>
                  <code className="text-green-400 font-mono text-sm">{stage.output}</code>
                </div>
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* Closing callout */}
      <div className="min-h-[50vh] flex items-center justify-center px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          className="max-w-3xl text-center"
        >
          <div className="text-3xl mb-4">💡</div>
          <p className="text-xl sm:text-2xl text-white/80 italic font-light leading-relaxed">
            "{data.closingCallout}"
          </p>
        </motion.div>
      </div>
    </div>
  );
}
