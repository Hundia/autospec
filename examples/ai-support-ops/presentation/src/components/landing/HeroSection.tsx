import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowRight, Github } from 'lucide-react';

// Conversation-style animation data
interface ConversationLine {
  speaker: 'user' | 'ai';
  text: string;
  delay: number; // ms before this line appears
}

const CONVERSATION: ConversationLine[] = [
  { speaker: 'user', text: 'Run @QUICKSTART.md', delay: 0 },
  { speaker: 'ai', text: 'Reading requirements/my-app.md...', delay: 1200 },
  { speaker: 'ai', text: '', delay: 800 },
  { speaker: 'ai', text: 'Generating 10 expert specifications...', delay: 600 },
  { speaker: 'ai', text: '  ✓ Product Manager    (Vision & Stories)', delay: 400 },
  { speaker: 'ai', text: '  ✓ Backend Lead       (API & Services)', delay: 300 },
  { speaker: 'ai', text: '  ✓ Frontend Lead      (Components & UX)', delay: 300 },
  { speaker: 'ai', text: '  ✓ Database Architect (Schema & Migrations)', delay: 300 },
  { speaker: 'ai', text: '  ✓ QA Lead            (Testing Strategy)', delay: 250 },
  { speaker: 'ai', text: '  ✓ DevOps Lead        (Infrastructure)', delay: 250 },
  { speaker: 'ai', text: '  ✓ Marketing Lead     (Go-to-Market)', delay: 250 },
  { speaker: 'ai', text: '  ✓ Finance Lead       (Pricing & Economics)', delay: 250 },
  { speaker: 'ai', text: '  ✓ Business Lead      (Strategy)', delay: 250 },
  { speaker: 'ai', text: '  ✓ UI Designer        (Screens & Wireframes)', delay: 250 },
  { speaker: 'ai', text: '', delay: 400 },
  { speaker: 'ai', text: 'Generating sprint backlog...', delay: 500 },
  { speaker: 'ai', text: '  ✓ 8 sprints | 47 tickets | 186 pts', delay: 600 },
  { speaker: 'ai', text: '', delay: 400 },
  { speaker: 'ai', text: 'Ready. Run /sprint-run 0 to begin.', delay: 500 },
];

function useConversationAnimation() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [userTypedChars, setUserTypedChars] = useState(0);
  const [isTypingUser, setIsTypingUser] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalLines = CONVERSATION.length;

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Phase 1: Type out user message character by character
    if (isTypingUser) {
      const userMsg = CONVERSATION[0].text;
      if (userTypedChars < userMsg.length) {
        timeoutRef.current = setTimeout(() => {
          setUserTypedChars((c) => c + 1);
        }, 50);
      } else {
        // Done typing user message, start showing AI lines
        timeoutRef.current = setTimeout(() => {
          setIsTypingUser(false);
          setVisibleLines(1); // User line is "done"
        }, 600);
      }
      return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }

    // Phase 2: Show AI response lines one by one
    if (visibleLines < totalLines) {
      const nextLine = CONVERSATION[visibleLines];
      timeoutRef.current = setTimeout(() => {
        setVisibleLines((v) => v + 1);
      }, nextLine.delay);
    } else {
      // All lines shown, wait then restart
      timeoutRef.current = setTimeout(() => {
        setVisibleLines(0);
        setUserTypedChars(0);
        setIsTypingUser(true);
      }, 4000);
    }

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [visibleLines, userTypedChars, isTypingUser, totalLines]);

  return { visibleLines, userTypedChars, isTypingUser };
}

export default function HeroSection() {
  const [copied, setCopied] = useState(false);
  const installCommand = 'gh repo create my-project --template Hundia/autospec-starter';
  const animation = useConversationAnimation();
  const chatRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [animation.visibleLines, animation.userTypedChars]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
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
              Drop <span className="text-white font-medium font-mono">@QUICKSTART.md</span> into
              your AI assistant. It generates 10 expert specs, a sprint backlog, and full
              documentation — from your requirements, in one pass.
            </motion.p>

            {/* Install Command */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-white/10 rounded-xl p-2 backdrop-blur-sm">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/80 rounded-lg">
                  <Github size={18} className="text-white/40" />
                  <code className="text-xs sm:text-sm font-mono text-white/90">
                    {installCommand}
                  </code>
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
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
              className="flex flex-col sm:flex-row items-start gap-4 mb-12"
            >
              <a
                href="#quickstart"
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

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 text-sm text-white/40"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">25+</span>
                <span>Sprints Completed</span>
              </div>
              <div className="w-px h-6 bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">263</span>
                <span>Tickets Executed</span>
              </div>
              <div className="w-px h-6 bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">~60%</span>
                <span>Cost Savings</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Conversation Animation */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            {/* Glow behind terminal */}
            <div className="absolute inset-0 -m-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-2xl" />

            {/* Chat Window */}
            <div className="relative bg-slate-950 rounded-xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Window Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/80 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 flex justify-center">
                  <span className="text-xs text-white/40 font-mono">~/my-project</span>
                </div>
              </div>

              {/* Chat Body */}
              <div
                ref={chatRef}
                className="h-[360px] lg:h-[420px] overflow-hidden p-4 space-y-3"
              >
                {/* User message (typing animation) */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <span className="text-xs text-blue-400 font-bold">U</span>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg rounded-tl-none px-4 py-2 max-w-[85%]">
                    <span className="font-mono text-sm text-blue-300">
                      {animation.isTypingUser
                        ? CONVERSATION[0].text.slice(0, animation.userTypedChars)
                        : CONVERSATION[0].text}
                    </span>
                    {animation.isTypingUser && (
                      <span className="inline-block w-1.5 h-4 bg-blue-400/80 animate-pulse ml-0.5 align-middle" />
                    )}
                  </div>
                </div>

                {/* AI response lines */}
                {!animation.isTypingUser && animation.visibleLines > 1 && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                      <span className="text-xs text-purple-400 font-bold">AI</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg rounded-tl-none px-4 py-3 max-w-[90%]">
                      <div className="font-mono text-sm space-y-0.5">
                        {CONVERSATION.slice(1, animation.visibleLines).map((line, idx) => {
                          if (line.text === '') return <div key={idx} className="h-2" />;

                          // Color the checkmarks green, "Ready" line emerald
                          let textClass = 'text-white/70';
                          if (line.text.startsWith('  ✓')) textClass = 'text-green-400';
                          else if (line.text.startsWith('Reading')) textClass = 'text-blue-400';
                          else if (line.text.startsWith('Generating')) textClass = 'text-purple-400';
                          else if (line.text.startsWith('Ready')) textClass = 'text-emerald-400';

                          return (
                            <div key={idx} className={`${textClass} leading-5 whitespace-pre`}>
                              {line.text}
                            </div>
                          );
                        })}
                        {animation.visibleLines < CONVERSATION.length && (
                          <span className="inline-block w-1.5 h-4 bg-purple-400/60 animate-pulse" />
                        )}
                      </div>
                    </div>
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
