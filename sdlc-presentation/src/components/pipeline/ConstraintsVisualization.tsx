import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ScrollText, Lock, Boxes } from 'lucide-react';

// The project's "laws" — the constraints injected into every agent context.
// Each maps directly to a pipeline gate enforced at execution time.
interface Constraint {
  iconKey: string;
  title: string;
  rules: string[]; // LTR — concrete, code-flavored rules
}

const constraintsEn: Constraint[] = [
  {
    iconKey: 'Layers',
    title: 'Architecture',
    rules: ['UI → Service → DB', 'No layer skipping', 'Modules stay decoupled'],
  },
  {
    iconKey: 'ScrollText',
    title: 'Conventions',
    rules: ['camelCase · 2-space indent', 'ESLint + Prettier enforced', 'Project style or no merge'],
  },
  {
    iconKey: 'Lock',
    title: 'Security',
    rules: ['No secrets in code', 'Parameterized queries only', 'AuthZ on every endpoint'],
  },
  {
    iconKey: 'Boxes',
    title: 'Tech Stack',
    rules: ['React + TypeScript + Postgres', 'Approved dependencies only', 'No new frameworks'],
  },
];

const constraintsHe: Constraint[] = [
  {
    iconKey: 'Layers',
    title: 'ארכיטקטורה',
    rules: ['UI → Service → DB', 'No layer skipping', 'מודולים נשארים מנותקים'],
  },
  {
    iconKey: 'ScrollText',
    title: 'מוסכמות',
    rules: ['camelCase · 2-space indent', 'ESLint + Prettier enforced', 'סגנון הפרויקט או אין merge'],
  },
  {
    iconKey: 'Lock',
    title: 'אבטחה',
    rules: ['No secrets in code', 'Parameterized queries only', 'AuthZ on every endpoint'],
  },
  {
    iconKey: 'Boxes',
    title: 'Tech Stack',
    rules: ['React + TypeScript + Postgres', 'Approved dependencies only', 'בלי frameworks חדשים'],
  },
];

// Literal classes only — one tone per constraint, fixed order.
const TONES = [
  { icon: Layers,     ring: 'border-emerald-500/30', glow: 'bg-emerald-500/10', text: 'text-emerald-300', dot: 'text-emerald-400/70' },
  { icon: ScrollText, ring: 'border-violet-500/30',  glow: 'bg-violet-500/10',  text: 'text-violet-300',  dot: 'text-violet-400/70' },
  { icon: Lock,       ring: 'border-cyan-500/30',    glow: 'bg-cyan-500/10',    text: 'text-cyan-300',    dot: 'text-cyan-400/70' },
  { icon: Boxes,      ring: 'border-blue-500/30',    glow: 'bg-blue-500/10',    text: 'text-blue-300',    dot: 'text-blue-400/70' },
] as const;

export default function ConstraintsVisualization({ lang }: { lang: 'en' | 'he' }) {
  const isRTL = lang === 'he';
  const constraints = isRTL ? constraintsHe : constraintsEn;

  return (
    <div className="max-w-2xl mx-auto">
      {/* constitution.md file frame */}
      <div className="bg-slate-950 rounded-xl border border-violet-500/20 overflow-hidden">
        {/* File header */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border-b border-slate-700">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-xs text-slate-400 font-mono">constitution.md · the laws of the project</span>
        </div>

        {/* Constraint categories */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {constraints.map((c, idx) => {
            const tone = TONES[idx];
            const Icon = tone.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className={`rounded-lg border ${tone.ring} bg-white/[0.02] p-3.5`}
              >
                <div className={`flex items-center gap-2.5 mb-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`shrink-0 w-8 h-8 rounded-lg ${tone.glow} border ${tone.ring} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${tone.text}`} strokeWidth={1.75} />
                  </div>
                  <span className={`text-sm font-bold ${tone.text}`}>{c.title}</span>
                </div>
                <ul className="flex flex-col gap-1.5" dir="ltr">
                  {c.rules.map((rule) => (
                    <li key={rule} className="flex items-start gap-2">
                      <span className={`mt-1.5 w-1 h-1 rounded-full bg-current ${tone.dot} shrink-0`} />
                      <span className="text-[11px] font-mono text-slate-400 leading-snug">{rule}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Footer — injected into every agent */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="px-4 py-2.5 border-t border-violet-500/15 bg-violet-500/[0.04]"
        >
          <span className="text-[11px] font-mono text-violet-300/70">
            {isRTL
              ? '→ מוזרק לכל הקשר סוכן · הצעות לא תואמות הופכות בלתי אפשריות מכנית'
              : '→ injected into every agent context · non-compliant suggestions become mechanically impossible'}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
