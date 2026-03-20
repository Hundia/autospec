import React from 'react';
import { motion } from 'framer-motion';

const barColors: Record<string, { bg: string; text: string; fill: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', fill: 'bg-blue-500' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', fill: 'bg-green-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', fill: 'bg-amber-500' },
};

const bars = [
  {
    label: 'Planning & Specification',
    percentage: 40,
    color: 'blue',
    description: 'Understanding WHAT to build is the big investment. Define it right, agents execute it right.',
  },
  {
    label: 'Development',
    percentage: 30,
    color: 'green',
    description: 'With clear specs, even smaller models deliver high-end results.',
  },
  {
    label: 'Testing & Verification',
    percentage: 30,
    color: 'amber',
    description: 'QA agents verify every ticket. Automated validation ensures nothing ships broken.',
  },
];

const microservicesCons = [
  'Context scattered across repositories',
  'API contracts create ambiguity',
  'Agent must infer behavior from interfaces',
  'Cross-service debugging is guesswork',
];

const monolithPros = [
  'Entire codebase in one context window',
  'Direct function calls — no API ambiguity',
  'Agent sees the full process end-to-end',
  'Refactoring is atomic, not distributed',
];

export default function FutureVisionSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-sm text-indigo-400 mb-4">
            The Future
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Where Development Is Heading
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            SDD points to two big shifts in how software gets built
          </p>
        </motion.div>

        {/* Sub-section A: Planning-First Development */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            Planning-First Development
          </h3>

          {/* Insight box */}
          <div className="bg-slate-800/40 border border-white/10 rounded-xl p-5 mb-8 text-white/70 text-sm leading-relaxed">
            We're returning to waterfall — but smarter. When specs are clear, agents don't hallucinate. When agents don't hallucinate, you can use cheaper models and get the same results.
          </div>

          {/* Progress bars */}
          <div className="space-y-6 mb-8">
            {bars.map((bar, index) => {
              const colors = barColors[bar.color];
              return (
                <motion.div
                  key={bar.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/80">{bar.label}</span>
                    <span className={`text-sm font-bold ${colors.text}`}>{bar.percentage}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <motion.div
                      className={`h-full rounded-full ${colors.fill}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.15, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-xs text-white/50">{bar.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Callout A */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 text-blue-300 text-sm leading-relaxed">
            "The future developer spends more time thinking than typing. That's not slower — it's smarter."
          </div>
        </motion.div>

        {/* Divider */}
        <div className="my-16 border-t border-white/10" />

        {/* Sub-section B: Monolith Renaissance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-white mb-8">
            Monolith Renaissance
          </h3>

          {/* Two-column comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Left: Microservices */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">🔀</span>
                <h4 className="font-semibold text-red-400 text-lg">Microservices</h4>
              </div>
              <ul className="space-y-3">
                {microservicesCons.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/60">
                    <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right: Monolith */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-green-500/10 border border-green-500/20 rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">🏛️</span>
                <h4 className="font-semibold text-green-400 text-lg">Monolith / Monorepo</h4>
              </div>
              <ul className="space-y-3">
                {monolithPros.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/60">
                    <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Callout B */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5 text-purple-300 text-sm leading-relaxed">
            "Decoupling made sense for human teams. For agents with 200K context windows, a monolith is a superpower."
          </div>
        </motion.div>
      </div>
    </section>
  );
}
