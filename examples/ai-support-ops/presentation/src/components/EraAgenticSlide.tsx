import { motion } from 'framer-motion';

interface EraAgenticSlideProps {
  data: {
    title: string;
    subtitle: string;
    tools: string[];
    power: Array<{ title: string; description: string }>;
    danger: Array<{ title: string; description: string }>;
  };
  lang: 'en' | 'he';
}

export default function EraAgenticSlide({ data }: EraAgenticSlideProps): JSX.Element {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-3 text-cyan-400"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-center text-slate-400 text-lg mb-6"
      >
        {data.subtitle}
      </motion.p>

      {/* Tool cards */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center gap-4 mb-8 flex-wrap"
      >
        {data.tools.map((tool, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 + idx * 0.1 }}
            className="px-5 py-2 bg-cyan-500/20 border border-cyan-400/40 rounded-lg text-cyan-300 text-sm font-semibold"
          >
            {tool}
          </motion.span>
        ))}
      </motion.div>

      {/* Split layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* The Power */}
        <div>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-cyan-400 font-bold text-xl mb-4 text-center"
          >
            The Power
          </motion.h3>
          <div className="space-y-3">
            {data.power.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.12 }}
                className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4"
              >
                <p className="text-white font-semibold text-sm mb-0.5">{item.title}</p>
                <p className="text-slate-400 text-xs">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* The Danger */}
        <div>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-amber-400 font-bold text-xl mb-4 text-center"
          >
            The Danger
          </motion.h3>
          <div className="space-y-3">
            {data.danger.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.12 }}
                animate-custom={idx === data.danger.length - 1 ? 'glitch' : undefined}
                className="bg-amber-500/10 border border-amber-500/40 border-dashed rounded-lg p-4"
              >
                <p className="text-amber-300 font-semibold text-sm mb-0.5">
                  <span className="mr-1">⚠️</span>
                  {item.title}
                </p>
                <p className="text-slate-400 text-xs">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
