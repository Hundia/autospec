import React from 'react';
import { motion } from 'framer-motion';

export default function UserReviewVisualization({ lang }: { lang: 'en' | 'he' }) {
  const isHe = lang === 'he';

  const checkItems = isHe ? [
    { text: 'פיצ\'רים חדשים עובדים כמצופה', done: true },
    { text: 'אין רגרסיות בפיצ\'רים קיימים', done: true },
    { text: 'UI נראה נכון ב-RTL ו-LTR', done: true },
    { text: 'ביצועים מקובלים', done: false },
    { text: 'מוכן לפרודקשן?', done: false },
  ] : [
    { text: 'New features work as expected', done: true },
    { text: 'No regressions in existing features', done: true },
    { text: 'UI looks correct in all viewports', done: true },
    { text: 'Performance acceptable', done: false },
    { text: 'Ready for production?', done: false },
  ];

  return (
    <div className="max-w-2xl mx-auto grid grid-cols-2 gap-6">
      {/* Left: User testing mockup */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-slate-950 rounded-xl border border-rose-500/20 p-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-lg">
            👤
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{isHe ? 'סקירת בעל המוצר' : 'Product Owner Review'}</div>
            <div className="text-xs text-slate-400">{isHe ? 'בודק את הספרינט' : 'Testing sprint deliverables'}</div>
          </div>
        </div>

        {/* Browser-like mockup showing the app */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 border-b border-slate-600">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
            <span className="ml-2 text-[10px] text-slate-500 font-mono">preprod.myapp.com</span>
          </div>
          <div className="p-3 space-y-2">
            {[1, 2, 3].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.2 }}
                className="flex gap-2"
              >
                <div className="w-8 h-8 rounded bg-slate-600/50 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-2 bg-slate-600/50 rounded w-3/4" />
                  <div className="h-2 bg-slate-600/30 rounded w-1/2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right: Checklist */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="bg-slate-950 rounded-xl border border-rose-500/20 p-5"
      >
        <div className="text-sm font-semibold text-rose-400 mb-4">{isHe ? 'צ\'קליסט סקירה' : 'Review Checklist'}</div>
        <div className="space-y-3">
          {checkItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + idx * 0.15 }}
              className="flex items-start gap-3"
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                item.done
                  ? 'border-green-500 bg-green-500/20'
                  : 'border-slate-600 bg-slate-800'
              }`}>
                {item.done && <span className="text-green-400 text-xs">✓</span>}
              </div>
              <span className={`text-sm ${item.done ? 'text-white/80' : 'text-white/40'}`}>{item.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Approval button mockup */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
          className="mt-5 flex gap-2"
        >
          <div className="flex-1 bg-green-500/20 border border-green-500/40 rounded-lg px-3 py-2 text-center text-xs text-green-400 font-semibold">
            {isHe ? '✅ מאושר' : '✅ Approved'}
          </div>
          <div className="flex-1 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-center text-xs text-red-400/60 font-semibold">
            {isHe ? '↩ שינויים נדרשים' : '↩ Changes Needed'}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
