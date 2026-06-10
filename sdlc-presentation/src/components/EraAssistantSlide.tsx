import { motion } from 'framer-motion';

interface EraAssistantSlideProps {
  data: {
    title: string;
    subtitle: string;
    tools: string[];
    gains: Array<{ title: string; description: string }>;
    unchanged: Array<{ title: string; description: string }>;
    decisionAuthority: string;
  };
  lang: 'en' | 'he';
}

export default function EraAssistantSlide({ data }: EraAssistantSlideProps): JSX.Element {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-3 text-blue-400"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="text-center text-slate-400 text-lg mb-8"
      >
        {data.subtitle}
      </motion.p>

      {/* Tool badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex justify-center gap-3 mb-8 flex-wrap"
      >
        {data.tools.map((tool, idx) => (
          <span
            key={idx}
            className="px-4 py-1.5 bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-300 text-sm font-medium"
          >
            {tool}
          </span>
        ))}
      </motion.div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* What Changed */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h3 className="text-blue-400 font-bold text-lg mb-4 text-center">What Changed</h3>
          <div className="space-y-3">
            {data.gains.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + idx * 0.15 }}
                className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4"
              >
                <p className="text-white font-semibold text-sm mb-0.5">{item.title}</p>
                <p className="text-slate-400 text-xs">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What Didn't Change */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h3 className="text-slate-400 font-bold text-lg mb-4 text-center">What Didn't Change</h3>
          <div className="space-y-3">
            {data.unchanged.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + idx * 0.15 }}
                className="bg-slate-700/40 border border-slate-600/40 rounded-lg p-4"
              >
                <p className="text-white font-semibold text-sm mb-0.5">{item.title}</p>
                <p className="text-slate-400 text-xs">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Speed gauge bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="bg-slate-800/60 border border-slate-600/30 rounded-xl p-4 flex items-center gap-4"
      >
        <span className="text-slate-400 text-sm font-medium whitespace-nowrap">Typing Speed</span>
        <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '75%' }}
            transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"
          />
        </div>
        <span className="text-blue-300 text-sm font-bold whitespace-nowrap">3x faster</span>
        <span className="text-slate-500 text-xs">Decision Authority:</span>
        <span className="px-2 py-0.5 bg-slate-600 rounded text-slate-300 text-xs font-semibold">{data.decisionAuthority}</span>
      </motion.div>
    </div>
  );
}
