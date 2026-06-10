import React from 'react';
import { motion } from 'framer-motion';

interface RoleCard {
  icon: string;
  oldRole: string;
  newRole: string;
  oneLiner: string;
  stage: string;
  accent: string;
}

interface ChecklistItem {
  type: 'check' | 'warn';
  text: string;
}

interface SdlcRolesSlideProps {
  data: {
    title: string;
    subtitle: string;
    roles: RoleCard[];
    coreShiftTitle: string;
    coreShift: ChecklistItem[];
  };
  lang: 'en' | 'he';
}

const accentClasses: Record<string, { border: string; bg: string; text: string; stage: string }> = {
  teal: { border: 'border-teal-500/30', bg: 'bg-teal-500/10', text: 'text-teal-400', stage: 'bg-teal-500/20 text-teal-300' },
  blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400', stage: 'bg-blue-500/20 text-blue-300' },
  violet: { border: 'border-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-400', stage: 'bg-violet-500/20 text-violet-300' },
  cyan: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-400', stage: 'bg-cyan-500/20 text-cyan-300' },
  emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', stage: 'bg-emerald-500/20 text-emerald-300' },
  amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400', stage: 'bg-amber-500/20 text-amber-300' },
  indigo: { border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', text: 'text-indigo-400', stage: 'bg-indigo-500/20 text-indigo-300' },
  rose: { border: 'border-rose-500/30', bg: 'bg-rose-500/10', text: 'text-rose-400', stage: 'bg-rose-500/20 text-rose-300' },
};

export default function SdlcRolesSlide({ data }: SdlcRolesSlideProps) {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl sm:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-teal-400 via-blue-400 to-violet-400 bg-clip-text text-transparent"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center text-slate-400 text-base mb-6 max-w-2xl mx-auto"
      >
        {data.subtitle}
      </motion.p>

      {/* Role cards: 3+3 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {data.roles.map((role, idx) => {
          const colors = accentClasses[role.accent] || accentClasses.teal;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.08, duration: 0.4 }}
              className={`${colors.bg} border ${colors.border} rounded-xl p-4`}
            >
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl flex-shrink-0">{role.icon}</span>
                <div className="min-w-0">
                  <div className="text-white/40 text-xs line-through mb-0.5">{role.oldRole}</div>
                  <div className={`font-bold text-sm ${colors.text}`}>{role.newRole}</div>
                </div>
              </div>
              <p className="text-white/55 text-xs mb-2 leading-relaxed">{role.oneLiner}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${colors.stage}`}>
                {role.stage}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Core shift checklist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-slate-800/60 border border-white/10 rounded-xl px-6 py-4 max-w-3xl mx-auto"
      >
        <p className="text-white/60 text-xs uppercase tracking-widest mb-3">{data.coreShiftTitle}</p>
        <ul className="space-y-2">
          {data.coreShift.map((item, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + idx * 0.1 }}
              className="flex items-start gap-2 text-sm"
            >
              <span className={item.type === 'check' ? 'text-green-400' : 'text-amber-400'}>
                {item.type === 'check' ? '✓' : '⚠'}
              </span>
              <span className={item.type === 'check' ? 'text-white/70' : 'text-amber-300/80'}>
                {item.text}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
