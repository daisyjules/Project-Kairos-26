import React, { useEffect } from 'react';
import { useKairos } from '../context/KairosContext';
import { formatTZS } from '../utils/formatters';
import { triggerCelebrationConfetti, playMilestoneChime } from '../utils/audio';
import {
  Trophy,
  CheckCircle2,
  TrendingUp,
  Coins,
  ArrowRight,
  Volume2,
  X,
  ShieldCheck,
  Building2,
  PieChart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MilestoneCelebrationModalProps {
  milestone: number | null;
  onClose: () => void;
}

export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
  milestone,
  onClose,
}) => {
  const {
    dseCalc,
    state,
    recordDSEMilestoneDecision,
    setActiveTab,
    notificationSettings,
  } = useKairos();

  const isSoundEnabled = notificationSettings?.enableSound ?? true;

  useEffect(() => {
    if (milestone) {
      triggerCelebrationConfetti();
      if (isSoundEnabled) {
        playMilestoneChime();
      }
    }
  }, [milestone, isSoundEnabled]);

  if (!milestone) return null;

  const currentVal = dseCalc.totalLiquidAndShares;
  const userDecision = state.dsePortfolio.userMilestoneDecision;

  const handleSelectDecision = (
    decision: 'withdraw' | 'reinvest_utt' | 'hold_compound'
  ) => {
    recordDSEMilestoneDecision(milestone, decision);
  };

  const handleNavigateDSE = () => {
    setActiveTab('dse');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
          className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border-2 border-emerald-400 overflow-hidden my-auto"
        >
          {/* Top celebratory banner */}
          <div className="relative bg-gradient-to-r from-emerald-850 via-[#2D4A3E] to-emerald-900 p-6 text-white text-center sm:text-left overflow-hidden">
            <div className="absolute -right-8 -top-8 w-36 h-36 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute right-12 bottom-0 w-24 h-24 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full bg-white/15 p-1.5 text-white/80 hover:text-white hover:bg-white/25 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-stone-950 shadow-lg ring-4 ring-white/20">
                <Trophy className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/30 px-3 py-0.5 text-xs font-bold tracking-wider uppercase text-emerald-200 border border-emerald-400/40">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                  Portfolio Milestone Unlocked
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Reached {formatTZS(milestone)}!
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/90 max-w-lg">
                  Congratulations! Your disciplined capital allocation has carried your public equities portfolio across the {formatTZS(milestone)} mark.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Live Portfolio Snapshot Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  Current Total Value
                </div>
                <div className="text-lg font-extrabold font-mono-num text-stone-900 mt-1">
                  {formatTZS(currentVal)}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                  Over milestone by {formatTZS(Math.max(0, currentVal - milestone))}
                </div>
              </div>

              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                  <Coins className="h-3.5 w-3.5 text-amber-600" />
                  Est. Annual Dividends
                </div>
                <div className="text-lg font-extrabold font-mono-num text-stone-900 mt-1">
                  {formatTZS(dseCalc.annualEstimatedDividends)}
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  ~{(dseCalc.weightedDividendYieldPct || 6.5).toFixed(1)}% cash yield
                </div>
              </div>

              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                  <PieChart className="h-3.5 w-3.5 text-indigo-600" />
                  Active Companies
                </div>
                <div className="text-lg font-extrabold font-mono-num text-stone-900 mt-1">
                  {state.dsePortfolio.holdings.length} Stocks
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  Cash: {formatTZS(state.dsePortfolio.cashBalance)}
                </div>
              </div>
            </div>

            {/* Holdings contributing to milestone */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-stone-600" />
                  Equity Contributors to {formatTZS(milestone)}
                </span>
                <span className="text-stone-500 font-medium">
                  {state.dsePortfolio.holdings.length} holdings + cash
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {state.dsePortfolio.holdings.map((h) => (
                  <div
                    key={h.id}
                    className="rounded-lg border border-stone-200 bg-white p-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-stone-900">{h.ticker}</span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                        {h.sharesHeld} shs
                      </span>
                    </div>
                    <div className="text-xs font-mono-num font-semibold text-stone-700 mt-1">
                      {formatTZS(h.sharesHeld * h.currentPrice)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Decision Roadmap */}
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  Select Strategic Capital Allocation
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Reaching {formatTZS(milestone)} unlocks strategic options for dividend sweeps, UTT AMIS compounding, or business liquidity.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectDecision('reinvest_utt')}
                  className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    userDecision?.milestone === milestone &&
                    userDecision?.decision === 'reinvest_utt'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500 font-bold text-emerald-950'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="font-bold text-stone-900 flex items-center justify-between">
                    <span>1. Reinvest to UTT</span>
                    {userDecision?.decision === 'reinvest_utt' && (
                      <span className="text-[10px] text-emerald-700 font-bold">Selected</span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                    Sweep dividend gains into UTT Liquid Fund for daily liquidity and 13.5% annual yield.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDecision('hold_compound')}
                  className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    userDecision?.milestone === milestone &&
                    userDecision?.decision === 'hold_compound'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500 font-bold text-emerald-950'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="font-bold text-stone-900 flex items-center justify-between">
                    <span>2. Compound in Equities</span>
                    {userDecision?.decision === 'hold_compound' && (
                      <span className="text-[10px] text-emerald-700 font-bold">Selected</span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                    Leave all shares untouched. Reinvest dividends to buy more CRDB, NMB, and TPCC.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDecision('withdraw')}
                  className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    userDecision?.milestone === milestone &&
                    userDecision?.decision === 'withdraw'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500 font-bold text-emerald-950'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="font-bold text-stone-900 flex items-center justify-between">
                    <span>3. Business Buffer</span>
                    {userDecision?.decision === 'withdraw' && (
                      <span className="text-[10px] text-emerald-700 font-bold">Selected</span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                    Hold excess broker cash as backup reserve for Klin Fitz expansion or poultry cycles.
                  </p>
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => {
                  playMilestoneChime();
                  triggerCelebrationConfetti();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs"
                title="Replay celebratory chime and confetti"
              >
                <Volume2 className="h-4 w-4 text-emerald-700" />
                Replay Chime & Confetti
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={handleNavigateDSE}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#2D4A3E] px-4 py-2 text-xs font-bold text-white hover:bg-[#233B31] shadow-2xs transition-colors"
                >
                  View DSE Portfolio Ledger
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
