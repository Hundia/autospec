import React from 'react';
import { motion } from 'framer-motion';

interface PipelineStepProps {
  number: string;
  title: string;
  subtitle: string;
  time: string;
  output: string;
  accentColor: string;
  hero?: boolean;
  children: React.ReactNode;
  isRTL?: boolean;
}

const colorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
  violet: { border: 'border-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-400', glow: 'shadow-violet-500/20' },
  emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  cyan: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
  indigo: { border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', text: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
  green: { border: 'border-green-500/30', bg: 'bg-green-500/10', text: 'text-green-400', glow: 'shadow-green-500/20' },
};

export default function PipelineStep({ number, title, subtitle, time, output, accentColor, hero, children, isRTL }: PipelineStepProps) {
  const colors = colorMap[accentColor] || colorMap.blue;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`relative ${hero ? 'min-h-[120vh] py-20' : 'min-h-[80vh] py-16'} flex items-center`}
    >
      <div className={`w-full max-w-5xl mx-auto px-6 ${hero ? `border-2 ${colors.border} rounded-2xl p-8 shadow-2xl ${colors.glow} bg-gradient-to-b from-amber-500/5 to-transparent` : ''}`}>
        {/* Step number badge */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={`inline-flex items-center gap-3 mb-6`}
        >
          <span className={`text-5xl font-black ${colors.text} opacity-40`}>{number}</span>
          {hero && (
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full">
              Key Insight
            </span>
          )}
        </motion.div>

        {/* Title */}
        <h3 className={`text-3xl sm:text-4xl font-bold text-white mb-3`}>
          {title}
        </h3>

        {/* Subtitle */}
        <p className="text-base text-white/60 mb-8 max-w-2xl">
          {subtitle}
        </p>

        {/* Visualization area */}
        <div className="mb-8">
          {children}
        </div>

        {/* Bottom meta */}
        <div className={`flex gap-6 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${colors.text}`}>
            <span>⏱️</span>
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <span>📄</span>
            <span>{output}</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
