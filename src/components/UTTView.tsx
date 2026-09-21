import React from 'react';
import { useKairos } from '../context/KairosContext';
import { CurrencyInput } from './CurrencyInput';
import { StatCard } from './StatCard';
import { WarningBanner } from './WarningBanner';
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

export const UTTView: React.FC = () => {
  const { state, setActiveTab, updateUTT, uttCalc } = useKairos();
  const utt = state.utt;
  const loan = state.loan;

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

  // Comparison rate: UTT vs Loan Cost
  const returnVsLoanCostDelta = utt.expectedAnnualReturnPct - loan.interestRateAnnualPct;

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
          <span>Back to Overview</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('diary')}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/70 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 hover:bg-amber-200 transition-colors cursor-pointer"
          >
            <span>Read Wealth Diary Notes</span>
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
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 text-[#1E3A2F] dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1 text-xs font-semibold mb-2">
                <Landmark className="h-3.5 w-3.5" />
                <span>Chapter 4 • Wealth Tree & Compounding</span>
              </div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                UTT AMIS & Wealth Preservation
              </h1>
              <p className="mt-1 font-serif-body text-sm text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
                Allocated capital: <strong>{formatTZS(utt.investmentAmount)}</strong>. Government-backed liquid bond yields compounding quietly in the background without management distraction.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Fund: {utt.fundName} ({utt.expectedAnnualReturnPct}% compound)
                </span>
              </div>
              <div className="text-xs font-mono-num font-bold text-emerald-700 dark:text-emerald-400">
                10-Yr FV: {formatTZS(uttCalc.totalFutureValue, true)}
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-3 left-4 text-white font-handwriting text-base font-semibold drop-shadow-md lg:hidden">
              🌱 Quiet, patient compound growth
            </div>
          </div>
        </div>
      </div>

      {/* CRITICAL REALITY CHECK WARNING BANNER */}
      <WarningBanner
        type="warning"
        title="CRITICAL: Cost of Debt vs. Expected Return Reality Check"
        message="Because this capital comes from a loan, compare the investment's expected return and liquidity with the loan's effective cost before locking the money away. UTT returns are market-based estimates and are NOT guaranteed to beat loan interest."
      />

      {/* 4 Summary Horizon Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Estimated 1-Year Value"
          value={formatTZS(uttCalc.valueAfter1Year)}
          subValue={`Annual return est: ${formatTZS(uttCalc.annualEstimatedReturn)} (${formatTZS(
            uttCalc.monthlyEquivalentReturn,
            true
          )}/mo eq.)`}
          badge={{ text: '12 Months', variant: 'neutral' }}
          icon={<Calendar className="h-4 w-4" />}
        />

        <StatCard
          label="Estimated 3-Year Value"
          value={formatTZS(uttCalc.valueAfter3Years)}
          subValue={`Est. gains: +${formatTZS(uttCalc.valueAfter3Years - utt.investmentAmount)}`}
          badge={{ text: '36 Months', variant: 'neutral' }}
          icon={<TrendingUp className="h-4 w-4" />}
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
          highlight
        />
      </div>

      {/* DUAL COLUMN: INPUT CONTROLS & COMPOUND TRAJECTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Investment Parameters & Cost of Debt Comparison */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              Investment Assumptions & Controls
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              All returns are <strong>ESTIMATES</strong> based on historical unit trust performance.
            </p>

            <div className="space-y-4">
              <CurrencyInput
                label="Principal Investment Amount"
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
                helperText="Recurring salary/business profit reinvestment"
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
              Comparing what the investment earns vs what the loan costs.
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
                  ⚠️ <strong>Negative Spread ({returnVsLoanCostDelta.toFixed(1)}%)</strong>: The loan interest rate ({loan.interestRateAnnualPct}%) exceeds the expected UTT yield ({utt.expectedAnnualReturnPct}%). UTT functions here as a <strong>liquidity and capital preservation anchor</strong>, not an arbitrage mechanism.
                </span>
              ) : (
                <span>
                  ✓ <strong>Positive Spread (+{returnVsLoanCostDelta.toFixed(1)}%)</strong>: Yield exceeds the loan rate, but remember debt service requires hard monthly cash outflows whereas unit trust gains are accrued.
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
