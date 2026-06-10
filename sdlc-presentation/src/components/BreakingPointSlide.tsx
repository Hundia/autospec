import { motion } from 'framer-motion';

interface BreakingPointSlideProps {
  data: {
    title: string;
    subtitle: string;
    buildItems: string[];
    debtItems: string[];
    stats: Array<{ value: string; label: string }>;
    bottomLine: string;
  };
  lang: 'en' | 'he';
}

export default function BreakingPointSlide({ data }: BreakingPointSlideProps): JSX.Element {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-2 text-red-600"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center text-slate-400 text-lg mb-7"
      >
        {data.subtitle}
      </motion.p>

      {/* Balance beam visualization */}
      <div className="flex items-end justify-center gap-8 mb-8">
        {/* Left: Build side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-2 flex-1"
        >
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 w-full">
            <p className="text-cyan-400 font-bold text-center mb-3 text-sm uppercase tracking-wide">Build</p>
            <ul className="space-y-2">
              {data.buildItems.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + idx * 0.2 }}
                  className="flex items-center gap-2 text-cyan-300 text-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Center beam */}
        <div className="flex flex-col items-center flex-shrink-0">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 15 }}
            transition={{ delay: 1.2, duration: 0.8, ease: 'easeInOut' }}
            className="w-32 h-1.5 bg-slate-500 rounded-full"
            style={{ transformOrigin: 'center' }}
          />
          <div className="w-1 h-8 bg-slate-600 mt-0" />
          <div className="w-4 h-4 bg-slate-600 rounded-sm" />
        </div>

        {/* Right: Debt side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-2 flex-1"
        >
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 w-full">
            <p className="text-red-400 font-bold text-center mb-3 text-sm uppercase tracking-wide">Debt</p>
            <ul className="space-y-2">
              {data.debtItems.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + idx * 0.2 }}
                  className="flex items-center gap-2 text-red-300 text-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {data.stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 + idx * 0.15 }}
            className="bg-slate-800/60 border border-red-900/40 rounded-xl p-4 text-center"
          >
            <p className="text-2xl font-black text-red-400 mb-1">{stat.value}</p>
            <p className="text-slate-400 text-xs">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Bottom line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="text-center bg-red-900/20 border border-red-600/30 rounded-xl px-6 py-4"
      >
        <p className="text-red-300 font-semibold text-base italic">{data.bottomLine}</p>
      </motion.div>
    </div>
  );
}
