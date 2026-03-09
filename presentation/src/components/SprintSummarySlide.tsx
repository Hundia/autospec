import React from 'react';
import { motion } from 'framer-motion';

interface SprintSummarySlideProps {
  data: {
    title: string;
    sections: Array<{
      icon: string;
      title: string;
      example: string;
    }>;
    callout: string;
  };
  lang: 'en' | 'he';
}

export default function SprintSummarySlide({ data, lang }: SprintSummarySlideProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-10 text-teal-400"
      >
        {data.title}
      </motion.h2>

      {/* Mock document */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 border border-teal-500/20 rounded-xl overflow-hidden mb-8"
      >
        {/* Document header */}
        <div className="bg-teal-500/10 border-b border-teal-500/20 px-6 py-3 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-4 font-mono text-sm text-white/60">sprints/sprint-5/summary.md</span>
        </div>

        {/* Document sections */}
        <div className="p-6 space-y-5">
          {data.sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.12 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{section.icon}</span>
                <h3 className="text-base font-bold text-white">{section.title}</h3>
              </div>
              <div className="bg-black/20 rounded px-3 py-2 text-sm font-mono text-white/60">
                {section.example}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center bg-teal-500/10 border border-teal-500/30 rounded-xl px-6 py-4 text-teal-300 text-sm"
      >
        {data.callout}
      </motion.div>
    </div>
  );
}
