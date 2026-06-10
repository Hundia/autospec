import React from 'react';
import { motion } from 'framer-motion';

interface PhilosophyCard {
  icon: string;
  title: string;
  description: string;
  accent: string;
}

interface PhilosophySlideProps {
  data: {
    title: string;
    subtitle: string;
    cards: PhilosophyCard[];
    quote: string;
  };
  lang: 'en' | 'he';
}

const accentBorder: Record<string, string> = {
  teal: 'border-t-teal-400',
  blue: 'border-t-blue-400',
  violet: 'border-t-violet-400',
  amber: 'border-t-amber-400',
  emerald: 'border-t-emerald-400',
  rose: 'border-t-rose-400',
  cyan: 'border-t-cyan-400',
  orange: 'border-t-orange-400',
};

export default function PhilosophySlide({ data }: PhilosophySlideProps) {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl sm:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center text-slate-400 text-base mb-6 max-w-2xl mx-auto"
      >
        {data.subtitle}
      </motion.p>

      {/* 5-card grid: 3 top + 2 bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {data.cards.slice(0, 3).map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
            className={`bg-white/5 border border-white/10 border-t-2 ${accentBorder[card.accent] ?? 'border-t-blue-400'} rounded-xl p-4 flex flex-col gap-2`}
          >
            <div className="text-2xl">{card.icon}</div>
            <h3 className="text-white font-semibold text-sm">{card.title}</h3>
            <p className="text-white/55 text-xs leading-relaxed">{card.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-full sm:max-w-[67%] mx-auto">
        {data.cards.slice(3).map((card, idx) => (
          <motion.div
            key={idx + 3}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
            className={`bg-white/5 border border-white/10 border-t-2 ${accentBorder[card.accent] ?? 'border-t-teal-400'} rounded-xl p-4 flex flex-col gap-2`}
          >
            <div className="text-2xl">{card.icon}</div>
            <h3 className="text-white font-semibold text-sm">{card.title}</h3>
            <p className="text-white/55 text-xs leading-relaxed">{card.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Quote banner */}
      <motion.blockquote
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="border-l-4 border-orange-400 bg-orange-500/10 rounded-r-xl px-6 py-4 max-w-3xl mx-auto"
      >
        <p className="text-orange-200 font-semibold text-base italic leading-relaxed">
          "{data.quote}"
        </p>
      </motion.blockquote>
    </div>
  );
}
