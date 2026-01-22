import React from 'react';
import { motion } from 'framer-motion';

interface TitleSlideProps {
  data: {
    title: string;
    subtitle: string;
    tagline: string;
    presenter: string;
    date: string;
  };
  lang: 'en' | 'he';
}

export default function TitleSlide({ data, lang }: TitleSlideProps) {
  return (
    <div className="text-center max-w-4xl mx-auto">
      {/* Logo / ASCII Art */}
      <motion.pre
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-blue-400 text-xs sm:text-sm font-mono mb-8 hidden sm:block"
      >
{`   _         _        ____
  / \\  _   _| |_ ___ / ___| _ __   ___  ___
 / _ \\| | | | __/ _ \\\\___ \\| '_ \\ / _ \\/ __|
/ ___ \\ |_| | || (_) |___) | |_) |  __/ (__
/_/   \\_\\__,_|\\__\\___/|____/| .__/ \\___|\\__|
                            |_|              `}
      </motion.pre>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-6xl sm:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
      >
        {data.title}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-2xl sm:text-3xl text-white/80 mb-6"
      >
        {data.subtitle}
      </motion.p>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-lg text-blue-400 mb-12"
      >
        {data.tagline}
      </motion.p>

      {/* Presenter & Date */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-white/50"
      >
        <p>{data.presenter}</p>
        <p>{data.date}</p>
      </motion.div>
    </div>
  );
}
