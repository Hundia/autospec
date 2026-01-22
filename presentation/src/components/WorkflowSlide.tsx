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
    <div className="max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-12 text-blue-400"
      >
        {data.title}
      </motion.h2>

      <div className="space-y-6">
        {data.steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.15 }}
            className="flex items-start gap-6 bg-white/5 border border-blue-500/20 rounded-xl p-6"
          >
            <div className="text-4xl font-bold text-blue-400">{step.number}</div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-white/70 mb-3">{step.description}</p>
              <div className="flex gap-4 text-sm">
                <span className="text-blue-300">⏱️ {step.time}</span>
                <span className="text-green-300">📄 {step.output}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
