import React from 'react';
import { motion } from 'framer-motion';

interface TicketExecutionSlideProps {
  data: {
    title: string;
    stages: Array<{
      stage: number;
      title: string;
      description: string;
      icon: string;
      time: string;
    }>;
    callout: string;
  };
  lang: 'en' | 'he';
}

export default function TicketExecutionSlide({ data, lang }: TicketExecutionSlideProps) {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-10 text-amber-400"
      >
        {data.title}
      </motion.h2>

      <div className="relative">
        {data.stages.map((stage, i) => (
          <div key={i} className="relative">
            {/* Stage card */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.12, ease: 'easeOut' }}
              className="flex items-start gap-4"
            >
              {/* Left: stage number + connector */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center text-amber-300 font-bold text-sm">
                  {stage.stage}
                </div>
                {/* Vertical connector line (not after last item) */}
                {i < data.stages.length - 1 && (
                  <motion.div
                    className="w-0.5 bg-amber-500/40 mt-1"
                    initial={{ height: 0 }}
                    animate={{ height: 32 }}
                    transition={{ delay: 0.3 + i * 0.12, duration: 0.3 }}
                  />
                )}
              </div>

              {/* Card content */}
              <div className="flex-1 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3 mb-2 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0">{stage.icon}</span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white text-sm sm:text-base mb-0.5">
                      {stage.title}
                    </h3>
                    <p className="text-white/55 text-xs sm:text-sm leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </div>
                {/* Time annotation */}
                <div className="flex-shrink-0 text-right">
                  <span className="text-xs text-amber-400/80 font-mono bg-amber-500/10 border border-amber-500/25 rounded px-2 py-1 whitespace-nowrap">
                    {stage.time}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Callout */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 + data.stages.length * 0.12 + 0.2 }}
        className="mt-6 text-center"
      >
        <p className="text-base text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-5 py-3 inline-block">
          🎯 {data.callout}
        </p>
      </motion.div>
    </div>
  );
}
