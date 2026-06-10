import { motion } from 'framer-motion';

interface SprintMemorySlideProps {
  data: {
    title: string;
    subtitle: string;
    summary: {
      command: string;
      progress: string;
      result: string;
      sections: Array<{
        label: string;
        color: string;
        items: string[];
      }>;
    };
    benefits: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    callout: string;
  };
  lang: 'en' | 'he';
}

const sectionColors: Record<string, { border: string; bg: string; text: string }> = {
  blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  violet: { border: 'border-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-400' },
  green: { border: 'border-green-500/30', bg: 'bg-green-500/10', text: 'text-green-400' },
  amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400' },
};

export default function SprintMemorySlide({ data }: SprintMemorySlideProps) {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl sm:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: Sprint summary terminal mockup */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/5 border border-slate-600/30 rounded-xl overflow-hidden"
        >
          {/* Terminal chrome */}
          <div className="bg-slate-800/80 border-b border-slate-600/30 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-3 font-mono text-xs text-white/50">terminal</span>
          </div>

          <div className="p-4 font-mono text-xs space-y-2 bg-slate-950/60">
            {/* Command */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-cyan-400"
            >
              {data.summary.command}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/40"
            >
              {data.summary.progress}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-green-400"
            >
              {data.summary.result}
            </motion.div>

            <div className="border-t border-slate-700/50 pt-2 mt-2 space-y-2">
              {data.summary.sections.map((section, idx) => {
                const colors = sectionColors[section.color] || sectionColors.blue;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    className={`${colors.bg} border ${colors.border} rounded-lg p-2`}
                  >
                    <div className={`${colors.text} text-[11px] font-bold mb-1`}>{section.label}</div>
                    {section.items.map((item, i) => (
                      <div key={i} className="text-white/50 text-[11px] pl-2">{item}</div>
                    ))}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right: Benefit cards */}
        <div className="space-y-3">
          {data.benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
              className="bg-white/5 border border-teal-500/20 rounded-xl p-4 flex items-start gap-3"
            >
              <span className="text-2xl">{benefit.icon}</span>
              <div>
                <h3 className="text-sm font-semibold text-white mb-0.5">{benefit.title}</h3>
                <p className="text-white/50 text-xs">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom callout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-center bg-teal-500/10 border border-teal-500/30 rounded-xl px-6 py-3 text-teal-300 text-sm max-w-2xl mx-auto"
      >
        {data.callout}
      </motion.div>
    </div>
  );
}
