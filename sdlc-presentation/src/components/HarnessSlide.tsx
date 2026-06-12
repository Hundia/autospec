import React from 'react';
import { motion } from 'framer-motion';

interface HarnessLayer {
  icon: string;
  title: string;
  description: string;
  accent: string;
}

interface HarnessSlideProps {
  data: {
    title: string;
    subtitle: string;
    loopSteps: string[];
    layers: HarnessLayer[];
    callout: string;
  };
  lang: 'en' | 'he';
}

const accentClasses: Record<string, { border: string; bg: string; text: string }> = {
  green: { border: 'border-green-500/30', bg: 'bg-green-500/10', text: 'text-green-400' },
  blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  violet: { border: 'border-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-400' },
  amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  teal: { border: 'border-teal-500/30', bg: 'bg-teal-500/10', text: 'text-teal-400' },
  cyan: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
};

export default function HarnessSlide({ data }: HarnessSlideProps) {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl sm:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center text-slate-400 text-base mb-8 max-w-2xl mx-auto"
      >
        {data.subtitle}
      </motion.p>

      {/* Loop diagram */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
      >
        <p className="text-xs text-white/40 uppercase tracking-widest text-center mb-4">The Guardrail Loop</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {data.loopSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.12 }}
                className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 font-medium"
              >
                {step}
              </motion.span>
              {idx < data.loopSteps.length - 1 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + idx * 0.12 + 0.06 }}
                  className="text-white/30 text-lg"
                >
                  →
                </motion.span>
              )}
            </React.Fragment>
          ))}
          {/* Loop arrow back */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + data.loopSteps.length * 0.12 }}
            className="text-teal-400/60 text-lg font-bold"
          >
            ↺
          </motion.span>
        </div>
      </motion.div>

      {/* Four layer cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {data.layers.map((layer, idx) => {
          const colors = accentClasses[layer.accent] || accentClasses.teal;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1, duration: 0.4 }}
              className={`${colors.bg} border ${colors.border} rounded-xl p-4 flex flex-col gap-2`}
            >
              <div className="text-2xl">{layer.icon}</div>
              <h3 className={`font-semibold text-sm ${colors.text}`}>{layer.title}</h3>
              <p className="text-white/50 text-xs leading-relaxed">{layer.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Callout */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-center bg-green-500/10 border border-green-500/30 rounded-xl px-6 py-4 max-w-3xl mx-auto"
      >
        <p className="text-green-300 font-semibold text-sm italic">{data.callout}</p>
      </motion.div>
    </div>
  );
}
