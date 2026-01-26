import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, BookOpen, Zap, Code2, FileText } from 'lucide-react';

const navLinks = [
  { name: 'Docs', href: '#docs', icon: BookOpen },
  { name: 'Quick Start', href: '#quickstart', icon: Zap },
  { name: 'Examples', href: '#examples', icon: Code2 },
  { name: 'Paper', href: '#paper', icon: FileText },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">
                AS
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                AutoSpec
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2"
                >
                  <link.icon size={16} />
                  {link.name}
                </a>
              ))}
            </div>

            {/* Right side - CTA & GitHub */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://github.com/Hundia/autospec"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="#quickstart"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                Get Started
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute right-0 top-0 h-full w-72 bg-slate-900 border-l border-white/10 p-6 pt-20"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <link.icon size={20} />
                    {link.name}
                  </a>
                ))}
                <hr className="border-white/10 my-4" />
                <a
                  href="https://github.com/Hundia/autospec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  <Github size={20} />
                  GitHub
                </a>
                <a
                  href="#quickstart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center font-medium rounded-lg"
                >
                  Get Started
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
