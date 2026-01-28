import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, Sparkles } from 'lucide-react';

const aiTools = [
  { name: 'Claude', status: 'full', description: 'Best performance with Opus/Sonnet' },
  { name: 'GitHub Copilot', status: 'full', description: 'Works great in VS Code' },
  { name: 'Cursor', status: 'full', description: 'Optimized for AI-first IDE' },
  { name: 'GPT-4', status: 'partial', description: 'Good for simpler tasks' },
  { name: 'Gemini', status: 'partial', description: 'Improving support' },
  { name: 'Windsurf', status: 'coming', description: 'Coming soon' },
];

const ides = [
  { name: 'VS Code', status: 'full' },
  { name: 'Cursor', status: 'full' },
  { name: 'JetBrains', status: 'full' },
  { name: 'Neovim', status: 'full' },
  { name: 'Terminal', status: 'full' },
];

const statusConfig = {
  full: { icon: Check, color: 'text-green-500', bg: 'bg-green-500/20', label: 'Full Support' },
  partial: { icon: Circle, color: 'text-yellow-500', bg: 'bg-yellow-500/20', label: 'Partial' },
  coming: { icon: Sparkles, color: 'text-blue-500', bg: 'bg-blue-500/20', label: 'Coming Soon' },
};

export default function ToolsSection() {
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
          <span className="inline-block px-4 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-400 mb-4">
            Compatibility
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Works With Your Favorite Tools
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            AutoSpec generates prompts optimized for leading AI assistants and works in any development environment
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* AI Assistants */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6">AI Assistants</h3>
            <div className="space-y-3">
              {aiTools.map((tool) => {
                const status = statusConfig[tool.status as keyof typeof statusConfig];
                return (
                  <div
                    key={tool.name}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${status.bg}`}>
                        <status.icon size={16} className={status.color} />
                      </div>
                      <div>
                        <div className="font-medium text-white">{tool.name}</div>
                        <div className="text-xs text-white/50">{tool.description}</div>
                      </div>
                    </div>
                    <span className={`text-xs ${status.color}`}>{status.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* IDEs & Editors */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6">IDEs & Editors</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {ides.map((ide) => {
                const status = statusConfig[ide.status as keyof typeof statusConfig];
                return (
                  <div
                    key={ide.name}
                    className="flex items-center gap-2 p-3 bg-white/5 rounded-lg"
                  >
                    <status.icon size={16} className={status.color} />
                    <span className="text-sm text-white">{ide.name}</span>
                  </div>
                );
              })}
            </div>

            {/* How it works */}
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-lg">
              <h4 className="font-medium text-white mb-3">How It Works</h4>
              <ol className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center text-xs text-blue-400">1</span>
                  <span>AutoSpec generates markdown prompts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center text-xs text-blue-400">2</span>
                  <span>Copy prompt to your AI assistant</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center text-xs text-blue-400">3</span>
                  <span>AI executes with full context</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center text-xs text-blue-400">4</span>
                  <span>Update backlog, repeat</span>
                </li>
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
