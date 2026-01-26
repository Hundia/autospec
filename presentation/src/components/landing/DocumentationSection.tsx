import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Zap, GraduationCap, FileText, ArrowRight, Clock, Target, Layers } from 'lucide-react';

const docs = [
  {
    icon: Zap,
    title: 'Quick Start',
    description: '5 steps to your first spec-driven project',
    time: '5 min read',
    color: 'blue',
    link: '#quickstart',
    featured: true,
  },
  {
    icon: GraduationCap,
    title: 'Deep Dive',
    description: '9 chapters covering philosophy, methodology & results',
    time: '45 min read',
    color: 'purple',
    link: '#',
  },
  {
    icon: FileText,
    title: 'Academic Paper',
    description: 'Peer-review style paper with full methodology & data',
    time: '20 min read',
    color: 'green',
    link: '#paper',
  },
];

const topics = [
  { icon: Target, name: 'Philosophy', desc: 'Why specs matter' },
  { icon: Layers, name: '10-Role Model', desc: 'Complete coverage' },
  { icon: Clock, name: 'Sprint System', desc: 'Incremental delivery' },
  { icon: BookOpen, name: 'Best Practices', desc: 'Proven patterns' },
];

const colorClasses: Record<string, { bg: string; border: string; icon: string; gradient: string }> = {
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: 'text-blue-500', gradient: 'from-blue-500 to-cyan-500' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: 'text-purple-500', gradient: 'from-purple-500 to-pink-500' },
  green: { bg: 'bg-green-500/10', border: 'border-green-500/30', icon: 'text-green-500', gradient: 'from-green-500 to-emerald-500' },
};

export default function DocumentationSection() {
  return (
    <section id="docs" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-sm text-green-400 mb-4">
            <BookOpen size={14} />
            Documentation
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Comprehensive Documentation
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Everything you need to master spec-driven development with AI
          </p>
        </motion.div>

        {/* Documentation Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {docs.map((doc, index) => {
            const colors = colorClasses[doc.color];
            return (
              <motion.a
                key={doc.title}
                href={doc.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`group relative ${colors.bg} ${colors.border} border rounded-xl p-6 hover:scale-105 transition-all`}
              >
                {doc.featured && (
                  <div className="absolute -top-3 right-4">
                    <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                      Start Here
                    </span>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-4`}>
                  <doc.icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{doc.title}</h3>
                <p className="text-sm text-white/60 mb-4">{doc.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40 flex items-center gap-1">
                    <Clock size={12} />
                    {doc.time}
                  </span>
                  <span className={`flex items-center gap-1 text-sm ${colors.icon} group-hover:gap-2 transition-all`}>
                    Read
                    <ArrowRight size={14} />
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Topics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl p-8"
        >
          <h3 className="text-xl font-semibold text-white text-center mb-8">What You'll Learn</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {topics.map((topic, index) => (
              <motion.div
                key={topic.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center p-4"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-white/5 rounded-xl flex items-center justify-center">
                  <topic.icon className="text-white/60" size={24} />
                </div>
                <h4 className="font-medium text-white mb-1">{topic.name}</h4>
                <p className="text-xs text-white/50">{topic.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Academic Paper CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          id="paper"
          className="mt-12 text-center"
        >
          <div className="inline-block p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl">
            <FileText className="mx-auto mb-4 text-green-500" size={40} />
            <h3 className="text-xl font-semibold text-white mb-2">Academic Paper Available</h3>
            <p className="text-white/60 mb-4 max-w-md">
              Read our peer-review style paper documenting the complete AutoSpec methodology,
              including case studies and empirical results.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded-lg transition-colors"
            >
              <FileText size={18} />
              Download Paper (PDF)
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
