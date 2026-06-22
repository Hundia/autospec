import React from 'react';
import { motion } from 'framer-motion';

const requirementsLines = {
  en: [
    '# REQ-MFL-001 · Game Of Drones',
    '',
    '## Project Overview',
    'Drone telemetry platform — per-subsystem health over one radio link...',
    '',
    '## User Stories',
    '- As an operator, I want each subsystem to report OK / DEGRADED / FAIL',
    '- As an operator, I want MFL status on every telemetry cycle',
    '- As a ground crew, I want to assess airworthiness in real time',
    '- As a pilot, I want to respond to in-flight degradation',
    '',
    '## Technical Requirements',
    '- Strict ICD — pre-defined message types only',
    '- New MFL message across all subsystems',
    '- Backend · Frontend · Simulator in scope',
    '- Real-time per-cycle status reporting',
  ],
  he: [
    '# REQ-MFL-001 · Game Of Drones',
    '',
    '## סקירת הפרויקט',
    'פלטפורמת טלמטריית רחפן — בריאות לכל תת-מערכת על קישור רדיו אחד...',
    '',
    '## סיפורי משתמש',
    '- כמפעיל, אני רוצה שכל תת-מערכת תדווח OK / DEGRADED / FAIL',
    '- כמפעיל, אני רוצה סטטוס MFL בכל מחזור טלמטריה',
    '- כצוות קרקע, אני רוצה להעריך כשירות-טיסה בזמן אמת',
    '- כטייס, אני רוצה להגיב להידרדרות תוך כדי טיסה',
    '',
    '## דרישות טכניות',
    '- ICD נוקשה — רק סוגי הודעות מוגדרים מראש',
    '- הודעת MFL חדשה על פני כל תת-המערכות',
    '- Backend · Frontend · סימולטור בהיקף',
    '- דיווח סטטוס בזמן אמת בכל מחזור',
  ],
};

export default function TerminalVisualization({ lang }: { lang: 'en' | 'he' }) {
  const lines = requirementsLines[lang];
  return (
    <div className="bg-slate-950 rounded-xl border border-slate-700 overflow-hidden max-w-2xl mx-auto">
      {/* Terminal chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border-b border-slate-700">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-xs text-slate-400 font-mono">requirements.md</span>
      </div>
      {/* Content */}
      <div className="p-4 font-mono text-sm space-y-0.5 max-h-80 overflow-hidden">
        {lines.map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
            className={
              line.startsWith('#') ? 'text-blue-400 font-bold' :
              line.startsWith('-') ? 'text-green-400' :
              line === '' ? 'h-3' :
              'text-slate-300'
            }
          >
            {line || '\u00A0'}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
