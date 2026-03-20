import { motion } from 'framer-motion';

interface SolutionSlideProps {
  data: {
    title: string;
    subtitle?: string;
    capabilities?: Array<{
      number: string;
      title: string;
      description: string;
      artifact: string;
      icon: string;
    }>;
    flow?: Array<{
      step: string;
      icon: string;
      description: string;
    }>;
    keyInsight: string;
  };
  lang: 'en' | 'he';
}

export default function SolutionSlide({ data }: SolutionSlideProps) {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-3 text-green-400"
      >
        {data.title}
      </motion.h2>

      {data.subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-center text-white/60 text-lg mb-8"
        >
          {data.subtitle}
        </motion.p>
      )}

      {!data.subtitle && <div className="mb-10" />}

      {/* Capabilities grid (new format) */}
      {data.capabilities && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {data.capabilities.map((cap, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.15, duration: 0.5 }}
              className="bg-gradient-to-br from-green-500/15 to-blue-500/15 border border-green-500/30 rounded-xl p-5 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-green-400/50 text-xl font-black">{cap.number}</span>
                <span className="text-2xl">{cap.icon}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{cap.title}</h3>
              <p className="text-white/60 text-sm flex-1 mb-4">{cap.description}</p>
              <code className="text-xs font-mono text-green-300/80 bg-slate-900/60 rounded px-3 py-1.5 block truncate">
                {cap.artifact}
              </code>
            </motion.div>
          ))}
        </div>
      )}

      {/* Key Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-center"
      >
        <p className="text-lg text-green-300 bg-green-500/10 border border-green-500/30 rounded-lg px-6 py-4 inline-block">
          {data.keyInsight}
        </p>
      </motion.div>
    </div>
  );
}
