import React, { useState, useEffect, RefObject } from 'react';
import { motion } from 'framer-motion';

interface ScrollProgressBarProps {
  containerRef: RefObject<HTMLDivElement>;
  visible: boolean;
}

export default function ScrollProgressBar({ containerRef, visible }: ScrollProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !visible) return;

    const handleScroll = () => {
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      if (scrollHeight > 0) {
        setProgress(scrollTop / scrollHeight);
      }
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [containerRef, visible]);

  if (!visible) return null;

  return (
    <div className="fixed right-2 top-16 bottom-16 w-1.5 z-40 rounded-full bg-white/10">
      <motion.div
        className="w-full rounded-full bg-gradient-to-b from-blue-400 via-amber-400 to-green-400"
        style={{ height: `${Math.max(progress * 100, 2)}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}
