import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  BookOpen,
  ListTodo,
  FileCode,
  Play,
  Shield,
  BookMarked,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { phases } from '../../data/paper-content';

const iconMap: Record<string, React.ElementType> = {
  FileText,
  BookOpen,
  ListTodo,
  FileCode,
  Play,
  Shield,
  BookMarked,
  CheckCircle2,
};

const colorMap: Record<string, { bg: string; border: string; text: string; num: string; dot: string }> = {
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-400',    num: 'from-blue-500 to-blue-600',       dot: 'bg-blue-500' },
  violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/30',  text: 'text-violet-400',  num: 'from-violet-500 to-violet-600',   dot: 'bg-violet-500' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', num: 'from-emerald-500 to-emerald-600', dot: 'bg-emerald-500' },
  cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/30',    text: 'text-cyan-400',    num: 'from-cyan-500 to-cyan-600',       dot: 'bg-cyan-500' },
  indigo:  { bg: 'bg-indigo-500/10',  border: 'border-indigo-500/30',  text: 'text-indigo-400',  num: 'from-indigo-500 to-indigo-600',   dot: 'bg-indigo-500' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-400',   num: 'from-amber-500 to-amber-600',    dot: 'bg-amber-500' },
  green:   { bg: 'bg-green-500/10',   border: 'border-green-500/30',   text: 'text-green-400',   num: 'from-green-500 to-green-600',    dot: 'bg-green-500' },
  rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-500/30',    text: 'text-rose-400',    num: 'from-rose-500 to-rose-600',      dot: 'bg-rose-500' },
};

export default function MethodologySection() {
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
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-400 mb-4">
            <Layers size={14} />
            Section 2: Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            The{' '}
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              8-Phase Workflow
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Each project follows a structured eight-phase lifecycle that enforces documentation, testing, and knowledge capture at every step.
          </p>
        </motion.div>

        {/* Phases grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {phases.map((phase, index) => {
            const colors = colorMap[phase.color];
            const Icon = iconMap[phase.icon] || FileText;
            return (
              <motion.div
                key={phase.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`${colors.bg} ${colors.border} border rounded-xl p-5 relative overflow-hidden group hover:scale-105 transition-transform`}
              >
                {/* Number circle */}
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors.num} flex items-center justify-center text-white font-bold text-sm mb-4 shadow-lg`}>
                  {phase.num}
                </div>

                {/* Icon */}
                <Icon className={`${colors.text} mb-3`} size={22} />

                {/* Content */}
                <h3 className="text-white font-semibold mb-2 text-sm">{phase.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{phase.description}</p>

                {/* Subtle bg number */}
                <div className="absolute -bottom-2 -right-2 text-6xl font-black text-white/[0.03] select-none">
                  {phase.num}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Connecting flow line (lg only) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="hidden lg:flex items-center justify-center mt-8 gap-1"
        >
          {phases.map((phase, i) => {
            const colors = colorMap[phase.color];
            return (
              <React.Fragment key={phase.num}>
                <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                {i < phases.length - 1 && (
                  <div className="flex-1 h-px border-t border-dashed border-white/20 max-w-[60px]" />
                )}
              </React.Fragment>
            );
          })}
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="hidden lg:block text-center text-white/30 text-xs mt-3"
        >
          Each sprint cycles through all 8 phases — no phase is optional
        </motion.p>
      </div>
    </section>
  );
}
