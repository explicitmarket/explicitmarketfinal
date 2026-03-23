import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Shield, Eye, Zap, Server, Moon, Sun } from 'lucide-react';

export function Security() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('theme-mode');
    if (stored) setIsDark(stored === 'dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
  }, [isDark]);

  const bgClass = isDark ? 'bg-black text-white' : 'bg-white text-black';
  const cardBgClass = isDark
    ? 'bg-slate-900/40 border border-slate-800/50 backdrop-blur-md'
    : 'bg-slate-50/40 border border-slate-200/50 backdrop-blur-md';
  const textMutedClass = isDark ? 'text-slate-500' : 'text-slate-600';
  const dividerClass = isDark ? 'border-slate-800/30' : 'border-slate-200/30';

  const features = [
    {
      icon: Lock,
      title: 'Bank-Grade Encryption',
      desc: 'AES-256 encryption for all sensitive data in transit and at rest',
    },
    {
      icon: Shield,
      title: '2FA Authentication',
      desc: 'Multi-factor authentication with TOTP and SMS verification',
    },
    {
      icon: Eye,
      title: 'Real-Time Monitoring',
      desc: 'Continuous anomaly detection and threat monitoring 24/7',
    },
    {
      icon: Server,
      title: 'Secure Infrastructure',
      desc: 'ISO 27001 certified data centers with redundant backups',
    },
  ];

  const certifications = [
    'SOC 2 Type II Compliant',
    'ISO 27001 Certified',
    'FINRA & SEC Regulated',
    'GDPR Compliant',
    'PCI DSS Level 1',
    'Penetration Tested Monthly',
  ];

  const safeguards = [
    {
      title: 'Account Security',
      items: [
        'Biometric login options',
        'Device management & whitelisting',
        'Session timeout controls',
        'Login notifications',
      ]
    },
    {
      title: 'Fund Protection',
      items: [
        'Segregated client funds',
        'SIPC insurance coverage',
        'Cold storage for crypto assets',
        'Emergency liquidity reserves',
      ]
    },
    {
      title: 'Transaction Security',
      items: [
        'Real-time fraud detection',
        'Velocity checks',
        'Withdrawal limits & controls',
        'Transaction reversal capability',
      ]
    },
    {
      title: 'Data Security',
      items: [
        'End-to-end encryption',
        'Zero-knowledge architecture',
        'Regular security audits',
        'Bug bounty program',
      ]
    },
  ];

  return (
    <div className={`${bgClass} min-h-screen transition-colors duration-500`}>
      <style>{`
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 10px rgba(59,130,246,0.4), 0 0 20px rgba(59,130,246,0.2); }
          50% { text-shadow: 0 0 20px rgba(59,130,246,0.7), 0 0 40px rgba(59,130,246,0.5); }
        }
        .glow-text { animation: glow 3s ease-in-out infinite; }
        .cyber-pulse-light { 
          animation: cyberpulseLight 2.5s ease-in-out infinite;
        }
        @keyframes cyberpulseLight {
          0%, 100% { border-color: rgba(59,130,246,0.4); box-shadow: 0 0 10px rgba(59,130,246,0.25); }
          50% { border-color: rgba(59,130,246,0.9); box-shadow: 0 0 25px rgba(59,130,246,0.6), inset 0 0 15px rgba(59,130,246,0.15); }
        }
      `}</style>

      {/* Header with Back Button */}
      <div
        className={`fixed w-full top-0 z-50 backdrop-blur-sm ${
          isDark ? 'bg-black/80' : 'bg-white/80'
        } border-b ${dividerClass} transition-all duration-300`}
      >
        <div className="max-w-6xl mx-auto px-8 py-5 flex items-center gap-4">
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-light tracking-wide">Back</span>
          </a>
          <div className="flex-1" />
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 transition-all ${
              isDark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <span className="font-light tracking-widest text-sm">EXPLICIT</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative w-full pt-32 pb-20 px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-light tracking-tight mb-6">Bank-Grade Security</h1>
            <p className={`text-lg font-light ${textMutedClass} mb-8`}>
              Your funds and data are protected by military-grade encryption and continuous monitoring
            </p>
            <motion.a
              href="/auth/signup"
              className={`inline-block px-10 py-3 text-sm font-light tracking-wide border-2 transition-all hover-lift cyber-pulse-light
                ${isDark ? 'border-white text-white' : 'border-blue-600 text-blue-600'}`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Trade Securely
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${dividerClass}`}></div>

      {/* Core Features */}
      <section className="w-full py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-light tracking-tight mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Core Security Features
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  className={`p-8 rounded-lg ${cardBgClass} hover:${isDark ? 'border-slate-700/50' : 'border-slate-300/50'} transition-all`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3 }}
                >
                  <Icon className="w-8 h-8 mb-4" />
                  <h3 className="text-lg font-light tracking-wide mb-3">{feature.title}</h3>
                  <p className={`text-sm font-light ${textMutedClass}`}>{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${dividerClass}`}></div>

      {/* Certifications */}
      <section className="w-full py-24 px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl font-light tracking-tight mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Industry Certifications
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((cert, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${isDark ? 'bg-white/40' : 'bg-blue-600/40'}`} />
                <p className="text-base font-light">{cert}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${dividerClass}`}></div>

      {/* Multi-Layer Safeguards */}
      <section className="w-full py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-light tracking-tight mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Multi-Layer Protection
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {safeguards.map((section, i) => (
              <motion.div
                key={i}
                className={`p-8 rounded-lg ${cardBgClass}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-light tracking-wide mb-6">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <div className={`w-1 h-1 rounded-full mt-2 flex-shrink-0 ${isDark ? 'bg-white/40' : 'bg-blue-600/40'}`} />
                      <span className={`text-sm font-light ${textMutedClass}`}>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${dividerClass}`}></div>

      {/* Trust Metrics */}
      <section className="w-full py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-4xl font-light tracking-tight mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Security Track Record
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Zero Breaches', value: '7+ Years' },
              { label: 'Accounts Protected', value: '2.1M+' },
              { label: 'Funds Secured', value: '$15B+' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className={`p-8 rounded-lg ${cardBgClass}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <p className={`text-sm font-light ${textMutedClass} mb-3`}>{stat.label}</p>
                <p className="text-3xl font-light tracking-tight">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${dividerClass}`}></div>

      {/* CTA */}
      <section className="w-full py-24 px-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            className="text-4xl font-light tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Trade with Confidence
          </motion.h2>
          <motion.p
            className={`text-base font-light ${textMutedClass} mb-8`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your security is our priority. Start trading on the most secure platform available.
          </motion.p>
          <motion.a
            href="/auth/signup"
            className={`inline-block px-10 py-3 text-sm font-light tracking-wide border-2 transition-all hover-lift cyber-pulse-light
              ${isDark ? 'border-white text-white' : 'border-blue-600 text-blue-600'}`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
          </motion.a>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${dividerClass}`}></div>

      {/* Footer */}
      <footer className={`w-full py-16 px-8 ${isDark ? 'bg-slate-950/50' : 'bg-slate-50/50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { title: 'Product', links: ['Features', 'Broker', 'Security', 'API Docs'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: [{ text: 'Terms', href: '/terms' }, 'Privacy', 'Compliance', 'Disclosures'] },
              { title: 'Social', links: ['Twitter', 'Discord', 'LinkedIn', 'GitHub'] },
            ].map((col, i) => (
              <div key={i}>
                <p className="text-xs font-light tracking-widest mb-4 opacity-60">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      {typeof link === 'object' ? (
                        <a href={link.href} className={`text-xs font-light ${textMutedClass} hover:${isDark ? 'text-white' : 'text-black'} transition-colors`}>
                          {link.text}
                        </a>
                      ) : (
                        <a href="#" className={`text-xs font-light ${textMutedClass} hover:${isDark ? 'text-white' : 'text-black'} transition-colors`}>
                          {link}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={`border-t ${dividerClass} pt-8 flex flex-col md:flex-row items-center justify-between`}>
            <p className={`text-xs font-light ${textMutedClass}`}>© 2025 Explicit Market. All rights reserved.</p>
            <div className="flex gap-8 mt-6 md:mt-0">
              <a href="/broker" className={`text-xs font-light ${textMutedClass} hover:${isDark ? 'text-white' : 'text-black'} transition-colors`}>Broker</a>
              <a href="/contact" className={`text-xs font-light ${textMutedClass} hover:${isDark ? 'text-white' : 'text-black'} transition-colors`}>Support</a>
              <a href="/terms" className={`text-xs font-light ${textMutedClass} hover:${isDark ? 'text-white' : 'text-black'} transition-colors`}>Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
