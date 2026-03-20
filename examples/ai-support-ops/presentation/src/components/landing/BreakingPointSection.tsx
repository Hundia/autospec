import React from 'react';
import { motion } from 'framer-motion';

const buildItems = [
  '6 AI agents',
  '200+ files generated',
  '50 chat sessions',
];

const debtItems = [
  '0 docs written',
  '0 decisions recorded',
  '0 handoff possible',
];

const statCards = [
  {
    value: '73%',
    label: 'of AI projects abandoned within 6 months',
    color: 'red',
  },
  {
    value: '40hrs',
    label: 'spent re-understanding code per quarter',
    color: 'amber',
  },
  {
    value: '$0',
    label: 'value of chat logs after session ends',
    color: 'slate',
  },
];

const statColors: Record<string, { value: string; bg: string; border: string }> = {
  red: { value: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  amber: { value: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  slate: { value: 'text-slate-300', bg: 'bg-slate-700/30', border: 'border-slate-500/30' },
};

export default function BreakingPointSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-red-600 mb-4">
            The Breaking Point
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            The faster you build, the faster you lose
          </p>
        </motion.div>

        {/* Balance Beam */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-14"
        >
          <div className="flex items-end justify-center gap-6 lg:gap-12">
            {/* Build side (left) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 max-w-xs bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5"
            >
              <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Build
              </h3>
              <ul className="space-y-2">
                {buildItems.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Tilting beam */}
            <div className="flex flex-col items-center flex-shrink-0">
              {/* Beam bar (tilts) */}
              <motion.div
                initial={{ rotate: 0 }}
                whileInView={{ rotate: 15 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 80, damping: 12 }}
                className="mb-1"
              >
                <div className="w-32 h-1.5 bg-slate-500 rounded-full" />
              </motion.div>
              {/* Support */}
              <div className="w-1 h-8 bg-slate-600" />
              {/* Base */}
              <div className="w-4 h-4 bg-slate-600 rounded-sm" />
            </div>

            {/* Debt side (right) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 max-w-xs bg-red-500/10 border border-red-500/30 rounded-xl p-5"
            >
              <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                Debt
              </h3>
              <ul className="space-y-2">
                {debtItems.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400/60 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {statCards.map((stat, index) => {
            const colors = statColors[stat.color];
            return (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className={`${colors.bg} ${colors.border} border rounded-xl p-6 text-center`}
              >
                <div className={`text-3xl font-bold mb-2 ${colors.value}`}>{stat.value}</div>
                <p className="text-sm text-white/50">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-red-500/15 border border-red-500/30 rounded-xl px-8 py-6 text-center"
        >
          <p className="text-white/80 text-lg font-medium">
            Agentic development without structure is{' '}
            <span className="text-red-400 font-semibold">technical debt at AI speed.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
