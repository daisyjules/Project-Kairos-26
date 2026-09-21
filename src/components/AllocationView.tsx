import React, { useState } from 'react';
import { useKairos } from '../context/KairosContext';
import { CurrencyInput } from './CurrencyInput';
import { StatCard } from './StatCard';
import { WarningBanner } from './WarningBanner';
import { formatTZS, formatPercent } from '../utils/formatters';
import {
  PieChart,
  Shield,
  Briefcase,
  Car,
  Laptop,
  AlertTriangle,
  Plus,
  Trash2,
  TrendingUp,
  Shirt,
  Palmtree,
  Egg,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { ResponsiveContainer, PieChart as RePie, Pie, Cell, Tooltip } from 'recharts';

export const AllocationView: React.FC = () => {
  const { state, setActiveTab, updateAllocations, masterCalc, carCalc } = useKairos();
  const [newCustomName, setNewCustomName] = useState('');
  const [newCustomAmount, setNewCustomAmount] = useState(500000);
  const [newCustomIsProductive, setNewCustomIsProductive] = useState(true);

  const allocations = state.allocations;

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomName.trim()) return;
    const currentCustoms = allocations.customAllocations || [];
    const newItem = {
      id: `custom_${Date.now()}`,
      name: newCustomName.trim(),
      amount: newCustomAmount,
      isProductive: newCustomIsProductive,
    };
    updateAllocations({
      customAllocations: [...currentCustoms, newItem],
    });
    setNewCustomName('');
    setNewCustomAmount(500000);
  };

  const handleRemoveCustom = (id: string) => {
    const currentCustoms = allocations.customAllocations || [];
    updateAllocations({
      customAllocations: currentCustoms.filter((c) => c.id !== id),
    });
  };

  const pieData = [
    { name: 'UTT / Investments', value: allocations.utt, color: '#2D4A3E' },
    { name: 'Klin Fitz Laundry', value: allocations.klinFitz, color: '#4E7764' },
    { name: 'Zanzibar Airbnb JV', value: allocations.zanzibarAirbnb, color: '#7E9F8E' },
    { name: 'Mom’s Poultry', value: allocations.momsPoultry, color: '#C28458' },
    { name: 'Car (Transport)', value: allocations.car, color: '#C25E3E' },
    { name: 'Productivity Laptop', value: allocations.laptop, color: '#8C7A6B' },
    ...(allocations.customAllocations || []).map((c, i) => ({
      name: c.name,
      value: c.amount,
      color: '#A0826C',
    })),
    {
      name: 'Cash / Loan Reserve',
      value: Math.max(0, masterCalc.remainingReserve),
      color: masterCalc.remainingReserve < 1000000 ? '#F59E0B' : '#3B82F6',
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
            onClick={() => setActiveTab('klinfitz')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A2F] dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <span>Explore Engines</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Header Info */}
      <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A2F] dark:text-emerald-400">
              30M Capital Engine
            </span>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              Loan Capital Allocation & Reserve Planning
            </h1>
            <p className="mt-2 text-sm font-serif-body text-stone-600 dark:text-stone-300 max-w-2xl">
              Distribute total borrowed capital across high-conviction cash engines, long-term wealth, and productive tools.
              Every shilling deployed reduces the safety cushion.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <span className="text-xs font-semibold text-stone-500 uppercase">Available Capital Base</span>
            <div className="mt-1 flex items-center gap-2">
              <CurrencyInput
                label=""
                value={allocations.startingCapital}
                onChange={(val) => updateAllocations({ startingCapital: val })}
                step={1000000}
                helperText="Editable loan principal base"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Critical Over-allocation Alert */}
      {masterCalc.isOverAllocated && (
        <WarningBanner
          type="danger"
          title="CRITICAL: Capital Allocation Exceeds Starting Capital"
          message={`Allocations total ${formatTZS(masterCalc.totalAllocated)}, which is ${formatTZS(
            masterCalc.totalAllocated - masterCalc.startingCapital
          )} over your available loan of ${formatTZS(masterCalc.startingCapital)}. You cannot spend money you don't have.`}
        />
      )}

      {/* Hard Cap Alerts */}
      {carCalc.isOverBudget && (
        <WarningBanner
          type="warning"
          title="Car Purchase Price Exceeds Hard Cap of TZS 10,000,000"
          message={`The car allocation is currently ${formatTZS(
            allocations.car
          )}. The hard cap is TZS 10M maximum. The car is a depreciating utility asset, not an investment engine.`}
        />
      )}

      {state.laptop.purchasePrice > 1000000 && (
        <WarningBanner
          type="warning"
          title="Laptop Budget Exceeds Hard Cap of TZS 1,000,000"
          message={`The laptop is currently allocated at ${formatTZS(
            allocations.laptop
          )}. Max budget cap is TZS 1,000,000. Classify as productivity tool, not luxury.`}
        />
      )}

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Allocated"
          value={formatTZS(masterCalc.totalAllocated)}
          subValue={`Target: ${formatTZS(masterCalc.startingCapital)}`}
          badge={{
            text: masterCalc.isOverAllocated ? 'EXCEEDED' : `${formatPercent(100 - masterCalc.reservePct, 1)} Deployed`,
            variant: masterCalc.isOverAllocated ? 'danger' : 'neutral',
          }}
          icon={<PieChart className="h-4 w-4" />}
        />

        <StatCard
          label="Total Remaining Reserve"
          value={formatTZS(masterCalc.remainingReserve)}
          subValue={`${formatPercent(masterCalc.reservePct)} of starting capital`}
          badge={{
            text: masterCalc.remainingReserve < 1000000 ? 'Low Cushion' : 'Safe Cushion',
            variant: masterCalc.remainingReserve < 1000000 ? 'warning' : 'success',
          }}
          icon={<Shield className="h-4 w-4" />}
          highlight={!masterCalc.isOverAllocated && masterCalc.remainingReserve >= 1000000}
        />

        <StatCard
          label="Productive Assets %"
          value={formatPercent(masterCalc.productivePct)}
          subValue={`${formatTZS(masterCalc.productiveCapital)} (UTT, Laundry, Airbnb, Poultry, Laptop)`}
          badge={{ text: 'Productive Engine', variant: 'success' }}
          icon={<Briefcase className="h-4 w-4" />}
        />

        <StatCard
          label="Lifestyle / Transport %"
          value={formatPercent(masterCalc.lifestylePct)}
          subValue={`${formatTZS(masterCalc.lifestyleProductivityCapital)} (Vehicle allocation)`}
          badge={{
            text: allocations.car > 10000000 ? 'Over 10M Cap' : 'Under Cap',
            variant: allocations.car > 10000000 ? 'danger' : 'neutral',
          }}
          icon={<Car className="h-4 w-4" />}
        />
      </div>

      {/* Main Allocator Grid & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Interactive Category Allocators */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              Core Capital Allocations
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-6">
              Adjust any project's initial deployment. Values automatically sync across all dedicated business models.
            </p>

            <div className="space-y-5">
              {/* 1. UTT */}
              <div className="rounded-xl border border-stone-200/80 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-800/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2D4A3E] text-white text-xs font-bold">
                      1
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        UTT / Investments
                      </h4>
                      <span className="text-[11px] text-stone-500 font-serif-body">
                        Wealth preservation, liquid buffer & bond compounding
                      </span>
                    </div>
                  </div>
                  <span className="font-mono-num text-xs font-bold text-[#2D4A3E] dark:text-emerald-400">
                    {formatPercent((allocations.utt / masterCalc.startingCapital) * 100, 1)}
                  </span>
                </div>
                <CurrencyInput
                  label="Allocated Capital"
                  value={allocations.utt}
                  onChange={(val) => updateAllocations({ utt: val })}
                  step={500000}
                  slider
                  max={20000000}
                  helperText="Initial recommendation: TZS 10,000,000"
                />
              </div>

              {/* 2. Klin Fitz */}
              <div className="rounded-xl border border-stone-200/80 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-800/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#4E7764] text-white text-xs font-bold">
                      2
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        Klin Fitz Laundry
                      </h4>
                      <span className="text-[11px] text-stone-500 font-serif-body">
                        Mother-operated cash engine • Primary loan coverage business
                      </span>
                    </div>
                  </div>
                  <span className="font-mono-num text-xs font-bold text-[#4E7764] dark:text-emerald-400">
                    {formatPercent((allocations.klinFitz / masterCalc.startingCapital) * 100, 1)}
                  </span>
                </div>
                <CurrencyInput
                  label="Allocated Capital"
                  value={allocations.klinFitz}
                  onChange={(val) => updateAllocations({ klinFitz: val })}
                  step={250000}
                  slider
                  max={12000000}
                  helperText="Initial recommendation: TZS 5,000,000"
                />
              </div>

              {/* 3. Zanzibar Airbnb JV */}
              <div className="rounded-xl border border-stone-200/80 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-800/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#7E9F8E] text-white text-xs font-bold">
                      3
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        Zanzibar Airbnb (Joint Venture with Alice)
                      </h4>
                      <span className="text-[11px] text-stone-500 font-serif-body">
                        User contribution only (Not entire property cost)
                      </span>
                    </div>
                  </div>
                  <span className="font-mono-num text-xs font-bold text-[#7E9F8E] dark:text-emerald-400">
                    {formatPercent((allocations.zanzibarAirbnb / masterCalc.startingCapital) * 100, 1)}
                  </span>
                </div>
                <CurrencyInput
                  label="User Contribution"
                  value={allocations.zanzibarAirbnb}
                  onChange={(val) => updateAllocations({ zanzibarAirbnb: val })}
                  step={250000}
                  slider
                  max={10000000}
                  helperText="Initial recommendation: TZS 3,000,000"
                />
              </div>

              {/* 4. Mom's Poultry Pilot */}
              <div className="rounded-xl border border-stone-200/80 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-800/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#C28458] text-white text-xs font-bold">
                      4
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        Mom’s Poultry (Small Pilot)
                      </h4>
                      <span className="text-[11px] text-stone-500 font-serif-body">
                        Start small (200 chicks) • Pilot → Measure → Scale
                      </span>
                    </div>
                  </div>
                  <span className="font-mono-num text-xs font-bold text-[#C28458] dark:text-amber-400">
                    {formatPercent((allocations.momsPoultry / masterCalc.startingCapital) * 100, 1)}
                  </span>
                </div>
                <CurrencyInput
                  label="Pilot Startup Capital"
                  value={allocations.momsPoultry}
                  onChange={(val) => updateAllocations({ momsPoultry: val })}
                  step={100000}
                  slider
                  max={5000000}
                  helperText="Initial recommendation: TZS 1,500,000"
                />
              </div>

              {/* 5. Car */}
              <div className="rounded-xl border border-stone-200/80 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-800/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#C25E3E] text-white text-xs font-bold">
                      5
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        Car (Transport & Logistics)
                      </h4>
                      <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold font-serif-body">
                        HARD MAXIMUM PURCHASE PRICE: TZS 10,000,000
                      </span>
                    </div>
                  </div>
                  <span className="font-mono-num text-xs font-bold text-[#C25E3E]">
                    {formatPercent((allocations.car / masterCalc.startingCapital) * 100, 1)}
                  </span>
                </div>
                <CurrencyInput
                  label="Car Purchase Price"
                  value={allocations.car}
                  onChange={(val) => updateAllocations({ car: val })}
                  step={250000}
                  slider
                  max={12000000}
                  warningIfAbove={10000000}
                  warningMessage="Exceeds 10M hard ceiling!"
                  helperText="Initial recommendation: ≤ TZS 8.5M–10M max"
                />
              </div>

              {/* 6. Laptop */}
              <div className="rounded-xl border border-stone-200/80 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-800/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#8C7A6B] text-white text-xs font-bold">
                      6
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        Productivity Laptop
                      </h4>
                      <span className="text-[11px] text-stone-500 font-serif-body">
                        HARD MAXIMUM BUDGET: TZS 1,000,000 (Productivity tool)
                      </span>
                    </div>
                  </div>
                  <span className="font-mono-num text-xs font-bold text-[#8C7A6B]">
                    {formatPercent((allocations.laptop / masterCalc.startingCapital) * 100, 1)}
                  </span>
                </div>
                <CurrencyInput
                  label="Laptop Purchase Price"
                  value={allocations.laptop}
                  onChange={(val) => updateAllocations({ laptop: val })}
                  step={50000}
                  slider
                  max={2000000}
                  warningIfAbove={1000000}
                  warningMessage="Exceeds 1M hard ceiling!"
                  helperText="Initial recommendation: TZS 950,000–1,000,000"
                />
              </div>

              {/* Custom Allocations if any */}
              {(allocations.customAllocations || []).map((custom) => (
                <div
                  key={custom.id}
                  className="rounded-xl border border-stone-200 p-4 bg-stone-50/70 dark:border-stone-800 dark:bg-stone-800/40 flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {custom.name}
                      </span>
                      <span className="rounded bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 text-[9px] font-semibold text-stone-700 dark:text-stone-300">
                        {custom.isProductive ? 'Productive' : 'Lifestyle'}
                      </span>
                    </div>
                    <div className="mt-1 font-mono-num text-sm font-bold text-stone-800 dark:text-stone-200">
                      {formatTZS(custom.amount)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustom(custom.id)}
                    className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1"
                    title="Remove custom allocation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {/* Add Custom Item Form */}
              <form
                onSubmit={handleAddCustom}
                className="rounded-xl border border-dashed border-stone-300 dark:border-stone-700 p-4 space-y-3"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  <Plus className="h-3.5 w-3.5" />
                  Add Custom Allocation Item
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="e.g. Legal & Registration Reserve"
                    value={newCustomName}
                    onChange={(e) => setNewCustomName(e.target.value)}
                    className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:outline-hidden"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Amount in TZS"
                      value={newCustomAmount}
                      onChange={(e) => setNewCustomAmount(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 font-mono-num text-xs text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      disabled={!newCustomName.trim()}
                      className="shrink-0 rounded-lg bg-[#2D4A3E] px-3 py-2 text-xs font-semibold text-white hover:bg-[#3D6352] disabled:opacity-50 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Visual Allocation Donut & Analysis */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              Capital Distribution Chart
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Real-time balance between productive engines, transport, and reserve.
            </p>

            <div className="h-64 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RePie>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatTZS(Number(val)), '']}
                    contentStyle={{
                      backgroundColor: state.theme === 'dark' ? '#1C1917' : '#FFFFFF',
                      borderColor: '#78716C',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </RePie>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] uppercase font-bold text-stone-400">Reserve</span>
                <span className="font-mono-num text-sm font-bold text-stone-900 dark:text-stone-100">
                  {formatTZS(masterCalc.remainingReserve, true)}
                </span>
                <span className="text-[10px] text-stone-500 font-mono-num">
                  {formatPercent(masterCalc.reservePct, 0)}
                </span>
              </div>
            </div>

            {/* Allocation Strategy Summary */}
            <div className="mt-4 space-y-2 border-t border-stone-100 dark:border-stone-800 pt-4 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-stone-600 dark:text-stone-400">Productive Capital:</span>
                <span className="font-mono-num font-bold text-emerald-600 dark:text-emerald-400">
                  {formatTZS(masterCalc.productiveCapital)} ({formatPercent(masterCalc.productivePct, 1)})
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-600 dark:text-stone-400">Car & Transport:</span>
                <span className="font-mono-num font-bold text-amber-600 dark:text-amber-400">
                  {formatTZS(masterCalc.lifestyleProductivityCapital)} ({formatPercent(masterCalc.lifestylePct, 1)})
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-600 dark:text-stone-400">Cash / Debt Buffer:</span>
                <span className="font-mono-num font-bold text-sky-600 dark:text-sky-400">
                  {formatTZS(masterCalc.remainingReserve)} ({formatPercent(masterCalc.reservePct, 1)})
                </span>
              </div>
            </div>
          </div>

          {/* Hard Guardrails Reminder */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-800/40 p-5">
            <h4 className="font-editorial text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">
              Foundational Capital Guardrails
            </h4>
            <ul className="space-y-2 text-xs font-serif-body text-stone-600 dark:text-stone-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2D4A3E] dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Car purchase is capped at TZS 10M</strong>: The car provides utility for delivery and suppliers, but depreciates. It is not an asset that generates revenue directly.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2D4A3E] dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Laptop is capped at TZS 1M</strong>: Essential tool for founder operations and guest dispatch, but kept functional and economical.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2D4A3E] dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Never deplete the cash reserve to zero</strong>: Keep at least TZS 1,000,000–1,500,000 liquid for initial working capital and early loan buffer.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
