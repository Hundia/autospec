import React from 'react';
import { motion } from 'framer-motion';

interface ComparisonItem {
  emoji: string;
  text: string;
}

const conversationItems: ComparisonItem[] = [
  { emoji: '💬', text: 'Context degrades after turn 30' },
  { emoji: '🔄', text: 'Every session starts from zero' },
  { emoji: '❌', text: 'Decisions lost when chat ends' },
  { emoji: '🚫', text: 'No agent can continue your work' },
];

const specificationItems: ComparisonItem[] = [
  { emoji: '📐', text: 'Decisions persisted in specs/' },
  { emoji: '🔗', text: 'Any session inherits full context' },
  { emoji: '✅', text: 'Choices survive forever in docs/' },
  { emoji: '🤖', text: 'Any agent can continue seamlessly' },
];

const colorStyles: Record<string, { border: string; bg: string; label: string; dot: string }> = {
  red: { border: 'border-red-500/40', bg: 'bg-red-500/10', label: 'text-red-400', dot: 'bg-red-400' },
  green: { border: 'border-green-500/40', bg: 'bg-green-500/10', label: 'text-green-400', dot: 'bg-green-400' },
};

interface ComparisonColumnProps {
  title: string;
  colorKey: string;
  items: ComparisonItem[];
  delay: number;
}

function ComparisonColumn({ title, colorKey, items, delay }: ComparisonColumnProps) {
  const colors = colorStyles[colorKey];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay }}
      className={`${colors.bg} ${colors.border} border rounded-2xl p-6 flex-1`}
    >
      <h3 className={`text-sm font-semibold ${colors.label} mb-5 flex items-center gap-2`}>
        <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: colorKey === 'red' ? -10 : 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: delay + 0.1 + index * 0.08 }}
            className="flex items-center gap-3 text-sm text-white/70"
          >
            <span className="text-base leading-none">{item.emoji}</span>
            <span>{item.text}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function CostOfNoSpecsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
              The Cost of No Specifications
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Agentic AI without specs is a liability, not an asset
          </p>
        </motion.div>

        {/* Two-column comparison */}
        <div className="flex flex-col sm:flex-row gap-6 mb-10">
          <ComparisonColumn
            title="With Conversation"
            colorKey="red"
            items={conversationItems}
            delay={0.1}
          />
          <ComparisonColumn
            title="With Specifications"
            colorKey="green"
            items={specificationItems}
            delay={0.25}
          />
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-amber-500/15 border border-amber-500/30 rounded-xl px-8 py-6 text-center"
        >
          <p className="text-white/80 text-lg font-medium">
            Specifications are the{' '}
            <span className="text-amber-400 font-semibold">memory that AI was never given.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
