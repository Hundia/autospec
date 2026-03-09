import React from 'react';
import { motion } from 'framer-motion';

interface QAMethodologySlideProps {
  data: {
    title: string;
    pyramid: Array<{
      level: string;
      percentage: string;
      description: string;
    }>;
    bugProtocol: string[];
    callout: string;
  };
  lang: 'en' | 'he';
}

export default function QAMethodologySlide({ data, lang }: QAMethodologySlideProps) {
  const pyramidWidths = ['w-1/2', 'w-3/4', 'w-full'];
  const pyramidColors = [
    'bg-rose-500/30 border-rose-500/40',
    'bg-rose-500/20 border-rose-500/30',
    'bg-rose-500/10 border-rose-500/20',
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-10 text-rose-400"
      >
        {data.title}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left: Test Pyramid */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-rose-500/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 text-center">Test Pyramid</h3>
          <div className="flex flex-col items-center gap-3">
            {data.pyramid.map((tier, idx) => (
              <div
                key={idx}
                className={`${pyramidWidths[idx]} ${pyramidColors[idx]} border rounded-lg px-4 py-3 text-center`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{tier.level}</span>
                  <span className="text-rose-300 text-sm font-mono">{tier.percentage}</span>
                </div>
                <p className="text-xs text-white/50 mt-1">{tier.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Bug Fix Protocol */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/5 border border-rose-500/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 text-center">Bug Fix Protocol</h3>
          <div className="space-y-4">
            {data.bugProtocol.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-rose-300 font-bold text-sm">{idx + 1}</span>
                </div>
                <p className="text-white/80 text-sm pt-1">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center bg-rose-500/10 border border-rose-500/30 rounded-xl px-6 py-4 text-rose-300 text-sm"
      >
        {data.callout}
      </motion.div>
    </div>
  );
}
