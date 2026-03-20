import React from 'react'; // needed for React.Fragment
import { motion } from 'framer-motion';
import { MessageSquare, Shuffle, RotateCcw, Puzzle, BrainCircuit, ArrowRight, FileText, Users, ListTodo, Bot, CheckCircle2 } from 'lucide-react';

const problems = [
  {
    icon: MessageSquare,
    title: 'Vague Requests',
    description: '"Build me a login system"',
    color: 'red',
  },
  {
    icon: Shuffle,
    title: 'Unpredictable Output',
    description: 'Different results every time',
    color: 'red',
  },
  {
    icon: RotateCcw,
    title: 'Endless Iterations',
    description: 'Back and forth fixing issues',
    color: 'red',
  },
  {
    icon: Puzzle,
    title: 'Integration Chaos',
    description: "Code that doesn't fit together",
    color: 'red',
  },
  {
    icon: BrainCircuit,
    title: 'Context Amnesia',
    description: 'Every session starts from zero — no memory of past decisions.',
    color: 'red',
  },
];

const solution = [
  {
    icon: FileText,
    title: 'Requirements',
    description: 'Clear vision documented',
    color: 'blue',
  },
  {
    icon: Users,
    title: '10 Role Specs',
    description: 'Complete perspectives',
    color: 'purple',
  },
  {
    icon: ListTodo,
    title: 'Sprint Backlog',
    description: 'Prioritized tickets',
    color: 'cyan',
  },
  {
    icon: Bot,
    title: 'AI Execution',
    description: 'Precise implementation',
    color: 'green',
  },
  {
    icon: CheckCircle2,
    title: 'Shipping Code',
    description: 'Production ready',
    color: 'emerald',
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  red: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: 'text-red-500' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: 'text-blue-500' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: 'text-purple-500' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', icon: 'text-cyan-500' },
  green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: 'text-green-500' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: 'text-emerald-500' },
};

export default function ProblemSolutionSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Problem Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-sm text-red-400 mb-4">
              Why AI Coding Fails
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              AI Agents Are Powerful. Without Structure, They're Expensive Chaos.
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              AI assistants are powerful, but without structure, they're unreliable partners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {problems.map((problem, index) => {
              const colors = colorClasses[problem.color];
              const isLast = index === problems.length - 1;
              return (
                <motion.div
                  key={problem.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`${colors.bg} ${colors.border} border rounded-xl p-6 hover:scale-105 transition-transform ${
                    isLast ? 'sm:col-span-2 sm:max-w-xs sm:mx-auto lg:col-span-1 lg:max-w-none' : ''
                  }`}
                >
                  <problem.icon className={`${colors.icon} mb-4`} size={32} />
                  <h3 className="text-lg font-semibold text-white mb-2">{problem.title}</h3>
                  <p className={`text-sm ${colors.text}`}>{problem.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Enhanced Transition Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center my-12 gap-0"
        >
          {/* Top vertical gradient line (red→blue) */}
          <div
            className="w-px h-12"
            style={{ background: 'linear-gradient(to bottom, rgb(239 68 68 / 0.4), rgb(59 130 246 / 0.6))' }}
          />

          {/* Central badge with spring animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="relative"
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-xl scale-150" />
            {/* Ring border */}
            <div className="absolute inset-0 rounded-full border border-white/10" />
            {/* Badge */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/80">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </motion.div>

          {/* Label text */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-3 mb-3 text-sm font-medium bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent text-center"
          >
            AutoSpec transforms chaos into structure
          </motion.p>

          {/* Bottom vertical gradient line (blue→green) */}
          <div
            className="w-px h-12"
            style={{ background: 'linear-gradient(to bottom, rgb(59 130 246 / 0.6), rgb(16 185 129 / 0.4))' }}
          />
        </motion.div>

        {/* Solution Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-sm text-green-400 mb-4">
              The Solution
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              The AutoSpec Way
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Treat specifications as code. Every line of output traces back to a spec.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
            {solution.map((step, index) => {
              const colors = colorClasses[step.color];
              return (
                <React.Fragment key={step.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`${colors.bg} ${colors.border} border rounded-xl p-6 w-full lg:w-auto lg:min-w-[160px] text-center hover:scale-105 transition-transform`}
                  >
                    <step.icon className={`${colors.icon} mx-auto mb-3`} size={28} />
                    <h3 className="text-sm font-semibold text-white mb-1">{step.title}</h3>
                    <p className={`text-xs ${colors.text}`}>{step.description}</p>
                  </motion.div>
                  {index < solution.length - 1 && (
                    <ArrowRight className="hidden lg:block text-white/20 flex-shrink-0" size={24} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Bottom line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center text-white/50 mt-12 text-lg max-w-xl mx-auto"
          >
            You don't have an AI problem. You have a structure problem.{' '}
            <span className="text-white font-semibold">AutoSpec is the structure.</span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
