import React from 'react';
import { motion } from 'framer-motion';

interface ProblemSlideProps {
  data: {
    title: string;
    points: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    bottomLine: string;
  };
  lang: 'en' | 'he';
}

export default function ProblemSlide({ data, lang }: ProblemSlideProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-12 text-red-400"
      >
        {data.title}
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {data.points.map((point, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.15 }}
            className="bg-white/5 border border-red-500/30 rounded-xl p-6 hover:bg-white/10 transition-colors"
          >
            <div className="text-4xl mb-3">{point.icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{point.title}</h3>
            <p className="text-white/60">{point.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <p className="text-xl text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-6 py-4 inline-block">
          {data.bottomLine}
        </p>
      </motion.div>
    </div>
  );
}
