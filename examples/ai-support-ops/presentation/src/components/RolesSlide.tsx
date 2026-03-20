import React from 'react';
import { motion } from 'framer-motion';

interface RolesSlideProps {
  data: {
    title: string;
    description: string;
    roles: Array<{
      num: string;
      name: string;
      focus: string;
      specFile?: string;
    }>;
    agentDistinction?: {
      subtitle: string;
      lanes: Array<{
        agent: string;
        roles: string[];
      }>;
    };
    insight: string;
  };
  lang: 'en' | 'he';
}

const laneColors = [
  { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-300', badge: 'bg-indigo-500/20 text-indigo-200' },
  { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-300', badge: 'bg-blue-500/20 text-blue-200' },
  { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-300', badge: 'bg-violet-500/20 text-violet-200' },
];

export default function RolesSlide({ data, lang }: RolesSlideProps) {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-2 text-purple-400"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center text-white/60 mb-6 text-sm"
      >
        {data.description}
      </motion.p>

      {/* UPPER: 2x5 role cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {data.roles.map((role, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + idx * 0.04 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-2.5 text-center hover:scale-105 transition-transform"
          >
            <div className="text-purple-400 font-mono text-xs mb-0.5">{role.num}</div>
            <h3 className="text-white font-semibold text-xs mb-0.5">{role.name}</h3>
            <p className="text-white/50 text-[10px]">{role.focus}</p>
            {role.specFile && (
              <p className="text-purple-400/50 text-[9px] font-mono mt-1 truncate">{role.specFile}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* LOWER: Agent swim lanes */}
      {data.agentDistinction && (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-white/50 text-xs mb-4 italic"
          >
            {data.agentDistinction.subtitle}
          </motion.p>

          <div className="space-y-2 mb-4">
            {data.agentDistinction.lanes.map((lane, idx) => {
              const colors = laneColors[idx % laneColors.length];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  className={`flex items-center gap-3 ${colors.bg} border ${colors.border} rounded-lg px-4 py-2`}
                >
                  <div className="flex items-center gap-2 flex-shrink-0 min-w-[160px]">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className={`text-sm font-bold ${colors.text}`}>{lane.agent}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {lane.roles.map((role, ri) => (
                      <span key={ri} className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
                        {role}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* Insight */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center"
      >
        <p className="text-sm text-purple-300 bg-purple-500/10 border border-purple-500/30 rounded-lg px-5 py-2.5 inline-block">
          {data.insight}
        </p>
      </motion.div>
    </div>
  );
}
