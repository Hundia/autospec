import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, ArrowDown, Server, Code2, Shield } from 'lucide-react';

const agents = [
  { label: 'Agent A', task: 'Backend Sprint', tickets: ['11.1 API endpoints', '11.2 DB migration', '11.3 Validation'], color: 'teal' },
  { label: 'Agent B', task: 'Frontend Sprint', tickets: ['11.4 Components', '11.5 State mgmt', '11.6 Routing'], color: 'teal' },
  { label: 'Agent C', task: 'QA Sprint', tickets: ['11.7 API tests', '11.8 E2E tests', '11.9 Bug fixes'], color: 'teal' },
];

const orchestratorCapabilities = [
  'Writes sprint briefs with full context',
  'Spawns parallel agents',
  'Reviews results and merges',
];

export default function OrchestratorSection() {
  return (
    <section id="orchestrator" className="py-24 px-4 sm:px-6 lg:px-8">
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
            Execution Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Opus Plans. Sonnet Builds.{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              In Perfect Harmony.
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            The two-tier orchestrator pattern separates planning from implementation.
            Opus handles architecture decisions while Sonnet agents execute in parallel worktrees.
          </p>
        </motion.div>

        {/* Two-tier visualization */}
        <div className="space-y-6">
          {/* Top: Orchestrator card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-indigo-500 animate-ping opacity-75" />
              </div>
              <Server className="text-indigo-400" size={20} />
              <h3 className="text-white font-bold text-lg">Orchestrator (Opus)</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {orchestratorCapabilities.map((cap, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-white/60">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />
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
              <div className="w-px h-6 border-l-2 border-dashed border-indigo-500/40" />
              <ArrowDown className="text-indigo-400" size={16} />
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
                className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span className="text-white font-bold text-sm">{agent.label}</span>
                  <span className="text-xs text-teal-400 font-mono ml-auto">{agent.task}</span>
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
            "Main context stays clean. Agents work in isolated worktrees. Knowledge flows up through sprint summaries."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
