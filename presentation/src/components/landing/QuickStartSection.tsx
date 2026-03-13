import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Github, Download, Wrench } from 'lucide-react';

const options = [
  {
    title: 'GitHub Template',
    subtitle: 'Recommended',
    time: '30 seconds',
    icon: Github,
    color: 'blue',
    featured: true,
    description: 'Click "Use this template" on GitHub. Skills pre-installed for Claude Code, Cursor, Copilot, and Windsurf. Zero dependencies.',
    code: 'gh repo create my-project --template Hundia/autospec-starter',
    codeLabel: 'Copy Command',
  },
  {
    title: 'Download QUICKSTART.md',
    subtitle: 'Existing Projects',
    time: '1 minute',
    icon: Download,
    color: 'green',
    featured: false,
    description: 'Add QUICKSTART.md to any existing project. Place your requirements in a folder and tell your AI: "Run @QUICKSTART.md".',
    code: 'curl -o QUICKSTART.md https://raw.githubusercontent.com/Hundia/autospec/main/QUICKSTART.md\nmkdir -p requirements',
    codeLabel: 'Copy Commands',
  },
  {
    title: 'CLI Tools',
    subtitle: 'Optional',
    time: '2 minutes',
    icon: Wrench,
    color: 'purple',
    featured: false,
    description: 'Install the CLI for sprint status, viewer dashboard, and FinOps tracking. Not required for core workflow.',
    code: 'npm install -g autospec\nautospec status\nautospec viewer',
    codeLabel: 'Copy Commands',
  },
];

const colorClasses: Record<string, { bg: string; border: string; icon: string; time: string }> = {
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/50',
    icon: 'text-blue-400',
    time: 'bg-blue-500/10 text-blue-400',
  },
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: 'text-green-400',
    time: 'bg-green-500/10 text-green-400',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    icon: 'text-purple-400',
    time: 'bg-purple-500/10 text-purple-400',
  },
};

export default function QuickStartSection() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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
          <span className="inline-block px-4 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-sm text-green-400 mb-4">
            Get Started
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Start in 30 Seconds. Pick Your Path.
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Use the GitHub template for new projects, download QUICKSTART.md for existing ones, or add CLI tools for dashboards.
          </p>
        </motion.div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option, index) => {
            const colors = colorClasses[option.color];
            return (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative bg-slate-800/50 border rounded-xl p-6 flex flex-col ${
                  option.featured
                    ? `${colors.border} ring-1 ring-blue-500/20`
                    : 'border-slate-700'
                }`}
              >
                {/* Featured Badge */}
                {option.featured && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Recommended
                    </span>
                  </div>
                )}

                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <option.icon className={colors.icon} size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{option.title}</h3>
                      <p className="text-xs text-white/50">{option.subtitle}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${colors.time}`}>
                    {option.time}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-white/60 mb-4 flex-1">
                  {option.description}
                </p>

                {/* Code Block */}
                <div className="relative">
                  <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm text-white/80 whitespace-pre-wrap break-all">
                    {option.code}
                  </div>
                  <button
                    onClick={() => handleCopy(option.code, index)}
                    className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg text-xs text-white/60 hover:text-white transition-all"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check size={12} className="text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        {option.codeLabel}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
