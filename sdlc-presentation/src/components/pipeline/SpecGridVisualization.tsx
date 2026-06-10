import React from 'react';
import { motion } from 'framer-motion';

const specFiles = [
  { num: '01', icon: '📋', name: 'Product Manager', file: 'product_manager.md' },
  { num: '02', icon: '⚙️', name: 'Backend Lead', file: 'backend_lead.md' },
  { num: '03', icon: '🎨', name: 'Frontend Lead', file: 'frontend_lead.md' },
  { num: '04', icon: '🗄️', name: 'DB Architect', file: 'db_architect.md' },
  { num: '05', icon: '🧪', name: 'QA Lead', file: 'qa_lead.md' },
  { num: '06', icon: '🚀', name: 'DevOps Lead', file: 'devops_lead.md' },
  { num: '07', icon: '📢', name: 'Marketing Lead', file: 'marketing_lead.md' },
  { num: '08', icon: '💰', name: 'Finance Lead', file: 'finance_lead.md' },
  { num: '09', icon: '📊', name: 'Business Lead', file: 'business_lead.md' },
  { num: '10', icon: '🖌️', name: 'UI Designer', file: 'ui_designer.md' },
];

const specFilesHe = [
  { num: '01', icon: '📋', name: 'מנהל מוצר', file: 'product_manager.md' },
  { num: '02', icon: '⚙️', name: 'ליד Backend', file: 'backend_lead.md' },
  { num: '03', icon: '🎨', name: 'ליד Frontend', file: 'frontend_lead.md' },
  { num: '04', icon: '🗄️', name: 'ארכיטקט DB', file: 'db_architect.md' },
  { num: '05', icon: '🧪', name: 'ליד QA', file: 'qa_lead.md' },
  { num: '06', icon: '🚀', name: 'ליד DevOps', file: 'devops_lead.md' },
  { num: '07', icon: '📢', name: 'ליד שיווק', file: 'marketing_lead.md' },
  { num: '08', icon: '💰', name: 'ליד פיננסים', file: 'finance_lead.md' },
  { num: '09', icon: '📊', name: 'ליד עסקי', file: 'business_lead.md' },
  { num: '10', icon: '🖌️', name: 'מעצב UI', file: 'ui_designer.md' },
];

export default function SpecGridVisualization({ lang }: { lang: 'en' | 'he' }) {
  const files = lang === 'he' ? specFilesHe : specFiles;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto">
      {files.map((spec, idx) => (
        <motion.div
          key={spec.num}
          initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: idx * 0.06, duration: 0.4, type: 'spring' }}
          className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3 text-center hover:bg-violet-500/20 transition-colors"
        >
          <div className="text-2xl mb-1">{spec.icon}</div>
          <div className="text-xs text-violet-300 font-semibold truncate">{spec.name}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">{spec.num}_{spec.file}</div>
        </motion.div>
      ))}
    </div>
  );
}
