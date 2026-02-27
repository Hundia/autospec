import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Brain, TrendingUp, XCircle, CheckCircle2 } from 'lucide-react';

const sprintPhases = [
  {
    sprint: 'Sprint 0',
    title: 'Cold Start Eliminated',
    description:
      'autospec init creates 10 role specs and the backlog. Your AI reads CLAUDE.md and understands the project structure from the first prompt.',
    icon: Rocket,
    color: 'blue',
    tickets: ['🔲 Setup project scaffold', '🔲 Configure auth module', '🔲 Design database schema'],
  },
  {
    sprint: 'Sprint 1',
    title: 'First Layer of Memory',
    description:
      'As tickets complete, sprint summaries capture what was built, what files changed, and what bugs were found. This becomes institutional memory.',
    icon: Brain,
    color: 'purple',
    tickets: ['✅ Project scaffold', '🔄 Auth module', '🔲 Database schema'],
  },
  {
    sprint: 'Sprint 2+',
    title: 'Compounding Knowledge',
    description:
      'Each new sprint inherits all prior summaries. The AI knows which approaches failed, which interfaces have quirks, which modules are fragile.',
    icon: TrendingUp,
    color: 'emerald',
    tickets: ['✅ Auth module', '✅ Database schema', '🔄 Booking system'],
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; dot: string; badge: string }> = {
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    dot: 'bg-blue-500',
    badge: 'bg-blue-500/20 text-blue-300',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    dot: 'bg-purple-500',
    badge: 'bg-purple-500/20 text-purple-300',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-500/20 text-emerald-300',
  },
};

export default function SprintMemorySection() {
  return (
    <section id="memory" className="py-24 px-4 sm:px-6 lg:px-8">
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
            <Sparkles size={14} />
            Key Differentiator
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your AI Agent Remembers Everything.{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Across Every Session.
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Most AI frameworks lose context when the session ends. AutoSpec's sprint memory system
            creates a permanent, growing knowledge base that makes every future session smarter.
          </p>
        </motion.div>

        {/* Sprint Timeline — Desktop horizontal, mobile vertical */}
        <div className="relative">
          {/* Horizontal memory thread bar (desktop) */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Vertical bar (mobile) */}
            <div className="md:hidden absolute top-0 bottom-0 left-5 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 rounded-full z-0" />

            {sprintPhases.map((phase, index) => {
              const colors = colorClasses[phase.color];
              return (
                <motion.div
                  key={phase.sprint}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                  className="relative z-10 pl-12 md:pl-0"
                >
                  {/* Connection dot to memory thread */}
                  <div className="flex justify-start md:justify-center mb-4">
                    <div
                      className={`w-6 h-6 rounded-full ${colors.dot} border-4 border-slate-950 shadow-lg flex-shrink-0 absolute left-2.5 md:static`}
                    />
                  </div>

                  <div
                    className={`${colors.bg} ${colors.border} border rounded-xl p-6 bg-slate-800/50`}
                  >
                    {/* Sprint badge */}
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold mb-3 ${colors.badge}`}
                    >
                      {phase.sprint}
                    </span>

                    {/* Icon + title */}
                    <div className="flex items-center gap-3 mb-3">
                      <phase.icon className={colors.text} size={20} />
                      <h3 className="text-white font-bold text-sm sm:text-base">{phase.title}</h3>
                    </div>

                    {/* Description */}
                    <p className="text-white/60 text-sm mb-4 leading-relaxed">{phase.description}</p>

                    {/* Mini ticket list */}
                    <div className="space-y-1.5">
                      {phase.tickets.map((ticket) => (
                        <div key={ticket} className="text-xs text-white/50 font-mono">
                          {ticket}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* vs Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16"
        >
          {/* Other Tools */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
            <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
              <XCircle size={20} /> Other Frameworks
            </h4>
            <div className="space-y-2 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500/50 rounded-full flex-shrink-0" />
                Session 1: Full context ✓
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500/50 rounded-full flex-shrink-0" />
                Session 2: Context lost ✗
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500/50 rounded-full flex-shrink-0" />
                Session 3: Start from zero ✗
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500/50 rounded-full flex-shrink-0" />
                Session N: Still starting from zero ✗
              </div>
            </div>
          </div>

          {/* AutoSpec */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
            <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 size={20} /> AutoSpec
            </h4>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                Session 1: Full context from specs ✓
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                Session 2: Specs + Sprint 0 memory ✓
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                Session 3: Specs + Sprint 0-1 memory ✓
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                Session N: Full accumulated knowledge ✓
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key quote callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-8 text-center"
        >
          <p className="text-white/80 text-lg italic max-w-3xl mx-auto leading-relaxed">
            "Close your IDE. Come back next week. Open a new AI session. It reads CLAUDE.md, the
            backlog, and the sprint summaries — and picks up exactly where you left off."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
