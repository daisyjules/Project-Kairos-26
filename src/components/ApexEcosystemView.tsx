import React from 'react';
import { useKairos } from '../context/KairosContext';
import { formatTZS, formatPercent } from '../utils/formatters';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Shield,
  Layers,
  Shirt,
  Palmtree,
  Egg,
  Landmark,
  Car,
  Laptop,
  Sparkles,
  CreditCard,
  RefreshCw,
  Zap,
} from 'lucide-react';

export const ApexEcosystemView: React.FC = () => {
  const { state, setActiveTab, masterCalc, klinFitzCalc, zanzibarCalc, poultryCalc, loanCalc } = useKairos();

  const totalMonthlyBusinessSurplus =
    klinFitzCalc.monthlyOperatingProfit +
    zanzibarCalc.userProfitShare +
    poultryCalc.monthlyEquivalentProfit;

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#1E3A2F] dark:text-stone-400 dark:hover:text-emerald-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('allocation')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A2F] dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <span>Capital Allocations</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1E3A2F]/10 text-[#1E3A2F] dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="h-3.5 w-3.5" />
              Strategic Macro Architecture
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              The APEX Ecosystem Flywheel
            </h1>
            <p className="mt-1 font-serif-body text-sm text-stone-600 dark:text-stone-300 max-w-2xl">
              Project Kairos 26 is not a collection of disconnected side-hustles. It is a calculated multi-node
              ecosystem where cash engines, liquidity anchors, and mobility tools reinforce one another.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3.5 dark:border-stone-800 dark:bg-stone-800 text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Combined Monthly Engine
            </span>
            <span className="font-mono-num text-lg font-bold text-[#1E3A2F] dark:text-emerald-400">
              {formatTZS(totalMonthlyBusinessSurplus)}/mo
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Flywheel Nodes Flow */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs space-y-6">
        <h3 className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100">
          Ecosystem Node Roles & Capital Flow
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Node 1: Loan */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-5 dark:border-rose-900/40 dark:bg-rose-950/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white font-bold text-xs">
                  <CreditCard className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                  Origin Engine
                </span>
              </div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                TZS 30M Bank Loan
              </h4>
              <p className="text-xs font-serif-body text-stone-600 dark:text-stone-400 mt-1">
                The borrowed catalyst that bought speed and seed capital. Carries fixed monthly obligation of{' '}
                <strong>{formatTZS(state.loan.monthlyRepayment)}/mo</strong>.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-200/60 dark:border-rose-900/40 text-[11px] font-mono-num text-rose-800 dark:text-rose-300 font-bold">
              Must be serviced first
            </div>
          </div>

          {/* Node 2: Klin Fitz */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4E7764] text-white font-bold text-xs">
                  <Shirt className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Primary Cash Engine
                </span>
              </div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Klin Fitz Laundry
              </h4>
              <p className="text-xs font-serif-body text-stone-600 dark:text-stone-400 mt-1">
                Mother-operated daily cash machine. Generates{' '}
                <strong>{formatTZS(klinFitzCalc.monthlyOperatingProfit)}/mo</strong> to directly cover bank debt.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-900/40 text-[11px] font-mono-num text-[#2D4A3E] dark:text-emerald-300 font-bold">
              Coverage: {formatPercent(klinFitzCalc.debtCoverageRatio * 100, 0)} of loan
            </div>
          </div>

          {/* Node 3: Zanzibar Airbnb */}
          <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-5 dark:border-teal-900/40 dark:bg-teal-950/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7E9F8E] text-white font-bold text-xs">
                  <Palmtree className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                  Tourism & FX Cash
                </span>
              </div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Zanzibar Airbnb JV
              </h4>
              <p className="text-xs font-serif-body text-stone-600 dark:text-stone-400 mt-1">
                High-yield tourism income shared with Alice. User share:{' '}
                <strong>{formatTZS(zanzibarCalc.userProfitShare)}/mo</strong> at {state.zanzibarAirbnb.occupancyPct}% occupancy.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-teal-200/60 dark:border-teal-900/40 text-[11px] font-mono-num text-teal-800 dark:text-teal-300 font-bold">
              Routes linen to Klin Fitz
            </div>
          </div>

          {/* Node 4: UTT Investments */}
          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-5 dark:border-stone-800 dark:bg-stone-800/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D4A3E] text-white font-bold text-xs">
                  <Landmark className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                  Liquidity Anchor
                </span>
              </div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                UTT AMIS Funds
              </h4>
              <p className="text-xs font-serif-body text-stone-600 dark:text-stone-400 mt-1">
                <strong>{formatTZS(state.utt.investmentAmount)}</strong> initial base. Compounds quietly while serving as an emergency liquidity backstop.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 text-[11px] font-mono-num text-stone-800 dark:text-stone-300 font-bold">
              10-Yr Target: {formatTZS(masterCalc.uttBalance10Y, true)}
            </div>
          </div>
        </div>

        {/* Second Row of Nodes: Poultry, Car, Laptop, Retro Atelier */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Node 5: Poultry */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 dark:border-amber-900/40 dark:bg-amber-950/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C28458] text-white font-bold text-xs">
                  <Egg className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Agri Pilot
                </span>
              </div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Mom’s Poultry
              </h4>
              <p className="text-xs font-serif-body text-stone-600 dark:text-stone-400 mt-1">
                Low-capital (TZS 1.5M) family pilot. Generates run-rate profit of{' '}
                <strong>{formatTZS(poultryCalc.monthlyEquivalentProfit)}/mo</strong> while testing unit economics.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-amber-900/40 text-[11px] font-mono-num text-amber-800 dark:text-amber-300 font-bold">
              Flock scales via reinvestment
            </div>
          </div>

          {/* Node 6: Car */}
          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-5 dark:border-stone-800 dark:bg-stone-800/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C25E3E] text-white font-bold text-xs">
                  <Car className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                  Logistics Backbone
                </span>
              </div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Vehicle Mobility
              </h4>
              <p className="text-xs font-serif-body text-stone-600 dark:text-stone-400 mt-1">
                Enables laundry customer pickups, wholesale detergent sourcing, Airbnb emergencies, and poultry supply runs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 text-[11px] font-mono-num text-stone-800 dark:text-stone-300 font-bold">
              Max Cap: TZS 10M
            </div>
          </div>

          {/* Node 7: Laptop */}
          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-5 dark:border-stone-800 dark:bg-stone-800/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8C7A6B] text-white font-bold text-xs">
                  <Laptop className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                  Founder Command
                </span>
              </div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Productivity Rig
              </h4>
              <p className="text-xs font-serif-body text-stone-600 dark:text-stone-400 mt-1">
                Enables financial tracking, Airbnb guest messaging, supply chain coordination, and APEX brand work.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 text-[11px] font-mono-num text-stone-800 dark:text-stone-300 font-bold">
              Max Cap: TZS 1M
            </div>
          </div>

          {/* Node 8: Retro Atelier */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-5 dark:border-indigo-900/40 dark:bg-indigo-950/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D4A3E] text-white font-bold text-xs">
                  <Sparkles className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                  APEX Horizon
                </span>
              </div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Retro Atelier
              </h4>
              <p className="text-xs font-serif-body text-stone-600 dark:text-stone-400 mt-1">
                Future design and boutique hospitality flagship. Funded organically from business surplus once debt is de-risked.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-200/60 dark:border-indigo-900/40 text-[11px] font-mono-num text-indigo-800 dark:text-indigo-300 font-bold">
              Target: Q4 2026 / Q1 2027
            </div>
          </div>
        </div>
      </div>

      {/* Sustainable Cash Routing Engine */}
      <div className="rounded-2xl border border-stone-200 bg-stone-900 text-stone-100 p-6 sm:p-8 dark:border-stone-800 shadow-md">
        <h3 className="font-editorial text-xl font-bold text-white mb-2">
          The Sustainable APEX Cash Routing Algorithm
        </h3>
        <p className="text-xs font-serif-body text-stone-300 max-w-2xl mb-6">
          How every 100 shillings generated across the ecosystem is deployed to compound founder equity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-stone-800 bg-stone-800/60 p-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block">
              1. Non-Negotiable Priority
            </span>
            <h4 className="text-base font-bold text-white">
              Debt Service Inviolability
            </h4>
            <p className="text-xs font-serif-body text-stone-300">
              The first <strong>{formatTZS(state.loan.monthlyRepayment)}</strong> generated each month from Klin Fitz and Zanzibar is ring-fenced strictly for the bank. Never touch this cash for personal spending.
            </p>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-800/60 p-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              2. Working Capital Buffer
            </span>
            <h4 className="text-base font-bold text-white">
              Business Emergency Reserves
            </h4>
            <p className="text-xs font-serif-body text-stone-300">
              Each operating entity retains 15%–20% of net monthly profit in its dedicated working capital account to cover machine repairs, low-season dips, and flock health.
            </p>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-800/60 p-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
              3. Long-Term Compound
            </span>
            <h4 className="text-base font-bold text-white">
              UTT & Retro Atelier Growth
            </h4>
            <p className="text-xs font-serif-body text-stone-300">
              All net surplus above debt service and operating reserves routes into monthly UTT unit accumulation and accumulates the initial launch reserve for Retro Atelier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
