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
    }>;
    insight: string;
  };
  lang: 'en' | 'he';
}

export default function RolesSlide({ data, lang }: RolesSlideProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-4 text-purple-400"
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

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {data.roles.map((role, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-3 text-center hover:scale-105 transition-transform"
          >
            <div className="text-purple-400 font-mono text-sm mb-1">{role.num}</div>
            <h3 className="text-white font-semibold text-sm mb-1">{role.name}</h3>
            <p className="text-white/50 text-xs">{role.focus}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <p className="text-lg text-purple-300 bg-purple-500/10 border border-purple-500/30 rounded-lg px-6 py-3 inline-block">
          {data.insight}
        </p>
      </motion.div>
    </div>
  );
}
