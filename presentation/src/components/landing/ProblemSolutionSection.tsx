import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Shuffle, RotateCcw, Puzzle, ArrowDown, ArrowRight, FileText, Users, ListTodo, Bot, CheckCircle2 } from 'lucide-react';

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
              The Problem
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why AI Coding Often Fails
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              AI assistants are powerful, but without structure, they're unreliable partners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {problems.map((problem, index) => {
              const colors = colorClasses[problem.color];
              return (
                <motion.div
                  key={problem.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`${colors.bg} ${colors.border} border rounded-xl p-6 hover:scale-105 transition-transform`}
                >
                  <problem.icon className={`${colors.icon} mb-4`} size={32} />
                  <h3 className="text-lg font-semibold text-white mb-2">{problem.title}</h3>
                  <p className={`text-sm ${colors.text}`}>{problem.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Arrow Transition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex justify-center my-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 rounded-full flex items-center justify-center">
            <ArrowDown className="text-white/60" size={28} />
          </div>
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
        </motion.div>
      </div>
    </section>
  );
}
