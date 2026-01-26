import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Mail, Heart, Copy, Check, Terminal, ArrowRight, Star } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Quick Start', href: '#quickstart' },
    { name: 'Documentation', href: '#docs' },
    { name: 'Examples', href: '#examples' },
    { name: 'Case Studies', href: '#examples' },
  ],
  resources: [
    { name: 'Academic Paper', href: '#paper' },
    { name: 'Blog', href: '#' },
    { name: 'Changelog', href: '#' },
    { name: 'Roadmap', href: '#' },
  ],
  community: [
    { name: 'GitHub', href: 'https://github.com/Hundia/autospec' },
    { name: 'Discord', href: '#' },
    { name: 'Twitter', href: '#' },
    { name: 'Contributing', href: '#' },
  ],
};

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const installCommand = 'npx autospec init';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="border-t border-white/10">
      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-slate-900/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Ship Better Software?
          </h2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            Start building with spec-driven development today.
            Turn your AI assistant into a reliable development partner.
          </p>

          {/* Install Command */}
          <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-white/10 rounded-xl p-2 mb-8">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/80 rounded-lg">
              <Terminal size={18} className="text-white/40" />
              <code className="text-base font-mono text-white/90">{installCommand}</code>
            </div>
            <button
              onClick={handleCopy}
              className="p-3 hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Copy command"
            >
              {copied ? (
                <Check size={18} className="text-green-400" />
              ) : (
                <Copy size={18} className="text-white/40 hover:text-white/60" />
              )}
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#quickstart"
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              Get Started
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="https://github.com/Hundia/autospec"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-all"
            >
              <Star size={18} />
              Star on GitHub
            </a>
          </div>
        </motion.div>
      </div>

      {/* Links Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="col-span-2 md:col-span-1">
              <a href="#" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">
                  AS
                </div>
                <span className="text-lg font-bold text-white">AutoSpec</span>
              </a>
              <p className="text-sm text-white/50 mb-4">
                The spec-driven development framework for AI-powered software engineering.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/Hundia/autospec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
                <a
                  href="#"
                  className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="#"
                  className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Community</h4>
              <ul className="space-y-2">
                {footerLinks.community.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-6 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            {new Date().getFullYear()} AutoSpec. Open source under MIT License.
          </p>
          <p className="text-sm text-white/40 flex items-center gap-1">
            Built with <Heart size={14} className="text-red-500" /> for developers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
