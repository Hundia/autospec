import { motion } from 'framer-motion';

interface FutureWaterfallSlideProps {
  data: {
    title: string;
    subtitle: string;
    insight: string;
    allocation: Array<{
      phase: string;
      percentage: number;
      color: string;
      description: string;
    }>;
    callout: string;
  };
  lang: 'en' | 'he';
}

const barColors: Record<string, { bg: string; text: string; fill: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', fill: 'bg-blue-500' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', fill: 'bg-green-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', fill: 'bg-amber-500' },
};

export default function FutureWaterfallSlide({ data }: FutureWaterfallSlideProps) {
  return (
    <div className="max-w-4xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center text-slate-400 text-base mb-6 max-w-2xl mx-auto"
      >
        {data.subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8 text-white/70 text-sm leading-relaxed"
      >
        {data.insight}
      </motion.div>

      <div className="space-y-5 mb-8">
        {data.allocation.map((item, idx) => {
          const colors = barColors[item.color] || barColors.blue;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.15 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold ${colors.text}`}>{item.phase}</span>
                <span className={`text-lg font-bold ${colors.text}`}>{item.percentage}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ delay: 0.7 + idx * 0.15, duration: 0.8, ease: 'easeOut' }}
                  className={`${colors.fill} h-3 rounded-full`}
                />
              </div>
              <p className="text-white/50 text-xs">{item.description}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="text-center"
      >
        <p className="text-base text-blue-300 bg-blue-500/10 border border-blue-500/30 rounded-lg px-6 py-3 inline-block">
          {data.callout}
        </p>
      </motion.div>
    </div>
  );
}
