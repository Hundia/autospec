import React from 'react';
import { motion } from 'framer-motion';

interface SDDMethodologySlideProps {
  data: {
    title: string;
    principles: Array<{ title: string; description: string; icon: string }>;
    implementations: Array<{ name: string; description: string; status: string }>;
  };
  lang: 'en' | 'he';
}

const statusStyles: Record<string, { border: string; bg: string; label: string }> = {
  featured: {
    border: 'border-cyan-400',
    bg: 'bg-cyan-500/10',
    label: 'text-cyan-400',
  },
  alternative: {
    border: 'border-dashed border-purple-400',
    bg: 'bg-purple-500/5',
    label: 'text-purple-300',
  },
  custom: {
    border: 'border-dotted border-gray-400',
    bg: 'bg-white/5',
    label: 'text-gray-300',
  },
};

export default function SDDMethodologySlide({ data, lang }: SDDMethodologySlideProps) {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-10 text-teal-400"
      >
        {data.title}
      </motion.h2>

      <div className="flex flex-col md:flex-row gap-6 items-start relative">
        {/* LEFT — SDD Principles */}
        <div className="flex-1 min-w-0">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-semibold text-teal-400/70 uppercase tracking-widest mb-4"
          >
            The SDD Philosophy
          </motion.h3>
          <div className="flex flex-col gap-3">
            {data.principles.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.12 }}
                className="flex items-start gap-3 bg-teal-500/10 border border-teal-500/25 rounded-xl px-4 py-3"
              >
                <span className="text-2xl flex-shrink-0">{p.icon}</span>
                <div>
                  <h4 className="font-semibold text-white text-sm mb-0.5">{p.title}</h4>
                  <p className="text-white/55 text-xs">{p.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CENTER — SVG connector (desktop only) */}
        <div className="hidden md:flex flex-col items-center justify-center w-10 self-stretch pt-10">
          <motion.svg
            width="2"
            height="100%"
            viewBox="0 0 2 200"
            className="h-full"
            style={{ height: '100%', minHeight: 160 }}
          >
            <motion.line
              x1="1"
              y1="0"
              x2="1"
              y2="200"
              stroke="rgba(20,184,166,0.4)"
              strokeWidth="2"
              strokeDasharray="6 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeInOut' }}
            />
          </motion.svg>
        </div>

        {/* RIGHT — Implementations */}
        <div className="flex-1 min-w-0">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-semibold text-emerald-400/70 uppercase tracking-widest mb-4"
          >
            Implementations
          </motion.h3>
          <div className="flex flex-col gap-3">
            {data.implementations.map((impl, i) => {
              const styles = statusStyles[impl.status] || statusStyles.custom;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.14 }}
                  className={`rounded-xl px-4 py-3 border-2 ${styles.border} ${styles.bg}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-bold text-sm ${styles.label}`}>{impl.name}</h4>
                    {impl.status === 'featured' && (
                      <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-white/55 text-xs">{impl.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
