import { motion } from 'framer-motion';

interface SDDThreePillarsSlideProps {
  data: {
    title: string;
    subtitle: string;
    pillars: Array<{
      number: string;
      title: string;
      description: string;
      artifact: string;
      icon: string;
      color: string;
    }>;
  };
  lang: 'en' | 'he';
}

const pillarColors: Record<string, { border: string; bg: string; number: string }> = {
  teal: { border: 'border-teal-500/40', bg: 'bg-teal-500/10', number: 'text-teal-400' },
  emerald: { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', number: 'text-emerald-400' },
  cyan: { border: 'border-cyan-500/40', bg: 'bg-cyan-500/10', number: 'text-cyan-400' },
};

export default function SDDThreePillarsSlide({ data }: SDDThreePillarsSlideProps) {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-3 bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center text-slate-400 text-base mb-8 max-w-2xl mx-auto"
      >
        {data.subtitle}
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {data.pillars.map((pillar, idx) => {
          const colors = pillarColors[pillar.color] || pillarColors.teal;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.15, duration: 0.5 }}
              className={`${colors.bg} border ${colors.border} rounded-xl p-5 flex flex-col`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-2xl font-black ${colors.number} opacity-60`}>{pillar.number}</span>
                <span className="text-2xl">{pillar.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{pillar.title}</h3>
              <p className="text-white/60 text-sm flex-1 mb-4">{pillar.description}</p>
              <code className="text-xs font-mono text-slate-300 bg-slate-900/60 rounded px-3 py-1.5 block truncate">
                {pillar.artifact}
              </code>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
