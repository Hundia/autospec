import React from 'react';
import { motion } from 'framer-motion';

const tree = [
  { name: 'docs/', depth: 0, icon: '📁' },
  { name: 'auth/', depth: 1, icon: '📁', files: ['01-architecture.md', '02-jwt-flow.md', '03-guards.md'] },
  { name: 'database/', depth: 1, icon: '📁', files: ['01-schema.md', '02-erd.md', '03-migrations.md'] },
  { name: 'frontend/', depth: 1, icon: '📁', files: ['01-routing.md', '02-stores.md', '03-services.md'] },
  { name: 'scheduling/', depth: 1, icon: '📁', files: ['01-classes.md', '02-capacity.md'] },
  { name: 'bookings/', depth: 1, icon: '📁', files: ['01-state-machine.md', '02-waitlist.md'] },
  { name: 'payments/', depth: 1, icon: '📁', files: ['01-transactions.md'] },
  { name: 'design-system/', depth: 1, icon: '📁', files: ['01-tokens.md', '02-primitives.md'] },
];

export default function DocsTreeVisualization({ lang }: { lang: 'en' | 'he' }) {
  return (
    <div className="bg-slate-950 rounded-xl border border-emerald-500/20 p-5 max-w-lg mx-auto font-mono text-sm">
      {tree.map((folder, fi) => (
        <div key={fi}>
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: fi * 0.1 }}
            className="flex items-center gap-2 py-1"
            style={{ paddingLeft: `${folder.depth * 20}px` }}
          >
            <span>{folder.icon}</span>
            <span className="text-emerald-400 font-bold">{folder.name}</span>
          </motion.div>
          {folder.files?.map((file, i) => (
            <motion.div
              key={file}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: fi * 0.1 + (i + 1) * 0.06 }}
              className="flex items-center gap-2 py-0.5"
              style={{ paddingLeft: `${(folder.depth + 1) * 20}px` }}
            >
              <span className="text-slate-600">📄</span>
              <span className="text-slate-400">{file}</span>
            </motion.div>
          ))}
        </div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5 }}
        className="mt-3 pt-3 border-t border-emerald-500/10 text-emerald-400/60 text-xs text-center"
      >
        {lang === 'he' ? '100+ קבצים אחרי 10 בולטים' : '100+ files after 10 bolts'}
      </motion.div>
    </div>
  );
}
