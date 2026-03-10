import { motion } from 'framer-motion';

interface BridgeSlideProps {
  data: {
    title: string;
    question: string;
    points: string[];
  };
  lang: 'en' | 'he';
}

const charVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function BridgeSlide({ data }: BridgeSlideProps): JSX.Element {
  const chars = data.question.split('');

  return (
    <div className="max-w-3xl mx-auto w-full text-center">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-12 text-purple-400 tracking-wide"
      >
        {data.title}
      </motion.h2>

      {/* Typewriter question */}
      <div
        className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-12"
        style={{ textShadow: '0 0 40px rgba(168,85,247,0.4)' }}
      >
        {chars.map((char, idx) => (
          <motion.span
            key={idx}
            variants={charVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 + idx * 0.03, duration: 0.05 }}
          >
            {char}
          </motion.span>
        ))}
      </div>

      {/* Sub-points */}
      <div className="space-y-5">
        {data.points.map((point, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + chars.length * 0.03 + idx * 0.5, duration: 0.4 }}
            className="text-lg text-purple-300/80 font-medium"
          >
            {point}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
