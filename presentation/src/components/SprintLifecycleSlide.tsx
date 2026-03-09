import React from 'react';
import { motion } from 'framer-motion';

interface SprintLifecycleSlideProps {
  data: {
    title: string;
    phases: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    callout: string;
  };
  lang: 'en' | 'he';
}

export default function SprintLifecycleSlide({ data, lang }: SprintLifecycleSlideProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-12 text-emerald-400"
      >
        {data.title}
      </motion.h2>

      {/* Desktop: horizontal pipeline */}
      <div className="hidden md:flex items-start gap-2 mb-10">
        {data.phases.map((phase, idx) => (
          <React.Fragment key={idx}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.12 }}
              className="flex-1 bg-white/5 border border-emerald-500/20 rounded-xl p-5 text-center"
            >
              <div className="text-3xl mb-3">{phase.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{phase.title}</h3>
              <p className="text-sm text-white/60">{phase.description}</p>
            </motion.div>
            {idx < data.phases.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + idx * 0.12 }}
                className="text-emerald-400/60 text-2xl mt-10 flex-shrink-0"
              >
                →
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile: vertical pipeline */}
      <div className="md:hidden space-y-4 mb-10">
        {data.phases.map((phase, idx) => (
          <React.Fragment key={idx}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.12 }}
              className="bg-white/5 border border-emerald-500/20 rounded-xl p-5 flex items-center gap-4"
            >
              <div className="text-3xl flex-shrink-0">{phase.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-white">{phase.title}</h3>
                <p className="text-sm text-white/60">{phase.description}</p>
              </div>
            </motion.div>
            {idx < data.phases.length - 1 && (
              <div className="text-center text-emerald-400/60 text-xl">↓</div>
            )}
          </React.Fragment>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-6 py-4 text-emerald-300 text-sm"
      >
        {data.callout}
      </motion.div>
    </div>
  );
}
