import React from 'react';
import { motion } from 'framer-motion';

const timelineStages = [
  { turn: 'Turn 1',   status: 'Clean',        color: 'green',  snippet: 'Use PostgreSQL with Prisma ORM' },
  { turn: 'Turn 25',  status: 'Drift',         color: 'yellow', snippet: "Actually, let's try MongoDB here..." },
  { turn: 'Turn 50',  status: 'Contradiction', color: 'orange', snippet: "Wait, we're using Prisma right?" },
  { turn: 'Turn 100', status: 'Chaos',         color: 'red',    snippet: 'TypeError: Cannot read undefined' },
];

const colorMap: Record<string, { dot: string; border: string; text: string; bg: string }> = {
  green:  { dot: 'bg-green-400',  border: 'border-green-500/40',  text: 'text-green-400',  bg: 'bg-green-500/10' },
  yellow: { dot: 'bg-yellow-400', border: 'border-yellow-500/40', text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  orange: { dot: 'bg-orange-400', border: 'border-orange-500/40', text: 'text-orange-400', bg: 'bg-orange-500/10' },
  red:    { dot: 'bg-red-400',    border: 'border-red-500/40',    text: 'text-red-400',    bg: 'bg-red-500/10' },
};

const symptomChips = [
  'AI rewrites already-decided architecture',
  'Decisions from Sprint 1 vanish by Sprint 3',
  'Each new agent starts from zero',
];

export default function ProblemSection() {
  return (
    <section
      id="problem"
      data-testid="problem-section"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Problem statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-sm text-red-400 mb-6">
              The Problem
            </span>

            <h2
              id="problem-heading"
              className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight"
            >
              Long AI conversations{' '}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                corrupt themselves
              </span>
            </h2>

            <p className="text-white/60 leading-relaxed mb-4 max-w-lg">
              By message 40, your AI is contradicting decisions it made in message 10.
            </p>

            <p className="text-white/50 leading-relaxed mb-8 max-w-lg text-sm">
              Every message adds to the context window. After enough turns, the AI forgets
              earlier decisions, contradicts itself, and drifts from your original intent.
              There is no memory. There is no continuity.
            </p>

            <div
              className="flex flex-wrap gap-3"
              role="list"
              aria-label="Symptoms of context degradation"
            >
              {symptomChips.map((chip, i) => (
                <motion.span
                  key={i}
                  role="listitem"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.08 }}
                  className="bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm px-3 py-1.5 rounded-lg"
                >
                  {chip}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Right: Degradation timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            data-testid="degradation-timeline"
            aria-label="Context degradation timeline"
          >
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white/70 mb-6 uppercase tracking-wider">
                Context Degradation
              </h3>

              <div className="relative pl-8">
                {/* Vertical connector line */}
                <div
                  className="absolute left-3 top-4 bottom-4 w-px border-l-2 border-dashed border-white/10"
                  aria-hidden="true"
                />

                <div className="space-y-5">
                  {timelineStages.map((stage, index) => {
                    const colors = colorMap[stage.color];
                    return (
                      <motion.div
                        key={stage.turn}
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.12 }}
                        className="relative"
                        data-testid={`degradation-node-${index}`}
                      >
                        {/* Dot on the line */}
                        <div
                          className={`absolute -left-8 top-4 w-2.5 h-2.5 rounded-full ${colors.dot} ring-4 ring-slate-950`}
                          aria-hidden="true"
                        />

                        <div className={`border ${colors.border} ${colors.bg} rounded-xl p-4`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-xs font-mono ${colors.text}`}>{stage.turn}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${colors.border} ${colors.text} ${colors.bg}`}>
                              {stage.status}
                            </span>
                          </div>
                          <div className={`text-xs font-mono px-3 py-2 rounded-lg border ${colors.border} ${colors.bg} ${colors.text} break-words`}>
                            "{stage.snippet}"
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
