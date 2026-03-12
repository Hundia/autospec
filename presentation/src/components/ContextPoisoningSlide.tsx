import { motion } from 'framer-motion';

interface ChatMessage {
  role: 'user' | 'ai';
  turn: number;
  text: string;
  flag?: 'drift' | 'contradiction' | 'poisoned';
}

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
    chat?: {
      windowTitle: string;
      messages: ChatMessage[];
    };
  };
  lang: 'en' | 'he';
}

const colorMap: Record<string, { dot: string; border: string; text: string; bg: string; line: string }> = {
  green: { dot: 'bg-green-400', border: 'border-green-500/40', text: 'text-green-400', bg: 'bg-green-500/10', line: 'bg-green-500/30' },
  yellow: { dot: 'bg-yellow-400', border: 'border-yellow-500/40', text: 'text-yellow-400', bg: 'bg-yellow-500/10', line: 'bg-yellow-500/30' },
  orange: { dot: 'bg-orange-400', border: 'border-orange-500/40', text: 'text-orange-400', bg: 'bg-orange-500/10', line: 'bg-orange-500/30' },
  red: { dot: 'bg-red-400', border: 'border-red-500/40', text: 'text-red-400', bg: 'bg-red-500/10', line: 'bg-red-500/30' },
};

const flagStyles: Record<string, string> = {
  drift: 'bg-yellow-500/10 border-l-2 border-l-yellow-500/50',
  contradiction: 'bg-orange-500/10 border-l-2 border-l-orange-500/50',
  poisoned: 'bg-red-500/15 border-l-2 border-l-red-500/60',
};

export default function ContextPoisoningSlide({ data }: ContextPoisoningSlideProps): JSX.Element {
  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center text-slate-400 text-sm mb-5 max-w-2xl mx-auto"
      >
        {data.subtitle}
      </motion.p>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* LEFT: Degradation Timeline */}
        <div className="relative flex flex-col gap-0">
          {/* Connecting line */}
          <div className="absolute left-[7px] top-4 bottom-4 w-px bg-gradient-to-b from-green-500/40 via-yellow-500/40 to-red-500/40" />

          {data.stages.map((stage, idx) => {
            const colors = colorMap[stage.color] || colorMap.green;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.15, duration: 0.35 }}
                className="relative flex items-start gap-3 py-2"
              >
                {/* Dot on timeline */}
                <div className={`relative z-10 w-[15px] h-[15px] rounded-full ${colors.dot} shadow-lg flex-shrink-0 mt-0.5`} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.text}`}>
                      {stage.turn}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${colors.bg} border ${colors.border} ${colors.text}`}>
                      {stage.status}
                    </span>
                  </div>
                  <code className="block font-mono text-[10px] text-slate-300 bg-slate-900/60 rounded px-2 py-1 truncate">
                    {stage.snippet}
                  </code>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* RIGHT: Chat Window */}
        {data.chat && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900/80"
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/80 border-b border-slate-700/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="text-[10px] text-slate-500 font-mono ml-2">{data.chat.windowTitle}</span>
            </div>

            {/* Messages */}
            <div className="p-3 flex flex-col gap-2 max-h-[400px] overflow-y-auto">
              {data.chat.messages.map((msg, idx) => {
                const isAI = msg.role === 'ai';
                const prevMsg = data.chat!.messages[idx - 1];
                const showTurn = !prevMsg || prevMsg.turn !== msg.turn;
                const flagClass = msg.flag ? flagStyles[msg.flag] : '';
                const isPoisoned = msg.flag === 'poisoned';

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={
                      isPoisoned
                        ? { opacity: 1, y: 0, x: [0, -2, 2, -1, 1, 0] }
                        : { opacity: 1, y: 0 }
                    }
                    transition={
                      isPoisoned
                        ? { delay: 0.4 + idx * 0.12, duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
                        : { delay: 0.4 + idx * 0.12, duration: 0.3 }
                    }
                  >
                    {/* Turn indicator */}
                    {showTurn && (
                      <div className="text-center mb-1">
                        <span className="text-[9px] text-slate-600 font-mono bg-slate-800/60 px-2 py-0.5 rounded-full">
                          Turn {msg.turn}
                        </span>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${
                          isAI
                            ? `bg-slate-800/80 text-slate-300 ${flagClass}`
                            : 'bg-blue-600/20 text-blue-200 border border-blue-500/20'
                        }`}
                      >
                        {/* Role label */}
                        <div className={`text-[9px] font-semibold mb-0.5 ${isAI ? 'text-violet-400/70' : 'text-blue-400/70'}`}>
                          {isAI ? 'AI' : 'You'}
                        </div>
                        <span className="font-mono leading-relaxed">{msg.text}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
