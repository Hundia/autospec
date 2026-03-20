import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiggyBank } from 'lucide-react';

const providers = [
  {
    id: 'claude',
    name: 'Claude',
    accent: 'indigo',
    tiers: [
      { model: 'Haiku', cost: '~$0.001/task' },
      { model: 'Sonnet', cost: '~$0.01/task' },
      { model: 'Opus', cost: '~$0.05/task' },
    ],
    before: { label: 'All-Opus', cost: '$47' },
    after: { label: 'Routed', cost: '$19' },
  },
  {
    id: 'copilot',
    name: 'Copilot',
    accent: 'blue',
    tiers: [
      { model: 'GPT-4o mini', cost: '~$0.002/task' },
      { model: 'GPT-4o', cost: '~$0.015/task' },
      { model: 'GPT-5.4', cost: '~$0.06/task' },
    ],
    before: { label: 'All-GPT-5.4', cost: '$52' },
    after: { label: 'Routed', cost: '$21' },
  },
  {
    id: 'gemini',
    name: 'Gemini',
    accent: 'amber',
    tiers: [
      { model: 'Flash', cost: '~$0.0005/task' },
      { model: 'Pro', cost: '~$0.008/task' },
      { model: 'Ultra', cost: '~$0.04/task' },
    ],
    before: { label: 'All-Ultra', cost: '$38' },
    after: { label: 'Routed', cost: '$15' },
  },
  {
    id: 'local',
    name: 'Local',
    accent: 'green',
    tiers: [
      { model: 'GPT OSS 7B', cost: '$0 (self-hosted)' },
      { model: 'GPT OSS 30B', cost: '$0 (self-hosted)' },
      { model: 'GPT OSS 120B', cost: '$0 (self-hosted)' },
    ],
    before: { label: 'All-120B', cost: '$0' },
    after: { label: 'Routed', cost: '$0' },
  },
];

const tierDescriptions = [
  {
    allocation: '40%',
    tasks: 'Data extraction, doc updates, boilerplate, CRUD',
    example: '"Extract field names from Prisma schema as TypeScript interface"',
  },
  {
    allocation: '45%',
    tasks: 'State machines, multi-file refactors, component synthesis',
    example: '"Implement waitlist promotion: cancel → promote → deduct credit → notify"',
  },
  {
    allocation: '15%',
    tasks: 'Architecture decisions, security audits, complex debugging',
    example: '"Analyze booking/membership/notification race conditions"',
  },
];

const tierColors = [
  {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    text: 'text-cyan-400',
    badge: 'bg-cyan-500/20 text-cyan-300',
    dot: 'bg-cyan-500',
  },
  {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    badge: 'bg-purple-500/20 text-purple-300',
    dot: 'bg-purple-500',
  },
  {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300',
    dot: 'bg-amber-500',
  },
];

const accentMap: Record<string, { bg: string; border: string; text: string; solid: string }> = {
  indigo: {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    text: 'text-indigo-400',
    solid: 'bg-indigo-500',
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    solid: 'bg-blue-500',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    solid: 'bg-amber-500',
  },
  green: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    solid: 'bg-emerald-500',
  },
};

const fadeSlide = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.2 },
};

export default function FinOpsSection() {
  const [activeId, setActiveId] = useState('claude');
  const active = providers.find((p) => p.id === activeId)!;

  return (
    <section id="finops" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
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
            Smart task routing sends each job to the cheapest model that can handle it — across any provider.
          </p>
        </motion.div>

        {/* Provider selector pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {providers.map((p) => {
            const isActive = p.id === activeId;
            const colors = accentMap[p.accent];
            return (
              <button
                key={p.id}
                onClick={() => setActiveId(p.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  isActive
                    ? `${colors.bg} ${colors.border} ${colors.text}`
                    : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/60 hover:bg-white/10'
                }`}
              >
                {p.name}
              </button>
            );
          })}
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
              {tierColors.map((tc, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${tc.dot}`} />
                  <span className="text-sm text-white/60">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={active.tiers[i].model}
                        {...fadeSlide}
                        className="inline-block"
                      >
                        {active.tiers[i].model}
                      </motion.span>
                    </AnimatePresence>
                    {' '}
                    {tierDescriptions[i].allocation}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: 3 tier cards */}
          <div className="space-y-4">
            {tierDescriptions.map((desc, index) => {
              const colors = tierColors[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`bg-slate-800/50 ${colors.border} border rounded-xl p-5`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                      <span className="font-bold text-white">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={active.tiers[index].model}
                            {...fadeSlide}
                            className="inline-block"
                          >
                            {active.tiers[index].model}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${colors.badge}`}>
                      {desc.allocation}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-2">{desc.tasks}</p>
                  <p className={`text-xs font-mono italic ${colors.text} mb-2`}>{desc.example}</p>
                  <span className="text-xs text-white/40">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={active.tiers[index].cost}
                        {...fadeSlide}
                        className="inline-block"
                      >
                        {active.tiers[index].cost}
                      </motion.span>
                    </AnimatePresence>
                  </span>
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
            <div className="text-3xl font-bold text-white">
              <AnimatePresence mode="wait">
                <motion.span
                  key={active.before.cost}
                  {...fadeSlide}
                  className="inline-block"
                >
                  {active.before.cost}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="text-white/40 text-sm">
              per sprint (
              <AnimatePresence mode="wait">
                <motion.span
                  key={active.before.label}
                  {...fadeSlide}
                  className="inline-block"
                >
                  {active.before.label}
                </motion.span>
              </AnimatePresence>
              )
            </div>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 text-center">
            <div className="text-emerald-400 text-sm font-medium mb-2">With AutoSpec FinOps</div>
            <div className="text-3xl font-bold text-white">
              <AnimatePresence mode="wait">
                <motion.span
                  key={active.after.cost}
                  {...fadeSlide}
                  className="inline-block"
                >
                  {active.after.cost}
                </motion.span>
              </AnimatePresence>
            </div>
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
