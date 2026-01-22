import React from 'react';
import { motion } from 'framer-motion';

interface ResultsSlideProps {
  data: {
    title: string;
    metrics: Array<{
      label: string;
      value: string;
      icon: string;
    }>;
    testimonial: {
      quote: string;
      source: string;
    };
  };
  lang: 'en' | 'he';
}

export default function ResultsSlide({ data, lang }: ResultsSlideProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-12 text-yellow-400"
      >
        {data.title}
      </motion.h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        {data.metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + idx * 0.1 }}
            className="bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6 text-center"
          >
            <div className="text-3xl mb-2">{metric.icon}</div>
            <div className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-white/60">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/5 border border-yellow-500/20 rounded-xl p-8 text-center"
      >
        <p className="text-xl sm:text-2xl text-white/90 italic mb-4">
          "{data.testimonial.quote}"
        </p>
        <p className="text-white/50">— {data.testimonial.source}</p>
      </motion.div>
    </div>
  );
}
