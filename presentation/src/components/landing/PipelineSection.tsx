import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, ArrowRight } from 'lucide-react';

const phases = [
  {
    num: '01',
    title: 'Foundation',
    subtitle: 'Specs, docs, and skills',
    time: '~2 hours',
    output: 'specs/*.md · docs/ · .claude/commands/',
    color: 'blue',
    description: 'Write your requirements once. AI generates 10 role specs, 50+ doc files, and CLI skills — everything your agents need to stay aligned.',
  },
  {
    num: '02',
    title: 'Visualize',
    subtitle: 'Build & review the Viewer',
    time: '~5 minutes',
    output: 'viewer/ (live dashboard)',
    color: 'amber',
    description: 'Before writing a line of code, review your entire project visually. Specs, backlog, and architecture — all in one browsable interface.',
  },
  {
    num: '03',
    title: 'Build',
    subtitle: 'Execute sprints iteratively',
    time: '2–4 hrs/sprint',
    output: 'Working features + docs/',
    color: 'indigo',
    description: 'Parallel agents without collisions. Each agent owns its ticket, traces back to a spec, and updates the docs when done.',
  },
  {
    num: '04',
    title: 'Close',
    subtitle: 'Summarize & repeat',
    time: '~5 min/sprint',
    output: 'sprints/sprint-X/summary.md',
    color: 'teal',
    description: 'Sprint close writes the summary automatically. Next session, any agent picks up with full context — no re-explaining, no drift.',
  },
];

const phaseColors: Record<string, { border: string; bg: string; text: string }> = {
  blue:   { border: 'border-blue-500/30',   bg: 'bg-blue-500/10',   text: 'text-blue-400' },
  amber:  { border: 'border-amber-500/30',  bg: 'bg-amber-500/10',  text: 'text-amber-400' },
  indigo: { border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
  teal:   { border: 'border-teal-500/30',   bg: 'bg-teal-500/10',   text: 'text-teal-400' },
};

export default function PipelineSection() {
  return (
    <section
      id="how-it-works"
      data-testid="pipeline-section"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950"
    >
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
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            From Requirements to Running Code
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Four phases. Full traceability. Every artifact version-controlled.
          </p>
        </motion.div>

        {/* Desktop: horizontal stepper */}
        <div className="hidden lg:flex items-stretch gap-3 mb-16">
          {phases.map((phase, index) => {
            const colors = phaseColors[phase.color];
            return (
              <React.Fragment key={phase.num}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`relative flex-1 min-w-0 flex flex-col border ${colors.border} ${colors.bg} rounded-2xl p-6 overflow-hidden`}
                  data-testid={`pipeline-phase-${index}`}
                >
                  {/* Faded number watermark */}
                  <span className={`absolute -bottom-3 -right-2 text-8xl font-black opacity-[0.07] ${colors.text} select-none leading-none`}>
                    {phase.num}
                  </span>

                  {/* Phase label */}
                  <div className={`text-xs font-semibold uppercase tracking-widest ${colors.text} mb-1`}>
                    Phase {phase.num}
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-bold text-lg mb-1">{phase.title}</h3>
                  <p className={`text-xs ${colors.text} mb-4`}>{phase.subtitle}</p>

                  {/* Description */}
                  <p className="text-white/55 text-xs leading-relaxed mb-4 flex-1">{phase.description}</p>

                  {/* Time */}
                  <div className={`flex items-center gap-1.5 text-xs ${colors.text} mb-3`}>
                    <Clock size={11} className="shrink-0" />
                    <span>{phase.time}</span>
                  </div>

                  {/* Output artifact */}
                  <div className={`flex items-start gap-1.5 px-3 py-2 rounded-lg border ${colors.border} ${colors.bg}`}>
                    <FileText size={11} className={`shrink-0 mt-0.5 ${colors.text}`} />
                    <code className={`text-xs font-mono ${colors.text} break-all leading-tight min-w-0`}>{phase.output}</code>
                  </div>
                </motion.div>

                {/* Connector arrow between phases */}
                {index < phases.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="flex-shrink-0 flex items-center justify-center w-6"
                    aria-hidden="true"
                  >
                    <ArrowRight size={18} className="text-white/20" />
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile: vertical stack */}
        <div className="flex lg:hidden flex-col gap-4 mb-16">
          {phases.map((phase, index) => {
            const colors = phaseColors[phase.color];
            return (
              <motion.div
                key={phase.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`relative border-l-4 ${colors.border} ${colors.bg} rounded-xl p-5 min-w-0`}
                data-testid={`pipeline-phase-${index}`}
              >
                <div className={`text-xs font-semibold uppercase tracking-widest ${colors.text} mb-1`}>
                  Phase {phase.num} · {phase.time}
                </div>
                <h3 className="text-white font-bold mb-1">{phase.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed mb-3">{phase.description}</p>
                <div className={`flex items-start gap-1.5 px-3 py-2 rounded-lg border ${colors.border} ${colors.bg}`}>
                  <FileText size={11} className={`shrink-0 mt-0.5 ${colors.text}`} />
                  <code className={`text-xs font-mono ${colors.text} break-all leading-tight min-w-0`}>{phase.output}</code>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom callout — preserved from original */}
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
