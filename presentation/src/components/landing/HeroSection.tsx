import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowRight, Github } from 'lucide-react';

// Conversation animation data
interface ConversationLine {
  speaker: 'user' | 'ai' | 'output';
  text: string;
  color?: string;
}

const CONVERSATION_LINES: ConversationLine[] = [
  { speaker: 'user', text: 'Run @QUICKSTART.md' },
  { speaker: 'ai', text: 'Reading requirements/my-app.md...' },
  { speaker: 'output', text: '' },
  { speaker: 'output', text: 'Generating 10 expert specifications...', color: 'text-blue-400' },
  { speaker: 'output', text: '  \u2713 Product Manager    (Vision & Stories)', color: 'text-green-400' },
  { speaker: 'output', text: '  \u2713 Backend Lead       (API & Services)', color: 'text-green-400' },
  { speaker: 'output', text: '  \u2713 Frontend Lead      (Components & UX)', color: 'text-green-400' },
  { speaker: 'output', text: '  \u2713 Database Architect  (Schema & Migrations)', color: 'text-green-400' },
  { speaker: 'output', text: '  \u2713 QA Lead            (Testing Strategy)', color: 'text-green-400' },
  { speaker: 'output', text: '  \u2713 DevOps Lead        (Infrastructure)', color: 'text-green-400' },
  { speaker: 'output', text: '  ... +4 more experts', color: 'text-white/50' },
  { speaker: 'output', text: '' },
  { speaker: 'output', text: 'Generating sprint backlog...', color: 'text-blue-400' },
  { speaker: 'output', text: '  \u2713 8 sprints | 47 tickets | 186 pts', color: 'text-green-400' },
  { speaker: 'output', text: '' },
  { speaker: 'ai', text: 'Ready. Run /sprint-run 0 to begin.' },
];

const CHAR_DELAY = 40;
const LINE_DELAY = 90;
const PAUSE_AFTER = 3500;
const RESET_PAUSE = 2000;

type AnimPhase = 'typing-user' | 'showing-ai-1' | 'showing-lines' | 'paused' | 'resetting';

function useConversationAnimation() {
  const [phase, setPhase] = useState<AnimPhase>('typing-user');
  const [typedChars, setTypedChars] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    clearTimer();

    const userText = CONVERSATION_LINES[0].text;

    if (phase === 'typing-user') {
      if (typedChars < userText.length) {
        timeoutRef.current = setTimeout(() => setTypedChars((c) => c + 1), CHAR_DELAY);
      } else {
        timeoutRef.current = setTimeout(() => setPhase('showing-ai-1'), 500);
      }
    } else if (phase === 'showing-ai-1') {
      // Show "Reading requirements..." line (index 1), then start showing output lines
      timeoutRef.current = setTimeout(() => setPhase('showing-lines'), 600);
    } else if (phase === 'showing-lines') {
      // Lines 2 onward (index 2+)
      const remainingLines = CONVERSATION_LINES.slice(2);
      if (visibleLines < remainingLines.length) {
        timeoutRef.current = setTimeout(() => setVisibleLines((l) => l + 1), LINE_DELAY);
      } else {
        timeoutRef.current = setTimeout(() => setPhase('paused'), PAUSE_AFTER);
      }
    } else if (phase === 'paused') {
      timeoutRef.current = setTimeout(() => setPhase('resetting'), RESET_PAUSE);
    } else if (phase === 'resetting') {
      setTypedChars(0);
      setVisibleLines(0);
      setPhase('typing-user');
    }

    return clearTimer;
  }, [phase, typedChars, visibleLines]);

  return { phase, typedChars, visibleLines };
}

export default function HeroSection() {
  const [copied, setCopied] = useState(false);
  const installCommand = 'gh repo create my-project --template Hundia/autospec-starter';
  const { phase, typedChars, visibleLines } = useConversationAnimation();
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [phase, typedChars, visibleLines]);

  const userText = CONVERSATION_LINES[0].text;
  const aiReadingLine = CONVERSATION_LINES[1];
  const outputLines = CONVERSATION_LINES.slice(2);

  const showAiReading = phase === 'showing-ai-1' || phase === 'showing-lines' || phase === 'paused' || phase === 'resetting';
  const showOutput = phase === 'showing-lines' || phase === 'paused' || phase === 'resetting';

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
                Open Source Framework
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Make AI Think
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Before It Codes
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl sm:text-2xl text-white/60 max-w-xl mb-8"
            >
              Drop in your requirements. Get a complete AI-ready project structure —{' '}
              <span className="text-white font-medium">specs, backlog, and living docs</span>{' '}
              — in under 5 minutes.
            </motion.p>

            {/* Install Command */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-white/10 rounded-xl p-2 backdrop-blur-sm max-w-full">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/80 rounded-lg overflow-hidden">
                  <span className="text-white/40 font-mono text-sm flex-shrink-0">$</span>
                  <code className="text-xs sm:text-sm font-mono text-white/90 truncate">
                    {installCommand}
                  </code>
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Copy command"
                >
                  {copied ? (
                    <Check size={18} className="text-green-400" />
                  ) : (
                    <Copy size={18} className="text-white/40 hover:text-white/60" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-6"
            >
              <a
                href="https://github.com/Hundia/autospec-starter"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
              >
                Get the Template
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://github.com/Hundia/autospec"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-all"
              >
                <Github size={18} />
                Star on GitHub
              </a>
            </motion.div>

            {/* Presentation link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-4"
              data-testid="hero-presentation-link"
            >
              <a
                href="#/presentation"
                className="text-sm text-white/40 hover:text-white/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                → See the full presentation
              </a>
            </motion.div>
          </div>

          {/* Right: Animated Chat Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            {/* Glow behind terminal */}
            <div className="absolute inset-0 -m-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-2xl" />

            {/* Terminal Window */}
            <div className="relative bg-slate-950 rounded-xl border border-white/10 shadow-2xl overflow-hidden">
              {/* macOS Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/80 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 flex justify-center">
                  <span className="text-xs text-white/40 font-mono">AI Assistant — ~/my-project</span>
                </div>
              </div>

              {/* Chat Body */}
              <div
                ref={chatBodyRef}
                className="h-[360px] lg:h-[420px] overflow-hidden font-mono text-sm p-4 space-y-3"
              >
                {/* User message */}
                <div className="flex items-start gap-3">
                  <span className="text-xs font-semibold text-cyan-400 flex-shrink-0 mt-0.5 w-8">You</span>
                  <div className="flex-1">
                    <span className="text-white">
                      {userText.slice(0, typedChars)}
                    </span>
                    {phase === 'typing-user' && (
                      <span className="inline-block w-2 h-4 bg-white/80 animate-pulse ml-0.5 align-middle" />
                    )}
                  </div>
                </div>

                {/* AI: Reading line */}
                {showAiReading && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-xs font-semibold text-purple-400 flex-shrink-0 mt-0.5 w-8">AI</span>
                    <span className="text-white/80">{aiReadingLine.text}</span>
                  </motion.div>
                )}

                {/* Output lines */}
                {showOutput && (
                  <div className="flex items-start gap-3">
                    <span className="w-8 flex-shrink-0" />
                    <div className="flex-1 space-y-0.5">
                      {outputLines.slice(0, visibleLines).map((line, idx) => {
                        // Last line ("Ready. Run ...") is AI speaker
                        const isLastAiLine = idx === outputLines.length - 1;
                        if (isLastAiLine) {
                          return (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-start gap-3 -ml-11 mt-2"
                            >
                              <span className="text-xs font-semibold text-purple-400 flex-shrink-0 mt-0.5 w-8">AI</span>
                              <span className="text-emerald-400 font-medium">{line.text}</span>
                            </motion.div>
                          );
                        }
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`leading-5 ${line.color || 'text-white/60'}`}
                          >
                            {line.text || '\u00A0'}
                          </motion.div>
                        );
                      })}

                      {/* Blinking cursor at end */}
                      {phase === 'showing-lines' && visibleLines < outputLines.length && (
                        <span className="inline-block w-2 h-4 bg-white/60 animate-pulse" />
                      )}
                    </div>
                  </div>
                )}

                {/* Bottom cursor when paused */}
                {phase === 'paused' && (
                  <div className="flex items-center gap-3">
                    <span className="w-8 flex-shrink-0" />
                    <span className="inline-block w-2 h-4 bg-white/40 animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
