import React from 'react';
import { motion } from 'framer-motion';

interface TerminalLine {
  text: string;
  type: 'command' | 'success' | 'error' | 'info';
}

interface ToolCard {
  icon: string;
  title: string;
  terminal: TerminalLine[];
  valueTag: string;
  accent: string;
}

interface ToolingSlideProps {
  data: {
    title: string;
    subtitle: string;
    tools: ToolCard[];
  };
  lang: 'en' | 'he';
}

const lineColors: Record<string, string> = {
  command: 'text-cyan-400',
  success: 'text-green-400',
  error: 'text-red-400',
  info: 'text-white/50',
};

const accentClasses: Record<string, { border: string; bg: string; text: string; tag: string }> = {
  teal: { border: 'border-teal-500/30', bg: 'bg-teal-500/10', text: 'text-teal-400', tag: 'bg-teal-500/20 text-teal-300' },
  violet: { border: 'border-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-400', tag: 'bg-violet-500/20 text-violet-300' },
  blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400', tag: 'bg-blue-500/20 text-blue-300' },
  amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400', tag: 'bg-amber-500/20 text-amber-300' },
  emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', tag: 'bg-emerald-500/20 text-emerald-300' },
};

export default function ToolingSlide({ data }: ToolingSlideProps) {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl sm:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-teal-400 via-violet-400 to-blue-400 bg-clip-text text-transparent"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center text-slate-400 text-base mb-6 max-w-2xl mx-auto"
      >
        {data.subtitle}
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.tools.map((tool, idx) => {
          const colors = accentClasses[tool.accent] || accentClasses.teal;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
              className={`${colors.bg} border ${colors.border} rounded-2xl overflow-hidden`}
            >
              {/* Card header */}
              <div className="px-4 py-3 flex items-center gap-2 border-b border-white/10">
                <span className="text-xl">{tool.icon}</span>
                <span className={`font-bold text-sm ${colors.text}`}>{tool.title}</span>
              </div>

              {/* Terminal block */}
              <div className="bg-slate-950/80 px-4 py-3 font-mono text-xs space-y-1">
                {/* Terminal chrome */}
                <div className="flex gap-1.5 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                </div>
                {tool.terminal.map((line, lIdx) => (
                  <motion.div
                    key={lIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + idx * 0.1 + lIdx * 0.08 }}
                    className={lineColors[line.type] || 'text-white/50'}
                  >
                    {line.text}
                  </motion.div>
                ))}
              </div>

              {/* Value tag */}
              <div className="px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded-md ${colors.tag} font-medium`}>
                  {tool.valueTag}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
