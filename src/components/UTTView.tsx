import React, { useState } from 'react';
import { useKairos } from '../context/KairosContext';
import { CurrencyInput } from './CurrencyInput';
import { StatCard } from './StatCard';
import { formatTZS, formatPercent } from '../utils/formatters';
import {
  TrendingUp,
  Landmark,
  ShieldCheck,
  Scale,
  Calendar,
  DollarSign,
  AlertOctagon,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Droplets,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import wealthImg from '../assets/images/wealth_plant_1787307790696.jpg';
import { PinnedCorkboard } from './PinnedCorkboard';
import { CommentsSection } from './CommentsSection';

interface UTTFundOption {
  key: string;
  name: string;
  expectedReturnPct: number;
  liquiditySpeed: string;
  exitLoad: string;
  description: string;
}

const UTT_FUNDS: UTTFundOption[] = [
  {
    key: 'liquid',
    name: 'UTT AMIS Liquid Fund',
    expectedReturnPct: 13.0,
    liquiditySpeed: 'T+1 (24 Hours to M-Pesa / Bank)',
    exitLoad: '0% (No penalty, no lock-in)',
    description: 'Designed specifically for high liquidity and capital preservation. Highest withdrawal flexibility for operational safety.',
  },
  {
    key: 'umoja',
    name: 'UTT AMIS Umoja Fund',
    expectedReturnPct: 13.8,
    liquiditySpeed: 'T+2 (48 Hours to Bank)',
    exitLoad: '1% if held < 6 months, 0% thereafter',
    description: 'Premier balanced fund combining government bonds and high-dividend equities (NMB, CRDB, Twiga).',
  },
  {
    key: 'wekeza',
    name: 'UTT AMIS Wekeza Maisha',
    expectedReturnPct: 12.8,
    liquiditySpeed: 'T+2 to T+3',
    exitLoad: 'Low exit fee on early exit',
    description: 'Long-term collective investment scheme bundled with group term life and disability insurance cover.',
  },
  {
    key: 'jikimu',
    name: 'UTT AMIS Jikimu Fund',
    expectedReturnPct: 12.5,
    liquiditySpeed: 'T+2',
    exitLoad: 'Quarterly distributions',
    description: 'Income scheme designed for periodic dividend payouts (quarterly or annual cash distributions).',
  },
];

export const UTTView: React.FC = () => {
  const { state, setActiveTab, updateUTT, redeemUTTLiquid, depositToUTT, uttCalc } = useKairos();
  const utt = state.utt;
  const loan = state.loan;

  const [simulatedRedeemAmt, setSimulatedRedeemAmt] = useState<number>(2000000);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  const handleFundSelect = (fund: UTTFundOption) => {
    updateUTT({
      fundName: fund.name,
      expectedAnnualReturnPct: fund.expectedReturnPct,
      fundType: fund.key as any,
    });
    triggerToast(`Switched fund to ${fund.name} (${fund.expectedReturnPct}% p.a. • ${fund.liquiditySpeed})`);
  };

  const handleExecuteRedemption = () => {
    if (simulatedRedeemAmt <= 0) return;
    const actualRedeemed = Math.min(utt.investmentAmount, simulatedRedeemAmt);
    redeemUTTLiquid(actualRedeemed);
    triggerToast(`Successfully redeemed ${formatTZS(actualRedeemed)} from UTT Liquid Fund into Cash Reserve.`);
  };

  const handleExecuteDeposit = () => {
    if (simulatedRedeemAmt <= 0) return;
    depositToUTT(simulatedRedeemAmt);
    triggerToast(`Successfully deposited ${formatTZS(simulatedRedeemAmt)} into UTT Liquid Fund.`);
  };

  // Compounding trajectory data points over 10 years
  const trajectoryData = [];
  const P = utt.investmentAmount;
  const rMonthly = utt.expectedAnnualReturnPct / 100 / 12;
  const pmt = utt.monthlyContribution;

  for (let year = 0; year <= 10; year++) {
    const months = year * 12;
    let balance = P;
    if (utt.reinvestReturns) {
      if (rMonthly > 0) {
        balance =
          P * Math.pow(1 + rMonthly, months) +
          (pmt > 0 ? pmt * ((Math.pow(1 + rMonthly, months) - 1) / rMonthly) : 0);
      }
    } else {
      balance = P + pmt * months;
    }
    const invested = P + pmt * months;
    trajectoryData.push({
      year: `Yr ${year}`,
      balance: Math.round(balance),
      principal: Math.round(invested),
      gains: Math.max(0, Math.round(balance - invested)),
    });
  }

  // Debt runway covered by this liquid reserve
  const monthsOfLoanCovered = loan.monthlyRepayment > 0
    ? Number((utt.investmentAmount / loan.monthlyRepayment).toFixed(1))
    : 0;

  // Comparison rate: UTT vs Loan Cost
  const returnVsLoanCostDelta = utt.expectedAnnualReturnPct - loan.interestRateAnnualPct;

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#1E3A2F] dark:text-stone-400 dark:hover:text-emerald-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Overview</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('dse')}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-semibold text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200 transition-colors cursor-pointer"
          >
            <span>View DSE Equities</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('loan')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A2F] dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <span>Next: Debt & Solvency</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Warm Header Banner with Wealth Plant Image */}
      <div className="rounded-3xl border border-stone-200/90 bg-white overflow-hidden dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 text-[#1E3A2F] dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1 text-xs font-semibold">
                  <Landmark className="h-3.5 w-3.5" />
                  <span>Chapter 4 • Liquid Wealth Anchor & Compounding</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100 text-cyan-900 px-2.5 py-0.5 text-xs font-bold">
                  <Droplets className="h-3 w-3 text-cyan-700" />
                  100% Liquid Asset • T+1 Redemptions
                </span>
              </div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                UTT AMIS Liquid Reserve & Compounding
              </h1>
              <p className="mt-1 font-serif-body text-sm text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
                Allocated capital: <strong>{formatTZS(utt.investmentAmount)}</strong>. Government-backed collective investment units that are <strong>fully liquid</strong> (redeemable in 24–48 hours to bank or M-Pesa) while compounding quietly at ~{utt.expectedAnnualReturnPct}% p.a.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 dark:border-stone-800 pt-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Active Fund: {utt.fundName} ({utt.expectedAnnualReturnPct}% compound)
                </span>
              </div>
              <div className="text-xs font-mono-num font-bold text-emerald-700 dark:text-emerald-400">
                Debt Runway Provided: {monthsOfLoanCovered} Months of Loan Repayments
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 relative min-h-[180px] lg:min-h-full">
            <img
              src={wealthImg}
              alt="Small plant growing on desk in sunlight"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-b-3xl lg:rounded-b-none lg:rounded-r-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 text-white font-semibold text-xs drop-shadow-md">
              💧 Liquid Reserve & Daily NAV Growth
            </div>
          </div>
        </div>
      </div>

      {/* LIQUIDITY ADVANTAGE & ZERO LOCK-IN BANNER */}
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-5 dark:border-cyan-900/60 dark:bg-cyan-950/30">
        <div className="flex items-start gap-3.5">
          <div className="rounded-xl bg-cyan-600 p-2 text-white shrink-0 shadow-xs">
            <Droplets className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-cyan-950 dark:text-cyan-100">
                Liquidity Advantage: UTT Fund is Readily Liquid (No Lock-In Period)
              </h3>
              <span className="rounded bg-cyan-200/80 px-2 py-0.5 text-[10px] font-bold text-cyan-900">
                Daily NAV • Fast Redemption
              </span>
            </div>
            <p className="text-xs text-cyan-900/85 dark:text-cyan-200/90 leading-relaxed">
              Unlike locked fixed-term deposits or illiquid machinery, <strong>UTT AMIS funds are open-ended and 100% liquid</strong>.
              Units can be redeemed on any business day directly to your bank account or mobile money (M-Pesa / Airtel Money / Tigo Pesa)
              in <strong>24 to 48 hours (T+1)</strong> with <strong>0% exit penalty</strong> on the Liquid Fund.
              This guarantees that your <strong>{formatTZS(utt.investmentAmount)}</strong> acts as an instant emergency liquidity cushion capable of servicing <strong>{monthsOfLoanCovered} months</strong> of loan payments if business cashflows ever dip.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Summary Horizon Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Available Liquid Capital"
          value={formatTZS(utt.investmentAmount)}
          subValue={`Accessible in T+1 (24h) • ${monthsOfLoanCovered} mos debt cover`}
          badge={{ text: '100% Liquid', variant: 'success' }}
          icon={<Droplets className="h-4 w-4" />}
          highlight
        />

        <StatCard
          label="Estimated 1-Year Value"
          value={formatTZS(uttCalc.valueAfter1Year)}
          subValue={`Annual return: +${formatTZS(uttCalc.annualEstimatedReturn)} (${formatTZS(
            uttCalc.monthlyEquivalentReturn,
            true
          )}/mo eq.)`}
          badge={{ text: '12 Months', variant: 'neutral' }}
          icon={<Calendar className="h-4 w-4" />}
        />

        <StatCard
          label="Estimated 5-Year Value"
          value={formatTZS(uttCalc.valueAfter5Years)}
          subValue={`Est. gains: +${formatTZS(uttCalc.valueAfter5Years - utt.investmentAmount)}`}
          badge={{ text: '60 Months', variant: 'info' }}
          icon={<TrendingUp className="h-4 w-4" />}
        />

        <StatCard
          label="Estimated 10-Year Value"
          value={formatTZS(uttCalc.valueAfter10Years)}
          subValue={`Total 10-yr gains: +${formatTZS(uttCalc.totalGains10Years)}`}
          badge={{ text: '10 Years', variant: 'success' }}
          icon={<Sparkles className="h-4 w-4" />}
        />
      </div>

      {/* INTERACTIVE LIQUID REDEMPTION & CAPITAL ACCESS SIMULATOR */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900/40 p-1.5 text-emerald-800 dark:text-emerald-300">
                <Clock className="h-4 w-4" />
              </div>
              <h3 className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100">
                Liquid Capital Access & Redemption Simulator
              </h3>
            </div>
            <p className="text-xs text-stone-500 font-serif-body mt-0.5">
              Simulate or execute withdrawals from UTT to your operational cash reserves for debt service or emergencies.
            </p>
          </div>
          <span className="rounded-full bg-stone-100 dark:bg-stone-800 px-3 py-1 text-xs font-semibold text-stone-700 dark:text-stone-300">
            Speed: T+1 (24h turnaround to Bank / M-Pesa)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 space-y-3">
            <CurrencyInput
              label="Withdrawal / Redemption Amount"
              value={simulatedRedeemAmt}
              onChange={(v) => setSimulatedRedeemAmt(Math.min(utt.investmentAmount, Math.max(0, v)))}
              step={250000}
              slider
              max={utt.investmentAmount || 10000000}
              helperText={`Max redeemable: ${formatTZS(utt.investmentAmount)}`}
            />

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSimulatedRedeemAmt(Math.round(utt.investmentAmount * 0.25))}
                className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-[11px] font-semibold text-stone-700 hover:bg-stone-100"
              >
                25% (Emergency)
              </button>
              <button
                type="button"
                onClick={() => setSimulatedRedeemAmt(Math.round(utt.investmentAmount * 0.5))}
                className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-[11px] font-semibold text-stone-700 hover:bg-stone-100"
              >
                50% (Half Cushion)
              </button>
              <button
                type="button"
                onClick={() => setSimulatedRedeemAmt(Math.min(utt.investmentAmount, loan.monthlyRepayment))}
                className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-[11px] font-semibold text-stone-700 hover:bg-stone-100"
              >
                1 Mo Loan ({formatTZS(loan.monthlyRepayment, true)})
              </button>
              <button
                type="button"
                onClick={() => setSimulatedRedeemAmt(utt.investmentAmount)}
                className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-[11px] font-semibold text-stone-700 hover:bg-stone-100"
              >
                100% Full Access
              </button>
            </div>
          </div>

          <div className="md:col-span-7 rounded-xl bg-stone-50 dark:bg-stone-800/40 p-4 border border-stone-200 dark:border-stone-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Redemption Simulation Outcome
            </h4>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <span className="text-[10px] text-stone-500 block">Remaining UTT Cushion</span>
                <span className="font-mono-num font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {formatTZS(Math.max(0, utt.investmentAmount - simulatedRedeemAmt))}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <span className="text-[10px] text-stone-500 block">Added to Cash Reserve</span>
                <span className="font-mono-num font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                  +{formatTZS(simulatedRedeemAmt)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <span className="text-[10px] text-stone-500 block">Remaining Debt Runway</span>
                <span className="font-mono-num font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {loan.monthlyRepayment > 0
                    ? `${((Math.max(0, utt.investmentAmount - simulatedRedeemAmt) / loan.monthlyRepayment)).toFixed(1)} mos`
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200 dark:border-stone-700 text-xs">
              <span className="text-stone-500 text-[11px]">
                Turnaround: Request on Day 0 → Money in bank / M-Pesa on Day 1.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExecuteRedemption}
                  disabled={simulatedRedeemAmt <= 0 || utt.investmentAmount <= 0}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#2D4A3E] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#233B31] transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                >
                  <ArrowDownLeft className="h-3.5 w-3.5" />
                  Redeem to Cash Reserve
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DUAL COLUMN: FUND SELECTOR, INPUT CONTROLS & COMPOUND TRAJECTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Fund Selector & Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* UTT AMIS Fund Scheme Switcher */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs space-y-3">
            <h3 className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100">
              Select UTT AMIS Scheme
            </h3>
            <p className="text-xs text-stone-500 font-serif-body">
              Different collective investment schemes offer varying liquidity and return characteristics.
            </p>

            <div className="space-y-2 pt-1">
              {UTT_FUNDS.map((fund) => {
                const isSelected = utt.fundName.toLowerCase().includes(fund.key) || (fund.key === 'liquid' && utt.fundName.toLowerCase().includes('liquid'));

                return (
                  <div
                    key={fund.key}
                    onClick={() => handleFundSelect(fund)}
                    className={`rounded-xl border p-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 dark:border-emerald-600'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 dark:text-stone-100">
                          {fund.name}
                        </span>
                        {fund.key === 'liquid' && (
                          <span className="rounded bg-cyan-100 text-cyan-800 text-[10px] font-bold px-1.5 py-0.2">
                            Fastest Liquidity
                          </span>
                        )}
                      </div>
                      <span className="font-mono-num font-bold text-emerald-700 dark:text-emerald-400">
                        {fund.expectedReturnPct}% p.a.
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                      <span>Speed: {fund.liquiditySpeed}</span>
                      <span>Exit fee: {fund.exitLoad}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              Investment Assumptions & Controls
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Returns are market-based collective investment estimates based on Bank of Tanzania government bonds and DSE equities.
            </p>

            <div className="space-y-4">
              <CurrencyInput
                label="Liquid Principal Investment"
                value={utt.investmentAmount}
                onChange={(v) => updateUTT({ investmentAmount: v })}
                step={500000}
                slider
                max={20000000}
                helperText="Initial recommendation: TZS 10,000,000"
              />

              <CurrencyInput
                label="Expected Annual Return %"
                value={utt.expectedAnnualReturnPct}
                onChange={(v) => updateUTT({ expectedAnnualReturnPct: Math.min(30, Math.max(1, v)) })}
                step={0.5}
                isCurrency={false}
                unit="%"
                slider
                min={5}
                max={25}
                helperText="Historical UTT AMIS: ~12%–14.5% p.a."
              />

              <CurrencyInput
                label="Future Monthly Contribution"
                value={utt.monthlyContribution}
                onChange={(v) => updateUTT({ monthlyContribution: v })}
                step={50000}
                slider
                max={2000000}
                helperText="Recurring business profit reinvestment"
              />

              {/* Reinvestment Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 p-3.5 dark:border-stone-800 dark:bg-stone-800/40">
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    Compound Reinvestment of Dividends
                  </h4>
                  <p className="text-[11px] text-stone-500 font-serif-body">
                    Automatically roll periodic returns back into the principal
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={utt.reinvestReturns}
                    onChange={(e) => updateUTT({ reinvestReturns: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D4A3E]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Cost of Debt vs Return Comparison Card */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="h-4 w-4 text-[#2D4A3E] dark:text-emerald-400" />
              <h3 className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100">
                Yield vs. Loan Interest Spread Analysis
              </h3>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Comparing what this liquid reserve earns vs what the commercial loan costs.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-800/40">
                <span className="text-stone-500 text-[10px] uppercase font-bold">Loan Cost (Interest)</span>
                <div className="font-mono-num text-base font-bold text-rose-600 dark:text-rose-400">
                  {loan.interestRateAnnualPct}% p.a.
                </div>
              </div>

              <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-800/40">
                <span className="text-stone-500 text-[10px] uppercase font-bold">UTT Expected Return</span>
                <div className="font-mono-num text-base font-bold text-[#2D4A3E] dark:text-emerald-400">
                  {utt.expectedAnnualReturnPct}% p.a.
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-lg bg-stone-100 dark:bg-stone-800 p-3 text-xs font-serif-body text-stone-600 dark:text-stone-300">
              {returnVsLoanCostDelta < 0 ? (
                <span>
                  ⚠️ <strong>Negative Spread ({((returnVsLoanCostDelta ?? 0)).toFixed(1)}%)</strong>: The loan interest rate ({loan.interestRateAnnualPct}%) exceeds the expected UTT yield ({utt.expectedAnnualReturnPct}%). However, because UTT is <strong>100% liquid</strong>, its primary strategic value is as a <strong>safe emergency debt-service buffer and working capital insurance</strong>.
                </span>
              ) : (
                <span>
                  ✓ <strong>Positive Spread (+{((returnVsLoanCostDelta ?? 0)).toFixed(1)}%)</strong>: Yield exceeds the loan rate, with full liquidity protection if cash is required.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: 10-Year Compounding Visualizer */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              10-Year Growth Trajectory (Estimate)
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Projected balance over 10 years with reinvestment.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 10 }} />
                  <Tooltip
                    formatter={(val: any) => [formatTZS(Number(val)), '']}
                    contentStyle={{
                      backgroundColor: state.theme === 'dark' ? '#1C1917' : '#FFFFFF',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    name="Estimated Portfolio Value"
                    stroke="#2D4A3E"
                    fill="#2D4A3E"
                    fillOpacity={0.25}
                  />
                  <Area
                    type="monotone"
                    dataKey="principal"
                    name="Cumulative Principal"
                    stroke="#78716C"
                    fill="#78716C"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Table of Key Milestones */}
            <div className="mt-4 grid grid-cols-4 gap-2 border-t border-stone-100 dark:border-stone-800 pt-4 text-center text-xs">
              <div className="p-2 rounded bg-stone-50 dark:bg-stone-800/40">
                <span className="text-[10px] text-stone-400 block">Year 1</span>
                <span className="font-mono-num font-bold text-stone-900 dark:text-stone-100">
                  {formatTZS(uttCalc.valueAfter1Year, true)}
                </span>
              </div>
              <div className="p-2 rounded bg-stone-50 dark:bg-stone-800/40">
                <span className="text-[10px] text-stone-400 block">Year 3</span>
                <span className="font-mono-num font-bold text-stone-900 dark:text-stone-100">
                  {formatTZS(uttCalc.valueAfter3Years, true)}
                </span>
              </div>
              <div className="p-2 rounded bg-stone-50 dark:bg-stone-800/40">
                <span className="text-[10px] text-stone-400 block">Year 5</span>
                <span className="font-mono-num font-bold text-stone-900 dark:text-stone-100">
                  {formatTZS(uttCalc.valueAfter5Years, true)}
                </span>
              </div>
              <div className="p-2 rounded bg-stone-50 dark:bg-stone-800/40">
                <span className="text-[10px] text-stone-400 block">Year 10</span>
                <span className="font-mono-num font-bold text-[#2D4A3E] dark:text-emerald-400">
                  {formatTZS(uttCalc.valueAfter10Years, true)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Notes for UTT */}
      <PinnedCorkboard
        filterTarget="utt"
        title="Pinned Wealth & Compounding Rules"
      />

      {/* Comments for UTT */}
      <CommentsSection
        targetId="utt"
        title="UTT AMIS Bond Strategy Comments"
        subtitle="Track annual distributions, reinvestment decisions, and tax considerations."
      />
    </div>
  );
};
