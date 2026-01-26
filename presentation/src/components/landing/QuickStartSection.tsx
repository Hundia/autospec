import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Terminal, ChevronRight, FileText, Users, Zap } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Initialize Project',
    description: 'Set up AutoSpec in your project',
    command: 'npx autospec init',
    output: `✓ Created specs/ directory
✓ Created prompts/ directory
✓ Created backlog/ directory
✓ Initialized autospec.config.json

AutoSpec is ready! Next: Define your requirements.`,
  },
  {
    number: '02',
    title: 'Define Requirements',
    description: 'Describe what you want to build',
    command: 'vim requirements.md',
    output: `# My Project Requirements

## Overview
Build a task management application with:
- User authentication (email/password)
- Project organization
- Real-time collaboration
- Mobile-responsive design

## Core Features
- [ ] User registration and login
- [ ] Create, edit, delete projects
- [ ] Add tasks with due dates
- [ ] Assign tasks to team members`,
    isFile: true,
  },
  {
    number: '03',
    title: 'Generate Specs',
    description: 'Create 10 role-based specifications',
    command: 'autospec build-team',
    output: `Generating specifications from 10 perspectives...

✓ product_manager.md    (Vision & User Stories)
✓ backend_lead.md       (API & Services)
✓ frontend_lead.md      (Components & UX)
✓ database_architect.md (Schema & Migrations)
✓ qa_lead.md            (Testing Strategy)
✓ devops_lead.md        (Infrastructure)
✓ marketing_lead.md     (Go-to-Market)
✓ finance_lead.md       (Pricing & Economics)
✓ business_lead.md      (Strategy)
✓ ui_designer.md        (Screens & Wireframes)

Generated 10 specs with 8,500+ lines of documentation.`,
  },
  {
    number: '04',
    title: 'Execute Sprint',
    description: 'Generate AI-ready prompts for development',
    command: 'autospec sprint 0',
    output: `Sprint 0: Foundation Setup
═══════════════════════════

Tickets for this sprint:
  1. [SETUP] Initialize project repository
  2. [SETUP] Configure development environment
  3. [DB] Create initial database schema
  4. [AUTH] Implement user authentication
  5. [API] Set up API foundation

Total: 12 tickets | Estimated: 4-6 hours

✓ Prompt generated: prompts/sprint-0.md
  Copy and paste into your AI assistant →`,
  },
];

export default function QuickStartSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [displayedOutput, setDisplayedOutput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<number | null>(null);

  const currentStep = steps[activeStep];

  // Typewriter effect for terminal output
  useEffect(() => {
    setDisplayedOutput('');
    setIsTyping(true);
    let index = 0;
    const output = currentStep.output;

    const interval = setInterval(() => {
      if (index < output.length) {
        setDisplayedOutput(output.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [activeStep]);

  const handleCopy = async (command: string, index: number) => {
    await navigator.clipboard.writeText(command);
    setCopiedCommand(index);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <section id="quickstart" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400 mb-4">
            <Zap size={14} />
            Quick Start
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Start Building in Minutes
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Four simple steps from idea to spec-driven development
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Steps List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {steps.map((step, index) => (
              <button
                key={step.number}
                onClick={() => setActiveStep(index)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeStep === index
                    ? 'bg-blue-500/10 border-blue-500/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-bold ${
                      activeStep === index
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-sm text-white/60">{step.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <code className="text-xs bg-slate-800 px-2 py-1 rounded text-blue-400 font-mono">
                        {step.command}
                      </code>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(step.command, index);
                        }}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        {copiedCommand === index ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} className="text-white/40" />
                        )}
                      </button>
                    </div>
                  </div>
                  <ChevronRight
                    className={`text-white/40 transition-transform ${
                      activeStep === index ? 'rotate-90' : ''
                    }`}
                    size={20}
                  />
                </div>
              </button>
            ))}
          </motion.div>

          {/* Terminal Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-slate-950 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/80 border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-white/40 font-mono">
                    {currentStep.isFile ? currentStep.command.split(' ')[1] : 'terminal'}
                  </span>
                </div>
                <Terminal size={14} className="text-white/40" />
              </div>

              {/* Terminal Content */}
              <div className="p-4 h-[400px] overflow-auto font-mono text-sm">
                {!currentStep.isFile && (
                  <div className="flex items-center gap-2 text-white/60 mb-2">
                    <span className="text-green-400">$</span>
                    <span className="text-white">{currentStep.command}</span>
                  </div>
                )}
                <AnimatePresence mode="wait">
                  <motion.pre
                    key={activeStep}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`whitespace-pre-wrap ${
                      currentStep.isFile ? 'text-white/80' : 'text-white/60'
                    }`}
                  >
                    {displayedOutput}
                    {isTyping && (
                      <span className="inline-block w-2 h-4 bg-white/60 animate-pulse ml-0.5" />
                    )}
                  </motion.pre>
                </AnimatePresence>
              </div>
            </div>

            {/* Helper text */}
            <p className="text-center text-sm text-white/40 mt-4">
              Click each step to see the output
            </p>
          </motion.div>
        </div>

        {/* Full Documentation Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href="#docs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/80 hover:text-white transition-all"
          >
            <FileText size={18} />
            Full Quick Start Guide
            <ChevronRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
