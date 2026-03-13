import React from 'react';
import { motion } from 'framer-motion';

const timelineStages = [
  {
    turn: 'Turn 1',
    status: 'Clean',
    color: 'green',
    snippet: 'Use PostgreSQL with Prisma ORM',
  },
  {
    turn: 'Turn 25',
    status: 'Drift',
    color: 'yellow',
    snippet: "Actually, let's try MongoDB here...",
  },
  {
    turn: 'Turn 50',
    status: 'Contradiction',
    color: 'orange',
    snippet: "Wait, we're using Prisma right?",
  },
  {
    turn: 'Turn 100',
    status: 'Chaos',
    color: 'red',
    snippet: 'TypeError: Cannot read undefined',
  },
];

const colorMap: Record<string, { dot: string; border: string; text: string; bg: string }> = {
  green: { dot: 'bg-green-400', border: 'border-green-500/40', text: 'text-green-400', bg: 'bg-green-500/10' },
  yellow: { dot: 'bg-yellow-400', border: 'border-yellow-500/40', text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  orange: { dot: 'bg-orange-400', border: 'border-orange-500/40', text: 'text-orange-400', bg: 'bg-orange-500/10' },
  red: { dot: 'bg-red-400', border: 'border-red-500/40', text: 'text-red-400', bg: 'bg-red-500/10' },
};

const flagStyles: Record<string, string> = {
  drift: 'bg-yellow-500/10 border-l-2 border-l-yellow-500/50',
  contradiction: 'bg-orange-500/10 border-l-2 border-l-orange-500/50',
  poisoned: 'bg-red-500/15 border-l-2 border-l-red-500/60',
  frustrated: 'bg-red-500/20 border-l-2 border-l-red-400/70',
};

interface ChatMessage {
  turn: number;
  sender: 'user' | 'ai';
  text: string;
  flag?: string;
}

const chatMessages: ChatMessage[] = [
  {
    turn: 1,
    sender: 'user',
    text: 'Set up the database layer. We want PostgreSQL with Prisma ORM for type-safe queries.',
  },
  {
    turn: 1,
    sender: 'ai',
    text: "Great choice. I'll set up PostgreSQL with Prisma, define the schema, and generate the client. Creating schema.prisma...",
  },
  {
    turn: 25,
    sender: 'user',
    text: 'The activity feed query is getting slow with all the joins. Any ideas?',
  },
  {
    turn: 25,
    sender: 'ai',
    text: "For the activity feed, MongoDB would be a much better fit — documents map naturally to events. I'll add a Mongo connection for that collection.",
    flag: 'drift',
  },
  {
    turn: 50,
    sender: 'user',
    text: "The activity feed is broken. I'm getting schema validation errors on every write.",
  },
  {
    turn: 50,
    sender: 'ai',
    text: "I see the problem — your Prisma models don't have an activityFeed relation. I'll add it to schema.prisma and run a migration.",
    flag: 'contradiction',
  },
  {
    turn: 100,
    sender: 'user',
    text: "Now I'm getting TypeError: Cannot read properties of undefined on every DB call.",
  },
  {
    turn: 100,
    sender: 'ai',
    text: "The issue is the Prisma client isn't initialized. Let me add Mongoose for the relational tables too and unify everything under a single ODM layer.",
    flag: 'poisoned',
  },
  {
    turn: 100,
    sender: 'user',
    text: "You just don't get it... you suck. I'm never using agentic development again, a waste of my time!",
    flag: 'frustrated',
  },
];

function TurnLabel({ turn }: { turn: number }) {
  return (
    <span className="text-[10px] text-white/30 font-mono flex-shrink-0">T{turn}</span>
  );
}

export default function ContextPoisoningSection() {
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
          <span className="inline-block px-4 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-sm text-amber-400 mb-4">
            The Problem
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent">
              Context Poisoning
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Long conversations don't just lose context — they actively corrupt it
          </p>
        </motion.div>

        {/* Two-panel layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Left: Degradation Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-slate-900/50 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-sm font-semibold text-white/70 mb-6 uppercase tracking-wider">
              Degradation Timeline
            </h3>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-3 bottom-3 w-px bg-white/10" />

              <div className="space-y-6">
                {timelineStages.map((stage, index) => {
                  const colors = colorMap[stage.color];
                  return (
                    <motion.div
                      key={stage.turn}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                      className="flex items-start gap-4 relative"
                    >
                      {/* Dot */}
                      <div className={`w-3.5 h-3.5 rounded-full ${colors.dot} flex-shrink-0 mt-0.5 relative z-10`} />

                      <div className="flex-1 min-w-0">
                        {/* Turn label + Status badge */}
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs text-white/40 font-mono">{stage.turn}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${colors.border} ${colors.text} ${colors.bg}`}>
                            {stage.status}
                          </span>
                        </div>
                        {/* Code snippet */}
                        <div className={`text-xs font-mono px-3 py-2 rounded-lg border ${colors.border} ${colors.bg} ${colors.text} break-words`}>
                          "{stage.snippet}"
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right: Chat Window */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* macOS-style chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/60 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-xs text-white/40 font-mono">AI Agent — project/database</span>
            </div>

            {/* Scrollable messages */}
            <div className="overflow-y-auto p-4 space-y-3" style={{ maxHeight: '350px' }}>
              {chatMessages.map((msg, index) => {
                const isUser = msg.sender === 'user';
                const baseClass = isUser
                  ? 'bg-slate-700/50 border border-white/10'
                  : 'bg-slate-800/30 border border-white/5';
                const flagClass = msg.flag ? flagStyles[msg.flag] : '';

                const isFrustrated = msg.flag === 'frustrated';

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.06 }}
                    className={`rounded-lg p-3 ${baseClass} ${flagClass}`}
                  >
                    {isFrustrated ? (
                      <motion.div
                        whileInView={{ x: [0, -2, 2, -1, 1, 0] }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.06 }}
                      >
                        <div className="flex items-start gap-2">
                          <TurnLabel turn={msg.turn} />
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] font-semibold text-white/50 mr-1.5">
                              {isUser ? 'You:' : 'AI:'}
                            </span>
                            <span className="text-xs text-white/70">{msg.text}</span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <TurnLabel turn={msg.turn} />
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-semibold text-white/50 mr-1.5">
                            {isUser ? 'You:' : 'AI:'}
                          </span>
                          <span className="text-xs text-white/70">{msg.text}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
