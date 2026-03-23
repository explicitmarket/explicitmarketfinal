import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../lib/store';
import { formatCurrency } from '../lib/utils';
import ForexListWidget from '../components/trading/ForexListWidget';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  History,
  Play,
  TrendingUp,
  Bot,
  Zap,
  Copy,
  Moon,
  Sun
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { account, trades, user, assets, history, purchasedBots, purchasedSignals, purchasedCopyTrades, purchasedFundedAccounts } = useStore();
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
  
  const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
  const botEarnings = purchasedBots.reduce((sum, b) => sum + b.totalEarned, 0);
  const signalEarnings = purchasedSignals.reduce((sum, s) => sum + s.earnings, 0);
  const copyTradingEarnings = purchasedCopyTrades
    .filter(ct => ct.status === 'ACTIVE' || ct.status === 'CLOSED')
    .reduce((sum, ct) => sum + ct.profit, 0);
  
  const userFunded = purchasedFundedAccounts.filter(f => f.userId === user?.id);
  const activeFundedCount = userFunded.filter(f => f.status === 'ACTIVE').length;
  const pendingFundedCount = userFunded.filter(f => f.status === 'PENDING_APPROVAL').length;
  const fundedCapital = userFunded
    .filter(f => f.status === 'ACTIVE')
    .reduce((sum, f) => sum + f.capital, 0);
  
  React.useEffect(() => {
    console.log('📊 Dashboard Updated:');
    console.log('   Total Bot Earnings:', botEarnings.toFixed(2));
    console.log('   Active Bots:', purchasedBots.filter(b => b.status === 'ACTIVE').length);
    purchasedBots.forEach(b => {
      console.log(`   Bot: ${b.botName} | Status: ${b.status} | Allocated: $${b.allocatedAmount.toFixed(2)} | Earned: $${b.totalEarned.toFixed(2)}`);
    });
  }, [botEarnings, purchasedBots]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

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

      {/* Header with Theme Toggle */}
      <div className={`sticky top-0 z-50 backdrop-blur-sm ${isDark ? 'bg-black/80' : 'bg-white/80'} border-b ${dividerClass} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex items-center justify-between">
          <div>
            <motion.h1 
              className="text-2xl font-light tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Welcome back, {user?.name}
            </motion.h1>
            <motion.p 
              className={`text-xs font-light ${textMutedClass}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Here's what's happening with your portfolio today.
            </motion.p>
          </div>
          <motion.button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 transition-all ${
              isDark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 pb-20 md:pb-6">
        {/* Top Bar Info */}
        <motion.div 
          className={`flex flex-wrap items-center justify-between gap-4 text-xs font-light ${textMutedClass} border-b ${dividerClass} pb-4`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span>
              Leverage: <span className={isDark ? 'text-white' : 'text-black'}>1:{account.leverage}</span>
            </span>
            <span>
              Server: <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>ExplicitMarket-Live</span>
            </span>
          </div>
          <div className="flex gap-3">
            <span className={`px-3 py-1 rounded text-xs font-light ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100/30 text-emerald-600'}`}>
              {account.type} ACCOUNT
            </span>
            <span className={`px-3 py-1 rounded text-xs font-light ${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-200/50 text-slate-600'}`}>
              ID: {user?.id || '8829102'}
            </span>
          </div>
        </motion.div>

        {/* Main Metrics Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
        >
          {[
            {
              label: 'Balance',
              value: formatCurrency(account.balance),
              color: isDark ? 'text-white' : 'text-black',
              highlight: true
            },
            {
              label: 'Equity',
              value: formatCurrency(account.equity),
              color: account.equity >= account.balance
                ? (isDark ? 'text-emerald-400' : 'text-emerald-600')
                : (isDark ? 'text-red-400' : 'text-red-600')
            },
            {
              label: 'Margin',
              value: formatCurrency(account.margin),
              color: isDark ? 'text-white' : 'text-black'
            },
            {
              label: 'Free Margin',
              value: formatCurrency(account.freeMargin),
              color: isDark ? 'text-white' : 'text-black'
            },
            {
              label: 'Open P/L',
              value: formatCurrency(totalProfit),
              color: totalProfit >= 0
                ? (isDark ? 'text-emerald-400' : 'text-emerald-600')
                : (isDark ? 'text-red-400' : 'text-red-600')
            },
            {
              label: 'Funded Balance',
              value: formatCurrency(fundedCapital),
              color: fundedCapital > 0 ? (isDark ? 'text-blue-400' : 'text-blue-600') : textMutedClass
            },
            {
              label: 'Open Trades',
              value: trades.length.toString(),
              color: isDark ? 'text-white' : 'text-black'
            },
            {
              label: 'Funded Accounts',
              value: userFunded.length.toString(),
              color: isDark ? 'text-blue-400' : 'text-blue-600'
            }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className={`p-6 rounded-lg ${cardBgClass} ${stat.highlight ? `border-l-2 ${isDark ? 'border-l-blue-500' : 'border-l-blue-600'}` : ''}`}
              variants={itemVariants}
              whileHover={{ y: -2 }}
            >
              <span className={`block text-xs font-light tracking-widest opacity-60 mb-2`}>
                {stat.label}
              </span>
              <span className={`block text-lg md:text-xl font-light tracking-tight ${stat.color}`}>
                {stat.value}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Earnings Section */}
        {(purchasedBots.length > 0 || purchasedSignals.length > 0) && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.05 }}
          >
            {purchasedBots.length > 0 && (
              <motion.div className={`p-6 rounded-lg ${cardBgClass}`} variants={itemVariants} whileHover={{ y: -2 }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-light tracking-widest opacity-60 uppercase">Bot Earnings</span>
                  <Bot className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <span className={`block text-2xl font-light ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>${botEarnings.toFixed(2)}</span>
                <p className={`text-xs font-light ${textMutedClass} mt-2`}>{purchasedBots.filter(b => b.status === 'ACTIVE').length} active bot(s)</p>
              </motion.div>
            )}
            {userFunded.length > 0 && (
              <motion.div className={`p-6 rounded-lg ${cardBgClass}`} variants={itemVariants} whileHover={{ y: -2 }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-light tracking-widest opacity-60 uppercase">Funded Accounts</span>
                  <Zap className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <span className={`block text-2xl font-light ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{activeFundedCount} active</span>
                {pendingFundedCount > 0 && (
                  <p className={`text-xs font-light ${isDark ? 'text-amber-400' : 'text-amber-600'} mt-2`}>{pendingFundedCount} pending</p>
                )}
              </motion.div>
            )}
            {purchasedSignals.length > 0 && (
              <motion.div className={`p-6 rounded-lg ${cardBgClass}`} variants={itemVariants} whileHover={{ y: -2 }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-light tracking-widest opacity-60 uppercase">Signal Earnings</span>
                  <Zap className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <span className={`block text-2xl font-light ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>${signalEarnings.toFixed(2)}</span>
                <p className={`text-xs font-light ${textMutedClass} mt-2`}>{purchasedSignals.filter(s => s.status === 'ACTIVE').length} active signal(s)</p>
              </motion.div>
            )}
            {purchasedCopyTrades.length > 0 && (
              <motion.div className={`p-6 rounded-lg ${cardBgClass}`} variants={itemVariants} whileHover={{ y: -2 }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-light tracking-widest opacity-60 uppercase">Copy Trading</span>
                  <Copy className={`h-4 w-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                </div>
                <span className={`block text-2xl font-light ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>${copyTradingEarnings.toFixed(2)}</span>
                <p className={`text-xs font-light ${textMutedClass} mt-2`}>{purchasedCopyTrades.filter(ct => ct.status === 'ACTIVE').length} active copy trade(s)</p>
              </motion.div>
            )}
            {!purchasedCopyTrades.length && (
              <motion.div className={`p-6 rounded-lg ${cardBgClass}`} variants={itemVariants} whileHover={{ y: -2 }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-light tracking-widest opacity-60 uppercase">Copy Trading</span>
                  <Copy className={`h-4 w-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                </div>
                <span className={`block text-2xl font-light ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>$0.00</span>
                <p className={`text-xs font-light ${textMutedClass} mt-2`}>Start to earn</p>
              </motion.div>
            )}
            <motion.div className={`p-6 rounded-lg ${cardBgClass}`} variants={itemVariants} whileHover={{ y: -2 }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-light tracking-widest opacity-60 uppercase">Total Passive</span>
                <TrendingUp className={`h-4 w-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <span className={`block text-2xl font-light ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>${(botEarnings + signalEarnings + copyTradingEarnings).toFixed(2)}</span>
              <p className={`text-xs font-light ${textMutedClass} mt-2`}>This session</p>
            </motion.div>
          </motion.div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Overview */}
          <motion.div 
            className={`lg:col-span-2 rounded-lg ${cardBgClass} overflow-hidden flex flex-col`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={`px-6 py-4 border-b ${dividerClass}`}>
              <h3 className="text-base font-light tracking-wide">📈 Forex Market Watch</h3>
            </div>
            <div className="flex-1 p-6">
              <ForexListWidget />
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="grid grid-cols-2 gap-3 content-start h-fit"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1 }}
          >
            {[
              { label: 'Fund Wallet', icon: ArrowDownLeft, color: 'emerald', action: 'wallet' },
              { label: 'Withdraw', icon: ArrowUpRight, color: 'red', action: 'wallet' },
              { label: 'Buy Signals', icon: Zap, color: 'blue', action: 'signals' },
              { label: 'Buy Bot', icon: Bot, color: 'purple', action: 'bot' }
            ].map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  onClick={() => onNavigate(action.action)}
                  className={`p-4 rounded-lg ${cardBgClass} hover:border-opacity-100 transition-all group flex flex-col items-center justify-center gap-2`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`p-2 rounded-full ${
                    action.color === 'emerald' ? (isDark ? 'bg-emerald-500/10' : 'bg-emerald-100/30') :
                    action.color === 'red' ? (isDark ? 'bg-red-500/10' : 'bg-red-100/30') :
                    action.color === 'blue' ? (isDark ? 'bg-blue-500/10' : 'bg-blue-100/30') :
                    (isDark ? 'bg-purple-500/10' : 'bg-purple-100/30')
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      action.color === 'emerald' ? (isDark ? 'text-emerald-400' : 'text-emerald-600') :
                      action.color === 'red' ? (isDark ? 'text-red-400' : 'text-red-600') :
                      action.color === 'blue' ? (isDark ? 'text-blue-400' : 'text-blue-600') :
                      (isDark ? 'text-purple-400' : 'text-purple-600')
                    }`} />
                  </div>
                  <span className="text-xs font-light text-center">{action.label}</span>
                </motion.button>
              );
            })}
            <motion.button
              onClick={() => onNavigate('trade')}
              className={`col-span-2 p-4 rounded-lg ${isDark ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30' : 'bg-gradient-to-r from-emerald-100/30 to-blue-100/30 border border-emerald-400/30'} hover:opacity-80 transition-all cyber-pulse-light flex items-center justify-center gap-3`}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'} fill-current`} />
              <span className="text-xs font-light tracking-widest uppercase">
                Start Trading
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Recent Trades */}
        <motion.div 
          className={`rounded-lg ${cardBgClass} overflow-hidden`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className={`px-6 py-4 border-b ${dividerClass}`}>
            <h3 className="text-base font-light tracking-wide">Recent Trade History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className={`${isDark ? 'bg-slate-900/20' : 'bg-slate-100/20'} ${textMutedClass} text-xs`}>
                <tr>
                  <th className="px-6 py-3 text-left font-light">Symbol</th>
                  <th className="px-6 py-3 text-left font-light">Type</th>
                  <th className="px-6 py-3 text-right font-light">Volume</th>
                  <th className="px-6 py-3 text-right font-light">Entry</th>
                  <th className="px-6 py-3 text-right font-light">Close</th>
                  <th className="px-6 py-3 text-right font-light">Profit</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${dividerClass}`}>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={`px-6 py-8 text-center text-sm font-light ${textMutedClass}`}>
                      No trade history available
                    </td>
                  </tr>
                ) : (
                  history.slice(0, 5).map((trade) => (
                    <motion.tr 
                      key={trade.id} 
                      className={`hover:${isDark ? 'bg-slate-800/30' : 'bg-slate-200/30'}`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <td className="px-6 py-3 font-light">{trade.symbol}</td>
                      <td className={`px-6 py-3 font-light ${trade.type === 'BUY' ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-red-400' : 'text-red-600')}`}>
                        {trade.type}
                      </td>
                      <td className={`px-6 py-3 text-right font-light font-mono ${textMutedClass}`}>
                        {trade.lots.toFixed(2)}
                      </td>
                      <td className={`px-6 py-3 text-right font-light font-mono ${textMutedClass}`}>
                        {trade.entryPrice}
                      </td>
                      <td className={`px-6 py-3 text-right font-light font-mono ${textMutedClass}`}>
                        {trade.currentPrice}
                      </td>
                      <td className={`px-6 py-3 text-right font-light font-mono ${trade.profit >= 0 ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-red-400' : 'text-red-600')}`}>
                        {formatCurrency(trade.profit)}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}