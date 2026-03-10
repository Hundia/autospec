import { motion } from 'framer-motion';

interface ModelOptimizationSlideProps {
  data: {
    title: string;
    subtitle: string;
    tiers: Array<{
      model: string;
      share: string;
      tasks: string;
      tier: string;
      reason: string;
    }>;
    insight: string;
    comparison: {
      allOpus: string;
      optimized: string;
      savings: string;
    };
  };
  lang: 'en' | 'he';
}

const tierColors: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  cheapest: {
    bg: 'bg-slate-700/40',
    border: 'border-slate-500/40',
    badge: 'bg-slate-600 text-slate-300',
    text: 'text-slate-300',
  },
  balanced: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/40',
    badge: 'bg-amber-600/60 text-amber-200',
    text: 'text-amber-300',
  },
  premium: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/40',
    badge: 'bg-purple-600/60 text-purple-200',
    text: 'text-purple-300',
  },
};

export default function ModelOptimizationSlide({ data }: ModelOptimizationSlideProps): JSX.Element {
  return (
    <div className="max-w-4xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-3 text-amber-400"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center text-slate-400 text-base mb-7"
      >
        {data.subtitle}
      </motion.p>

      {/* Tier cards */}
      <div className="space-y-3 mb-6">
        {data.tiers.map((tier, idx) => {
          const colors = tierColors[tier.tier] || tierColors.balanced;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + idx * 0.15 }}
              className={`flex items-center gap-5 ${colors.bg} border ${colors.border} rounded-xl p-4`}
            >
              <div className={`text-2xl font-black w-16 text-center ${colors.text}`}>
                {tier.share}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-sm font-bold px-2 py-0.5 rounded ${colors.badge}`}>
                    {tier.model}
                  </span>
                  <span className="text-white font-medium text-sm">{tier.tasks}</span>
                </div>
                <p className="text-slate-500 text-xs italic">Why: {tier.reason}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
        className="text-center bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-3 mb-5 text-amber-300 text-sm italic"
      >
        💡 {data.insight}
      </motion.div>

      {/* Cost comparison */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="text-center bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">All Opus</p>
          <p className="text-red-400 font-bold text-lg">{data.comparison.allOpus}</p>
        </div>
        <div className="text-center bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">Optimized</p>
          <p className="text-emerald-400 font-bold text-lg">{data.comparison.optimized}</p>
        </div>
        <div className="text-center bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">You Save</p>
          <p className="text-amber-400 font-bold text-lg">{data.comparison.savings}</p>
        </div>
      </motion.div>
    </div>
  );
}
