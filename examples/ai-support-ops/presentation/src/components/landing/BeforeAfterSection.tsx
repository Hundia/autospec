import React from 'react';
import { motion } from 'framer-motion';
import { GitCompare, XCircle, CheckCircle2 } from 'lucide-react';

const comparisons = [
  {
    label: 'Context',
    without: 'Lost every session — start from scratch',
    with: 'Preserved forever in specs and summaries',
  },
  {
    label: 'Documentation',
    without: 'Chat logs only — impossible to navigate',
    with: '100+ living docs updated every sprint',
  },
  {
    label: 'Onboarding',
    without: 'Weeks of reverse engineering the codebase',
    with: 'Read the specs, start building immediately',
  },
  {
    label: 'AI Accuracy',
    without: 'Degrades as conversation grows longer',
    with: 'Consistent from spec — every session',
  },
  {
    label: 'Cost per Sprint',
    without: '$47/sprint (wasted tokens re-explaining)',
    with: '$19/sprint (structured context = less waste)',
  },
  {
    label: 'Handoff',
    without: 'Impossible — knowledge locked in one person',
    with: 'Anyone reads the specs and contributes',
  },
];

export default function BeforeAfterSection() {
  return (
    <section id="before-after" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-sm text-violet-400 mb-4">
            <GitCompare size={14} />
            The Difference
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Same Team. Same AI.{' '}
            <span className="bg-gradient-to-r from-red-400 to-emerald-400 bg-clip-text text-transparent">
              Different Structure.
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            The tools are identical. The methodology is what separates teams that scale from teams
            that struggle.
          </p>
        </motion.div>

        {/* Comparison columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Without SDD */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-red-500/20 bg-red-500/10">
              <XCircle className="text-red-400" size={20} />
              <h3 className="text-red-300 font-bold">Without SDD</h3>
            </div>
            <div className="divide-y divide-red-500/10">
              {comparisons.map((row, index) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.07 }}
                  className="px-6 py-4"
                >
                  <div className="text-xs font-semibold text-red-400/70 uppercase tracking-wider mb-1">
                    {row.label}
                  </div>
                  <div className="flex items-start gap-2 text-sm text-white/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-1.5 flex-shrink-0" />
                    {row.without}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* With SDD */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-emerald-500/20 bg-emerald-500/10">
              <CheckCircle2 className="text-emerald-400" size={20} />
              <h3 className="text-emerald-300 font-bold">With SDD (AutoSpec)</h3>
            </div>
            <div className="divide-y divide-emerald-500/10">
              {comparisons.map((row, index) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.07 }}
                  className="px-6 py-4"
                >
                  <div className="text-xs font-semibold text-emerald-400/70 uppercase tracking-wider mb-1">
                    {row.label}
                  </div>
                  <div className="flex items-start gap-2 text-sm text-white/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    {row.with}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 bg-gradient-to-br from-emerald-500/10 to-violet-500/10 border border-emerald-500/20 rounded-xl p-8 text-center"
        >
          <p className="text-white/80 text-lg italic max-w-3xl mx-auto leading-relaxed">
            "Structure is the multiplier. The same AI with better structure delivers dramatically better results."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
