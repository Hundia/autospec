import { motion } from 'framer-motion';

interface ContextPoisoningSlideProps {
  data: {
    title: string;
    subtitle: string;
    stages: Array<{
      turn: string;
      status: string;
      color: string;
      snippet: string;
      description: string;
    }>;
  };
  lang: 'en' | 'he';
}

const colorMap: Record<string, { dot: string; border: string; text: string; bg: string }> = {
  green: { dot: 'bg-green-400', border: 'border-green-500/40', text: 'text-green-400', bg: 'bg-green-500/10' },
  yellow: { dot: 'bg-yellow-400', border: 'border-yellow-500/40', text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  orange: { dot: 'bg-orange-400', border: 'border-orange-500/40', text: 'text-orange-400', bg: 'bg-orange-500/10' },
  red: { dot: 'bg-red-400', border: 'border-red-500/40', text: 'text-red-400', bg: 'bg-red-500/10' },
};

export default function ContextPoisoningSlide({ data }: ContextPoisoningSlideProps): JSX.Element {
  return (
    <div className="max-w-4xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-3 bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent"
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

      {/* 2x2 grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data.stages.map((stage, idx) => {
          const colors = colorMap[stage.color] || colorMap.green;
          const isLast = idx === data.stages.length - 1;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              animate={
                isLast
                  ? { opacity: 1, x: [0, -2, 2, -1, 1, 0] as number[] }
                  : { opacity: 1, x: 0 }
              }
              transition={
                isLast
                  ? { delay: 0.25 + idx * 0.2, duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
                  : { delay: 0.25 + idx * 0.2, duration: 0.4 }
              }
              className={`flex items-start gap-3 ${colors.bg} border ${colors.border} rounded-xl p-3`}
            >
              {/* Dot */}
              <div className="flex-shrink-0 mt-1">
                <div className={`w-3 h-3 rounded-full ${colors.dot} shadow-lg`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
                    {stage.turn}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} border ${colors.border} ${colors.text}`}>
                    {stage.status}
                  </span>
                </div>
                <code className="block font-mono text-xs text-slate-200 bg-slate-900/60 rounded px-3 py-1.5 mb-1.5 truncate">
                  {stage.snippet}
                </code>
                <p className="text-slate-400 text-xs">{stage.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
