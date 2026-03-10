import React from 'react';
import { motion } from 'framer-motion';

interface OrchestratorSlideProps {
  data: {
    title: string;
    orchestrator: {
      name: string;
      subtitle?: string;
      tasks: string[];
    };
    agents: Array<{
      name: string;
      task: string;
    }>;
    benefits: string[];
  };
  lang: 'en' | 'he';
}

export default function OrchestratorSlide({ data, lang }: OrchestratorSlideProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-10 text-indigo-400"
      >
        {data.title}
      </motion.h2>

      {/* Orchestrator card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 rounded-xl p-6 mb-4 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-3 h-3 rounded-full bg-indigo-400 animate-pulse" />
          <h3 className="text-2xl font-bold text-white">{data.orchestrator.name}</h3>
        </div>
        {data.orchestrator.subtitle && (
          <p className="text-xs text-indigo-300/70 mb-3 max-w-md mx-auto">{data.orchestrator.subtitle}</p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          {data.orchestrator.tasks.map((task, idx) => (
            <span
              key={idx}
              className="bg-black/20 rounded px-3 py-2 text-sm font-mono text-white/80"
            >
              {task}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Flow arrows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="flex justify-center gap-12 text-indigo-400/60 text-2xl mb-4"
      >
        <span>↓</span>
        <span>↓</span>
        <span>↓</span>
      </motion.div>

      {/* Agent cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {data.agents.map((agent, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + idx * 0.15 }}
            className="bg-white/5 border border-indigo-500/20 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <h4 className="text-base font-bold text-white">{agent.name}</h4>
            </div>
            <p className="text-sm text-white/60 font-mono">{agent.task}</p>
          </motion.div>
        ))}
      </div>

      {/* Benefits bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap justify-center gap-4"
      >
        {data.benefits.map((benefit, idx) => (
          <span
            key={idx}
            className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-4 py-2 rounded-full text-sm"
          >
            {benefit}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
