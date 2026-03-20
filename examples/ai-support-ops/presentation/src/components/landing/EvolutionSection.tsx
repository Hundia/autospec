import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Code2, Bot, Shield } from 'lucide-react';

const eras = [
  {
    id: 1,
    era: 'Traditional',
    tagline: 'Slow but predictable.',
    description: 'Docs existed because humans wrote them.',
    bullets: [
      'Humans wrote and maintained all documentation',
      'Context preserved across sessions manually',
      'Slow delivery — weeks per feature',
    ],
    icon: FileText,
    color: 'slate',
    borderColor: 'border-slate-400',
    bgColor: 'bg-slate-500/10',
    badgeBg: 'bg-slate-500/20',
    badgeText: 'text-slate-300',
    iconColor: 'text-slate-400',
    dotColor: 'bg-slate-400',
  },
  {
    id: 2,
    era: 'Code Assistant',
    tagline: 'AI helped type faster, not think better.',
    description: 'Autocomplete at scale. Still no memory.',
    bullets: [
      'GitHub Copilot, ChatGPT in the editor',
      'Productivity boost — but context still lost',
      'Documentation still manual, often skipped',
    ],
    icon: Code2,
    color: 'blue',
    borderColor: 'border-blue-400',
    bgColor: 'bg-blue-500/10',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-blue-300',
    iconColor: 'text-blue-400',
    dotColor: 'bg-blue-400',
  },
  {
    id: 3,
    era: 'Agentic AI',
    tagline: 'Revolutionary power, dangerous autonomy.',
    description: 'AI writes features. No structure. No memory.',
    bullets: [
      'Claude Code, Cursor agents build autonomously',
      'Sessions end — context vanishes completely',
      '40+ hours/quarter reverse-engineering output',
    ],
    icon: Bot,
    color: 'amber',
    borderColor: 'border-amber-400',
    bgColor: 'bg-amber-500/10',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    iconColor: 'text-amber-400',
    dotColor: 'bg-amber-400',
  },
  {
    id: 4,
    era: 'SDD (AutoSpec)',
    tagline: 'Structure + AI = reliable development partner.',
    description: 'Specs drive agents. Memory compounds. Teams scale.',
    bullets: [
      'Specs, backlog, and summaries encode all context',
      'AI agents pick up exactly where they left off',
      'Cost drops. Velocity compounds. Quality holds.',
    ],
    icon: Shield,
    color: 'green',
    borderColor: 'border-emerald-400',
    bgColor: 'bg-emerald-500/10',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    iconColor: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
  },
];

export default function EvolutionSection() {
  return (
    <section id="evolution" className="py-24 px-4 sm:px-6 lg:px-8">
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
            <Shield size={14} />
            The Evolution
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            From Chaos to Structure.{' '}
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Four Eras of Development.
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Every era brought more AI power. Only SDD brings the structure to harness it reliably.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal connecting bar (desktop) */}
          <div className="hidden md:block absolute top-[0.625rem] left-0 right-0 h-1 bg-gradient-to-r from-slate-400 via-blue-400 via-amber-400 to-emerald-400 rounded-full z-0 opacity-50" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Vertical bar (mobile) */}
            <div className="md:hidden absolute top-0 bottom-0 left-5 w-1 bg-gradient-to-b from-slate-400 via-blue-400 via-amber-400 to-emerald-400 rounded-full z-0 opacity-50" />

            {eras.map((era, index) => (
              <motion.div
                key={era.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="relative z-10 pl-12 md:pl-0"
              >
                {/* Connection dot */}
                <div className="flex justify-start md:justify-center mb-4">
                  <div
                    className={`w-6 h-6 rounded-full ${era.dotColor} border-4 border-slate-950 shadow-lg flex-shrink-0 absolute left-2.5 md:static`}
                  />
                </div>

                {/* Card */}
                <div
                  className={`${era.bgColor} border-l-4 ${era.borderColor} border border-slate-700/50 rounded-xl p-5 bg-slate-800/50`}
                >
                  {/* Era badge */}
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold mb-3 ${era.badgeBg} ${era.badgeText}`}
                  >
                    Era {era.id}
                  </span>

                  {/* Icon + era name */}
                  <div className="flex items-center gap-2 mb-2">
                    <era.icon className={era.iconColor} size={18} />
                    <h3 className="text-white font-bold text-sm">{era.era}</h3>
                  </div>

                  {/* Tagline */}
                  <p className={`${era.iconColor} text-xs font-medium mb-3 italic`}>
                    "{era.tagline}"
                  </p>

                  {/* Bullets */}
                  <div className="space-y-1.5">
                    {era.bullets.map((bullet, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-white/50">
                        <div className={`w-1.5 h-1.5 rounded-full ${era.dotColor} mt-1 flex-shrink-0`} />
                        {bullet}
                      </div>
                    ))}
                  </div>
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
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-8 text-center"
        >
          <p className="text-white/80 text-lg italic max-w-3xl mx-auto leading-relaxed">
            "Every era brought more AI power. Only SDD brings the structure to harness it."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
