import React from 'react';
import { motion } from 'framer-motion';
import { PiggyBank } from 'lucide-react';
import { finopsData } from '../../data/paper-content';

const tierColors = [
  { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20',    text: 'text-cyan-400',    badge: 'bg-cyan-500/20 text-cyan-300',    dot: 'bg-cyan-500' },
  { bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  text: 'text-purple-400',  badge: 'bg-purple-500/20 text-purple-300',  dot: 'bg-purple-500' },
  { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   text: 'text-amber-400',   badge: 'bg-amber-500/20 text-amber-300',   dot: 'bg-amber-500' },
];

export default function PaperFinOpsSection() {
  const { tiers, comparison } = finopsData;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-sm text-amber-400 mb-4">
            <PiggyBank size={14} />
            Section 5: FinOps
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Cost-Optimized{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Model Routing
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Intelligent task routing directs each operation to the cheapest capable model, achieving ~82% cost reduction versus an all-Opus approach.
          </p>
        </motion.div>

        {/* Donut chart + tier cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          {/* CSS Donut */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-64 h-64 mx-auto">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, #06b6d4 0% 40%, #8b5cf6 40% 85%, #f59e0b 85% 100%)',
                }}
              />
              <div className="absolute inset-8 bg-slate-950 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">~82%</div>
                  <div className="text-xs text-white/50">Savings vs Opus</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-6 mt-6">
              {tiers.map((tier, i) => (
                <div key={tier.model} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${tierColors[i].dot}`} />
                  <span className="text-sm text-white/60">{tier.model} {tier.allocation}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tier cards */}
          <div className="space-y-4">
            {tiers.map((tier, index) => {
              const colors = tierColors[index];
              return (
                <motion.div
                  key={tier.model}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`bg-slate-800/50 ${colors.border} border rounded-xl p-5`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                      <span className="font-bold text-white">{tier.model}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${colors.badge}`}>
                      {tier.allocation}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-1">{tier.tasks}</p>
                  <span className={`text-xs font-mono ${colors.text}`}>{tier.cost}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Cost comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 text-center">
            <div className="text-red-400 text-sm font-medium mb-2">All-Opus (No Routing)</div>
            <div className="text-4xl font-bold text-white mb-1">{comparison.allOpus}</div>
            <div className="text-white/40 text-sm">estimated project cost</div>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 text-center">
            <div className="text-emerald-400 text-sm font-medium mb-2">AutoSpec FinOps Routing</div>
            <div className="text-4xl font-bold text-white mb-1">{comparison.autospec}</div>
            <div className="text-emerald-400 text-sm font-semibold">{comparison.savings} savings</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
