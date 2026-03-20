import React from 'react';
import { motion } from 'framer-motion';

interface WorkflowSlideProps {
  data: {
    title: string;
    steps: Array<{
      number: string;
      title: string;
      description: string;
      time: string;
      output: string;
    }>;
  };
  lang: 'en' | 'he';
}

export default function WorkflowSlide({ data, lang }: WorkflowSlideProps) {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-10 text-blue-400"
      >
        {data.title}
      </motion.h2>

      {/* Gradient connecting line (desktop) */}
      <div className="hidden md:block relative mb-4">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          className="h-1 rounded-full origin-left"
          style={{
            background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 35%, #06b6d4 65%, #3b82f6 100%)',
          }}
        />
      </div>

      {/* 7 phases */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {data.steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.08 }}
            className="bg-white/5 border border-blue-500/20 rounded-xl p-3 flex flex-col"
          >
            <div className="text-2xl font-bold text-blue-400 mb-1">{step.number}</div>
            <h3 className="text-sm font-semibold text-white mb-1 leading-tight">{step.title}</h3>
            <p className="text-xs text-white/50 mb-2 flex-1 leading-relaxed">{step.description}</p>
            <div className="text-xs space-y-0.5 pt-2 border-t border-white/10">
              <div className="text-blue-300">⏱️ {step.time}</div>
              <div className="text-green-300">📄 {step.output}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
