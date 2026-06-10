import React from 'react';
import { motion } from 'framer-motion';

interface Column {
  label: string;
  accent: string;
  items: string[];
}

interface NotVibeCodingSlideProps {
  data: {
    title: string;
    subtitle: string;
    left: Column;
    right: Column;
    callout: string;
  };
  lang: 'en' | 'he';
}

export default function NotVibeCodingSlide({ data }: NotVibeCodingSlideProps) {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl sm:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-rose-400 to-emerald-400 bg-clip-text text-transparent"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Left — Vibe Coding */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎲</span>
            <h3 className="text-red-400 font-bold text-lg">{data.left.label}</h3>
          </div>
          <ul className="space-y-3">
            {data.left.items.map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="flex items-start gap-2 text-red-300/80 text-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right — Governed SDLC */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🏛️</span>
            <h3 className="text-emerald-400 font-bold text-lg">{data.right.label}</h3>
          </div>
          <ul className="space-y-3">
            {data.right.items.map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex items-start gap-2 text-emerald-300/80 text-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Callout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-center bg-white/5 border border-white/10 rounded-xl px-6 py-4"
      >
        <p className="text-white font-bold text-lg">{data.callout}</p>
      </motion.div>
    </div>
  );
}
