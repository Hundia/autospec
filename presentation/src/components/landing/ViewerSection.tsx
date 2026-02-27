import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, BarChart3, Search, TrendingDown, GitBranch, Code2, Palette, Users } from 'lucide-react';

const viewerFeatures = [
  {
    icon: BarChart3,
    title: 'Project Dashboard',
    description: 'Sprint velocity, ticket completion, and documentation coverage at a glance.',
  },
  {
    icon: Search,
    title: 'Spec Browser',
    description: 'Full-text search across all 10 role specs with syntax highlighting.',
  },
  {
    icon: TrendingDown,
    title: 'Sprint Burndown',
    description: 'Visual timeline of every sprint — planned, shipped, and carried over.',
  },
  {
    icon: GitBranch,
    title: 'Architecture Diagrams',
    description: 'Auto-rendered system diagrams showing module boundaries and data flow.',
  },
  {
    icon: Code2,
    title: 'Mermaid Rendering',
    description: 'Every Mermaid diagram renders as interactive, zoomable SVG.',
  },
  {
    icon: Palette,
    title: 'Design System',
    description: 'Live preview of color tokens, typography, and component primitives.',
  },
];

const barHeights = [40, 65, 55, 80, 70, 90, 85];

export default function ViewerSection() {
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
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-400 mb-4">
            <Monitor size={14} />
            Built-in Viewer
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            See Your Entire Project.{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              In One Interface.
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            AutoSpec Viewer renders your specs, sprints, and architecture diagrams into a browsable,
            searchable interface.
          </p>
        </motion.div>

        {/* Main grid: features + browser mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Feature list */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            {viewerFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.07] transition-colors"
              >
                <div className="w-9 h-9 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="text-cyan-400" size={18} />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm mb-0.5">{feature.title}</div>
                  <div className="text-white/50 text-sm">{feature.description}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right: Browser mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-slate-950 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/80 border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-slate-800 rounded-md px-3 py-1 text-xs text-white/40 font-mono">
                    localhost:3000/viewer
                  </div>
                </div>
              </div>

              {/* Dashboard content mockup */}
              <div className="p-6 space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <div className="text-xs text-blue-400 mb-1">Specs</div>
                    <div className="text-xl font-bold text-white">10</div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                    <div className="text-xs text-purple-400 mb-1">Tickets</div>
                    <div className="text-xl font-bold text-white">42</div>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                    <div className="text-xs text-emerald-400 mb-1">Done</div>
                    <div className="text-xl font-bold text-white">38</div>
                  </div>
                </div>

                {/* Chart mockup (bars) */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-xs text-white/40 mb-3">Sprint Velocity</div>
                  <div className="flex items-end gap-2 h-24">
                    {barHeights.map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-sm"
                      />
                    ))}
                  </div>
                </div>

                {/* Spec list mockup */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-xs text-white/40 mb-3">Recent Specs</div>
                  <div className="space-y-2">
                    {['product_manager.md', 'backend_lead.md', 'qa_lead.md'].map((name) => (
                      <div key={name} className="flex items-center gap-2 text-xs">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                        <span className="text-white/60 font-mono">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stakeholder callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 flex items-center justify-center gap-3 text-white/50 text-sm"
        >
          <Users size={16} className="text-cyan-400 flex-shrink-0" />
          <span>
            Non-technical stakeholders can browse the Viewer to understand project status —
            without reading a single line of code.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
