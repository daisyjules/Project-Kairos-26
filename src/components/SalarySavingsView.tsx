import React, { useState } from 'react';
import {
  ArrowLeft,
  Wallet,
  PiggyBank,
  TrendingUp,
  Landmark,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  DollarSign,
  PieChart,
  Percent,
  Layers,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { useKairos } from '../context/KairosContext';
import { formatTZS, formatPercent } from '../utils/formatters';
import { StatCard } from './StatCard';
import { OFFICIAL_DSE_QUOTES } from '../data/dseEquities';

export const SalarySavingsView: React.FC = () => {
  const {
    state,
    setActiveTab,
    updateSalarySavings,
    logMonthlySalarySavings,
    salarySavingsCalc,
    dseCalc,
    masterCalc,
  } = useKairos();

  const salary = state.salarySavings;
  const [syncWithLoan, setSyncWithLoan] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLogging, setIsLogging] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSalaryChange = (val: number) => {
    updateSalarySavings({ monthlyNetSalary: Math.max(0, val) });
  };

  const handleExpensesChange = (val: number) => {
    updateSalarySavings({ monthlyLivingExpenses: Math.max(0, val) });
  };

  const handleLoanDeductionChange = (val: number) => {
    setSyncWithLoan(false);
    updateSalarySavings({ loanRepaymentDeduction: Math.max(0, val) });
  };

  const handleToggleSyncLoan = () => {
    if (!syncWithLoan) {
      setSyncWithLoan(true);
      updateSalarySavings({ loanRepaymentDeduction: state.loan.monthlyRepayment });
      showToast('Synced loan deduction with active debt repayment of ' + formatTZS(state.loan.monthlyRepayment));
    } else {
      setSyncWithLoan(false);
    }
  };

  const handleDSEAllocChange = (val: number) => {
    updateSalarySavings({ monthlyAllocatedToDSE: Math.max(0, val) });
  };

  const handleUTTAllocChange = (val: number) => {
    updateSalarySavings({ monthlyAllocatedToUTT: Math.max(0, val) });
  };

  const handleEmergencyAllocChange = (val: number) => {
    updateSalarySavings({ monthlyAllocatedToEmergency: Math.max(0, val) });
  };

  const handleLogSavings = () => {
    setIsLogging(true);
    setTimeout(() => {
      logMonthlySalarySavings();
      setIsLogging(false);
      showToast(
        `Successfully logged monthly salary savings! Routed ${formatTZS(
          salary.monthlyAllocatedToDSE
        )} to DSE broker cash & ${formatTZS(salary.monthlyAllocatedToUTT)} to UTT Liquid Fund.`
      );
    }, 450);
  };

  // Live calculation of how many DSE shares monthly salary savings can accumulate
  const crdbPrice = OFFICIAL_DSE_QUOTES['CRDB']?.currentPrice || 700;
  const nmbPrice = OFFICIAL_DSE_QUOTES['NMB']?.currentPrice || 6200;
  const tpccPrice = OFFICIAL_DSE_QUOTES['TPCC']?.currentPrice || 5600;

  const crdbSharesPurchased = Math.floor(salary.monthlyAllocatedToDSE / crdbPrice);
  const nmbSharesPurchased = Math.floor(salary.monthlyAllocatedToDSE / nmbPrice);
  const tpccSharesPurchased = Math.floor(salary.monthlyAllocatedToDSE / tpccPrice);

  // Status badge styling
  const getStatusBadge = () => {
    switch (salarySavingsCalc.savingsStatus) {
      case 'HEALTHY':
        return {
          label: 'Exceptional Saving Capability',
          badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          desc: 'Your monthly savings rate is >25%, allowing aggressive wealth accumulation in DSE equities and UTT Liquid Fund.',
        };
      case 'MODERATE':
        return {
          label: 'Moderate Saving Capability',
          badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
          desc: 'Saving between 15% and 25% of take-home pay. Sustainable, but consider trimming non-essential expenses.',
        };
      case 'TIGHT':
        return {
          label: 'Tight Saving Margin',
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
          desc: 'Saving less than 15% of take-home pay. Emergency safety runway may take longer to build.',
        };
      case 'DEFICIT':
      default:
        return {
          label: 'Deficit / Over-Budget',
          badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
          desc: 'Living expenses and debt service exceed your monthly salary. Restructure commitments immediately.',
        };
    }
  };

  const status = getStatusBadge();

  return (
    <div className="space-y-8 pb-16 text-[#242220]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A5752] transition-colors hover:text-[#2D4A3E]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Kairos Ecosystem
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('dse')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-2xs"
          >
            <Landmark className="h-3.5 w-3.5 text-emerald-700" />
            Go to DSE Portfolio
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('utt')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-2xs"
          >
            <TrendingUp className="h-3.5 w-3.5 text-indigo-700" />
            Go to UTT Liquid Fund
          </button>

          <button
            type="button"
            onClick={handleLogSavings}
            disabled={isLogging || salarySavingsCalc.totalAllocatedSavings <= 0}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2D4A3E] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#233B31] disabled:opacity-50 transition-colors shadow-2xs"
          >
            <Sparkles className={`h-3.5 w-3.5 ${isLogging ? 'animate-spin' : ''}`} />
            {isLogging ? 'Logging Savings...' : 'Log Monthly Salary Savings'}
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <section className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-stone-700">
                <Wallet className="h-3 w-3 text-stone-600" /> Salary Savings & Capability Evaluator
              </span>
              <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold ${status.badgeClass}`}>
                {status.label}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1918]">
              Founder Salary Savings & Capability Engine
            </h1>
            <p className="text-sm text-[#5A5752] leading-relaxed">
              Evaluate your genuine capacity to save from monthly employment salary, fund your living expenses,
              service debts, and systematically dollar-cost average into live DSE equities and the UTT Liquid Fund.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5 flex flex-col justify-between shrink-0 min-w-[240px]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
              Monthly Savings Capability
            </span>
            <div className="mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono-num text-emerald-950">
                {formatTZS(salarySavingsCalc.monthlySavingsCapacity)}
              </span>
              <span className="block text-xs font-semibold text-emerald-700 mt-0.5">
                {salarySavingsCalc.savingsRatePct}% of Net Salary Saved
              </span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-800">
              <span>Historical Saved:</span>
              <span className="font-bold">{formatTZS(salary.historicalSavingsTotal || 0)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Monthly Take-Home Salary"
          value={formatTZS(salarySavingsCalc.monthlyNetSalary)}
          subtext={`Basic living expenses: ${formatTZS(salarySavingsCalc.totalMonthlyExpenses)}`}
          icon={<DollarSign className="h-4 w-4 text-stone-600" />}
        />

        <StatCard
          label="Monthly Savings Rate"
          value={`${salarySavingsCalc.savingsRatePct}%`}
          subtext={
            salarySavingsCalc.savingsRatePct >= 25
              ? 'Above target 25% wealth benchmark'
              : 'Target at least 25% for rapid accumulation'
          }
          icon={<Percent className="h-4 w-4 text-emerald-600" />}
          highlight={salarySavingsCalc.savingsRatePct >= 25}
        />

        <StatCard
          label="DSE + UTT Monthly Accumulation"
          value={formatTZS(salarySavingsCalc.annualTotalSavings / 12)}
          subtext={`${formatTZS(salarySavingsCalc.annualTotalSavings)} saved & invested p.a.`}
          icon={<PiggyBank className="h-4 w-4 text-indigo-600" />}
        />

        <StatCard
          label="Emergency Living Runway"
          value={`${salarySavingsCalc.emergencyFundCoverageMonths} mo`}
          subtext={`Based on current ${formatTZS(state.allocations.cashReserve)} reserve`}
          icon={<ShieldCheck className="h-4 w-4 text-teal-600" />}
          highlight={salarySavingsCalc.emergencyFundCoverageMonths >= 3}
        />
      </div>

      {/* Main Grid: Inputs & Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Salary & Expenses Configuration */}
        <section className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1918]">
                  1. Salary & Deductions Profile
                </h3>
                <p className="text-xs text-[#5A5752]">
                  Set your monthly net income and baseline obligations
                </p>
              </div>
              <Wallet className="h-4 w-4 text-stone-400" />
            </div>

            <div className="space-y-4">
              {/* Net Salary */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Monthly Net Take-Home Salary (TZS)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="50000"
                    min="0"
                    value={salary.monthlyNetSalary}
                    onChange={(e) => handleSalaryChange(parseInt(e.target.value) || 0)}
                    className="w-full rounded-xl border border-stone-300 bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-bold font-mono-num text-stone-900 focus:border-[#2D4A3E] focus:outline-hidden"
                  />
                  <div className="flex gap-1.5 mt-1.5">
                    {[1_500_000, 2_000_000, 2_500_000, 3_500_000, 5_000_000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleSalaryChange(amt)}
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                          salary.monthlyNetSalary === amt
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                            : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {formatTZS(amt)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monthly Living Expenses */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Monthly Living & Personal Expenses (Rent, Food, Utilities, Transport)
                </label>
                <input
                  type="number"
                  step="25000"
                  min="0"
                  value={salary.monthlyLivingExpenses}
                  onChange={(e) => handleExpensesChange(parseInt(e.target.value) || 0)}
                  className="w-full rounded-xl border border-stone-300 bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-semibold font-mono-num text-stone-900 focus:border-[#2D4A3E] focus:outline-hidden"
                />
                <span className="text-[11px] text-stone-500 block mt-1">
                  Baseline monthly survival & lifestyle cost
                </span>
              </div>

              {/* Loan Repayment Deduction */}
              <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-700">
                    Debt Repayment from Salary (TZS/month)
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleSyncLoan}
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                      syncWithLoan ? 'text-emerald-700 underline' : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <RefreshCw className="h-3 w-3" />
                    {syncWithLoan ? 'Synced to Loan (Active)' : 'Custom Loan Amount'}
                  </button>
                </div>

                <input
                  type="number"
                  step="25000"
                  min="0"
                  value={syncWithLoan ? state.loan.monthlyRepayment : salary.loanRepaymentDeduction}
                  onChange={(e) => handleLoanDeductionChange(parseInt(e.target.value) || 0)}
                  disabled={syncWithLoan}
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold font-mono-num text-stone-900 disabled:bg-stone-100 disabled:text-stone-500"
                />
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span>Actual Kairos Loan Repayment:</span>
                  <span className="font-semibold text-stone-900">{formatTZS(state.loan.monthlyRepayment)}/mo</span>
                </div>
              </div>

              {/* Net Cash Flow Breakdown Bar */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-600 font-medium">Net Monthly Salary:</span>
                  <span className="font-bold text-stone-900 font-mono-num">
                    {formatTZS(salarySavingsCalc.monthlyNetSalary)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-rose-600 font-medium">- Living Expenses & Debt:</span>
                  <span className="font-bold text-rose-700 font-mono-num">
                    -{formatTZS(salarySavingsCalc.totalMonthlyExpenses)}
                  </span>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex justify-between items-center text-sm font-bold">
                  <span className="text-emerald-950">Net Monthly Savings Capacity:</span>
                  <span className="text-emerald-900 font-mono-num">
                    {formatTZS(salarySavingsCalc.monthlySavingsCapacity)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Savings Allocation to DSE, UTT & Emergency */}
        <section className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1918]">
                  2. Monthly Savings Allocation Engine
                </h3>
                <p className="text-xs text-[#5A5752]">
                  Direct your monthly surplus into productive wealth buckets
                </p>
              </div>
              <PieChart className="h-4 w-4 text-emerald-600" />
            </div>

            <div className="space-y-4">
              {/* Allocation 1: DSE Stocks DCA */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Landmark className="h-4 w-4 text-emerald-800" />
                    <span className="text-xs font-bold text-emerald-950">
                      Monthly Allocation to DSE Stocks (DCA)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-900 font-mono-num">
                    {formatTZS(salary.monthlyAllocatedToDSE)}/mo
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max={Math.max(1_000_000, salarySavingsCalc.monthlySavingsCapacity)}
                  step="25000"
                  value={salary.monthlyAllocatedToDSE}
                  onChange={(e) => handleDSEAllocChange(parseInt(e.target.value) || 0)}
                  className="w-full accent-[#2D4A3E] cursor-pointer"
                />

                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-emerald-200/60 text-[11px] font-mono-num">
                  <div className="rounded bg-white/80 p-1.5 border border-emerald-100">
                    <span className="text-[10px] text-gray-500 block">CRDB Shares/mo</span>
                    <span className="font-bold text-emerald-900">+{crdbSharesPurchased.toLocaleString()}</span>
                  </div>
                  <div className="rounded bg-white/80 p-1.5 border border-emerald-100">
                    <span className="text-[10px] text-gray-500 block">Twiga Cement/mo</span>
                    <span className="font-bold text-emerald-900">+{tpccSharesPurchased.toLocaleString()}</span>
                  </div>
                  <div className="rounded bg-white/80 p-1.5 border border-emerald-100">
                    <span className="text-[10px] text-gray-500 block">NMB Shares/mo</span>
                    <span className="font-bold text-emerald-900">+{nmbSharesPurchased.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Allocation 2: UTT Liquid Fund */}
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-indigo-700" />
                    <span className="text-xs font-bold text-indigo-950">
                      Monthly Allocation to UTT AMIS Liquid Fund
                    </span>
                  </div>
                  <span className="text-xs font-bold text-indigo-900 font-mono-num">
                    {formatTZS(salary.monthlyAllocatedToUTT)}/mo
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max={Math.max(1_000_000, salarySavingsCalc.monthlySavingsCapacity)}
                  step="25000"
                  value={salary.monthlyAllocatedToUTT}
                  onChange={(e) => handleUTTAllocChange(parseInt(e.target.value) || 0)}
                  className="w-full accent-indigo-700 cursor-pointer"
                />

                <p className="text-[11px] text-indigo-900/80">
                  Compounds at ~13.5% p.a. with 100% daily liquidity and T+1 turnaround.
                </p>
              </div>

              {/* Allocation 3: Emergency Bank Cash */}
              <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-teal-700" />
                    <span className="text-xs font-bold text-teal-950">
                      Monthly Emergency Bank Buffer
                    </span>
                  </div>
                  <span className="text-xs font-bold text-teal-900 font-mono-num">
                    {formatTZS(salary.monthlyAllocatedToEmergency)}/mo
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max={Math.max(500_000, salarySavingsCalc.monthlySavingsCapacity)}
                  step="25000"
                  value={salary.monthlyAllocatedToEmergency}
                  onChange={(e) => handleEmergencyAllocChange(parseInt(e.target.value) || 0)}
                  className="w-full accent-teal-700 cursor-pointer"
                />

                <p className="text-[11px] text-teal-900/80">
                  Guarantees liquid living runway without touching stock equities or selling shares prematurely.
                </p>
              </div>

              {/* Allocation Summary & Unallocated Surplus */}
              <div className="flex items-center justify-between rounded-xl bg-stone-100 p-3 text-xs">
                <div>
                  <span className="text-stone-500 font-medium">Total Monthly Savings Allocated:</span>
                  <span className="font-bold text-stone-900 ml-1.5 font-mono-num">
                    {formatTZS(salarySavingsCalc.totalAllocatedSavings)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 font-medium">Remaining Buffer:</span>
                  <span
                    className={`font-bold ml-1.5 font-mono-num ${
                      salarySavingsCalc.unallocatedSurplus >= 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {formatTZS(salarySavingsCalc.unallocatedSurplus)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Saving Capability Diagnostic & Milestone Velocity */}
      <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1918]">
              3. Saving Capability Evaluation & Milestone Velocity
            </h3>
            <p className="text-xs text-[#5A5752]">
              How fast your monthly salary savings drives genuine wealth milestones
            </p>
          </div>
          <Clock className="h-4 w-4 text-[#2D4A3E]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-2">
            <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
              DSE 5M Milestone Velocity
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-stone-900 font-mono-num">
                {salarySavingsCalc.monthsTo5MMilestoneDSE < 999
                  ? `${salarySavingsCalc.monthsTo5MMilestoneDSE} mo`
                  : 'N/A'}
              </span>
              <span className="text-xs text-stone-500">to reach 5,000,000 TZS</span>
            </div>
            <p className="text-[11px] text-stone-600">
              Current DSE portfolio value: {formatTZS(dseCalc.totalPortfolioValue)}. Monthly DCA:{' '}
              {formatTZS(salary.monthlyAllocatedToDSE)}.
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-2">
            <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
              DSE 10M Milestone Velocity
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-stone-900 font-mono-num">
                {salarySavingsCalc.monthsTo10MMilestoneDSE < 999
                  ? `${salarySavingsCalc.monthsTo10MMilestoneDSE} mo`
                  : 'N/A'}
              </span>
              <span className="text-xs text-stone-500">to reach 10,000,000 TZS</span>
            </div>
            <p className="text-[11px] text-stone-600">
              The flagship target milestone before triggering wealth diversification decisions.
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-2">
            <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
              5-Year Salary Net Worth Addition
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-emerald-800 font-mono-num">
                {formatTZS(salarySavingsCalc.fiveYearTotalNetWorthGain)}
              </span>
            </div>
            <p className="text-[11px] text-stone-600">
              Compound projection across 60 months of disciplined salary deductions.
            </p>
          </div>
        </div>

        {/* Projection Schedule Table */}
        <div className="overflow-x-auto rounded-xl border border-stone-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Horizon</th>
                <th className="py-3 px-4">Cumulative Salary Saved</th>
                <th className="py-3 px-4">DSE Equities (w/ Divs & Capital Gain)</th>
                <th className="py-3 px-4">UTT Liquid Fund (Compounded 13.5%)</th>
                <th className="py-3 px-4">Emergency Cash Buffer</th>
                <th className="py-3 px-4 font-bold text-[#1A1918]">Total Net Worth Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono-num">
              {[
                { months: 6, label: '6 Months' },
                { months: 12, label: '1 Year' },
                { months: 24, label: '2 Years' },
                { months: 36, label: '3 Years' },
                { months: 60, label: '5 Years' },
              ].map((h) => {
                const totalContrib = salarySavingsCalc.totalAllocatedSavings * h.months;
                const dseMonthly = salary.monthlyAllocatedToDSE;
                const uttMonthly = salary.monthlyAllocatedToUTT;
                const emergMonthly = salary.monthlyAllocatedToEmergency;

                const rDSE = 0.1 / 12;
                const rUTT = 0.135 / 12;

                const dseVal =
                  dseMonthly > 0 ? dseMonthly * ((Math.pow(1 + rDSE, h.months) - 1) / rDSE) : 0;
                const uttVal =
                  uttMonthly > 0 ? uttMonthly * ((Math.pow(1 + rUTT, h.months) - 1) / rUTT) : 0;
                const emergVal = emergMonthly * h.months;
                const totalVal = dseVal + uttVal + emergVal;

                return (
                  <tr key={h.months} className="hover:bg-stone-50/50">
                    <td className="py-3 px-4 font-sans font-bold text-stone-900">{h.label}</td>
                    <td className="py-3 px-4 text-stone-600">{formatTZS(totalContrib)}</td>
                    <td className="py-3 px-4 text-emerald-800 font-semibold">{formatTZS(Math.round(dseVal))}</td>
                    <td className="py-3 px-4 text-indigo-800 font-semibold">{formatTZS(Math.round(uttVal))}</td>
                    <td className="py-3 px-4 text-teal-800">{formatTZS(emergVal)}</td>
                    <td className="py-3 px-4 font-bold text-stone-900 text-sm">
                      {formatTZS(Math.round(totalVal))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
