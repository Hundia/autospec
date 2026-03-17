import { motion } from 'framer-motion';

interface Insight {
  title: string;
  description: string;
  icon: string;
  color: 'blue' | 'green' | 'violet' | 'amber';
}

interface OneMoreThingSlideProps {
  data: {
    title: string;
    subtitle: string;
    insights: Insight[];
  };
  lang: 'en' | 'he';
}

const colorMap = {
  blue: {
    border: 'border-blue-500/40',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/10',
  },
  green: {
    border: 'border-green-500/40',
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    glow: 'shadow-green-500/10',
  },
  violet: {
    border: 'border-violet-500/40',
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    glow: 'shadow-violet-500/10',
  },
  amber: {
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/10',
  },
};

export default function OneMoreThingSlide({ data }: OneMoreThingSlideProps) {
  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* "Oh, and one more thing..." — dramatic Steve Jobs entrance */}
      <motion.h2
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{
          opacity: [0, 1, 1, 1],
          scale: [1.2, 1.15, 1.15, 0.85],
          y: [0, 0, 0, -30],
        }}
        transition={{
          duration: 3.5,
          times: [0, 0.15, 0.4, 1],
          ease: 'easeInOut',
        }}
        className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-3 italic bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.5 }}
        className="text-center text-slate-400 text-base mb-8 max-w-2xl mx-auto"
      >
        {data.subtitle}
      </motion.p>

      {/* Cards container — fades in after title shrinks */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {data.insights.map((insight, idx) => {
          const colors = colorMap[insight.color];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 60, scale: 0.85 }}
              animate={{
                opacity: [0, 1, 1],
                y: [60, 0, 0],
                scale: [0.85, 1.05, 1],
              }}
              transition={{
                duration: 0.6,
                delay: 2.4 + idx * 0.2,
                times: [0, 0.6, 1],
                ease: 'easeOut',
              }}
              className={`${colors.bg} border ${colors.border} rounded-xl p-5 shadow-lg ${colors.glow}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{insight.icon}</span>
                <h3 className={`text-lg font-semibold ${colors.text}`}>
                  {insight.title}
                </h3>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                {insight.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
