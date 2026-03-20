import React from 'react';
import { motion } from 'framer-motion';

interface MultiAgentSlideProps {
  data: {
    title: string;
    description: string;
    agents: Array<{
      name: string;
      role: string;
      tickets: string[];
      color: string;
    }>;
    benefits: string[];
  };
  lang: 'en' | 'he';
}

export default function MultiAgentSlide({ data, lang }: MultiAgentSlideProps) {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {data.agents.map((agent, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: idx === 0 ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.2 }}
            className={`bg-gradient-to-br ${
              agent.color === 'blue'
                ? 'from-blue-500/20 to-blue-600/10 border-blue-500/30'
                : 'from-green-500/20 to-green-600/10 border-green-500/30'
            } border rounded-xl p-6`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${
                agent.color === 'blue' ? 'bg-blue-400' : 'bg-green-400'
              } animate-pulse`} />
              <h3 className="text-xl font-bold text-white">{agent.name}</h3>
              <span className="text-white/50">— {agent.role}</span>
            </div>
            <div className="space-y-2">
              {agent.tickets.map((ticket, tIdx) => (
                <div
                  key={tIdx}
                  className="bg-black/20 rounded px-3 py-2 text-sm font-mono text-white/80"
                >
                  {ticket}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap justify-center gap-4"
      >
        {data.benefits.map((benefit, idx) => (
          <span
            key={idx}
            className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-4 py-2 rounded-full text-sm"
          >
            ✓ {benefit}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
