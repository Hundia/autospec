import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ClipboardList, FileText, Hammer, ShieldCheck, BookOpen, ChevronRight } from 'lucide-react';

const phases = [
  {
    number: 1,
    title: 'Plan',
    description: 'PM spec drives ticket creation. Dependencies mapped.',
    icon: ClipboardList,
    color: 'blue',
  },
  {
    number: 2,
    title: 'Document',
    description: 'Write docs/ BEFORE code. Architecture decisions captured.',
    icon: FileText,
    color: 'purple',
  },
  {
    number: 3,
    title: 'Execute',
    description: 'Agents implement tickets. Parallel where safe.',
    icon: Hammer,
    color: 'amber',
  },
  {
    number: 4,
    title: 'QA',
    description: 'Test pyramid. Bug fix protocol. No shortcuts.',
    icon: ShieldCheck,
    color: 'rose',
  },
  {
    number: 5,
    title: 'Summarize',
    description: 'Sprint summary links to docs, files, tests. Future agents read this.',
    icon: BookOpen,
    color: 'emerald',
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; dot: string; iconBg: string }> = {
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500', iconBg: 'bg-blue-500/20' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-500', iconBg: 'bg-purple-500/20' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-500', iconBg: 'bg-amber-500/20' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', dot: 'bg-rose-500', iconBg: 'bg-rose-500/20' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-500', iconBg: 'bg-emerald-500/20' },
};

export default function SprintLifecycleSection() {
  return (
    <section id="lifecycle" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
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
            <RefreshCw size={14} />
            The Sprint Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Five Phases.{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Every Sprint.
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            AutoSpec enforces a complete lifecycle for every sprint. No phase is optional.
            Each builds on the last to create compounding project intelligence.
          </p>
        </motion.div>

        {/* 5-phase pipeline — horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Horizontal connecting line (desktop) */}
          <div className="hidden lg:block absolute top-14 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500 opacity-30" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {phases.map((phase, index) => {
              const colors = colorClasses[phase.color];
              return (
                <motion.div
                  key={phase.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Arrow between cards (desktop, not on last) */}
                  {index < phases.length - 1 && (
                    <div className="hidden lg:block absolute -right-2 top-14 z-10">
                      <ChevronRight className="text-white/20" size={16} />
                    </div>
                  )}

                  <div className={`${colors.bg} ${colors.border} border rounded-xl p-5 h-full`}>
                    {/* Phase number + icon */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
                        <phase.icon className={colors.text} size={16} />
                      </div>
                      <div>
                        <div className="text-xs text-white/40 font-mono">Phase {phase.number}</div>
                        <div className="text-white font-bold text-sm">{phase.title}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/50 text-sm leading-relaxed">{phase.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl p-8 text-center"
        >
          <p className="text-white/80 text-lg italic max-w-3xl mx-auto leading-relaxed">
            "This cycle repeats every sprint. Each iteration builds on the last. By Sprint 5,
            your AI knows more about your project than you do."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
