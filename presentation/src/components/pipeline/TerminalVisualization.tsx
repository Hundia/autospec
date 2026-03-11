import React from 'react';
import { motion } from 'framer-motion';

const requirementsLines = {
  en: [
    '# ShopFlow E-Commerce Platform',
    '',
    '## Project Overview',
    'A full-stack e-commerce platform with modern UX...',
    '',
    '## User Stories',
    '- As a customer, I want to browse products by category',
    '- As a customer, I want to add items to my cart',
    '- As a seller, I want to manage my inventory',
    '- As an admin, I want to view sales analytics',
    '',
    '## Technical Requirements',
    '- React + TypeScript frontend',
    '- NestJS API with PostgreSQL',
    '- Stripe payment integration',
    '- Real-time inventory tracking',
  ],
  he: [
    '# פלטפורמת ShopFlow מסחר אלקטרוני',
    '',
    '## סקירת הפרויקט',
    'פלטפורמת מסחר אלקטרוני full-stack עם UX מודרני...',
    '',
    '## סיפורי משתמש',
    '- כלקוח, אני רוצה לעיין במוצרים לפי קטגוריה',
    '- כלקוח, אני רוצה להוסיף פריטים לעגלה',
    '- כמוכר, אני רוצה לנהל את המלאי שלי',
    '- כאדמין, אני רוצה לצפות באנליטיקס מכירות',
    '',
    '## דרישות טכניות',
    '- React + TypeScript frontend',
    '- NestJS API עם PostgreSQL',
    '- אינטגרציית תשלומי Stripe',
    '- מעקב מלאי בזמן אמת',
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
