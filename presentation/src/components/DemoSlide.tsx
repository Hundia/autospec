import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface DemoSlideProps {
  data: {
    title: string;
    subtitle: string;
    steps: string[];
    note: string;
  };
  lang: 'en' | 'he';
}

export default function DemoSlide({ data, lang }: DemoSlideProps) {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mb-6">
          <Play size={48} className="text-white ml-2" />
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl sm:text-6xl font-bold text-white mb-4"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl text-white/60 mb-12"
      >
        {data.subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 border border-white/10 rounded-xl p-8 text-left mb-8"
      >
        <h3 className="text-lg font-semibold text-white/50 mb-4">
          {lang === 'en' ? 'Demo Steps' : 'שלבי ההדגמה'}
        </h3>
        <div className="space-y-3">
          {data.steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-mono text-sm">
                {idx + 1}
              </div>
              <span className="text-white/80">{step.replace(/^\d+\.\s*/, '')}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-white/40"
      >
        {data.note}
      </motion.p>
    </div>
  );
}
