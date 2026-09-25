import React, { useState } from 'react';
import { X, Sliders, Check, RefreshCw, Sparkles, DollarSign, ArrowRight } from 'lucide-react';
import { useKairos } from '../context/KairosContext';
import { formatTZS } from '../utils/formatters';

interface QuickNumbersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickNumbersModal: React.FC<QuickNumbersModalProps> = ({ isOpen, onClose }) => {
  const {
    state,
    updateAllocations,
    updateKlinFitz,
    updateZanzibar,
    updatePoultry,
    updateUTT,
    updateLoan,
    updateSteazy,
    masterCalc,
    klinFitzCalc,
    steazyCalc,
    zanzibarCalc,
    poultryCalc,
    uttCalc,
    loanCalc,
  } = useKairos();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 dark:border-stone-800 dark:bg-stone-900 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1E3A2F] text-white">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                Adjust Financial Numbers & Assumptions
              </h2>
              <p className="font-serif-body text-xs text-stone-600 dark:text-stone-400">
                Live interactive recalibration of all capital allocations, operating prices, volumes, and loan terms.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Quick Stats Strip */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Total Monthly Inflow</span>
            <div className="font-mono-num text-base font-bold text-gray-900">
              +{formatTZS(masterCalc.monthlyOperatingCashFlow)}/mo
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Monthly Debt Service</span>
            <div className="font-mono-num text-base font-bold text-rose-700">
              -{formatTZS(state.loan.monthlyRepayment)}/mo
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-700">Net Monthly Cushion</span>
            <div className="font-mono-num text-base font-bold text-emerald-800">
              +{formatTZS(masterCalc.monthlyCashFlowAfterDebt)}/mo
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Safety Cash Reserve</span>
            <div className="font-mono-num text-base font-bold text-gray-900">
              {formatTZS(state.allocations.cashReserve)}
            </div>
          </div>
        </div>

        {/* Grid of Sections */}
        <div className="mt-6 space-y-6">
          {/* Section 1: Capital Allocations */}
          <div className="rounded-2xl border border-stone-200 p-5 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/40">
            <h3 className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
              <span>1. Capital Deployment (Total: {formatTZS(state.allocations.startingCapital)})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Starting Capital (TZS)
                </label>
                <input
                  type="number"
                  step={1000000}
                  value={state.allocations.startingCapital}
                  onChange={(e) => updateAllocations({ startingCapital: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  UTT Liquid Fund (TZS)
                </label>
                <input
                  type="number"
                  step={500000}
                  value={state.allocations.utt}
                  onChange={(e) => updateAllocations({ utt: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Klin Fitz Laundry (TZS)
                </label>
                <input
                  type="number"
                  step={500000}
                  value={state.allocations.klinFitz}
                  onChange={(e) => updateAllocations({ klinFitz: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Zanzibar Airbnb (TZS)
                </label>
                <input
                  type="number"
                  step={500000}
                  value={state.allocations.zanzibarAirbnb}
                  onChange={(e) => updateAllocations({ zanzibarAirbnb: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Mom&apos;s Poultry Pilot (TZS)
                </label>
                <input
                  type="number"
                  step={250000}
                  value={state.allocations.momsPoultry}
                  onChange={(e) => updateAllocations({ momsPoultry: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Guarded Cash Reserve (TZS)
                </label>
                <div className="w-full rounded-xl border border-stone-200 bg-stone-100 dark:bg-stone-800 px-3 py-2 font-mono-num text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {formatTZS(state.allocations.cashReserve)}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Klin Fitz Operational Numbers */}
          <div className="rounded-2xl border border-stone-200 p-5 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100">
                2. Klin Fitz Laundry Assumptions
              </h3>
              <span className="font-mono-num text-xs font-bold text-emerald-700 dark:text-emerald-400">
                Profit: +{formatTZS(klinFitzCalc.monthlyOperatingProfit)}/mo
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Orders Per Day
                </label>
                <input
                  type="number"
                  step={1}
                  min={1}
                  max={100}
                  value={state.klinFitz.ordersPerDay}
                  onChange={(e) => updateKlinFitz({ ordersPerDay: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Avg Revenue / Order (TZS)
                </label>
                <input
                  type="number"
                  step={1000}
                  value={state.klinFitz.avgRevenuePerOrder}
                  onChange={(e) => updateKlinFitz({ avgRevenuePerOrder: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Monthly Staff Cost (TZS)
                </label>
                <input
                  type="number"
                  step={50000}
                  value={state.klinFitz.staffCost}
                  onChange={(e) => updateKlinFitz({ staffCost: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Zanzibar Airbnb Assumptions */}
          <div className="rounded-2xl border border-stone-200 p-5 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100">
                3. Zanzibar Airbnb Assumptions (50% JV)
              </h3>
              <span className="font-mono-num text-xs font-bold text-sky-700 dark:text-sky-400">
                Your Share: +{formatTZS(zanzibarCalc.userProfitShare)}/mo
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Nightly Price (TZS)
                </label>
                <input
                  type="number"
                  step={10000}
                  value={state.zanzibarAirbnb.nightlyPrice}
                  onChange={(e) => updateZanzibar({ nightlyPrice: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Occupancy Rate (%)
                </label>
                <input
                  type="number"
                  step={5}
                  min={10}
                  max={100}
                  value={state.zanzibarAirbnb.occupancyPct}
                  onChange={(e) => updateZanzibar({ occupancyPct: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Monthly Apartment Rent (TZS)
                </label>
                <input
                  type="number"
                  step={50000}
                  value={state.zanzibarAirbnb.monthlyRent}
                  onChange={(e) => updateZanzibar({ monthlyRent: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Poultry Pilot Numbers */}
          <div className="rounded-2xl border border-stone-200 p-5 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100">
                4. Mom&apos;s Poultry Pilot Assumptions
              </h3>
              <span className="font-mono-num text-xs font-bold text-amber-800 dark:text-amber-300">
                Batch Profit: +{formatTZS(poultryCalc.recurringBatchProfit)}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Number of Chicks
                </label>
                <input
                  type="number"
                  step={50}
                  min={50}
                  value={state.poultry.numChicks}
                  onChange={(e) => updatePoultry({ numChicks: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Selling Price / Bird (TZS)
                </label>
                <input
                  type="number"
                  step={500}
                  value={state.poultry.expectedSellingPrice}
                  onChange={(e) => updatePoultry({ expectedSellingPrice: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Mortality Rate (%)
                </label>
                <input
                  type="number"
                  step={1}
                  min={1}
                  max={25}
                  value={state.poultry.mortalityRatePct}
                  onChange={(e) => updatePoultry({ mortalityRatePct: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Loan Terms */}
          <div className="rounded-2xl border border-stone-200 p-5 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100">
                5. Loan Parameters & Debt Service
              </h3>
              <span className="font-mono-num text-xs font-bold text-rose-700 dark:text-rose-400">
                DSCR: {(loanCalc?.dscr ?? 0).toFixed(2)}x (Coverage)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Loan Principal (TZS)
                </label>
                <input
                  type="number"
                  step={1000000}
                  value={state.loan.principal}
                  onChange={(e) => updateLoan({ principal: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Tenure (Months)
                </label>
                <input
                  type="number"
                  step={6}
                  min={12}
                  max={120}
                  value={state.loan.tenureMonths || 120}
                  onChange={(e) => updateLoan({ tenureMonths: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Annual Interest (%)
                </label>
                <input
                  type="number"
                  step={0.5}
                  value={state.loan.interestRateAnnualPct || 18.5}
                  onChange={(e) => updateLoan({ interestRateAnnualPct: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Monthly Payment (TZS)
                </label>
                <input
                  type="number"
                  step={10000}
                  value={state.loan.monthlyRepayment}
                  onChange={(e) => updateLoan({ monthlyRepayment: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Steazy Fashion Brand Assumptions */}
          <div className="rounded-2xl border border-stone-200 p-5 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100">
                6. Steazy Fashion Brand Assumptions
              </h3>
              <span className="font-mono-num text-xs font-bold text-violet-800 dark:text-violet-300">
                Net Profit: +{formatTZS(steazyCalc.monthlyNetProfit)}/mo ({(steazyCalc.netMarginPct ?? 0).toFixed(0)}% Margin)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  T-Shirts Produced/mo
                </label>
                <input
                  type="number"
                  step={20}
                  min={10}
                  value={state.steazy.tshirtsProducedPerMonth}
                  onChange={(e) => updateSteazy({ tshirtsProducedPerMonth: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-violet-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Selling Price / Tee (TZS)
                </label>
                <input
                  type="number"
                  step={1000}
                  value={state.steazy.retailSellingPrice || 35000}
                  onChange={(e) => updateSteazy({ retailSellingPrice: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-violet-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Blank + Print Cost / Tee
                </label>
                <input
                  type="number"
                  step={500}
                  value={(state.steazy.blankCostPerUnit || 12000) + (state.steazy.printingCostPerUnit || 4000)}
                  onChange={(e) => {
                    const totalUnit = Number(e.target.value);
                    const blank = Math.round(totalUnit * 0.75);
                    const print = totalUnit - blank;
                    updateSteazy({ blankCostPerUnit: blank, printingCostPerUnit: print });
                  }}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-violet-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Monthly Operating Overhead (TZS)
                </label>
                <input
                  type="number"
                  step={50000}
                  value={state.steazy.monthlyOperatingExpenses}
                  onChange={(e) => updateSteazy({ monthlyOperatingExpenses: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 font-mono-num text-sm font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-violet-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <span className="font-serif-body text-xs text-stone-500">
            All modifications automatically save locally in your browser storage.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1E3A2F] px-6 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-xs"
          >
            <Check className="h-4 w-4" />
            <span>Done & Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
};
