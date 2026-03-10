import { motion } from 'framer-motion';

interface DocsFolderSlideProps {
  data: {
    title: string;
    subtitle: string;
    tree: Array<{ name: string; type: string; depth: number; annotation?: string }>;
    growth: Array<{ sprint: string; docs: number }>;
    comparison: { without: string; with: string };
  };
  lang: 'en' | 'he';
}

export default function DocsFolderSlide({ data }: DocsFolderSlideProps): JSX.Element {
  const maxDocs = Math.max(...data.growth.map((g) => g.docs));

  return (
    <div className="max-w-5xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-3 text-emerald-400"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center text-slate-400 text-base mb-8"
      >
        {data.subtitle}
      </motion.p>

      <div className="grid grid-cols-2 gap-8 mb-6">
        {/* File tree */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-5 font-mono text-sm"
        >
          {data.tree.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.12 }}
              className="flex items-center gap-2 py-1"
              style={{ paddingLeft: `${item.depth * 16}px` }}
            >
              <span>{item.type === 'folder' ? '📁' : '📄'}</span>
              <span className="text-emerald-300 font-semibold">{item.name}</span>
              {item.annotation && (
                <span className="text-slate-500 text-xs ml-2">— {item.annotation}</span>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Growth chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-slate-800/40 border border-emerald-500/20 rounded-xl p-5"
        >
          <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wide mb-5 text-center">
            Docs Growth
          </h3>
          <div className="space-y-4">
            {data.growth.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-slate-400 text-xs w-20 flex-shrink-0">{item.sprint}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.docs / maxDocs) * 100}%` }}
                    transition={{ delay: 0.6 + idx * 0.25, duration: 0.7, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                  />
                </div>
                <span className="text-emerald-400 font-bold text-sm w-8 text-right">{item.docs}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Comparison callout */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4"
        >
          <p className="text-xs text-red-400 uppercase tracking-wide font-bold mb-1">Without SDD</p>
          <p className="text-red-300 text-sm">{data.comparison.without}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35 }}
          className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-4"
        >
          <p className="text-xs text-emerald-400 uppercase tracking-wide font-bold mb-1">With SDD</p>
          <p className="text-emerald-300 text-sm">{data.comparison.with}</p>
        </motion.div>
      </div>
    </div>
  );
}
