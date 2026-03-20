import React from 'react';
import { motion } from 'framer-motion';

interface BacklogSlideProps {
  data: {
    title: string;
    description: string;
    statuses: Array<{
      status: string;
      label: string;
      description: string;
      color: string;
    }>;
    ticketStructure: string[];
    bugWorkflow: {
      title: string;
      steps: string[];
    };
  };
  lang: 'en' | 'he';
}

const colorClasses: Record<string, { bg: string; border: string; dot: string }> = {
  gray: { bg: 'bg-gray-500/20', border: 'border-gray-500/30', dot: 'bg-gray-400' },
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', dot: 'bg-blue-400' },
  yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
  green: { bg: 'bg-green-500/20', border: 'border-green-500/30', dot: 'bg-green-400' },
  red: { bg: 'bg-red-500/20', border: 'border-red-500/30', dot: 'bg-red-400' },
};

export default function BacklogSlide({ data, lang }: BacklogSlideProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-4 text-cyan-400"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center text-white/60 mb-8"
      >
        {data.description}
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Statuses */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            {lang === 'en' ? 'Ticket Statuses' : 'סטטוסי משימות'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.statuses.map((status, idx) => {
              const colors = colorClasses[status.color] || colorClasses.gray;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className={`${colors.bg} ${colors.border} border rounded-lg px-3 py-2 flex-shrink-0`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    <span className="font-semibold text-white text-sm">{status.label}</span>
                  </div>
                  <p className="text-white/50 text-xs">{status.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Ticket Structure */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🎫</span>
            {lang === 'en' ? 'Ticket Structure' : 'מבנה משימה'}
          </h3>
          <div className="space-y-2">
            {data.ticketStructure.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="bg-black/20 rounded px-3 py-2 text-sm font-mono text-white/80"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bug Workflow - spans full width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🐛</span>
            {data.bugWorkflow.title}
          </h3>
          <div className="flex flex-wrap gap-3">
            {data.bugWorkflow.steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="flex items-center gap-2 bg-black/20 rounded-full px-4 py-2 text-sm"
              >
                <span className="text-red-400 font-bold">{idx + 1}.</span>
                <span className="text-white/80">{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
