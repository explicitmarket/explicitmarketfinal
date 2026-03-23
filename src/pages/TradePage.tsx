import React, { useEffect, useState } from 'react';
import ForexListWidget from '../components/trading/ForexListWidget';
import { Chart } from '../components/trading/Chart';
import { OrderPanel } from '../components/trading/OrderPanel';
import { TradeList } from '../components/trading/TradeList';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';
import { Moon, Sun } from 'lucide-react';

export function TradePage() {
  const { assets } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(
    'Connecting to trading server...'
  );
  const [isDark, setIsDark] = useState(true);
  
  // Mobile Tab State
  const [mobileTab, setMobileTab] = useState<'order' | 'market' | 'trades'>(
    'order'
  );

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
  useEffect(() => {
    const statusMessages = [
    'Connecting to trading server...',
    'Authenticating session...',
    'Loading market data...',
    'Initializing chart engine...',
    'Syncing open positions...',
    'Ready'];

    let progressInterval: NodeJS.Timeout;
    let textInterval: NodeJS.Timeout;
    progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = Math.max(1, Math.floor(Math.random() * 10));
        return Math.min(100, prev + increment);
      });
    }, 200);
    let msgIndex = 0;
    textInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % statusMessages.length;
      if (msgIndex < statusMessages.length) {
        setLoadingText(statusMessages[msgIndex]);
      }
    }, 600);
    const completeTimer = setTimeout(() => {
      setIsLoading(false);
      clearInterval(progressInterval);
      clearInterval(textInterval);
    }, 3000);
    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      clearTimeout(completeTimer);
    };
  }, []);

  return (
    <div className={`${bgClass} h-screen w-full overflow-hidden flex flex-col relative transition-colors duration-500`}>
      <style>{`
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 10px rgba(59,130,246,0.4), 0 0 20px rgba(59,130,246,0.2); }
          50% { text-shadow: 0 0 20px rgba(59,130,246,0.7), 0 0 40px rgba(59,130,246,0.5); }
        }
        .glow-text { animation: glow 3s ease-in-out infinite; }
      `}</style>

      <AnimatePresence>
        {isLoading &&
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 z-50 flex flex-col items-center justify-center ${isDark ? 'bg-black' : 'bg-white'} ${isDark ? 'text-white' : 'text-black'}`}>
          
            <div className="w-full max-w-md px-6 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-light tracking-tight mb-8 glow-text">
                ExplicitMarket <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>Terminal</span>
              </motion.h1>

              <div className={`w-full h-1 ${isDark ? 'bg-slate-800/50' : 'bg-slate-200/50'} overflow-hidden mb-6 rounded-full`}>
                <motion.div
                  className={`h-full ${isDark ? 'bg-gradient-to-r from-blue-500 to-emerald-500' : 'bg-gradient-to-r from-blue-600 to-emerald-600'}`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>

              <div className="flex justify-between items-center text-xs font-light">
                <motion.span
                  key={loadingText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`truncate ${textMutedClass}`}>
                  {loadingText}
                </motion.span>
                <span className={textMutedClass}>{loadingProgress}%</span>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Header with Theme Toggle */}
      <motion.div 
        className={`sticky top-0 z-40 backdrop-blur-sm ${isDark ? 'bg-black/80' : 'bg-white/80'} border-b ${dividerClass} px-4 md:px-6 py-4 flex items-center justify-between transition-all duration-300`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-lg md:text-xl font-light tracking-tight">Trading Terminal</h1>
          <p className={`text-xs font-light ${textMutedClass}`}>Real-time forex trading</p>
        </div>
        <motion.button
          onClick={() => setIsDark(!isDark)}
          className={`p-2 transition-all ${isDark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </motion.div>

      {/* Mobile Symbol Selector */}
      <motion.div 
        className={`md:hidden h-14 ${cardBgClass} flex items-center overflow-x-auto no-scrollbar px-2 space-x-2 flex-shrink-0`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {assets.map((asset) =>
        <motion.button
          key={asset.symbol}
          onClick={() => setSelectedSymbol(asset.symbol)}
          className={cn(
            'px-3 py-2 rounded text-xs font-light whitespace-nowrap transition-all min-h-[44px] flex items-center',
            selectedSymbol === asset.symbol ?
            (`${isDark ? 'bg-blue-500/30 border-blue-500/50' : 'bg-blue-100/30 border-blue-400/50'} border`) :
            (`${cardBgClass}`)
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {asset.symbol}
        </motion.button>
        )}
      </motion.div>

      {/* Main Layout - Trading Grid */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Market Overview (Desktop Only) */}
        <motion.div 
          className={`hidden md:flex md:flex-col w-[300px] flex-shrink-0 ${dividerClass} border-r overflow-y-auto p-4`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <h3 className={`text-xs font-light tracking-widest opacity-60 mb-4 uppercase`}>Market</h3>
          <ForexListWidget />
        </motion.div>

        {/* Center: Chart */}
        <motion.div 
          className={`flex-shrink-0 h-48 md:h-auto md:flex-1 min-w-0 ${dividerClass} border-b md:border-b-0 md:border-r`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Chart symbol={selectedSymbol} />
        </motion.div>

        {/* Mobile Tab Bar */}
        <motion.div 
          className={`md:hidden flex ${isDark ? 'bg-slate-900/40 border-t border-slate-800/50' : 'bg-slate-50/40 border-t border-slate-200/50'} flex-shrink-0`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          {['order', 'market', 'trades'].map((tab) =>
          <motion.button
            key={tab}
            onClick={() => setMobileTab(tab as any)}
            className={cn(
              'flex-1 py-3 text-xs font-light uppercase tracking-wider border-b-2 transition-all min-h-[44px] flex items-center justify-center',
              mobileTab === tab ?
              (`border-blue-500 ${isDark ? 'text-blue-400 bg-slate-900/60' : 'text-blue-600 bg-slate-100/60'}`) :
              (`border-transparent ${textMutedClass}`)
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab}
          </motion.button>
          )}
        </motion.div>

        {/* Mobile Content Area */}
        <AnimatePresence mode="wait">
          <div className="md:hidden flex-1 overflow-hidden">
            {mobileTab === 'order' && (
              <motion.div
                key="order"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full overflow-y-auto"
              >
                <OrderPanel symbol={selectedSymbol} onSymbolChange={setSelectedSymbol} />
              </motion.div>
            )}
            {mobileTab === 'market' && (
              <motion.div
                key="market"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full overflow-y-auto"
              >
                <div className="p-4">
                  <ForexListWidget />
                </div>
              </motion.div>
            )}
            {mobileTab === 'trades' && (
              <motion.div
                key="trades"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full overflow-y-auto"
              >
                <TradeList />
              </motion.div>
            )}
          </div>
        </AnimatePresence>

        {/* Right: Order Panel (Desktop Only) */}
        <motion.div 
          className={`hidden md:block w-[320px] flex-shrink-0 ${dividerClass} border-l overflow-y-auto`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <OrderPanel symbol={selectedSymbol} onSymbolChange={setSelectedSymbol} />
        </motion.div>
      </div>

      {/* Bottom: Trade List (Desktop Only) */}
      <motion.div 
        className={`hidden md:block h-[250px] flex-shrink-0 ${dividerClass} border-t overflow-y-auto`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className={`px-4 py-3 ${dividerClass} border-b text-sm font-light`}>
          Open Positions
        </div>
        <TradeList />
      </motion.div>
    </div>
  );
}