import React from 'react';
import { motion } from 'framer-motion';

interface EnvironmentProofSlideProps {
  data: {
    title: string;
    environments: Array<{
      name: string;
      accent: string;
      mockup: string;
      commands: string[];
    }>;
    callout: string;
    bottomText: string;
  };
  lang: 'en' | 'he';
}

const accentMap: Record<string, { border: string; text: string; bg: string; dot: string }> = {
  cyan: { border: 'border-cyan-500/30', text: 'text-cyan-400', bg: 'bg-cyan-500/5', dot: 'bg-cyan-400' },
  purple: { border: 'border-purple-500/30', text: 'text-purple-400', bg: 'bg-purple-500/5', dot: 'bg-purple-400' },
  amber: { border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/5', dot: 'bg-amber-400' },
};

export default function EnvironmentProofSlide({ data, lang }: EnvironmentProofSlideProps) {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-10 text-sky-400"
      >
        {data.title}
      </motion.h2>

      {/* Three environment cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {data.environments.map((env, idx) => {
          const colors = accentMap[env.accent] || accentMap.cyan;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.15 }}
              className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden`}
            >
              {/* Mockup title bar */}
              <div className="flex items-center gap-2 px-4 py-2 bg-black/30 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                </div>
                <span className={`text-xs font-medium ${colors.text} ml-2`}>{env.name}</span>
              </div>
              {/* Mockup content */}
              <div className="p-4 font-mono text-xs space-y-1.5">
                {env.commands.map((cmd, ci) => (
                  <motion.div
                    key={ci}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.15 + ci * 0.1 }}
                    className="text-white/70"
                  >
                    {cmd}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Center callout */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mb-4"
      >
        <p className="text-lg font-semibold text-white bg-white/5 border border-sky-500/30 rounded-xl px-6 py-4 inline-block">
          {data.callout}
        </p>
      </motion.div>

      {/* Bottom text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-white/50 text-sm"
      >
        {data.bottomText}
      </motion.p>
    </div>
  );
}
