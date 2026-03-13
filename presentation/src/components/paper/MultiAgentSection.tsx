import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, ArrowDown, Server, Zap } from 'lucide-react';
import { orchestratorData } from '../../data/paper-content';

export default function MultiAgentSection() {
  const { orchestrator, agents, comparison } = orchestratorData;
  const sequentialPct = 100;
  const parallelPct = Math.round((comparison.parallel.hours / comparison.sequential.hours) * 100);

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
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-sm text-indigo-400 mb-4">
            <Cpu size={14} />
            Section 4: Execution Model
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Orchestrator{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              + Agent Pattern
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            A two-tier architecture separates planning from implementation, enabling safe parallel execution across isolated git worktrees.
          </p>
        </motion.div>

        {/* Two-tier visualization */}
        <div className="space-y-6 mb-16">
          {/* Orchestrator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-indigo-500 animate-ping opacity-75" />
              </div>
              <Server className="text-indigo-400" size={20} />
              <h3 className="text-white font-bold text-lg">
                Orchestrator{' '}
                <span className="text-indigo-400">({orchestrator.model})</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {orchestrator.capabilities.map((cap, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-white/60">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0" />
                  {cap}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-px h-6 border-l-2 border-dashed border-indigo-500/30" />
              <ArrowDown className="text-indigo-400" size={16} />
            </div>
          </motion.div>

          {/* Agents */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-white font-bold text-sm">{agent.label}</span>
                  <span className="text-xs text-indigo-400 font-mono ml-auto">{agent.task}</span>
                </div>
                <div>
                  <span className="inline-block text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                    {agent.model}
                  </span>
                </div>
                <div className="mt-3 text-xs text-white/40">Isolated worktree · No conflicts</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-800/50 border border-white/10 rounded-xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Zap className="text-yellow-400" size={20} />
            <h3 className="text-white font-bold text-lg">Execution Time Comparison</h3>
            <span className="ml-auto text-xs font-bold px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              {comparison.savings} faster
            </span>
          </div>

          <div className="space-y-6">
            {/* Sequential bar */}
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-white/70">{comparison.sequential.label}</span>
                <span className="text-white font-semibold">{comparison.sequential.hours}h</span>
              </div>
              <div className="h-8 bg-slate-900/50 rounded-lg overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${sequentialPct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-lg flex items-center justify-end pr-3"
                >
                  <span className="text-white text-xs font-semibold">100%</span>
                </motion.div>
              </div>
            </div>

            {/* Parallel bar */}
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-white/70">{comparison.parallel.label}</span>
                <span className="text-white font-semibold">{comparison.parallel.hours}h</span>
              </div>
              <div className="h-8 bg-slate-900/50 rounded-lg overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${parallelPct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-lg flex items-center justify-end pr-3"
                >
                  <span className="text-white text-xs font-semibold">{parallelPct}%</span>
                </motion.div>
              </div>
            </div>
          </div>

          <p className="text-white/40 text-xs mt-4 text-center">
            Sprint 18 example: 3 agents in parallel worktrees complete ~45% faster than sequential execution
          </p>
        </motion.div>
      </div>
    </section>
  );
}
