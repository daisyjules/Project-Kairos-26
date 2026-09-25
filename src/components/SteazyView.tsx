import React, { useState } from 'react';
import {
  ArrowLeft,
  Tag,
  TrendingUp,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  Sliders,
  CheckCircle2,
  Clock,
  PieChart,
} from 'lucide-react';
import { useKairos } from '../context/KairosContext';
import steazyHeroImg from '../assets/images/steazy_fashion_studio_1790167296402.jpg';
import { StatCard } from './StatCard';
import { CurrencyInput } from './CurrencyInput';
import { formatTZS } from '../utils/formatters';
import { SteazyFutureProduct } from '../types';

export const SteazyView: React.FC = () => {
  const {
    state,
    setActiveTab,
    updateSteazy,
    addSteazyFutureProduct,
    updateSteazyFutureProduct,
    deleteSteazyFutureProduct,
    steazyCalc,
  } = useKairos();

  const steazy = state.steazy;

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductQuarter, setNewProductQuarter] = useState('Q4 2026');
  const [newProductRetail, setNewProductRetail] = useState(25000);
  const [newProductCost, setNewProductCost] = useState(9000);
  const [newProductNotes, setNewProductNotes] = useState('');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;
    addSteazyFutureProduct({
      name: newProductName.trim(),
      targetLaunchQuarter: newProductQuarter,
      targetSellingPrice: newProductRetail,
      targetUnitCost: newProductCost,
      status: 'Idea',
      notes: newProductNotes.trim() || 'Future capsule item.',
    });
    setNewProductName('');
    setNewProductNotes('');
    setIsAddingProduct(false);
  };

  return (
    <div className="space-y-8 pb-16 text-[#242220]">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A5752] transition-colors hover:text-[#2D4A3E]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Kairos Ecosystem
        </button>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-900">
            <Tag className="h-3.5 w-3.5 text-violet-600" />
            Fashion & Streetwear Engine
          </span>
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
            Live Calculations Active
          </span>
        </div>
      </div>

      {/* Hero Presentation */}
      <section className="overflow-hidden rounded-3xl border border-[#E5E0D8] bg-white shadow-xs">
        <div className="grid lg:grid-cols-12">
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-600"></span>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A7670]">
                  Apparel Node · Blueprint
                </p>
              </div>
              <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-[#1A1918]">
                Steazy
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#5A5752]">
                A minimalist contemporary fashion label. We currently engineer heavyweight essential
                t-shirts with uncompromising cut and fabric quality, scaling into canvas tote bags,
                structured caps, and minimalist footwear as brand equity matures.
              </p>
            </div>

            <div className="mt-6 border-t border-[#F0EBE1] pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[#8C8881] block">Current Focus</span>
                <strong className="text-[#242220] font-semibold">T-Shirts (Direct & Wholesale)</strong>
              </div>
              <div>
                <span className="text-[#8C8881] block">Next Phase</span>
                <strong className="text-[#242220] font-semibold">Totes, Caps, Footwear</strong>
              </div>
              <div>
                <span className="text-[#8C8881] block">Ecosystem Role</span>
                <strong className="text-[#2D4A3E] font-semibold">High Gross Margin Engine</strong>
              </div>
            </div>
          </div>

          <div className="relative min-h-64 lg:col-span-5 bg-stone-100">
            <img
              src={steazyHeroImg}
              alt="Steazy minimalist streetwear design studio and garment racks"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-5">
              <div className="text-white">
                <span className="text-xs font-medium tracking-wide uppercase bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md">
                  Studio Atelier & Sample Archive
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Performance Dashboard Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Steazy KPI Summary">
        <StatCard
          label="Net Profit Margin"
          value={`${(steazyCalc.netMarginPct ?? 0).toFixed(1)}%`}
          subValue={`Gross Margin: ${(steazyCalc.grossMarginPct ?? 0).toFixed(1)}%`}
          badge={{
            text: (steazyCalc.netMarginPct ?? 0) >= 35 ? 'High Margin' : 'Balanced',
            variant: (steazyCalc.netMarginPct ?? 0) >= 35 ? 'success' : 'info',
          }}
          icon={<PieChart className="h-4 w-4" />}
          highlight={(steazyCalc.netMarginPct ?? 0) >= 35}
        />
        <StatCard
          label="Monthly Net Profit"
          value={formatTZS(steazyCalc.monthlyNetProfit)}
          subValue={`Gross Profit: ${formatTZS(steazyCalc.monthlyGrossProfit)}`}
          badge={{
            text: steazyCalc.monthlyNetProfit > 0 ? 'Cash Positive' : 'Deficit',
            variant: steazyCalc.monthlyNetProfit > 0 ? 'success' : 'neutral',
          }}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Annual Run-Rate Profit"
          value={formatTZS(steazyCalc.annualNetProfit)}
          subValue={`Annual Rev: ${formatTZS(steazyCalc.annualRevenue)}`}
          badge={{ text: `${(steazyCalc.annualROI ?? 0).toFixed(0)}% ROI`, variant: 'info' }}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          label="Unit Economics / Tee"
          value={formatTZS(steazyCalc.unitGrossProfit)}
          subValue={`Cost ${formatTZS(steazyCalc.unitCost)} · Sell ${formatTZS(steazyCalc.weightedSellingPrice)}`}
          badge={{ text: `${(steazyCalc.unitMarginPct ?? 0).toFixed(0)}% Margin`, variant: 'neutral' }}
          icon={<Package className="h-4 w-4" />}
        />
      </section>

      {/* Production & Financial Model Calculator */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Interactive Inputs (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Card 1: Production Volume (Month & Year) */}
          <section className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-violet-600" />
                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#3B3835]">
                  1. Production Volume & Capacity
                </h2>
              </div>
              <span className="text-xs text-[#7A7670] font-medium">T-Shirts Focus</span>
            </div>

            <p className="mt-3 text-xs text-[#5A5752] leading-relaxed">
              Adjust monthly units produced. Yearly production and annual volume metrics calculate
              automatically.
            </p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#3B3835] mb-1">
                  Monthly T-Shirts Produced
                </label>
                <div className="relative rounded-lg border border-[#D5CFE5] bg-[#FAF8F5] focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600">
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={steazy.tshirtsProducedPerMonth}
                    onChange={(e) =>
                      updateSteazy({ tshirtsProducedPerMonth: Math.max(0, parseInt(e.target.value) || 0) })
                    }
                    className="w-full bg-transparent px-3 py-2.5 text-sm font-semibold text-[#1A1918] focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-[#7A7670]">tees / month</span>
                </div>
                <p className="mt-1 text-[11px] text-[#7A7670]">
                  Target drop run for current month
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B3835] mb-1">
                  Yearly T-Shirts Produced
                </label>
                <div className="rounded-lg border border-[#E5E0D8] bg-[#F4F1EA] px-3 py-2.5 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1A1918]">
                    {steazyCalc.tshirtsProducedPerYear.toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-[#5A5752]">tees / year</span>
                </div>
                <p className="mt-1 text-[11px] text-[#7A7670]">
                  12-month annualized production cadence
                </p>
              </div>
            </div>
          </section>

          {/* Card 2: Unit Cost Breakdown */}
          <section className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-violet-600" />
                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#3B3835]">
                  2. Unit Cost Breakdown (Per T-Shirt)
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#7A7670]">Total Unit Cost:</span>{' '}
                <strong className="text-xs font-bold text-[#1A1918]">
                  {formatTZS(steazyCalc.unitCost)}
                </strong>
              </div>
            </div>

            <p className="mt-3 text-xs text-[#5A5752] leading-relaxed">
              Define the physical manufacturing cost of each unit. As production expands, bulk blank orders
              reduce this cost.
            </p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CurrencyInput
                label="Heavyweight Blank"
                value={steazy.blankCostPerUnit}
                onChange={(val) => updateSteazy({ blankCostPerUnit: val })}
                step={500}
                helperText="100% combed cotton blank"
              />
              <CurrencyInput
                label="Screen Print / DTG"
                value={steazy.printingCostPerUnit}
                onChange={(val) => updateSteazy({ printingCostPerUnit: val })}
                step={250}
                helperText="Plastisol / puff ink screen"
              />
              <CurrencyInput
                label="Tags & Packaging"
                value={steazy.tagPackagingCostPerUnit}
                onChange={(val) => updateSteazy({ tagPackagingCostPerUnit: val })}
                step={250}
                helperText="Woven label & zip bag"
              />
            </div>
          </section>

          {/* Card 3: Pricing & Channel Mix */}
          <section className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-violet-600" />
                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#3B3835]">
                  3. Pricing & Channel Distribution
                </h2>
              </div>
              <span className="text-xs font-semibold text-violet-800 bg-violet-50 px-2 py-0.5 rounded">
                Avg Selling Price: {formatTZS(steazyCalc.weightedSellingPrice)}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CurrencyInput
                label="Direct Retail Price (D2C)"
                value={steazy.retailSellingPrice}
                onChange={(val) => updateSteazy({ retailSellingPrice: val })}
                step={1000}
                helperText="Website & pop-up sales"
              />
              <CurrencyInput
                label="Wholesale Price (Stockists)"
                value={steazy.wholesaleSellingPrice}
                onChange={(val) => updateSteazy({ wholesaleSellingPrice: val })}
                step={1000}
                helperText="Boutique & partner retail"
              />
            </div>

            {/* Retail vs Wholesale Slider */}
            <div className="mt-5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-[#3B3835] mb-2">
                <span>Direct Retail: {steazy.retailSalesPct}%</span>
                <span>Wholesale: {100 - steazy.retailSalesPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={steazy.retailSalesPct}
                onChange={(e) => updateSteazy({ retailSalesPct: parseInt(e.target.value) || 0 })}
                className="w-full accent-violet-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#7A7670] mt-1">
                <span>100% Wholesale</span>
                <span>Balanced 50/50</span>
                <span>100% Direct Retail</span>
              </div>
            </div>
          </section>

          {/* Card 4: Capital & Operating Expenses */}
          <section className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-violet-600" />
                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#3B3835]">
                  4. Capital & Monthly Operating Expenses
                </h2>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CurrencyInput
                label="Initial Capital Allocated"
                value={steazy.initialCapital}
                onChange={(val) => updateSteazy({ initialCapital: val })}
                step={100000}
                helperText="Total seed money for equipment, sample runs"
              />
              <CurrencyInput
                label="Monthly Operating Expenses"
                value={steazy.monthlyOperatingExpenses}
                onChange={(val) => updateSteazy({ monthlyOperatingExpenses: val })}
                step={25000}
                helperText="Studio, content creation, deliveries, ads"
              />
            </div>
          </section>
        </div>

        {/* Right Column: Financial Model Summary & Roadmap (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Monthly P&L Ledger Summary */}
          <section className="rounded-2xl border border-[#E5E0D8] bg-[#FDFBF7] p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#242220]">
                Monthly Financial Flow (P&L)
              </h2>
              <span className="text-[11px] font-semibold text-[#5A5752]">
                {steazy.tshirtsProducedPerMonth} Units / Mo
              </span>
            </div>

            <div className="mt-5 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#EAE5DC]">
                <span className="text-[#5A5752]">Gross Monthly Revenue</span>
                <span className="font-bold text-[#1A1918]">
                  {formatTZS(steazyCalc.monthlyRevenue)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#EAE5DC]">
                <span className="text-[#5A5752]">Cost of Goods Sold (COGS)</span>
                <span className="font-semibold text-rose-600">
                  - {formatTZS(steazyCalc.monthlyCOGS)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#EAE5DC] bg-white px-2 rounded">
                <span className="font-semibold text-[#3B3835]">Gross Profit</span>
                <span className="font-bold text-[#2D4A3E]">
                  {formatTZS(steazyCalc.monthlyGrossProfit)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#EAE5DC]">
                <span className="text-[#5A5752]">Fixed Monthly Operating Costs</span>
                <span className="font-semibold text-rose-600">
                  - {formatTZS(steazyCalc.monthlyOperatingExpenses)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 bg-[#2D4A3E] text-white px-3 rounded-xl">
                <span className="font-semibold">Net Monthly Operating Profit</span>
                <span className="font-bold text-sm">
                  {formatTZS(steazyCalc.monthlyNetProfit)}
                </span>
              </div>
            </div>

            {/* Unit Breakeven & Payback Metrics */}
            <div className="mt-6 pt-4 border-t border-[#EAE5DC] grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#E5E0D8]">
                <span className="text-[#7A7670] block">Break-Even Units</span>
                <strong className="text-base font-bold text-[#1A1918]">
                  {steazyCalc.breakEvenTshirtsPerMonth}{' '}
                  <span className="text-xs font-normal text-[#7A7670]">tees/mo</span>
                </strong>
                <p className="text-[10px] text-[#7A7670] mt-0.5">
                  Covers fixed expenses of {formatTZS(steazy.monthlyOperatingExpenses)}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E5E0D8]">
                <span className="text-[#7A7670] block">Capital Payback</span>
                <strong className="text-base font-bold text-[#2D4A3E]">
                  {steazyCalc.paybackMonths < 999 ? `${steazyCalc.paybackMonths} mos` : '—'}
                </strong>
                <p className="text-[10px] text-[#7A7670] mt-0.5">
                  Return on {formatTZS(steazy.initialCapital)} capital
                </p>
              </div>
            </div>
          </section>

          {/* Steazy Ecosystem Expansion: Totes, Caps, Sneakers Roadmap */}
          <section className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#3B3835]">
                    Apparel Ecosystem Expansion
                  </h3>
                </div>
                <p className="text-xs text-[#7A7670] mt-0.5">
                  Roadmap for Totes, Caps, Sneakers & accessories
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingProduct(!isAddingProduct)}
                className="inline-flex items-center gap-1 rounded-lg border border-[#D5CFE5] bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-800 hover:bg-violet-100 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </button>
            </div>

            {/* Quick Add Product Form */}
            {isAddingProduct && (
              <form onSubmit={handleCreateProduct} className="mt-4 p-4 rounded-xl bg-[#FAF8F5] border border-violet-200 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[#5A5752] font-semibold mb-1">Product Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Canvas Tote Bag"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="w-full rounded border border-[#D5CFE5] bg-white px-2 py-1.5 text-xs text-[#1A1918]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#5A5752] font-semibold mb-1">Target Launch</label>
                    <input
                      type="text"
                      placeholder="e.g. Q4 2026"
                      value={newProductQuarter}
                      onChange={(e) => setNewProductQuarter(e.target.value)}
                      className="w-full rounded border border-[#D5CFE5] bg-white px-2 py-1.5 text-xs text-[#1A1918]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5A5752] font-semibold mb-1">Target Retail (TZS)</label>
                    <input
                      type="number"
                      step="1000"
                      value={newProductRetail}
                      onChange={(e) => setNewProductRetail(parseInt(e.target.value) || 0)}
                      className="w-full rounded border border-[#D5CFE5] bg-white px-2 py-1.5 text-xs text-[#1A1918]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5A5752] font-semibold mb-1">Target Cost (TZS)</label>
                    <input
                      type="number"
                      step="500"
                      value={newProductCost}
                      onChange={(e) => setNewProductCost(parseInt(e.target.value) || 0)}
                      className="w-full rounded border border-[#D5CFE5] bg-white px-2 py-1.5 text-xs text-[#1A1918]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[#5A5752] font-semibold text-xs mb-1">Design Specifications</label>
                  <input
                    type="text"
                    placeholder="e.g. Heavyweight cotton twill, embossed metal hardware"
                    value={newProductNotes}
                    onChange={(e) => setNewProductNotes(e.target.value)}
                    className="w-full rounded border border-[#D5CFE5] bg-white px-2 py-1.5 text-xs text-[#1A1918]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingProduct(false)}
                    className="px-3 py-1 text-xs text-[#5A5752] hover:text-[#242220]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-violet-700 text-white text-xs font-semibold hover:bg-violet-800"
                  >
                    Add to Roadmap
                  </button>
                </div>
              </form>
            )}

            {/* List of Future Products */}
            <div className="mt-4 space-y-3">
              {(steazy.futureProducts || []).map((prod) => {
                const margin =
                  prod.targetSellingPrice > 0
                    ? ((prod.targetSellingPrice - prod.targetUnitCost) / prod.targetSellingPrice) * 100
                    : 0;

                return (
                  <div
                    key={prod.id}
                    className="p-3.5 rounded-xl border border-[#E5E0D8] bg-white hover:border-violet-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-xs text-[#1A1918]">{prod.name}</h4>
                          <span className="rounded bg-violet-50 border border-violet-200 px-1.5 py-0.5 text-[10px] font-medium text-violet-800">
                            {prod.targetLaunchQuarter}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7A7670] mt-1">{prod.notes}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteSteazyFutureProduct(prod.id)}
                        className="text-[#A5A19B] hover:text-rose-600 transition-colors p-1"
                        title="Delete product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#F0EBE1] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 text-[11px] text-[#5A5752]">
                        <span>Cost: <strong>{formatTZS(prod.targetUnitCost)}</strong></span>
                        <span>Retail: <strong>{formatTZS(prod.targetSellingPrice)}</strong></span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {(margin ?? 0).toFixed(0)}% Margin
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
