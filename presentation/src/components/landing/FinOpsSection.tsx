import React from 'react';
import { motion } from 'framer-motion';
import { PiggyBank } from 'lucide-react';

const modelTiers = [
  {
    model: 'Haiku',
    allocation: '40%',
    tasks: 'Data extraction, doc updates, boilerplate, CRUD',
    example: '"Extract field names from Prisma schema as TypeScript interface"',
    cost: '~$0.001/task',
    color: 'cyan',
  },
  {
    model: 'Sonnet',
    allocation: '45%',
    tasks: 'State machines, multi-file refactors, component synthesis',
    example: '"Implement waitlist promotion: cancel → promote → deduct credit → notify"',
    cost: '~$0.01/task',
    color: 'purple',
  },
  {
    model: 'Opus',
    allocation: '15%',
    tasks: 'Architecture decisions, security audits, complex debugging',
    example: '"Analyze booking/membership/notification race conditions"',
    cost: '~$0.05/task',
    color: 'amber',
  },
];

const colorClasses: Record<
  string,
  { bg: string; border: string; text: string; badge: string; dot: string }
> = {
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    text: 'text-cyan-400',
    badge: 'bg-cyan-500/20 text-cyan-300',
    dot: 'bg-cyan-500',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    badge: 'bg-purple-500/20 text-purple-300',
    dot: 'bg-purple-500',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300',
    dot: 'bg-amber-500',
  },
};

export default function FinOpsSection() {
  return (
    <section id="finops" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-emerald-400 mb-4">
            <PiggyBank size={14} />
            Cost Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Stop Burning Money on the{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Wrong Model
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            AutoSpec's FinOps layer routes each task to the cheapest model that can handle it.
          </p>
        </motion.div>

        {/* Part 1: Donut chart + tier cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: CSS donut chart */}
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
                  background:
                    'conic-gradient(from 0deg, #06b6d4 0% 40%, #8b5cf6 40% 85%, #f59e0b 85% 100%)',
                }}
              />
              {/* Inner circle for donut hole */}
              <div className="absolute inset-8 bg-slate-900 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">~60%</div>
                  <div className="text-xs text-white/50">Cost Savings</div>
                </div>
              </div>
            </div>

            {/* Legend below chart */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-full" />
                <span className="text-sm text-white/60">Haiku 40%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full" />
                <span className="text-sm text-white/60">Sonnet 45%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                <span className="text-sm text-white/60">Opus 15%</span>
              </div>
            </div>
          </motion.div>

          {/* Right: 3 tier cards */}
          <div className="space-y-4">
            {modelTiers.map((tier, index) => {
              const colors = colorClasses[tier.color];
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
                      <span className={`font-bold text-white`}>{tier.model}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${colors.badge}`}>
                      {tier.allocation}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-2">{tier.tasks}</p>
                  <p className={`text-xs font-mono italic ${colors.text} mb-2`}>{tier.example}</p>
                  <span className="text-xs text-white/40">{tier.cost}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Part 2: Before / After comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
        >
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 text-center">
            <div className="text-red-400 text-sm font-medium mb-2">Without FinOps</div>
            <div className="text-3xl font-bold text-white">$47</div>
            <div className="text-white/40 text-sm">per sprint (all-Opus)</div>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 text-center">
            <div className="text-emerald-400 text-sm font-medium mb-2">With AutoSpec FinOps</div>
            <div className="text-3xl font-bold text-white">$19</div>
            <div className="text-white/40 text-sm">per sprint (routed)</div>
          </div>
        </motion.div>

        {/* Key insight callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 bg-slate-800/30 border border-white/10 rounded-xl p-6 text-center"
        >
          <p className="text-white/60 text-sm italic max-w-3xl mx-auto leading-relaxed">
            "The routing isn't just about cost. Haiku is faster. When 40% of your tasks complete in
            under 2 seconds instead of 8, your development loop tightens. Cheaper AND faster."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
