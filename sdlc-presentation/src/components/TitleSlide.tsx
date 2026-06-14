import React from 'react';
import { motion } from 'framer-motion';

interface TitleSlideProps {
  data: {
    title: string;
    subtitle: string;
    tagline: string;
    presenter?: string;
    collaborator?: string;
  };
  lang: 'en' | 'he';
}

const ambientDots = [
  { x: '8%', y: '15%', size: 6, xRange: 18, yRange: 22, duration: 9 },
  { x: '85%', y: '20%', size: 4, xRange: -14, yRange: 16, duration: 12 },
  { x: '15%', y: '75%', size: 8, xRange: 20, yRange: -18, duration: 11 },
  { x: '78%', y: '65%', size: 5, xRange: -16, yRange: 20, duration: 14 },
  { x: '50%', y: '88%', size: 7, xRange: 12, yRange: -12, duration: 8 },
  { x: '92%', y: '45%', size: 4, xRange: -10, yRange: 14, duration: 13 },
];

export default function TitleSlide({ data, lang }: TitleSlideProps) {
  const words = data.tagline.split(' ');

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(ellipse at 30% 40%, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.12) 40%, rgba(6,182,212,0.08) 80%, transparent 100%)',
            'radial-gradient(ellipse at 60% 55%, rgba(139,92,246,0.18) 0%, rgba(6,182,212,0.12) 40%, rgba(59,130,246,0.08) 80%, transparent 100%)',
            'radial-gradient(ellipse at 45% 30%, rgba(6,182,212,0.18) 0%, rgba(59,130,246,0.12) 40%, rgba(139,92,246,0.08) 80%, transparent 100%)',
            'radial-gradient(ellipse at 30% 40%, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.12) 40%, rgba(6,182,212,0.08) 80%, transparent 100%)',
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating ambient dots */}
      {ambientDots.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-400/20 pointer-events-none"
          style={{
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
          }}
          animate={{
            x: [0, dot.xRange, 0],
            y: [0, dot.yRange, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.85, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-7xl sm:text-9xl font-black mb-6 tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 40%, #22d3ee 80%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(96,165,250,0.4))',
          }}
        >
          {data.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl sm:text-2xl text-white/70 mb-10 font-light"
        >
          {data.subtitle}
        </motion.p>

        {/* Presenter name + collaborator credit */}
        {data.presenter && (
          <div className="mb-8">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              className="text-lg text-white/50 font-light"
            >
              {data.presenter}
            </motion.p>
            {data.collaborator && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.4 }}
                className="text-sm text-white/35 font-light italic mt-1"
              >
                {data.collaborator}
              </motion.p>
            )}
          </div>
        )}

        {/* Tagline — word-by-word stagger */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-14">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.15, duration: 0.4, ease: 'easeOut' }}
              className="text-2xl sm:text-3xl font-semibold text-cyan-300"
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Bottom badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 + words.length * 0.15 + 0.3, duration: 0.5 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/15 rounded-full"
        >
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-green-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="text-sm text-white/70 font-medium tracking-wide">
            Spec-Driven Development Framework
          </span>
        </motion.div>
      </div>
    </div>
  );
}
