import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Server,
  Layout,
  Database,
  TestTube2,
  Cloud,
  Megaphone,
  DollarSign,
  BarChart3,
  Palette,
  Users,
} from 'lucide-react';
import { roles } from '../../data/paper-content';

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Server,
  Layout,
  Database,
  TestTube2,
  Cloud,
  Megaphone,
  DollarSign,
  BarChart3,
  Palette,
};

const colorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400',    icon: 'text-blue-400' },
  green:   { bg: 'bg-green-500/10',   border: 'border-green-500/20',   text: 'text-green-400',   icon: 'text-green-400' },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  text: 'text-purple-400',  icon: 'text-purple-400' },
  orange:  { bg: 'bg-orange-500/10',  border: 'border-orange-500/20',  text: 'text-orange-400',  icon: 'text-orange-400' },
  yellow:  { bg: 'bg-yellow-500/10',  border: 'border-yellow-500/20',  text: 'text-yellow-400',  icon: 'text-yellow-400' },
  cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20',    text: 'text-cyan-400',    icon: 'text-cyan-400' },
  pink:    { bg: 'bg-pink-500/10',    border: 'border-pink-500/20',    text: 'text-pink-400',    icon: 'text-pink-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: 'text-emerald-400' },
  indigo:  { bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20',  text: 'text-indigo-400',  icon: 'text-indigo-400' },
  rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    text: 'text-rose-400',    icon: 'text-rose-400' },
};

export default function RoleModelSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
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
            <Users size={14} />
            Section 3: Role Model
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            10-Role{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Specification Model
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Every project perspective is captured through a dedicated role specification, eliminating blind spots in AI-generated code.
          </p>
        </motion.div>

        {/* Roles grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {roles.map((role, index) => {
            const colors = colorMap[role.color];
            const Icon = iconMap[role.icon] || FileText;
            return (
              <motion.div
                key={role.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className={`${colors.bg} ${colors.border} border rounded-xl p-4 hover:scale-105 transition-transform group`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`${colors.icon} flex-shrink-0`} size={18} />
                  <span className={`text-xs font-bold font-mono ${colors.text}`}>{role.num}</span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1 leading-tight">{role.name}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{role.focus}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6 text-center"
        >
          <p className="text-white/70 text-sm italic max-w-3xl mx-auto leading-relaxed">
            "Each spec file is a living document — updated after every sprint that touches its domain. The AI never re-discovers what's already been decided."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
