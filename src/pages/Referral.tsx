import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Moon, Sun } from 'lucide-react';

export function ReferralPage() {
  const { user, referralRecords, getReferralStats } = useStore();
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('theme-mode');
    if (stored) setIsDark(stored === 'dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
  }, [isDark]);

  if (!user) return null;

  const stats = getReferralStats(user.id);
  const userReferrals = referralRecords.filter(r => r.referrerId === user.id);
  const referralLink = `${window.location.origin}/auth/signup?ref=${user.referralCode}`;

  // FALLBACK: If referralRecords is empty but user has stats, show user stats
  const hasRecordsLoaded = userReferrals.length > 0;
  const hasStatsInProfile = (user.totalReferrals || 0) > 0;
  const usingFallbackData = !hasRecordsLoaded && hasStatsInProfile;
  
  const displayStats = usingFallbackData 
    ? {
        totalReferrals: user.totalReferrals || 0,
        totalEarnings: user.referralEarnings || 0,
        pendingEarnings: 0
      }
    : stats;

  // Design system colors matching Landing, Signup, and Dashboard
  const bgClass = isDark ? 'bg-black text-white' : 'bg-white text-black';
  const cardBgClass = isDark
    ? 'bg-slate-900/40 border border-slate-800/50 backdrop-blur-md'
    : 'bg-slate-50/40 border border-slate-200/50 backdrop-blur-md';
  const textMutedClass = isDark ? 'text-slate-500' : 'text-slate-600';
  const dividerClass = isDark ? 'border-slate-800/30' : 'border-slate-200/30';

  // Debug logging
  React.useEffect(() => {
    console.log('📄 Referral Page Loaded');
    console.log('  User ID:', user.id);
    console.log('  Referral Code:', user.referralCode);
    console.log('  Total Referral Records from Store:', referralRecords.length);
    console.log('  Referrals made by this user (filtered):', userReferrals.length);
    console.log('  User stats from profile:', { totalReferrals: user.totalReferrals, referralEarnings: user.referralEarnings });
    console.log('  Calculated stats from referralRecords:', stats);
    console.log('  USING FALLBACK?', usingFallbackData);
    if (usingFallbackData) {
      console.log('  ⚠️  NOTE: Showing stats from user profile because referralRecords not fully loaded. This is their actual balance.');
    }
  }, [user.id, referralRecords, userReferrals, stats, usingFallbackData]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      {/* Header with Theme Toggle */}
      <div className={`sticky top-0 z-50 backdrop-blur-sm ${isDark ? 'bg-black/80' : 'bg-white/80'} border-b ${dividerClass} transition-all duration-300 mb-8`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-light tracking-tight">
              Referral Program
            </h1>
            <p className={`text-sm ${textMutedClass} mt-1`}>
              Earn $25 for every person you refer who signs up
            </p>
          </motion.div>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-slate-100/50 hover:bg-slate-200/50'}`}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun size={20} className="text-slate-400" />
            ) : (
              <Moon size={20} className="text-slate-600" />
            )}
          </button>
        </div>
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-4 md:px-6 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* Stats Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" variants={containerVariants}>
          {usingFallbackData && (
            <motion.div
              className={`md:col-span-3 ${isDark ? 'bg-blue-950/30 border-blue-800/50' : 'bg-blue-50/40 border-blue-200/50'} border backdrop-blur-md rounded-lg p-4`}
              variants={itemVariants}
            >
              <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                ℹ️ Showing your earnings from your account profile. Detailed referral records are being loaded...
              </p>
            </motion.div>
          )}
          
          <motion.div variants={itemVariants}>
            <div className={`${cardBgClass} rounded-lg p-6 transition-all duration-300 hover:border-slate-700/70 dark:hover:border-slate-600`}>
              <p className={`text-xs font-light tracking-widest ${textMutedClass} mb-3`}>
                TOTAL REFERRALS
              </p>
              <p className="text-3xl font-light tracking-tighter">
                {displayStats.totalReferrals}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className={`${cardBgClass} rounded-lg p-6 transition-all duration-300 hover:border-green-700/70 dark:hover:border-green-600`}>
              <p className={`text-xs font-light tracking-widest ${textMutedClass} mb-3`}>
                COMPLETED EARNINGS
              </p>
              <p className="text-3xl font-light tracking-tighter text-green-500 dark:text-green-400">
                ${displayStats.totalEarnings.toFixed(2)}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className={`${cardBgClass} rounded-lg p-6 transition-all duration-300 hover:border-yellow-700/70 dark:hover:border-yellow-600`}>
              <p className={`text-xs font-light tracking-widest ${textMutedClass} mb-3`}>
                PENDING EARNINGS
              </p>
              <p className="text-3xl font-light tracking-tighter text-yellow-500 dark:text-yellow-400">
                ${displayStats.pendingEarnings.toFixed(2)}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Referral Code Section */}
        <motion.div variants={itemVariants}>
          <div className={`${cardBgClass} rounded-lg p-6 md:p-8 transition-all duration-300`}>
            <h2 className="text-xl font-light tracking-tight mb-6">
              Your Referral Code
            </h2>
            <div className="space-y-4">
              <div className={`${isDark ? 'bg-blue-950/40 border-blue-800/50' : 'bg-blue-50/40 border-blue-200/50'} border backdrop-blur-md rounded-lg p-4`}>
                <p className={`text-xs font-light tracking-widest ${textMutedClass} mb-3`}>REFERRAL CODE</p>
                <div className="flex items-center gap-2">
                  <code className="text-lg font-mono font-light flex-1">
                    {user.referralCode}
                  </code>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(user.referralCode || '')}
                    className="whitespace-nowrap"
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </Button>
                </div>
              </div>

              <div className={`${isDark ? 'bg-purple-950/40 border-purple-800/50' : 'bg-purple-50/40 border-purple-200/50'} border backdrop-blur-md rounded-lg p-4`}>
                <p className={`text-xs font-light tracking-widest ${textMutedClass} mb-3`}>REFERRAL LINK</p>
                <div className="flex items-center gap-2">
                  <div className={`text-sm font-mono font-light flex-1 break-all ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {referralLink}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(referralLink)}
                    className="whitespace-nowrap"
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </Button>
                </div>
              </div>

              <div className={`${isDark ? 'bg-green-950/40 border-green-800/50' : 'bg-green-50/40 border-green-200/50'} border backdrop-blur-md rounded-lg p-4`}>
                <p className={`text-sm font-light tracking-tight mb-3`}>
                  💡 How it works
                </p>
                <ul className={`text-sm font-light space-y-1 ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                  <li>• Share your referral code or link with friends</li>
                  <li>• They sign up using your code - they get $25 bonus on first deposit</li>
                  <li>• You earn $25 when they complete their first deposit</li>
                  <li>• Unlimited referrals = Unlimited earnings!</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Referrals List */}
        <motion.div variants={itemVariants}>
          <div className={`${cardBgClass} rounded-lg p-6 md:p-8 transition-all duration-300`}>
            <h2 className="text-xl font-light tracking-tight mb-6">
              Your Referrals ({userReferrals.length > 0 ? userReferrals.length : displayStats.totalReferrals})
            </h2>
            {userReferrals.length === 0 ? (
              <div className="text-center py-12">
                {displayStats.totalReferrals > 0 ? (
                  <div className="space-y-3">
                    <p className={textMutedClass}>
                      ✓ You have {displayStats.totalReferrals} successful referral{displayStats.totalReferrals !== 1 ? 's' : ''} earning you ${displayStats.totalEarnings.toFixed(2)}!
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      Detailed referral records are being loaded. Please refresh in a moment if records don't appear.
                    </p>
                  </div>
                ) : (
                  <p className={textMutedClass}>
                    You haven't referred anyone yet. Share your code to get started!
                  </p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${dividerClass}`}>
                      <th className={`text-left py-3 px-4 ${textMutedClass} font-light`}>
                        Name
                      </th>
                      <th className={`text-left py-3 px-4 ${textMutedClass} font-light`}>
                        Email
                      </th>
                      <th className={`text-left py-3 px-4 ${textMutedClass} font-light`}>
                        Bonus
                      </th>
                      <th className={`text-left py-3 px-4 ${textMutedClass} font-light`}>
                        Status
                      </th>
                      <th className={`text-left py-3 px-4 ${textMutedClass} font-light`}>
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userReferrals.map((referral) => (
                      <tr
                        key={referral.id}
                        className={`border-b ${dividerClass} transition-colors duration-200 ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-100/30'}`}
                      >
                        <td className="py-3 px-4">
                          {referral.referredUserName}
                        </td>
                        <td className={`py-3 px-4 ${textMutedClass}`}>
                          {referral.referredUserEmail}
                        </td>
                        <td className="py-3 px-4 font-light">
                          ${referral.bonusAmount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          {referral.status === 'COMPLETED' ? (
                            <span className={`inline-block px-3 py-1 ${isDark ? 'bg-green-950/50 text-green-300' : 'bg-green-100/50 text-green-700'} rounded-full text-xs font-light`}>
                              ✓ Completed
                            </span>
                          ) : (
                            <span className={`inline-block px-3 py-1 ${isDark ? 'bg-yellow-950/50 text-yellow-300' : 'bg-yellow-100/50 text-yellow-700'} rounded-full text-xs font-light`}>
                              ⏳ Pending
                            </span>
                          )}
                        </td>
                        <td className={`py-3 px-4 ${textMutedClass}`}>
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
