import React from 'react';
import { useKairos } from '../context/KairosContext';
import { CurrencyInput } from './CurrencyInput';
import { StatCard } from './StatCard';
import { WarningBanner } from './WarningBanner';
import { formatTZS, formatPercent, formatRatio } from '../utils/formatters';
import {
  CreditCard,
  Scale,
  TrendingDown,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Activity,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const LoanDashboardView: React.FC = () => {
  const { state, setActiveTab, updateLoan, loanCalc, klinFitzCalc, zanzibarCalc, poultryCalc } = useKairos();
  const loan = state.loan;

  const totalBusinessCashFlow =
    klinFitzCalc.monthlyOperatingProfit +
    zanzibarCalc.userProfitShare +
    poultryCalc.monthlyEquivalentProfit;

  // Comparison Waterfall Data
  const waterfallData = [
    {
      name: 'Klin Fitz Profit',
      amount: klinFitzCalc.monthlyOperatingProfit,
      fill: '#4E7764',
    },
    {
      name: 'Zanzibar Share',
      amount: zanzibarCalc.userProfitShare,
      fill: '#7E9F8E',
    },
    {
      name: 'Poultry Run-rate',
      amount: poultryCalc.monthlyEquivalentProfit,
      fill: '#C28458',
    },
    {
      name: 'Total Business Cash',
      amount: totalBusinessCashFlow,
      fill: '#2D4A3E',
    },
    {
      name: 'Monthly Loan Obligation',
      amount: -loan.monthlyRepayment,
      fill: '#E11D48',
    },
    {
      name: 'Net Cash Cushion',
      amount: totalBusinessCashFlow - loan.monthlyRepayment,
      fill: totalBusinessCashFlow >= loan.monthlyRepayment ? '#10B981' : '#F43F5E',
    },
  ];

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
            onClick={() => setActiveTab('monthly_tracker')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A2F] dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <span>Next: 12-Month Ledger</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
              <CreditCard className="h-3.5 w-3.5" />
              Debt Service & Solvency Command
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              Loan Amortization & Debt Service Coverage (DSCR)
            </h1>
            <p className="mt-1 font-serif-body text-sm text-stone-600 dark:text-stone-300 max-w-2xl">
              Borrowed principal: <strong>{formatTZS(loan.principal)}</strong>. Tracking true cash debt obligations,
              interest cost, and whether business cash flow can autonomously service the loan without salary subsidies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`rounded-2xl border p-4 text-center ${
                loanCalc.dscr >= 1.5
                  ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/50'
                  : loanCalc.dscr >= 1.25
                  ? 'border-sky-300 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/50'
                  : loanCalc.dscr >= 1.0
                  ? 'border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50'
                  : 'border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/50'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                Debt Coverage (DSCR)
              </span>
              <div className="font-mono-num text-2xl font-bold">
                {formatRatio(loanCalc.dscr)}
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider block">
                {loanCalc.dscrStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Strict Financial Principle Warning Banner */}
      <WarningBanner
        type={loanCalc.dscr < 1.0 ? 'danger' : 'info'}
        title={loanCalc.dscr < 1.0 ? 'Debt Coverage Deficit Alert' : 'Crucial Principle: Salary is NOT Business Profit'}
        message={
          loanCalc.dscr < 1.0
            ? `Your businesses currently generate ${formatTZS(
                totalBusinessCashFlow
              )}/mo, falling short of the ${formatTZS(
                loan.monthlyRepayment
              )}/mo loan obligation by ${formatTZS(
                Math.abs(loanCalc.cashFlowAfterDebtService)
              )}/mo. You must temporarily inject personal funds or scale Klin Fitz volume.`
            : 'Do NOT count your salary as business profit. The long-term goal of Project Kairos is for Klin Fitz, Zanzibar, and Poultry to service this loan independently, preserving your salary for additional asset acquisition.'
        }
      />

      {/* 4 Summary Loan Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Monthly Debt Service"
          value={formatTZS(loan.monthlyRepayment)}
          subValue={`Annual debt service: ${formatTZS(loanCalc.annualDebtService)}`}
          badge={{ text: 'Fixed Monthly', variant: 'warning' }}
          icon={<CreditCard className="h-4 w-4" />}
        />

        <StatCard
          label="Total Scheduled Repayments"
          value={formatTZS(loanCalc.totalRepayments)}
          subValue={`Over ${loan.tenureMonths} months (${(loan.tenureMonths / 12).toFixed(1)} yrs)`}
          badge={{ text: 'Total Outflow', variant: 'neutral' }}
          icon={<TrendingDown className="h-4 w-4" />}
        />

        <StatCard
          label="Total Financing Cost"
          value={formatTZS(loanCalc.totalFinancingCost)}
          subValue={`Interest + ${formatTZS(loan.originationFees + loan.insuranceCost)} fees & insurance`}
          badge={{ text: 'Cost of Capital', variant: 'danger' }}
          icon={<Scale className="h-4 w-4" />}
        />

        <StatCard
          label="Net Cash Flow After Debt"
          value={formatTZS(loanCalc.cashFlowAfterDebtService)}
          subValue={`Business profit (${formatTZS(totalBusinessCashFlow)}) minus loan (${formatTZS(
            loan.monthlyRepayment
          )})`}
          badge={{
            text: loanCalc.cashFlowAfterDebtService >= 0 ? 'Cash Positive' : 'Deficit / Subsidy',
            variant: loanCalc.cashFlowAfterDebtService >= 0 ? 'success' : 'danger',
          }}
          icon={<DollarSign className="h-4 w-4" />}
          highlight={loanCalc.cashFlowAfterDebtService >= 0}
        />
      </div>

      {/* DUAL COLUMN: LOAN CONTRACT INPUTS & DSCR STRESS TEST MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Loan Terms & Fee Breakdown */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              Loan Contract Parameters
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Editable values to match final executed loan agreements.
            </p>

            <div className="space-y-4">
              <CurrencyInput
                label="Loan Principal Amount"
                value={loan.principal}
                onChange={(v) => updateLoan({ principal: v })}
                step={1000000}
                helperText="Gross nominal borrowed capital"
              />

              <CurrencyInput
                label="Net Cash Actually Received"
                value={loan.actualNetCashReceived}
                onChange={(v) => updateLoan({ actualNetCashReceived: v })}
                step={500000}
                helperText="After upfront deductions, processing & insurance"
              />

              <CurrencyInput
                label="Agreed Monthly Repayment Amount"
                value={loan.monthlyRepayment}
                onChange={(v) => updateLoan({ monthlyRepayment: v })}
                step={25000}
                slider
                min={500000}
                max={2000000}
                helperText="Fixed monthly EMI paid to bank"
              />

              <div className="grid grid-cols-2 gap-4">
                <CurrencyInput
                  label="Loan Tenure (Months)"
                  value={loan.tenureMonths}
                  onChange={(v) => updateLoan({ tenureMonths: Math.max(6, Math.round(v)) })}
                  step={6}
                  isCurrency={false}
                  unit="mos"
                  slider
                  min={12}
                  max={60}
                  helperText="Default: 48 months (4 years)"
                />

                <CurrencyInput
                  label="Nominal Interest Rate % p.a."
                  value={loan.interestRateAnnualPct}
                  onChange={(v) => updateLoan({ interestRateAnnualPct: v })}
                  step={0.5}
                  isCurrency={false}
                  unit="%"
                  slider
                  min={10}
                  max={30}
                  helperText="Annual lending interest rate"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CurrencyInput
                  label="Origination & Processing Fees"
                  value={loan.originationFees}
                  onChange={(v) => updateLoan({ originationFees: v })}
                  step={50000}
                  helperText="Upfront bank bank facility fees"
                />

                <CurrencyInput
                  label="Credit Life Insurance"
                  value={loan.insuranceCost}
                  onChange={(v) => updateLoan({ insuranceCost: v })}
                  step={25000}
                  helperText="Mandatory loan protection insurance"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: DSCR Health Gauge & Cash Waterfall */}
        <div className="lg:col-span-6 space-y-6">
          {/* DSCR Matrix Card */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              Debt Service Coverage Ratio (DSCR) Benchmark
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Formula: <strong>Business Operating Cash Flow ÷ Monthly Loan Repayment</strong>.
            </p>

            <div className="space-y-2.5 text-xs">
              <div
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  loanCalc.dscr < 1.0
                    ? 'border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-bold'
                    : 'border-stone-200 bg-stone-50/50 dark:border-stone-800 dark:bg-stone-800/20 text-stone-600 dark:text-stone-400'
                }`}
              >
                <div>
                  <span className="block text-[11px] uppercase tracking-wider">Below 1.0x — Critical Deficit</span>
                  <span className="text-[10px] font-normal opacity-80 font-serif-body">
                    Businesses do not currently cover debt service. Requires personal subsidy.
                  </span>
                </div>
                <span className="font-mono-num font-bold text-sm">
                  {loanCalc.dscr < 1.0 ? `Active (${formatRatio(loanCalc.dscr)})` : '< 1.0x'}
                </span>
              </div>

              <div
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  loanCalc.dscr >= 1.0 && loanCalc.dscr < 1.25
                    ? 'border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold'
                    : 'border-stone-200 bg-stone-50/50 dark:border-stone-800 dark:bg-stone-800/20 text-stone-600 dark:text-stone-400'
                }`}
              >
                <div>
                  <span className="block text-[11px] uppercase tracking-wider">1.0x – 1.25x — Fragile Margin</span>
                  <span className="text-[10px] font-normal opacity-80 font-serif-body">
                    Thin margin of safety. A small dip in laundry or Airbnb sales causes debt default risk.
                  </span>
                </div>
                <span className="font-mono-num font-bold text-sm">
                  {loanCalc.dscr >= 1.0 && loanCalc.dscr < 1.25 ? `Active (${formatRatio(loanCalc.dscr)})` : '1.0–1.25x'}
                </span>
              </div>

              <div
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  loanCalc.dscr >= 1.25 && loanCalc.dscr < 1.5
                    ? 'border-sky-300 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 font-bold'
                    : 'border-stone-200 bg-stone-50/50 dark:border-stone-800 dark:bg-stone-800/20 text-stone-600 dark:text-stone-400'
                }`}
              >
                <div>
                  <span className="block text-[11px] uppercase tracking-wider">1.25x – 1.5x — Improving Resilience</span>
                  <span className="text-[10px] font-normal opacity-80 font-serif-body">
                    Moderate operating cushion against seasonal fluctuations.
                  </span>
                </div>
                <span className="font-mono-num font-bold text-sm">
                  {loanCalc.dscr >= 1.25 && loanCalc.dscr < 1.5 ? `Active (${formatRatio(loanCalc.dscr)})` : '1.25–1.5x'}
                </span>
              </div>

              <div
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  loanCalc.dscr >= 1.5
                    ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                    : 'border-stone-200 bg-stone-50/50 dark:border-stone-800 dark:bg-stone-800/20 text-stone-600 dark:text-stone-400'
                }`}
              >
                <div>
                  <span className="block text-[11px] uppercase tracking-wider">Above 1.5x — Healthy Cushion</span>
                  <span className="text-[10px] font-normal opacity-80 font-serif-body">
                    Robust cash buffer. Businesses cover debt comfortably with surplus for reinvestment.
                  </span>
                </div>
                <span className="font-mono-num font-bold text-sm">
                  {loanCalc.dscr >= 1.5 ? `Active (${formatRatio(loanCalc.dscr)})` : '> 1.5x'}
                </span>
              </div>
            </div>
          </div>

          {/* Cash Flow vs Debt Service Waterfall Chart */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
              Monthly Debt Service Coverage Breakdown
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-3">
              Business inflows vs fixed bank debt payment.
            </p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 9 }} />
                  <Tooltip
                    formatter={(val: any) => [formatTZS(Number(val)), '']}
                    contentStyle={{
                      backgroundColor: state.theme === 'dark' ? '#1C1917' : '#FFFFFF',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="amount" name="Monthly Amount" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
