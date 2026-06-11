import React from 'react';
import { motion } from 'framer-motion';

const skillLines = {
  en: [
    '$ ls .claude/commands/',
    '',
    'execute-ticket.md     # Run a single backlog ticket',
    'bolt-run.md         # Execute full sprint cycle',
    'plan-bolt.md        # Plan next sprint from backlog',
    'bolt-status.md      # Check sprint progress',
    'create-spec.md        # Generate role-based spec',
    'qa-review.md          # QA verification checklist',
    'update-backlog.md     # Update ticket statuses',
    'bolt-close.md       # Close sprint + summary',
    'create-bolt-docs.md # Generate sprint docs',
    'help.md               # Show all commands',
    '',
    '10 skills loaded → ready for any IDE',
  ],
  he: [
    '$ ls .claude/commands/',
    '',
    'execute-ticket.md     # הרץ משימה בודדת',
    'bolt-run.md         # הרץ מחזור בולט מלא',
    'plan-bolt.md        # תכנן בולט הבא',
    'bolt-status.md      # בדוק התקדמות בולט',
    'create-spec.md        # הפק מפרט מבוסס תפקיד',
    'qa-review.md          # צ\'קליסט אימות QA',
    'update-backlog.md     # עדכן סטטוס משימות',
    'bolt-close.md       # סגור בולט + סיכום',
    'create-bolt-docs.md # הפק דוקומנטציית בולט',
    'help.md               # הצג את כל הפקודות',
    '',
    '10 כלים נטענו → מוכן לכל IDE',
  ],
};

export default function SkillsVisualization({ lang }: { lang: 'en' | 'he' }) {
  const lines = skillLines[lang];
  return (
    <div className="bg-slate-950 rounded-xl border border-cyan-500/20 overflow-hidden max-w-2xl mx-auto">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border-b border-slate-700">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-xs text-slate-400 font-mono">.claude/commands/</span>
      </div>
      <div className="p-4 font-mono text-sm space-y-0.5">
        {lines.map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: idx * 0.06, duration: 0.3 }}
            className={
              line.startsWith('$') ? 'text-cyan-400 font-bold' :
              line.startsWith('10') ? 'text-cyan-300 font-semibold mt-2' :
              line === '' ? 'h-2' :
              'text-slate-400'
            }
          >
            {line || '\u00A0'}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
