import React from 'react';
import { motion } from 'framer-motion';

interface FinOpsSlideProps {
  data: {
    title: string;
    tiers: Array<{
      model: string;
      share: string;
      tasks: string;
      tier: string;
    }>;
    comparison: {
      allOpus: string;
      finOps: string;
      savings: string;
    };
  };
  lang: 'en' | 'he';
}

export default function FinOpsSlide({ data, lang }: FinOpsSlideProps) {
  const tierColors: Record<string, { bg: string; border: string; text: string }> = {
    cheapest: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-300' },
    balanced: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-300' },
    premium: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-300' },
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-10 text-amber-400"
      >
        {data.title}
      </motion.h2>

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {data.tiers.map((tier, idx) => {
          const colors = tierColors[tier.tier] || tierColors.balanced;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.15 }}
              className={`${colors.bg} border ${colors.border} rounded-xl p-6 text-center`}
            >
              <h3 className="text-2xl font-bold text-white mb-1">{tier.model}</h3>
              <div className={`text-3xl font-bold ${colors.text} mb-3`}>{tier.share}</div>
              <p className="text-sm text-white/60">{tier.tasks}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Cost comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/5 border border-amber-500/20 rounded-xl p-6"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <div>
            <span className="text-white/50 text-sm">All-Opus</span>
            <div className="text-xl font-mono text-white/60 line-through">{data.comparison.allOpus}</div>
          </div>
          <span className="text-amber-400 text-2xl">→</span>
          <div>
            <span className="text-white/50 text-sm">FinOps</span>
            <div className="text-xl font-mono text-amber-300 font-bold">{data.comparison.finOps}</div>
          </div>
          <span className="text-amber-400 text-2xl">=</span>
          <div className="bg-amber-500/20 border border-amber-500/30 rounded-full px-5 py-2">
            <span className="text-amber-300 font-bold">{data.comparison.savings}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
