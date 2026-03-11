import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = {
  en: [
    {
      label: 'Architecture',
      content: [
        { type: 'heading', text: 'System Architecture' },
        { type: 'diagram', text: '┌─────────┐    ┌──────────┐    ┌──────────┐' },
        { type: 'diagram', text: '│ Frontend │───▶│   API    │───▶│ Database │' },
        { type: 'diagram', text: '│  React   │    │  NestJS  │    │ Postgres │' },
        { type: 'diagram', text: '└─────────┘    └──────────┘    └──────────┘' },
        { type: 'text', text: 'Monorepo structure with shared types' },
      ],
    },
    {
      label: 'Backlog',
      content: [
        { type: 'heading', text: 'Sprint Kanban Board' },
        { type: 'card', text: '🔲 SF-042 — Add product search', status: 'todo' },
        { type: 'card', text: '🔄 SF-043 — Cart persistence', status: 'progress' },
        { type: 'card', text: '🔄 SF-044 — Stripe checkout', status: 'progress' },
        { type: 'card', text: '✅ SF-040 — User auth', status: 'done' },
        { type: 'card', text: '✅ SF-041 — Product catalog', status: 'done' },
      ],
    },
    {
      label: 'Flows',
      content: [
        { type: 'heading', text: 'Checkout Flow' },
        { type: 'flow', text: 'Cart → Address → Payment → Confirm → Order' },
        { type: 'text', text: 'States: pending → processing → paid → shipped' },
        { type: 'heading', text: 'Auth Flow' },
        { type: 'flow', text: 'Login → OTP → JWT → Protected Routes' },
      ],
    },
    {
      label: 'Mock Screens',
      content: [
        { type: 'heading', text: 'Product Catalog Page' },
        { type: 'mockup', text: '┌────────────────────────────────┐' },
        { type: 'mockup', text: '│  🔍 Search...     [Filter ▾]  │' },
        { type: 'mockup', text: '│ ┌──────┐ ┌──────┐ ┌──────┐   │' },
        { type: 'mockup', text: '│ │ 📦   │ │ 📦   │ │ 📦   │   │' },
        { type: 'mockup', text: '│ │$29.99│ │$49.99│ │$19.99│   │' },
        { type: 'mockup', text: '│ └──────┘ └──────┘ └──────┘   │' },
        { type: 'mockup', text: '└────────────────────────────────┘' },
      ],
    },
  ],
  he: [
    {
      label: 'ארכיטקטורה',
      content: [
        { type: 'heading', text: 'ארכיטקטורת מערכת' },
        { type: 'diagram', text: '┌─────────┐    ┌──────────┐    ┌──────────┐' },
        { type: 'diagram', text: '│ Frontend │───▶│   API    │───▶│ Database │' },
        { type: 'diagram', text: '│  React   │    │  NestJS  │    │ Postgres │' },
        { type: 'diagram', text: '└─────────┘    └──────────┘    └──────────┘' },
        { type: 'text', text: 'מבנה Monorepo עם טיפוסים משותפים' },
      ],
    },
    {
      label: 'באקלוג',
      content: [
        { type: 'heading', text: 'לוח Kanban ספרינט' },
        { type: 'card', text: '🔲 SF-042 — הוסף חיפוש מוצרים', status: 'todo' },
        { type: 'card', text: '🔄 SF-043 — שמירת עגלה', status: 'progress' },
        { type: 'card', text: '🔄 SF-044 — Stripe checkout', status: 'progress' },
        { type: 'card', text: '✅ SF-040 — אימות משתמשים', status: 'done' },
        { type: 'card', text: '✅ SF-041 — קטלוג מוצרים', status: 'done' },
      ],
    },
    {
      label: 'תהליכים',
      content: [
        { type: 'heading', text: 'תהליך Checkout' },
        { type: 'flow', text: 'עגלה → כתובת → תשלום → אישור → הזמנה' },
        { type: 'text', text: 'מצבים: ממתין → מעבד → שולם → נשלח' },
        { type: 'heading', text: 'תהליך אימות' },
        { type: 'flow', text: 'התחברות → OTP → JWT → נתיבים מוגנים' },
      ],
    },
    {
      label: 'מסכי דמו',
      content: [
        { type: 'heading', text: 'דף קטלוג מוצרים' },
        { type: 'mockup', text: '┌────────────────────────────────┐' },
        { type: 'mockup', text: '│  🔍 חיפוש...     [סינון ▾]   │' },
        { type: 'mockup', text: '│ ┌──────┐ ┌──────┐ ┌──────┐   │' },
        { type: 'mockup', text: '│ │ 📦   │ │ 📦   │ │ 📦   │   │' },
        { type: 'mockup', text: '│ │₪99.9 │ │₪149  │ │₪59.9 │   │' },
        { type: 'mockup', text: '│ └──────┘ └──────┘ └──────┘   │' },
        { type: 'mockup', text: '└────────────────────────────────┘' },
      ],
    },
  ],
};

export default function BrowserMockup({ lang }: { lang: 'en' | 'he' }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabData = tabs[lang];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="bg-slate-950 rounded-xl border-2 border-amber-500/30 overflow-hidden max-w-3xl mx-auto shadow-2xl shadow-amber-500/10"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border-b border-slate-700">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="flex-1 mx-4 bg-slate-700 rounded-md px-3 py-1 text-xs text-slate-400 font-mono">
          https://hundia.github.io/autospec/viewer
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-slate-700 bg-slate-900/50">
        {tabData.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              idx === activeTab
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5 min-h-[240px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-2 font-mono text-sm"
          >
            {tabData[activeTab].content.map((item, idx) => (
              <div
                key={idx}
                className={
                  item.type === 'heading' ? 'text-amber-400 font-bold text-base mb-2' :
                  item.type === 'diagram' || item.type === 'mockup' ? 'text-slate-400 text-xs leading-tight' :
                  item.type === 'flow' ? 'text-cyan-400 text-center py-2 text-base' :
                  item.type === 'card' ? `px-3 py-2 rounded-lg text-xs ${
                    (item as any).status === 'done' ? 'bg-green-500/10 text-green-400' :
                    (item as any).status === 'progress' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-slate-800 text-slate-300'
                  }` :
                  'text-slate-300'
                }
              >
                {item.text}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
