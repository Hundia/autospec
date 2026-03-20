import React from 'react';
import { motion } from 'framer-motion';

const pillars = [
  {
    num: '01',
    icon: '📐',
    title: 'Specs as Code',
    color: 'teal',
    description:
      'Every decision lives in a .md file in specs/. Not in chat logs, not in your head — in version-controlled files that any agent can read. Add AutoSpec to an existing project — your CLAUDE.md enforces conventions for every AI contributor, human or agent.',
    artifact: 'specs/*.md',
  },
  {
    num: '02',
    icon: '📋',
    title: 'Sprint Summaries',
    color: 'emerald',
    description:
      'Every sprint ends with a summary: what was built, what changed, what was decided. The next agent picks up exactly where you left off. Sprint summaries become your audit trail for compliance reviews.',
    artifact: 'sprints/sprint-X/summary.md',
  },
  {
    num: '03',
    icon: '📖',
    title: 'Living Documentation',
    color: 'cyan',
    description:
      'Docs grow with every ticket. Architecture, APIs, flows — always current, never stale. Knowledge compounds instead of decaying.',
    artifact: 'docs/ (grows every sprint)',
  },
];

const pillarColors: Record<string, { border: string; bg: string; number: string }> = {
  teal:    { border: 'border-teal-500/40',    bg: 'bg-teal-500/10',    number: 'text-teal-400' },
  emerald: { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', number: 'text-emerald-400' },
  cyan:    { border: 'border-cyan-500/40',    bg: 'bg-cyan-500/10',    number: 'text-cyan-400' },
};

interface PillarCardProps {
  pillar: typeof pillars[0];
  index: number;
}

function PillarCard({ pillar, index }: PillarCardProps) {
  const colors = pillarColors[pillar.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.12 }}
      className={`relative flex flex-col border ${colors.border} ${colors.bg} rounded-2xl p-7 overflow-hidden`}
    >
      {/* Faded background number */}
      <span
        className={`absolute -bottom-4 -right-2 text-9xl font-black opacity-[0.07] ${colors.number} select-none leading-none`}
      >
        {pillar.num}
      </span>

      {/* Emoji icon */}
      <div className="text-4xl mb-4">{pillar.icon}</div>

      {/* Pillar number + title */}
      <div className={`text-xs font-semibold uppercase tracking-widest ${colors.number} mb-1`}>
        Pillar {pillar.num}
      </div>
      <h3 className="text-white text-xl font-bold mb-4">{pillar.title}</h3>

      {/* Description */}
      <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1">{pillar.description}</p>

      {/* Artifact code block */}
      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${colors.bg} border ${colors.border}`}>
        <span className="text-white/30 text-xs font-mono">→</span>
        <code className={`text-xs font-mono ${colors.number}`}>{pillar.artifact}</code>
      </div>
    </motion.div>
  );
}

export default function ThreePillarsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-sm text-teal-400 mb-4">
            The Solution
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              The Building Blocks of SDD
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Three simple ideas that solve everything
          </p>
        </motion.div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {pillars.map((pillar, index) => (
            <PillarCard key={pillar.num} pillar={pillar} index={index} />
          ))}
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-block bg-gradient-to-br from-teal-900/30 to-emerald-900/30 border border-teal-500/20 rounded-2xl px-8 py-6 max-w-2xl">
            <p className="text-white/70 text-lg italic leading-relaxed">
              "Specifications are the memory that AI was never given."
            </p>
          </div>
        </motion.div>

        {/* Viewer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-8"
        >
          <a
            href="./viewer/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-400 font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            See it in action →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
