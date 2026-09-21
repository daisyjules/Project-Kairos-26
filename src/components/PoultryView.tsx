import React, { useState } from 'react';
import { useKairos } from '../context/KairosContext';
import { CurrencyInput } from './CurrencyInput';
import { StatCard } from './StatCard';
import { formatTZS, formatPercent, formatNumber } from '../utils/formatters';
import {
  Egg,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Clock,
  HeartHandshake,
  CheckCircle2,
  DollarSign,
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
import poultryImg from '../assets/images/poultry_farm_1787307776327.jpg';
import { PinnedCorkboard } from './PinnedCorkboard';
import { CommentsSection } from './CommentsSection';

export const PoultryView: React.FC = () => {
  const { state, setActiveTab, updatePoultry, updatePoultryCycle, poultryCalc } = useKairos();
  const pt = state.poultry;
  const [selectedCycleTab, setSelectedCycleTab] = useState(0);

  // Multi-cycle cumulative data
  const cycleData = pt.cycles.map((c) => {
    const surviving = Math.max(0, Math.round(c.flockSize * (1 - c.mortalityRatePct / 100)));
    const directCost = c.flockSize * c.costPerChick + c.feedCost + c.medsCost;
    const revenue = surviving * c.sellingPricePerBird;
    const profit = revenue - directCost;
    const reinvestAmount = profit > 0 ? (profit * c.reinvestProfitPct) / 100 : 0;
    const cashOut = profit - reinvestAmount;
    return {
      cycleNumber: `Cycle ${c.cycleNumber}`,
      flock: c.flockSize,
      surviving,
      directCost,
      revenue,
      profit,
      reinvestAmount,
      cashOut,
    };
  });

  const activeCycle = pt.cycles[selectedCycleTab] || pt.cycles[0];

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
            <span>Read Poultry Diary Notes</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('utt')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A2F] dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <span>Next: UTT & Wealth</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Warm Header Banner with Poultry Photo */}
      <div className="rounded-3xl border border-stone-200/90 bg-white overflow-hidden dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 px-3 py-1 text-xs font-semibold mb-2">
                <Egg className="h-3.5 w-3.5" />
                <span>Chapter 3 • Mother’s Backyard Pilot</span>
              </div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                Mom’s Poultry Pilot: “Measure Before Scaling”
              </h1>
              <p className="mt-1 font-serif-body text-sm text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
                Initial pilot capital: <strong>{formatTZS(pt.initialCapital)}</strong>. Starting with 200 chicks, mastering mortality and feed efficiency, then reinvesting into successive batches.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-4">
              <div className="flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                <span className="font-handwriting text-base text-stone-700 dark:text-stone-300">
                  “Pole pole ndio mwendo — slow and steady is the way.”
                </span>
              </div>
              <div className="text-xs font-mono-num font-bold text-amber-800 dark:text-amber-300">
                Surplus: +{formatTZS(poultryCalc.recurringBatchProfit)}/batch
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 relative min-h-[180px] lg:min-h-full">
            <img
              src={poultryImg}
              alt="Chickens and hens in green pastoral setting"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-b-3xl lg:rounded-b-none lg:rounded-r-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-3 left-4 text-white font-handwriting text-base font-semibold drop-shadow-md lg:hidden">
              🐣 200 chicks & healthy feed
            </div>
          </div>
        </div>
      </div>

      {/* 4 Output Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pilot Batch Net Profit"
          value={formatTZS(poultryCalc.recurringBatchProfit)}
          subValue={`Revenue: ${formatTZS(poultryCalc.expectedSalesRevenue)} / batch`}
          badge={{
            text: poultryCalc.recurringBatchProfit > 0 ? 'Batch Surplus' : 'Deficit',
            variant: poultryCalc.recurringBatchProfit > 0 ? 'success' : 'danger',
          }}
          icon={<TrendingUp className="h-4 w-4" />}
          highlight={poultryCalc.recurringBatchProfit > 0}
        />

        <StatCard
          label="Surviving Birds / Flock"
          value={`${poultryCalc.survivingBirds} / ${pt.numChicks}`}
          subValue={`Mortality: ${pt.mortalityRatePct}% • ${pt.expectedSellingAgeWeeks} wks to market`}
          badge={{ text: 'Flock Yield', variant: 'neutral' }}
          icon={<Egg className="h-4 w-4" />}
        />

        <StatCard
          label="Cost vs Sale per Bird"
          value={`${formatTZS(poultryCalc.costPerSurvivingBird)} / bird`}
          subValue={`Sale price: ${formatTZS(pt.expectedSellingPrice)} (Profit: ${formatTZS(
            poultryCalc.profitPerBird
          )})`}
          badge={{ text: 'Unit Margin', variant: 'info' }}
          icon={<DollarSign className="h-4 w-4" />}
        />

        <StatCard
          label="Annualized Inflow"
          value={formatTZS(poultryCalc.annualizedProfit)}
          subValue={`Eq: ${formatTZS(poultryCalc.monthlyEquivalentProfit)}/mo across ${pt.cyclesPerYear} cycles/yr`}
          badge={{ text: 'Annual Run-rate', variant: 'neutral' }}
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      {/* DUAL COLUMN: PILOT ASSUMPTIONS & 4-CYCLE EXPANSION MODEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Pilot Inputs & Recurring Cost Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Pilot Infrastructure & Capital */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              1. Pilot Setup & Initial Infrastructure
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Fixed capital for pilot flock. Total startup: <strong>{formatTZS(pt.initialCapital)}</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CurrencyInput
                label="Pilot Coop / Housing Adaptation"
                value={pt.housingCoop}
                onChange={(v) => updatePoultry({ housingCoop: v })}
                step={25000}
                helperText="Coop mesh, shelter, lighting"
              />
              <CurrencyInput
                label="Feeders & Drinkers Equipment"
                value={pt.feedersDrinkers}
                onChange={(v) => updatePoultry({ feedersDrinkers: v })}
                step={10000}
                helperText="Bell drinkers & feeding trays"
              />
              <CurrencyInput
                label="Bedding Material (Wood Shavings)"
                value={pt.beddingCost}
                onChange={(v) => updatePoultry({ beddingCost: v })}
                step={5000}
                helperText="Dry litter bedding"
              />
              <CurrencyInput
                label="Chicks Transport & Logistics"
                value={pt.transportCost}
                onChange={(v) => updatePoultry({ transportCost: v })}
                step={5000}
                helperText="Hatchery delivery fee"
              />
            </div>
          </div>

          {/* Section 2: Unit Economics & Flock Parameters */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              2. Flock Size, Feed & Mortality
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Batch variables from day-old chick to maturity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CurrencyInput
                label="Number of Day-Old Chicks"
                value={pt.numChicks}
                onChange={(v) => updatePoultry({ numChicks: Math.max(10, Math.round(v)) })}
                step={25}
                isCurrency={false}
                unit="chicks"
                slider
                min={50}
                max={1000}
                helperText="Pilot batch size (default: 200)"
              />
              <CurrencyInput
                label="Cost per Day-Old Chick"
                value={pt.costPerChick}
                onChange={(v) => updatePoultry({ costPerChick: v })}
                step={100}
                helperText="Standard broiler / kuroiler chick"
              />
              <CurrencyInput
                label="Total Feed Cost (Starter/Grower/Finisher)"
                value={pt.feedCost}
                onChange={(v) => updatePoultry({ feedCost: v })}
                step={25000}
                helperText="Complete 8-week feed requirement"
              />
              <CurrencyInput
                label="Vaccination, Vitamins & Medicine"
                value={pt.vaccinationMedicine}
                onChange={(v) => updatePoultry({ vaccinationMedicine: v })}
                step={10000}
                helperText="Gumboro, Newcastle, anti-stress"
              />
              <CurrencyInput
                label="Estimated Mortality Rate %"
                value={pt.mortalityRatePct}
                onChange={(v) => updatePoultry({ mortalityRatePct: Math.min(50, Math.max(0, v)) })}
                step={1}
                isCurrency={false}
                unit="%"
                slider
                min={1}
                max={25}
                helperText="Industry standard: 4%–8%"
              />
              <CurrencyInput
                label="Expected Selling Price per Chicken"
                value={pt.expectedSellingPrice}
                onChange={(v) => updatePoultry({ expectedSellingPrice: v })}
                step={500}
                helperText="Market retail price at 8 weeks"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Cycle Expansion Simulator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100">
                  4-Cycle Compound Expansion
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body">
                  Reinvesting proven profits cycle-by-cycle to grow from 200 → 400+ birds.
                </p>
              </div>
              <RefreshCw className="h-4 w-4 text-[#C28458]" />
            </div>

            {/* Cycle Tabs */}
            <div className="flex items-center gap-1 border-b border-stone-100 dark:border-stone-800 pb-2 mb-4">
              {pt.cycles.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedCycleTab(idx)}
                  className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
                    selectedCycleTab === idx
                      ? 'bg-[#C28458] text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'
                  }`}
                >
                  Cycle {c.cycleNumber} ({c.flockSize}b)
                </button>
              ))}
            </div>

            {/* Active Cycle Editor */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded-lg">
                <span className="font-bold text-stone-700 dark:text-stone-300">
                  Flock Size Target:
                </span>
                <input
                  type="number"
                  value={activeCycle.flockSize}
                  onChange={(e) =>
                    updatePoultryCycle(selectedCycleTab, { flockSize: parseInt(e.target.value) || 100 })
                  }
                  className="w-24 rounded border border-stone-200 bg-white px-2 py-1 font-mono-num text-xs text-right dark:border-stone-700 dark:bg-stone-900"
                />
              </div>

              <div className="flex justify-between items-center bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded-lg">
                <span className="font-bold text-stone-700 dark:text-stone-300">
                  Feed & Inputs Budget:
                </span>
                <input
                  type="number"
                  value={activeCycle.feedCost}
                  onChange={(e) =>
                    updatePoultryCycle(selectedCycleTab, { feedCost: parseFloat(e.target.value) || 0 })
                  }
                  className="w-32 rounded border border-stone-200 bg-white px-2 py-1 font-mono-num text-xs text-right dark:border-stone-700 dark:bg-stone-900"
                />
              </div>

              <div className="flex justify-between items-center bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded-lg">
                <span className="font-bold text-stone-700 dark:text-stone-300">
                  Profit Reinvestment %:
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={activeCycle.reinvestProfitPct}
                    onChange={(e) =>
                      updatePoultryCycle(selectedCycleTab, { reinvestProfitPct: parseFloat(e.target.value) || 0 })
                    }
                    className="w-16 rounded border border-stone-200 bg-white px-2 py-1 font-mono-num text-xs text-right dark:border-stone-700 dark:bg-stone-900"
                  />
                  <span>%</span>
                </div>
              </div>
            </div>

            {/* Expansion Chart */}
            <div className="h-44 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cycleData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="cycleNumber" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 10 }} />
                  <Tooltip
                    formatter={(val: any) => [formatTZS(Number(val)), '']}
                    contentStyle={{
                      backgroundColor: state.theme === 'dark' ? '#1C1917' : '#FFFFFF',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="revenue" name="Sales Revenue" fill="#C28458" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="Net Profit" fill="#2D4A3E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Notes for Poultry */}
      <PinnedCorkboard
        filterTarget="poultry"
        title="Pinned Poultry Notes & Mom's Protocols"
      />

      {/* Comments for Poultry */}
      <CommentsSection
        targetId="poultry"
        title="Mom's Poultry Farm Comments & Flock Log"
        subtitle="Record feed prices, vaccination dates, and partner feedback from Mom."
      />
    </div>
  );
};
