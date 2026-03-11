import React from 'react';
import { motion } from 'framer-motion';
import PipelineStep from './PipelineStep';
import TerminalVisualization from './TerminalVisualization';
import SpecGridVisualization from './SpecGridVisualization';
import DocsTreeVisualization from './DocsTreeVisualization';
import SkillsVisualization from './SkillsVisualization';
import BrowserMockup from './BrowserMockup';
import WorktreeDiagram from './WorktreeDiagram';
import QALoopVisualization from './QALoopVisualization';
import UserReviewVisualization from './UserReviewVisualization';
import SprintSummaryVisualization from './SprintSummaryVisualization';

interface PipelineStep_Data {
  number: string;
  title: string;
  subtitle: string;
  time: string;
  output: string;
  hero?: boolean;
  accentColor: string;
}

interface PipelineSlideProps {
  data: {
    title: string;
    subtitle: string;
    pipelineCallout: string;
    steps: PipelineStep_Data[];
  };
  lang: 'en' | 'he';
}

const visualizationMap: Record<string, React.FC<{ lang: 'en' | 'he' }>> = {
  '01': TerminalVisualization,
  '02': SpecGridVisualization,
  '03': DocsTreeVisualization,
  '04': SkillsVisualization,
  '05': BrowserMockup,
  '06': WorktreeDiagram,
  '07': QALoopVisualization,
  '08': UserReviewVisualization,
  '09': SprintSummaryVisualization,
};

export default function PipelineSlide({ data, lang }: PipelineSlideProps) {
  const isRTL = lang === 'he';

  return (
    <div className="w-full">
      {/* Hero header section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl sm:text-6xl font-black text-center mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
        >
          {data.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-white/60 text-center max-w-2xl mb-8"
        >
          {data.subtitle}
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-2 text-white/40"
        >
          <span className="text-sm">{isRTL ? 'גלול למטה' : 'Scroll down'}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-2xl"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>

      {/* Vertical connecting line */}
      <div className="relative">
        <div
          className="absolute left-8 top-0 bottom-0 w-0.5 hidden lg:block"
          style={{
            background: 'linear-gradient(180deg, #3b82f6 0%, #8b5cf6 20%, #06b6d4 40%, #f59e0b 60%, #6366f1 80%, #22c55e 100%)',
            opacity: 0.2,
          }}
        />

        {/* Pipeline steps */}
        {data.steps.map((step, idx) => {
          const VisualizationComponent = visualizationMap[step.number];
          return (
            <PipelineStep
              key={step.number}
              number={step.number}
              title={step.title}
              subtitle={step.subtitle}
              time={step.time}
              output={step.output}
              accentColor={step.accentColor}
              hero={step.hero}
              isRTL={isRTL}
            >
              {VisualizationComponent && <VisualizationComponent lang={lang} />}
            </PipelineStep>
          );
        })}
      </div>

      {/* Bottom callout */}
      <div className="min-h-[50vh] flex items-center justify-center px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          className="max-w-3xl text-center"
        >
          <div className="text-3xl mb-4">💡</div>
          <p className="text-xl sm:text-2xl text-white/80 italic font-light leading-relaxed">
            "{data.pipelineCallout}"
          </p>
        </motion.div>
      </div>
    </div>
  );
}
