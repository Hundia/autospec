import React from 'react';
import { motion } from 'framer-motion';

export default function SprintSummaryVisualization({ lang }: { lang: 'en' | 'he' }) {
  const isHe = lang === 'he';

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Terminal: sprint-close command */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
               className="bg-slate-950 rounded-xl border border-teal-500/20 overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-slate-400 font-mono">claude</span>
        </div>
        <div className="p-3 font-mono text-xs space-y-1">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-teal-400">
            {'>'} /sprint-close
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="text-slate-400">
            {isHe ? 'סוגר ספרינט 11... מייצר סיכום...' : 'Closing Sprint 11... Generating summary...'}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 }} className="text-green-400">
            ✓ sprints/sprint-11/summary.md {isHe ? 'נוצר' : 'created'}
          </motion.div>
        </div>
      </motion.div>

      {/* Sprint Summary Document */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 }}
        className="bg-slate-950 rounded-xl border border-teal-500/20 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📋</span>
          <span className="text-sm font-mono text-teal-400">sprints/sprint-11/summary.md</span>
        </div>

        <div className="space-y-3 text-sm">
          {/* Section: Release Notes */}
          <motion.div
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.7 }}
            className="bg-slate-800/50 rounded-lg p-3"
            style={{ borderLeftWidth: '3px', borderLeftColor: '#3b82f6', borderLeftStyle: 'solid' }}
          >
            <div className="text-blue-400 font-semibold text-xs uppercase tracking-wide mb-1">{isHe ? 'סיכום ושינויים' : 'Summary & Release Notes'}</div>
            <div className="text-slate-300 text-xs space-y-0.5">
              <div>• {isHe ? 'הוספת מערכת אימות JWT עם refresh tokens' : 'Added JWT auth system with refresh tokens'}</div>
              <div>• {isHe ? 'דף התחברות עם תמיכה ב-OTP' : 'Login page with OTP support'}</div>
              <div>• {isHe ? '3 API endpoints חדשים' : '3 new API endpoints'}</div>
            </div>
          </motion.div>

          {/* Section: Linked Docs */}
          <motion.div
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.9 }}
            className="bg-slate-800/50 rounded-lg p-3"
            style={{ borderLeftWidth: '3px', borderLeftColor: '#8b5cf6', borderLeftStyle: 'solid' }}
          >
            <div className="text-violet-400 font-semibold text-xs uppercase tracking-wide mb-1">{isHe ? 'מסמכים מקושרים' : 'Linked Documentation'}</div>
            <div className="text-slate-400 text-xs space-y-0.5 font-mono">
              <div className="text-violet-300/70">→ docs/auth/01-architecture.md</div>
              <div className="text-violet-300/70">→ docs/auth/02-jwt-flow.md</div>
              <div className="text-violet-300/70">→ docs/frontend/03-login-page.md</div>
            </div>
          </motion.div>

          {/* Section: Files Modified */}
          <motion.div
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 1.1 }}
            className="bg-slate-800/50 rounded-lg p-3"
            style={{ borderLeftWidth: '3px', borderLeftColor: '#22c55e', borderLeftStyle: 'solid' }}
          >
            <div className="text-green-400 font-semibold text-xs uppercase tracking-wide mb-1">{isHe ? 'קבצים ששונו' : 'Files Modified'}</div>
            <div className="text-slate-400 text-xs space-y-0.5 font-mono">
              <div><span className="text-green-400">+</span> src/auth/auth.service.ts</div>
              <div><span className="text-green-400">+</span> src/auth/auth.guard.ts</div>
              <div><span className="text-amber-400">~</span> src/pages/Login.tsx</div>
              <div className="text-slate-500">... 12 {isHe ? 'קבצים נוספים' : 'more files'}</div>
            </div>
          </motion.div>

          {/* Section: Closing Commit */}
          <motion.div
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 1.3 }}
            className="bg-slate-800/50 rounded-lg p-3"
            style={{ borderLeftWidth: '3px', borderLeftColor: '#f59e0b', borderLeftStyle: 'solid' }}
          >
            <div className="text-amber-400 font-semibold text-xs uppercase tracking-wide mb-1">{isHe ? 'Commit סגירה' : 'Closing Commit'}</div>
            <div className="text-slate-400 text-xs font-mono">
              <span className="text-amber-300">a3f7c21</span> feat(sprint-11): auth system + login page
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* The Magic Callout */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 1.5 }}
        className="bg-gradient-to-r from-teal-500/10 to-violet-500/10 border border-teal-500/30 rounded-xl p-4 text-center"
      >
        <div className="text-lg mb-1">✨</div>
        <p className="text-sm text-teal-300 font-medium">
          {isHe
            ? 'זה הקסם: בפעם הבאה שסוכן ירצה לשנות/להרחיב/לעדכן משהו מהספרינט הזה — כל מה שהוא צריך נמצא כאן. בלי הנדסה לאחור!'
            : "This is the magic: next time an agent needs to change, extend, or update anything from this sprint — everything it needs is right here. No reverse engineering!"}
        </p>
      </motion.div>
    </div>
  );
}
