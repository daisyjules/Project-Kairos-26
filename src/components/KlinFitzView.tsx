import React from 'react';
import { useKairos } from '../context/KairosContext';
import { CurrencyInput } from './CurrencyInput';
import { StatCard } from './StatCard';
import { WarningBanner } from './WarningBanner';
import { formatTZS, formatPercent, formatRatio } from '../utils/formatters';
import {
  Shirt,
  TrendingUp,
  Target,
  Clock,
  Sparkles,
  Building2,
  CheckCircle2,
  Sliders,
  DollarSign,
  ArrowLeft,
  ArrowRight,
  Shield,
  Layers,
  Heart,
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
import laundryImg from '../assets/images/clean_laundry_1787307764343.jpg';
import { PinnedCorkboard } from './PinnedCorkboard';
import { CommentsSection } from './CommentsSection';

export const KlinFitzView: React.FC = () => {
  const { state, setActiveTab, updateKlinFitz, applyKlinFitzScenario, klinFitzCalc } = useKairos();
  const kf = state.klinFitz;

  // Scenario sensitivity comparison data
  const scenarioData = [
    {
      name: 'Conservative (8/d)',
      orders: 8 * kf.operatingDaysPerMonth,
      revenue: 8 * kf.operatingDaysPerMonth * 10000,
      profit: 8 * kf.operatingDaysPerMonth * (10000 - 3800) - klinFitzCalc.totalFixedCosts,
    },
    {
      name: 'Base Target (15/d)',
      orders: 15 * kf.operatingDaysPerMonth,
      revenue: 15 * kf.operatingDaysPerMonth * 12000,
      profit: 15 * kf.operatingDaysPerMonth * (12000 - 3500) - klinFitzCalc.totalFixedCosts,
    },
    {
      name: 'Optimistic (25/d)',
      orders: 25 * kf.operatingDaysPerMonth,
      revenue: 25 * kf.operatingDaysPerMonth * 14000,
      profit: 25 * kf.operatingDaysPerMonth * (14000 - 3200) - klinFitzCalc.totalFixedCosts,
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
          <span>Back to Overview</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('diary')}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/70 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 hover:bg-amber-200 transition-colors cursor-pointer"
          >
            <span>Read Laundry Diary Notes</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('zanzibar')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A2F] dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <span>Next: Zanzibar Airbnb</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Warm Header Banner with Image */}
      <div className="rounded-3xl border border-stone-200/90 bg-white overflow-hidden dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/70 text-[#1E3A2F] dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1 text-xs font-semibold mb-2">
                <Shirt className="h-3.5 w-3.5" />
                <span>Chapter 1 • Family Venture with Mom</span>
              </div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                Klin Fitz Laundry Atelier
              </h1>
              <p className="mt-1 font-serif-body text-sm text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
                Our core recurring cash flow generator. Fresh linens, daily community drop-offs, and commercial guest house partnerships.
              </p>
            </div>

            {/* Quick Scenario Selector */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 dark:border-stone-800 pt-4">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Scenario:
                </span>
                <div className="flex items-center gap-1 rounded-xl border border-stone-200 bg-stone-50 p-1 dark:border-stone-800 dark:bg-stone-800">
                  {(['conservative', 'base', 'optimistic'] as const).map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => applyKlinFitzScenario(sc)}
                      className={`rounded-lg px-3 py-1 text-xs font-bold capitalize transition-all cursor-pointer ${
                        kf.activeScenario === sc
                          ? 'bg-[#1E3A2F] text-white shadow-xs dark:bg-emerald-800'
                          : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                      }`}
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs font-mono-num font-bold text-emerald-700 dark:text-emerald-400">
                Net: +{formatTZS(klinFitzCalc.monthlyOperatingProfit)}/mo
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 relative min-h-[180px] lg:min-h-full">
            <img
              src={laundryImg}
              alt="Crisp clean towels and laundry room"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-b-3xl lg:rounded-b-none lg:rounded-r-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-3 left-4 text-white font-handwriting text-base font-semibold drop-shadow-md lg:hidden">
              🧺 Fresh scents & daily service
            </div>
          </div>
        </div>
      </div>

      {/* Target Debt Coverage Goal Banner */}
      <div className="rounded-2xl border border-stone-200/80 bg-[#1E3A2F]/5 dark:border-stone-800 dark:bg-[#1E3A2F]/15 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E3A2F] text-white">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#1E3A2F] dark:text-emerald-400">
                Debt Service Coverage Threshold
              </div>
              <p className="text-xs font-serif-body text-stone-600 dark:text-stone-300">
                To fully cover the bank debt of <strong>{formatTZS(state.loan.monthlyRepayment)}/mo</strong> alone, Klin Fitz needs:
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Required Orders</span>
              <div className="font-mono-num text-base font-bold text-stone-900 dark:text-stone-100">
                {klinFitzCalc.ordersRequiredForFullLoanCoverage} orders/day
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Break-Even (Costs Only)</span>
              <div className="font-mono-num text-base font-bold text-emerald-700 dark:text-emerald-400">
                {klinFitzCalc.breakEvenOrdersPerDay} orders/day
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Output Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Monthly Gross Revenue"
          value={formatTZS(klinFitzCalc.totalMonthlyRevenue)}
          subValue={`${kf.ordersPerDay} orders/day × ${kf.operatingDaysPerMonth} days @ ${formatTZS(kf.avgRevenuePerOrder)}`}
          badge={{ text: 'Gross Inflow', variant: 'info' }}
          icon={<DollarSign className="h-4 w-4" />}
        />

        <StatCard
          label="Monthly Operating Profit"
          value={formatTZS(klinFitzCalc.monthlyOperatingProfit)}
          subValue={`Net margin: ${formatPercent(klinFitzCalc.operatingMarginPct, 1)}`}
          badge={{
            text: klinFitzCalc.monthlyOperatingProfit > 0 ? 'Operating Profit' : 'Deficit',
            variant: klinFitzCalc.monthlyOperatingProfit > 0 ? 'success' : 'danger',
          }}
          icon={<TrendingUp className="h-4 w-4" />}
          highlight={klinFitzCalc.monthlyOperatingProfit > 0}
        />

        <StatCard
          label="Annual Cash-on-Cash Return"
          value={formatPercent(state.klinFitz.initialCapital > 0 ? (klinFitzCalc.annualOperatingProfit / state.klinFitz.initialCapital) * 100 : 0, 1)}
          subValue={`Annual profit: ${formatTZS(klinFitzCalc.annualOperatingProfit)}`}
          badge={{ text: 'Capital Efficiency', variant: 'success' }}
          icon={<Sparkles className="h-4 w-4" />}
        />

        <StatCard
          label="Debt Coverage Ratio (Stand-alone)"
          value={formatRatio(klinFitzCalc.debtCoverageRatio)}
          subValue={`Covers ${formatPercent(klinFitzCalc.debtCoverageRatio * 100, 0)} of monthly loan`}
          badge={{
            text: klinFitzCalc.debtCoverageRatio >= 1.0 ? 'Self-Covering' : 'Partial Cover',
            variant: klinFitzCalc.debtCoverageRatio >= 1.0 ? 'success' : 'warning',
          }}
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      {/* DUAL COLUMN: INPUTS & UNIT ECONOMICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Initial Setup Capital */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-6 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              1. Initial Capital Deployment (5M Budget)
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Equipping the physical shop, plumbing, initial detergents stock, and working reserve.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CurrencyInput
                label="Total Initial Capital Allocation"
                value={kf.initialCapital}
                onChange={(val) => updateKlinFitz({ initialCapital: val })}
                helperText="Capital budgeted from loan (Target: 5,000,000)"
              />
              <CurrencyInput
                label="Washing & Drying Equipment"
                value={kf.equipmentCost}
                onChange={(val) => updateKlinFitz({ equipmentCost: val })}
                helperText="Commercial/semi-commercial washers, iron, steamer"
              />
              <CurrencyInput
                label="Shop Rent & Advance Deposit"
                value={kf.rentDeposit}
                onChange={(val) => updateKlinFitz({ rentDeposit: val })}
                helperText="First 3–6 months rent or security deposit"
              />
              <CurrencyInput
                label="Water Tank, Pump & Plumbing"
                value={kf.waterPlumbing}
                onChange={(val) => updateKlinFitz({ waterPlumbing: val })}
                helperText="Backup tank, pipe connections, drainage"
              />
              <CurrencyInput
                label="Initial Bulk Detergents & Softener"
                value={kf.detergentsInitial}
                onChange={(val) => updateKlinFitz({ detergentsInitial: val })}
                helperText="Opening chemical stock"
              />
              <CurrencyInput
                label="Packaging & Branded Hangers"
                value={kf.packagingInitial}
                onChange={(val) => updateKlinFitz({ packagingInitial: val })}
                helperText="Garment bags, labels, tags"
              />
              <CurrencyInput
                label="Branding, Board & Signage"
                value={kf.brandingSignage}
                onChange={(val) => updateKlinFitz({ brandingSignage: val })}
                helperText="Storefront road signage and flyers"
              />
              <CurrencyInput
                label="Working Capital Float"
                value={kf.workingCapital}
                onChange={(val) => updateKlinFitz({ workingCapital: val })}
                helperText="Cash float for month 1 operational ramp"
              />
            </div>

            {/* Total Budget Check */}
            <div className="mt-4 flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 text-xs">
              <span className="font-semibold text-stone-700 dark:text-stone-300">Sum of Setup Line Items:</span>
              <span className="font-mono-num font-bold text-stone-900 dark:text-stone-100">
                {formatTZS(
                  kf.equipmentCost +
                    kf.rentDeposit +
                    kf.waterPlumbing +
                    kf.detergentsInitial +
                    kf.packagingInitial +
                    kf.brandingSignage +
                    kf.workingCapital
                )}
              </span>
            </div>
          </div>

          {/* Section 2: Operating Throughput & Unit Costs */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-6 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              2. Operational Throughput & Unit Pricing
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Calibrate daily load volume, ticket size, and variable chemical/packaging cost per bag.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Orders Processed Per Day: <span className="font-mono-num font-bold text-[#1E3A2F] dark:text-emerald-400">{kf.ordersPerDay}</span>
                </label>
                <input
                  type="range"
                  min={3}
                  max={45}
                  step={1}
                  value={kf.ordersPerDay}
                  onChange={(e) => updateKlinFitz({ ordersPerDay: parseInt(e.target.value) })}
                  className="w-full accent-[#1E3A2F] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>3 orders/day</span>
                  <span>15 (Base)</span>
                  <span>45 orders/day</span>
                </div>
              </div>

              <CurrencyInput
                label="Average Revenue Per Order"
                value={kf.avgRevenuePerOrder}
                onChange={(val) => updateKlinFitz({ avgRevenuePerOrder: val })}
                helperText="Avg ticket (wash, dry, fold bundle)"
              />

              <CurrencyInput
                label="Variable Cost Per Order"
                value={kf.variableCostPerOrder}
                onChange={(val) => updateKlinFitz({ variableCostPerOrder: val })}
                helperText="Detergent, softener, packaging bag per order"
              />

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Operating Days Per Month: <span className="font-mono-num font-bold text-stone-900 dark:text-stone-100">{kf.operatingDaysPerMonth} days</span>
                </label>
                <input
                  type="range"
                  min={20}
                  max={30}
                  step={1}
                  value={kf.operatingDaysPerMonth}
                  onChange={(e) => updateKlinFitz({ operatingDaysPerMonth: parseInt(e.target.value) })}
                  className="w-full accent-[#1E3A2F] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>20 days (Mon-Fri)</span>
                  <span>26 days (Mon-Sat)</span>
                  <span>30 days (Full)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Monthly Fixed Operating Costs */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-6 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              3. Monthly Fixed Overhead Costs
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Regular monthly commitments regardless of volume.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CurrencyInput
                label="Staff / Assistant Wage"
                value={kf.staffCost}
                onChange={(val) => updateKlinFitz({ staffCost: val })}
                helperText="Shop attendant or helper allowance"
              />
              <CurrencyInput
                label="Electricity & Water Utilities"
                value={kf.utilitiesCost}
                onChange={(val) => updateKlinFitz({ utilitiesCost: val })}
                helperText="Monthly power tokens & metered water"
              />
              <CurrencyInput
                label="Transport / Logistics Allowance"
                value={kf.transportPickupCost}
                onChange={(val) => updateKlinFitz({ transportPickupCost: val })}
                helperText="Boda delivery or vehicle fuel allocation"
              />
              <CurrencyInput
                label="Other Fixed Shop Overhead"
                value={kf.otherFixedCosts}
                onChange={(val) => updateKlinFitz({ otherFixedCosts: val })}
                helperText="Cleaning supplies, maintenance, council fees"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Scenario Stress Testing & Unit Economics Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Unit Economics Card */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-6 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-4">
              Per-Order Unit Margin
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-600 dark:text-stone-400">Average Revenue / Order:</span>
                <span className="font-mono-num font-bold text-stone-900 dark:text-stone-100">
                  {formatTZS(kf.avgRevenuePerOrder)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-600 dark:text-stone-400">Variable Direct Cost:</span>
                <span className="font-mono-num text-rose-600 dark:text-rose-400">
                  -{formatTZS(kf.variableCostPerOrder)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 bg-stone-50 dark:bg-stone-800/60 px-3 rounded-xl">
                <span className="font-bold text-stone-800 dark:text-stone-200">Contribution Margin / Order:</span>
                <span className="font-mono-num font-bold text-emerald-700 dark:text-emerald-400">
                  {formatTZS(klinFitzCalc.contributionMarginPerOrder)} ({formatPercent(klinFitzCalc.contributionMarginPct, 1)})
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-600 dark:text-stone-400">Total Fixed Monthly Overhead:</span>
                <span className="font-mono-num text-stone-900 dark:text-stone-100">
                  {formatTZS(klinFitzCalc.totalFixedCosts)}/mo
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-600 dark:text-stone-400">Break-Even Order Requirement:</span>
                <span className="font-mono-num font-bold text-stone-900 dark:text-stone-100">
                  {klinFitzCalc.breakEvenOrdersPerDay} orders/day ({klinFitzCalc.breakEvenOrdersPerMonth} /mo)
                </span>
              </div>
            </div>
          </div>

          {/* Scenario Sensitivity Chart */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-6 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              Volume Sensitivity Scenarios
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Comparing Conservative, Base, and Optimistic monthly net profit.
            </p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scenarioData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                  <Tooltip
                    formatter={(val: any) => [formatTZS(Number(val)), '']}
                    contentStyle={{
                      backgroundColor: state.theme === 'dark' ? '#1C1917' : '#FFFFFF',
                      borderColor: '#78716C',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="profit" name="Monthly Profit" fill="#1E3A2F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Notes for Klin Fitz */}
      <PinnedCorkboard
        filterTarget="klinfitz"
        title="Pinned Laundry Rules & Notes"
      />

      {/* Comments for Klin Fitz */}
      <CommentsSection
        targetId="klinfitz"
        title="Klin Fitz Operational Comments & Feedback"
        subtitle="Mom's laundry feedback, equipment maintenance notes, and staff check-ins."
      />
    </div>
  );
};
