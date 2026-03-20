import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, Wrench, PlayCircle } from 'lucide-react';

const bugFixSteps = [
  { step: 1, title: 'Reproduce the exact user flow', description: 'Before writing any fix', icon: Search },
  { step: 2, title: 'Fix the code', description: 'Targeted, minimal change', icon: Wrench },
  { step: 3, title: 'Replay the user flow', description: 'Not just the code change', icon: PlayCircle },
];

const qaTable = [
  { type: 'Bug fix', qa: 'Reproduce \u2192 fix \u2192 verify' },
  { type: 'API change', qa: 'Run API test suite' },
  { type: 'UI change', qa: 'Playwright E2E' },
  { type: 'New feature', qa: 'Full test suite' },
];

export default function QASection() {
  return (
    <section id="qa" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-sm text-rose-400 mb-4">
            <ShieldCheck size={14} />
            Quality Built In
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Every Bug Reproduced.{' '}
            <span className="bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent">
              Every Fix Verified.
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            AutoSpec's QA methodology ensures nothing ships untested. The bug fix protocol
            catches the subtle failures that code-level tests miss.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Test Pyramid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-white font-bold text-lg mb-6">Test Pyramid</h3>
            <div className="space-y-3 flex flex-col items-center">
              {/* Top: E2E (narrowest) */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: '40%', opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-rose-500/20 border border-rose-500/30 rounded-lg px-4 py-3 text-center"
              >
                <div className="text-xs font-semibold text-rose-400">E2E / Playwright</div>
                <div className="text-xs text-white/50">10%</div>
              </motion.div>

              {/* Middle: Integration */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: '65%', opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-4 py-3 text-center"
              >
                <div className="text-xs font-semibold text-yellow-400">Integration Tests</div>
                <div className="text-xs text-white/50">30%</div>
              </motion.div>

              {/* Bottom: Unit (widest) */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: '90%', opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-4 py-3 text-center"
              >
                <div className="text-xs font-semibold text-emerald-400">Unit / API Tests</div>
                <div className="text-xs text-white/50">60%</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Bug Fix Protocol */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-white font-bold text-lg mb-6">Bug Fix Protocol</h3>
            <div className="space-y-4">
              {bugFixSteps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                  className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="w-8 h-8 bg-rose-500/20 border border-rose-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-rose-400 font-bold text-sm">{item.step}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm mb-0.5">{item.title}</div>
                    <div className="text-white/50 text-sm">{item.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* QA Decision Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 bg-white/5 border border-white/10 rounded-xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/10">
            <h4 className="text-white font-semibold text-sm">QA Decision Matrix</h4>
          </div>
          <div className="divide-y divide-white/5">
            {qaTable.map((row, index) => (
              <div key={row.type} className="flex items-center px-6 py-3">
                <div className="w-1/3 text-sm font-medium text-white/80">{row.type}</div>
                <div className="w-2/3 text-sm text-white/50 font-mono">{row.qa}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
