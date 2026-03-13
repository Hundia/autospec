import { motion } from 'framer-motion';

interface QATestingSlideProps {
  data: {
    title: string;
    subtitle: string;
    workflow: Array<{
      step: string;
      title: string;
      icon: string;
      description: string;
      color: string;
    }>;
    terminal: {
      title: string;
      lines: Array<{
        text: string;
        type: 'command' | 'info' | 'pass' | 'fail' | 'error' | 'summary';
      }>;
    };
    providers: string[];
    callout: string;
  };
  lang: 'en' | 'he';
}

const stepColors: Record<string, { border: string; bg: string; number: string }> = {
  blue: { border: 'border-blue-500/40', bg: 'bg-blue-500/10', number: 'text-blue-400' },
  violet: { border: 'border-violet-500/40', bg: 'bg-violet-500/10', number: 'text-violet-400' },
  green: { border: 'border-green-500/40', bg: 'bg-green-500/10', number: 'text-green-400' },
  teal: { border: 'border-teal-500/40', bg: 'bg-teal-500/10', number: 'text-teal-400' },
};

const lineColors: Record<string, string> = {
  command: 'text-cyan-400',
  info: 'text-white/50',
  pass: 'text-green-400',
  fail: 'text-red-400',
  error: 'text-red-300/70',
  summary: 'text-yellow-300',
};

export default function QATestingSlide({ data }: QATestingSlideProps) {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl sm:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"
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
        {/* Left: Workflow Steps */}
        <div className="space-y-3">
          {data.workflow.map((item, idx) => {
            const colors = stepColors[item.color] || stepColors.blue;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1, duration: 0.4 }}
                className={`${colors.bg} border ${colors.border} rounded-xl p-3 flex items-start gap-3`}
              >
                <span className={`text-xl font-black ${colors.number} opacity-60 mt-0.5`}>{item.step}</span>
                <span className="text-xl mt-0.5">{item.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="text-white/50 text-xs">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right: Terminal Output */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/5 border border-slate-600/30 rounded-xl overflow-hidden"
        >
          {/* Terminal chrome */}
          <div className="bg-slate-800/80 border-b border-slate-600/30 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-3 font-mono text-xs text-white/50">{data.terminal.title}</span>
          </div>

          {/* Terminal lines */}
          <div className="p-4 font-mono text-xs space-y-0.5 bg-slate-950/60">
            {data.terminal.lines.map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + idx * 0.08 }}
                className={lineColors[line.type] || 'text-white/60'}
              >
                {line.text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom: Provider badges + callout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="flex flex-wrap justify-center gap-2">
          {data.providers.map((provider, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60"
            >
              {provider}
            </span>
          ))}
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl px-6 py-3 text-blue-300 text-sm text-center max-w-2xl">
          {data.callout}
        </div>
      </motion.div>
    </div>
  );
}
