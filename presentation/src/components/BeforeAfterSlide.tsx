import { motion } from 'framer-motion';

interface BeforeAfterSlideProps {
  data: {
    title: string;
    subtitle: string;
    rows: Array<{ aspect: string; before: string; after: string }>;
  };
  lang: 'en' | 'he';
}

export default function BeforeAfterSlide({ data }: BeforeAfterSlideProps): JSX.Element {
  return (
    <div className="max-w-4xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-3 text-white"
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

      {/* Column headers */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-[1fr_2fr_2fr] gap-3 mb-2 px-1"
      >
        <div />
        <div className="text-center text-red-400 font-bold text-sm uppercase tracking-wider">Before</div>
        <div className="text-center text-green-400 font-bold text-sm uppercase tracking-wider">After</div>
      </motion.div>

      {/* Rows */}
      <div className="space-y-2">
        {data.rows.map((row, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.12 }}
            className="grid grid-cols-[1fr_2fr_2fr] gap-3 items-stretch"
          >
            {/* Aspect label */}
            <div className="flex items-center bg-slate-800/40 border border-slate-700/40 rounded-lg px-3 py-3">
              <span className="text-slate-300 font-semibold text-sm">{row.aspect}</span>
            </div>

            {/* Before */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 flex items-center">
              <span className="text-red-300 text-sm">{row.before}</span>
            </div>

            {/* After */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 flex items-center">
              <span className="text-green-300 text-sm">{row.after}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
