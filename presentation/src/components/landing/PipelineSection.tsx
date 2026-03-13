import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText } from 'lucide-react';

const steps = [
  { num: '01', title: 'Write Requirements', time: '1–2 hours', output: 'requirements.md', color: 'blue', hero: false },
  { num: '02', title: 'Generate Specs', time: '5 minutes', output: 'specs/*.md (10 files)', color: 'violet', hero: false },
  { num: '03', title: 'Generate Documentation', time: '10 minutes', output: 'docs/ (50+ files)', color: 'emerald', hero: false },
  { num: '04', title: 'Generate Skills', time: '2 minutes', output: '.claude/commands/ (10 skills)', color: 'cyan', hero: false },
  { num: '05', title: 'Build & Review Viewer', time: '5 minutes', output: 'Viewer app (live dashboard)', color: 'amber', hero: true },
  { num: '06', title: 'Plan & Execute Sprints', time: '2–4 hours/sprint', output: 'Working features + docs/', color: 'indigo', hero: false },
  { num: '07', title: 'QA + Living Updates', time: '30 minutes', output: 'Verified code + updated docs/', color: 'green', hero: false },
  { num: '08', title: 'User Review', time: '1–2 hours', output: 'Approval or change requests', color: 'rose', hero: false },
  { num: '09', title: 'Sprint Close & Summary', time: '5 minutes', output: 'sprints/sprint-X/summary.md', color: 'teal', hero: true },
];

const colorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  blue:    { border: 'border-blue-500/30',    bg: 'bg-blue-500/10',    text: 'text-blue-400',    glow: 'shadow-blue-500/20' },
  violet:  { border: 'border-violet-500/30',  bg: 'bg-violet-500/10',  text: 'text-violet-400',  glow: 'shadow-violet-500/20' },
  emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  cyan:    { border: 'border-cyan-500/30',    bg: 'bg-cyan-500/10',    text: 'text-cyan-400',    glow: 'shadow-cyan-500/20' },
  amber:   { border: 'border-amber-500/30',   bg: 'bg-amber-500/10',   text: 'text-amber-400',   glow: 'shadow-amber-500/20' },
  indigo:  { border: 'border-indigo-500/30',  bg: 'bg-indigo-500/10',  text: 'text-indigo-400',  glow: 'shadow-indigo-500/20' },
  green:   { border: 'border-green-500/30',   bg: 'bg-green-500/10',   text: 'text-green-400',   glow: 'shadow-green-500/20' },
  rose:    { border: 'border-rose-500/30',    bg: 'bg-rose-500/10',    text: 'text-rose-400',    glow: 'shadow-rose-500/20' },
  teal:    { border: 'border-teal-500/30',    bg: 'bg-teal-500/10',    text: 'text-teal-400',    glow: 'shadow-teal-500/20' },
};

interface StepCardProps {
  step: typeof steps[0];
  index: number;
}

function StepCard({ step, index }: StepCardProps) {
  const colors = colorMap[step.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className={`relative flex flex-col border-l-4 ${colors.border} ${colors.bg} rounded-xl p-5 ${
        step.hero ? `shadow-lg ${colors.glow} shadow-lg ring-1 ring-white/10` : ''
      }`}
    >
      {/* Faded step number */}
      <span className={`absolute top-3 right-4 text-5xl font-black opacity-10 ${colors.text} select-none`}>
        {step.num}
      </span>

      {/* Title */}
      <h3 className="text-white font-semibold text-sm mb-3 pr-10 leading-snug">
        {step.title}
        {step.hero && (
          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}>
            key
          </span>
        )}
      </h3>

      {/* Time estimate */}
      <div className="flex items-center gap-1.5 text-white/50 text-xs mb-2">
        <Clock size={11} className="shrink-0" />
        <span>{step.time}</span>
      </div>

      {/* Output artifact */}
      <div className="flex items-start gap-1.5 text-white/40 text-xs">
        <FileText size={11} className="shrink-0 mt-0.5" />
        <code className="break-all leading-tight">{step.output}</code>
      </div>
    </motion.div>
  );
}

export default function PipelineSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400 mb-4">
            End-to-End Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            From Requirements to Running Code
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            9 steps. Full traceability. Every artifact version-controlled.
          </p>
        </motion.div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {steps.map((step, index) => (
            <StepCard key={step.num} step={step} index={index} />
          ))}
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-block bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-white/10 rounded-2xl px-8 py-6 max-w-2xl">
            <p className="text-white/70 text-lg italic leading-relaxed">
              "The developer who reviews before coding ships faster than the one who codes before thinking."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
