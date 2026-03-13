import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ArrowDown, Server } from 'lucide-react';

const providers = [
  { id: 'claude', name: 'Claude Code', orchestrator: 'Opus 4.6', agent: 'Sonnet 4.6', accent: 'indigo' },
  { id: 'copilot', name: 'GitHub Copilot', orchestrator: 'GPT 5.4', agent: 'GPT 5.2', accent: 'blue' },
  { id: 'gemini', name: 'Gemini', orchestrator: 'Gemini Ultra', agent: 'Gemini Pro', accent: 'amber' },
  { id: 'local', name: 'Continue (Local)', orchestrator: 'Llama 4 70B', agent: 'Llama 4 8B', accent: 'green' },
];

const accentMap: Record<string, { bg: string; border: string; text: string; solid: string }> = {
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', solid: 'bg-indigo-500' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', solid: 'bg-blue-500' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', solid: 'bg-amber-500' },
  green: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', solid: 'bg-emerald-500' },
};

const agents = [
  { label: 'Agent A', task: 'Backend Sprint', tickets: ['11.1 API endpoints', '11.2 DB migration', '11.3 Validation'] },
  { label: 'Agent B', task: 'Frontend Sprint', tickets: ['11.4 Components', '11.5 State mgmt', '11.6 Routing'] },
  { label: 'Agent C', task: 'QA Sprint', tickets: ['11.7 API tests', '11.8 E2E tests', '11.9 Bug fixes'] },
];

const orchestratorCapabilities = [
  'Writes sprint briefs with full context',
  'Spawns parallel agents',
  'Reviews results and merges',
];

const modelFadeVariants = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

const modelTransition = { duration: 0.2 };

export default function OrchestratorSection() {
  const [activeId, setActiveId] = useState('claude');

  const active = providers.find((p) => p.id === activeId) ?? providers[0];
  const colors = accentMap[active.accent];

  return (
    <section id="orchestrator" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-sm text-indigo-400 mb-4">
            <Cpu size={14} />
            Execution Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Same Pattern.{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Any Provider.
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            The two-tier orchestrator pattern separates planning from implementation.
            Same specs drive any AI provider.
          </p>
        </motion.div>

        {/* Provider pill bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {providers.map((p) => {
            const isActive = p.id === activeId;
            const c = accentMap[p.accent];
            return (
              <button
                key={p.id}
                onClick={() => setActiveId(p.id)}
                className={
                  isActive
                    ? `px-4 py-2 rounded-full text-sm font-medium border transition-colors ${c.bg} ${c.border} ${c.text}`
                    : 'px-4 py-2 rounded-full text-sm font-medium border transition-colors bg-white/5 border-white/10 text-white/40 hover:text-white/60'
                }
              >
                {p.name}
              </button>
            );
          })}
        </motion.div>

        {/* Two-tier visualization */}
        <div className="space-y-6">
          {/* Top: Orchestrator card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`${colors.bg} ${colors.border} border rounded-xl p-6`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${colors.solid}`} />
                <div className={`absolute inset-0 w-3 h-3 rounded-full ${colors.solid} animate-ping opacity-75`} />
              </div>
              <Server className={colors.text} size={20} />
              <h3 className="text-white font-bold text-lg flex items-center gap-1">
                Orchestrator (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={active.orchestrator}
                    variants={modelFadeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={modelTransition}
                    className={`inline-block ${colors.text}`}
                  >
                    {active.orchestrator}
                  </motion.span>
                </AnimatePresence>
                )
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {orchestratorCapabilities.map((cap, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-white/60">
                  <div className={`w-1.5 h-1.5 ${colors.solid} rounded-full flex-shrink-0`} />
                  {cap}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Connecting arrows */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="flex flex-col items-center gap-1">
              <div className={`w-px h-6 border-l-2 border-dashed ${colors.border}`} />
              <ArrowDown className={colors.text} size={16} />
            </div>
          </motion.div>

          {/* Bottom: Agent cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className={`${colors.bg} ${colors.border} border rounded-xl p-5`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${colors.solid}`} />
                  <span className="text-white font-bold text-sm">{agent.label}</span>
                  <span className={`text-xs ${colors.text} font-mono ml-auto`}>{agent.task}</span>
                </div>
                <div className="mb-3">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={active.agent}
                      variants={modelFadeVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={modelTransition}
                      className={`inline-block text-xs font-mono px-2 py-0.5 rounded ${colors.bg} ${colors.border} border ${colors.text}`}
                    >
                      {active.agent}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="space-y-1.5">
                  {agent.tickets.map((ticket) => (
                    <div key={ticket} className="text-xs text-white/50 font-mono">
                      {ticket}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Benefits pills row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 pt-2"
          >
            {['Clean main context', 'Parallel execution', 'Isolated worktrees'].map((pill) => (
              <span
                key={pill}
                className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/60"
              >
                {pill}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-8 text-center"
        >
          <p className="text-white/80 text-lg italic max-w-3xl mx-auto leading-relaxed">
            "Same specs. Same pattern. Different models."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
