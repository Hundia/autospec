import React from 'react';
import { motion } from 'framer-motion';

interface SkillsEnvironmentsSlideProps {
  data: {
    title: string;
    skills: string[];
    environments: Array<{
      name: string;
      support: string;
    }>;
    callout: string;
  };
  lang: 'en' | 'he';
}

export default function SkillsEnvironmentsSlide({ data, lang }: SkillsEnvironmentsSlideProps) {
  const supportColor = (level: string) => {
    switch (level) {
      case 'Full': return 'text-green-400';
      case 'Partial': return 'text-yellow-400';
      case 'Basic': return 'text-orange-400';
      default: return 'text-white/60';
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-10 text-sky-400"
      >
        {data.title}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left: Slash commands */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-sky-500/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-5 text-center">Slash Commands</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {data.skills.map((skill, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.08 }}
                className="bg-sky-500/10 border border-sky-500/30 text-sky-300 px-4 py-2 rounded-full text-sm font-mono"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Right: Environments */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/5 border border-sky-500/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-5 text-center">Environments</h3>
          <div className="space-y-3">
            {data.environments.map((env, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.08 }}
                className="flex justify-between items-center bg-black/20 rounded px-3 py-2"
              >
                <span className="text-sm text-white/80">{env.name}</span>
                <span className={`text-sm font-mono ${supportColor(env.support)}`}>
                  {env.support}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center bg-sky-500/10 border border-sky-500/30 rounded-xl px-6 py-4 text-sky-300 text-sm"
      >
        {data.callout}
      </motion.div>
    </div>
  );
}
