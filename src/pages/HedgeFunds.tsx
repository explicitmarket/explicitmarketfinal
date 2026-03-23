import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Users, DollarSign, BarChart3, Moon, Sun } from 'lucide-react';

export function HedgeFunds() {
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

  const strategies = [
    {
      icon: TrendingUp,
      title: 'Market Neutral',
      desc: 'Balanced long and short positions to reduce market exposure',
    },
    {
      icon: BarChart3,
      title: 'Quantitative',
      desc: 'Algorithm-driven trading with advanced statistical models',
    },
    {
      icon: Users,
      title: 'Multi-Strategy',
      desc: 'Diversified approach across multiple trading methodologies',
    },
    {
      icon: DollarSign,
      title: 'High Yield',
      desc: 'Target superior risk-adjusted returns for accredited investors',
    },
  ];

  const benefits = [
    'Professional portfolio management',
    'Institutional-grade risk controls',
    'Transparent reporting and audits',
    'Dedicated fund managers',
    'Performance-based fee structure',
    'Global market access',
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
            <h1 className="text-6xl font-light tracking-tight mb-6">Hedge Funds</h1>
            <p className={`text-lg font-light ${textMutedClass} mb-8`}>
              Institutional-grade fund management with professional strategies for superior capital growth
            </p>
            <motion.a
              href="/auth/signup"
              className={`inline-block px-10 py-3 text-sm font-light tracking-wide border-2 transition-all hover-lift cyber-pulse-light
                ${isDark ? 'border-white text-white' : 'border-blue-600 text-blue-600'}`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Invest Now
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${dividerClass}`}></div>

      {/* Strategies */}
      <section className="w-full py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-light tracking-tight mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Our Strategies
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {strategies.map((strategy, i) => {
              const Icon = strategy.icon;
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
                  <h3 className="text-lg font-light tracking-wide mb-3">{strategy.title}</h3>
                  <p className={`text-sm font-light ${textMutedClass}`}>{strategy.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${dividerClass}`}></div>

      {/* Benefits */}
      <section className="w-full py-24 px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl font-light tracking-tight mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Why Choose Explicit Hedge Funds
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${isDark ? 'bg-white/40' : 'bg-blue-600/40'}`} />
                <p className="text-base font-light">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${dividerClass}`}></div>

      {/* Performance */}
      <section className="w-full py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-4xl font-light tracking-tight mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Track Record
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Average Annual Return', value: '18.5%' },
              { label: 'Assets Under Management', value: '$2.4B' },
              { label: 'Years of Experience', value: '15+' },
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
            Ready to grow your wealth?
          </motion.h2>
          <motion.p
            className={`text-base font-light ${textMutedClass} mb-8`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join our network of sophisticated investors and start building generational wealth today.
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
