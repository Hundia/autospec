import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, Rocket } from 'lucide-react';

const TERMINAL_LINES = [
  { text: '$ npx lightspeedspec init', type: 'command' },
  { text: '', type: 'blank' },
  { text: 'Scanning project... done (0.8s)', type: 'info' },
  { text: 'Detected: TypeScript + React + Express', type: 'result' },
  { text: 'Complexity: 42/100 → Standard depth', type: 'result' },
  { text: '', type: 'blank' },
  { text: 'Generating spec... done (38s)', type: 'info' },
  { text: '', type: 'blank' },
  { text: 'Created:', type: 'success' },
  { text: '  .lss/spec.md     (847 lines)', type: 'success' },
  { text: '  .lss/tasks.md    (12 tasks)', type: 'success' },
  { text: '  .lss/.meta.json', type: 'success' },
  { text: '', type: 'blank' },
  { text: 'Next: lss status | lss graduate', type: 'highlight' },
];

const lineColors: Record<string, string> = {
  command: 'text-white font-bold',
  blank: '',
  info: 'text-white/40',
  result: 'text-cyan-300/80',
  highlight: 'text-amber-300 font-semibold',
  success: 'text-green-400',
};

const steps = [
  { n: '1', icon: Search, label: 'Scan', desc: 'lss detects your tech stack, architecture, and complexity automatically' },
  { n: '2', icon: Zap, label: 'Generate', desc: 'LLM generates exactly the right amount of spec for your project' },
  { n: '3', icon: Rocket, label: 'Ship', desc: 'Use lss status to track tasks, lss graduate when ready to scale up' },
];

export default function QuickStartSection() {
  const [visible, setVisible] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setVisible(0);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setVisible(i);
      if (i >= TERMINAL_LINES.length) clearInterval(timer);
    }, 200);
    return () => clearInterval(timer);
  }, [inView]);

  return (
    <section id="quickstart" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Get Started in 30 Seconds</h2>
          <p className="text-xl text-white/50">One command. Zero configuration. Immediate value.</p>
        </motion.div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          onViewportEnter={() => setInView(true)}
          className="terminal-window max-w-2xl mx-auto mb-16 shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(245,158,11,0.12)' }}
        >
          <div className="terminal-header">
            <div className="terminal-dot bg-red-400" />
            <div className="terminal-dot bg-yellow-400" />
            <div className="terminal-dot bg-green-400" />
            <span className="text-xs text-white/40 ml-3 font-mono">lss — terminal</span>
          </div>
          <div className="p-6 font-mono text-sm space-y-1">
            {TERMINAL_LINES.slice(0, visible).map((line, i) => (
              <div key={i} className={lineColors[line.type] || 'text-white/60'}>
                {line.text || '\u00A0'}
              </div>
            ))}
            {visible < TERMINAL_LINES.length && (
              <span className="inline-block w-2 h-4 bg-amber-400 animate-pulse" />
            )}
          </div>
        </motion.div>

        {/* Three steps */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-2xl p-6 text-center transition-colors"
            >
              <div className="w-12 h-12 bg-amber-500/15 border border-amber-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                {React.createElement(step.icon, { size: 22, className: 'text-amber-400' })}
              </div>
              <div className="text-xs text-amber-500/60 font-mono mb-1">Step {step.n}</div>
              <h3 className="text-xl font-bold text-white mb-2">{step.label}</h3>
              <p className="text-sm text-white/50">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
