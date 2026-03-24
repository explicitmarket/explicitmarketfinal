import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../lib/store';
import { ArrowLeft, Moon, Sun } from 'lucide-react';

export function LoginPage() {
  const { login } = useStore();
  const [isDark, setIsDark] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
  const inputClass = isDark
    ? 'bg-slate-900/50 border-slate-800 text-white placeholder-slate-600'
    : 'bg-slate-100/50 border-slate-300 text-black placeholder-slate-400';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${bgClass} min-h-screen transition-colors duration-500 overflow-hidden`}>
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
          <span className="font-light tracking-widest text-sm"><a href="/" className="hover:opacity-70 transition-opacity">EXPLICIT</a></span>
        </div>
      </div>

      {/* Login Form */}
      <div className="min-h-screen w-full flex items-center justify-center pt-20 pb-32 px-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo Section */}
          <div className="text-center mb-12">
            <motion.h1
              className="text-5xl font-light tracking-tight mb-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Sign In
            </motion.h1>
            <motion.p
              className={`text-sm font-light ${textMutedClass}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Access your trading platform
            </motion.p>
          </div>

          {/* Form Card */}
          <motion.div
            className={`p-8 rounded-lg ${cardBgClass}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <motion.div
                  className={`p-4 rounded-lg border ${
                    isDark
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : 'bg-red-100/30 border-red-300/50 text-red-600'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xs font-light tracking-wide">{error}</p>
                </motion.div>
              )}

              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <label className="text-xs font-light tracking-widest opacity-60 block mb-2">EMAIL ADDRESS</label>
                <input
                  type="email"
                  placeholder="trader@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-light tracking-wide border transition-all focus:outline-none focus:ring-2 ${
                    isDark
                      ? 'focus:ring-blue-500/30'
                      : 'focus:ring-blue-400/30'
                  } ${inputClass}`}
                />
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <label className="text-xs font-light tracking-widest opacity-60 block mb-2">PASSWORD</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-light tracking-wide border transition-all focus:outline-none focus:ring-2 ${
                    isDark
                      ? 'focus:ring-blue-500/30'
                      : 'focus:ring-blue-400/30'
                  } ${inputClass}`}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className={`w-full px-6 py-3 text-sm font-light tracking-wide border-2 rounded-lg transition-all cyber-pulse-light
                  ${isDark ? 'border-white text-white' : 'border-blue-600 text-blue-600'}
                  disabled:opacity-50 disabled:cursor-not-allowed`}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
              </motion.button>
            </form>

            {/* Divider */}
            <div className={`my-6 w-full h-px ${dividerClass}`}></div>

            {/* Footer Links */}
            <motion.div
              className="space-y-4 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div>
                <span className={`text-xs font-light ${textMutedClass}`}>
                  Don't have an account?{' '}
                </span>
                <button
                  onClick={() => window.location.href = '/auth/signup'}
                  className={`text-xs font-light tracking-wide hover:opacity-70 transition-opacity ${
                    isDark ? 'text-white' : 'text-black'
                  }`}
                >
                  Sign Up
                </button>
              </div>
              <div>
                <button
                  onClick={() => window.location.href = '/auth/forgot-password'}
                  className={`text-xs font-light tracking-wide hover:opacity-70 transition-opacity ${
                    isDark ? 'text-slate-500' : 'text-slate-600'
                  }`}
                >
                  Forgot Password?
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className={`w-full py-12 px-8 border-t ${dividerClass} ${isDark ? 'bg-slate-950/30' : 'bg-slate-50/30'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`text-xs font-light ${textMutedClass}`}>© 2025 Explicit Market. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="/terms" className={`text-xs font-light ${textMutedClass} hover:${isDark ? 'text-white' : 'text-black'} transition-colors`}>Terms</a>
              <a href="/security" className={`text-xs font-light ${textMutedClass} hover:${isDark ? 'text-white' : 'text-black'} transition-colors`}>Security</a>
              <a href="/contact" className={`text-xs font-light ${textMutedClass} hover:${isDark ? 'text-white' : 'text-black'} transition-colors`}>Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
