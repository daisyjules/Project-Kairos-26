import React, { useState } from 'react';
import { useKairos } from '../context/KairosContext';
import { formatTZS, formatPercent, formatRatio } from '../utils/formatters';
import {
  BookOpen,
  ArrowRight,
  Shield,
  Shirt,
  Palmtree,
  Egg,
  TrendingUp,
  Sliders,
  Quote,
  Car,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from 'recharts';

import founderDeskImg from '../assets/images/founder_minimalist_desk_1787316891526.jpg';
import carImg from '../assets/images/minimalist_safari_car_1787316901639.jpg';
import zanzibarImg from '../assets/images/zanzibar_beach_1787307751785.jpg';
import laundryImg from '../assets/images/clean_laundry_1787307764343.jpg';
import poultryImg from '../assets/images/poultry_farm_1787307776327.jpg';
import wealthImg from '../assets/images/wealth_plant_1787307790696.jpg';

import { EditableText } from './EditableText';
import { QuickNumbersModal } from './QuickNumbersModal';

export const MasterDashboard: React.FC = () => {
  const {
    state,
    setActiveTab,
    masterCalc,
    klinFitzCalc,
    zanzibarCalc,
    poultryCalc,
    uttCalc,
    updateHeroQuote,
  } = useKairos();

  const [activeChartTab, setActiveChartTab] = useState<'yield' | 'spend'>('yield');
  const [isNumbersModalOpen, setIsNumbersModalOpen] = useState(false);

  // How the 30M is Spent
  const spendData = [
    { name: 'UTT AMIS Bond Fund', amount: state.allocations.utt, color: '#111827', pct: (state.allocations.utt / 30000000) * 100 },
    { name: 'Car (Transport)', amount: state.allocations.car, color: '#4B5563', pct: (state.allocations.car / 30000000) * 100 },
    { name: 'Klin Fitz Laundry', amount: state.allocations.klinFitz, color: '#059669', pct: (state.allocations.klinFitz / 30000000) * 100 },
    { name: 'Zanzibar Airbnb JV', amount: state.allocations.zanzibarAirbnb, color: '#0284C7', pct: (state.allocations.zanzibarAirbnb / 30000000) * 100 },
    { name: 'Mom’s Poultry Pilot', amount: state.allocations.momsPoultry, color: '#65A30D', pct: (state.allocations.momsPoultry / 30000000) * 100 },
    { name: 'Productivity Laptop', amount: state.allocations.laptop, color: '#9CA3AF', pct: (state.allocations.laptop / 30000000) * 100 },
    { name: 'Liquid Safety Reserve', amount: Math.max(0, masterCalc.remainingReserve), color: '#D97706', pct: (Math.max(0, masterCalc.remainingReserve) / 30000000) * 100 },
  ];

  // How each investment yields
  const yieldComparisonData = [
    {
      name: 'Klin Fitz',
      shortName: 'Laundry',
      monthlyNetProfit: klinFitzCalc.monthlyOperatingProfit,
      fill: '#059669',
    },
    {
      name: 'Zanzibar Airbnb',
      shortName: 'Airbnb JV',
      monthlyNetProfit: zanzibarCalc.userProfitShare,
      fill: '#0284C7',
    },
    {
      name: 'Mom’s Poultry',
      shortName: 'Poultry',
      monthlyNetProfit: poultryCalc.monthlyEquivalentProfit,
      fill: '#65A30D',
    },
    {
      name: 'UTT Bond Fund',
      shortName: 'UTT Fund',
      monthlyNetProfit: uttCalc.monthlyEquivalentReturn,
      fill: '#111827',
    },
  ];

  const totalMonthlyBusinessCash =
    klinFitzCalc.monthlyOperatingProfit +
    zanzibarCalc.userProfitShare +
    poultryCalc.monthlyEquivalentProfit;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Visual Hero Banner with Minimalist Photography & Live Overview */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[220px]">
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-800">
                <Sparkles className="h-3.5 w-3.5 text-gray-700" />
                <span>Project Kairos 26</span>
                <span className="text-gray-400">•</span>
                <span>Founder Capital Deployment</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
                The Year We Started Moving
              </h1>

              <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
                Deploying <strong className="text-gray-900 font-semibold">30,000,000 TZS</strong> into durable assets, 3 recurring cashflow engines, and a permanent debt-service buffer.
              </p>
            </div>

            {/* Editable Founder Note */}
            <div className="pt-3 border-t border-gray-100 flex items-start gap-2.5 text-xs text-gray-700">
              <Quote className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <EditableText
                  value={state.heroQuote?.text || 'Move deliberately. Build patiently with Mom & Alice. Let the monthly surplus protect our peace.'}
                  onSave={(newText) => updateHeroQuote({ text: newText, author: state.heroQuote?.author || 'Founder Reflection' })}
                  className="italic text-gray-800 font-medium"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setIsNumbersModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-black transition-all cursor-pointer shadow-2xs"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Adjust Financial Assumptions</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('diary')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer shadow-2xs"
              >
                <BookOpen className="h-3.5 w-3.5 text-gray-500" />
                <span>Read Diary</span>
              </button>
            </div>
          </div>

          {/* Right Hero Image Column */}
          <div className="lg:col-span-5 relative h-48 lg:h-auto min-h-[180px] bg-gray-100 border-t lg:border-t-0 lg:border-l border-gray-200 overflow-hidden">
            <img
              src={founderDeskImg}
              alt="Founder Minimalist Workspace"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
              <div className="backdrop-blur-xs bg-black/40 border border-white/20 rounded-lg p-2.5 max-w-xs">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-200">
                  <Shield className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Debt Service Coverage</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-mono-num text-lg font-bold text-white">
                    {formatRatio(masterCalc.dscr)} DSCR
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-300">
                    Solvent & Protected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Core Financial KPIs - Clean, Minimalist, High-Contrast */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Net Monthly Cushion */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-700 mb-1.5">
              <span className="font-semibold text-gray-900 text-sm">Net Monthly Cushion</span>
              <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-bold text-emerald-800">
                DSCR {formatRatio(masterCalc.dscr)}
              </span>
            </div>

            <div className="my-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold font-mono-num text-gray-950 tracking-tight">
                {masterCalc.monthlyCashFlowAfterDebt >= 0 ? '+' : ''}
                {formatTZS(masterCalc.monthlyCashFlowAfterDebt)}
              </span>
              <span className="text-xs font-medium text-gray-500">/mo</span>
            </div>
          </div>

          <p className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
            Net cash surplus after paying <span className="font-semibold text-gray-900">{formatTZS(state.loan.monthlyRepayment)}/mo</span> debt service.
          </p>
        </div>

        {/* Metric 2: Total Venture Inflow */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-700 mb-1.5">
              <span className="font-semibold text-gray-900 text-sm">Total Venture Inflow</span>
              <span className="rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs font-bold text-blue-800">
                3 Cash Engines
              </span>
            </div>

            <div className="my-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold font-mono-num text-gray-950 tracking-tight">
                +{formatTZS(totalMonthlyBusinessCash)}
              </span>
              <span className="text-xs font-medium text-gray-500">/mo</span>
            </div>
          </div>

          <p className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
            Klin Fitz ({formatTZS(klinFitzCalc.monthlyOperatingProfit, true)}) + Zanzibar ({formatTZS(zanzibarCalc.userProfitShare, true)}) + Poultry ({formatTZS(poultryCalc.monthlyEquivalentProfit, true)}).
          </p>
        </div>

        {/* Metric 3: Liquid Safety Buffer */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-700 mb-1.5">
              <span className="font-semibold text-gray-900 text-sm">Liquid Safety Buffer</span>
              <span className="rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-bold text-amber-800">
                {formatPercent(masterCalc.reservePct)} Protected
              </span>
            </div>

            <div className="my-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold font-mono-num text-gray-950 tracking-tight">
                {formatTZS(state.allocations.cashReserve)}
              </span>
            </div>
          </div>

          <p className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
            Untouchable cash reserve sitting in the bank for operational stability.
          </p>
        </div>
      </div>

      {/* 3. Five Visual Venture & Asset Cards with Photography */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-950 tracking-tight">
            Venture Engines & Capital Assets
          </h2>
          <span className="text-xs text-gray-500">
            Click any card to inspect operational model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Klin Fitz Laundry */}
          <div
            onClick={() => setActiveTab('klinfitz')}
            className="group rounded-xl border border-gray-200 bg-white overflow-hidden shadow-2xs hover:border-gray-900 hover:shadow-xs transition-all cursor-pointer flex flex-col"
          >
            <div className="relative h-36 w-full overflow-hidden bg-gray-100">
              <img
                src={laundryImg}
                alt="Klin Fitz Laundry"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 right-2.5 rounded-md bg-black/60 backdrop-blur-xs px-2 py-1 text-[11px] font-bold text-white font-mono-num">
                {formatTZS(state.allocations.klinFitz, true)} Cap
              </div>
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-md bg-emerald-950/80 backdrop-blur-xs px-2 py-1 text-xs font-semibold text-emerald-200">
                <Shirt className="h-3.5 w-3.5" />
                <span>Klin Fitz Laundry</span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <p className="text-xs text-gray-600 line-clamp-2">
                  Daily commercial laundry operations in Dar es Salaam providing steady daily cashflow.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 block text-[10px]">Daily Target</span>
                    <span className="font-bold text-gray-900 font-mono-num">
                      {state.klinFitz.ordersPerDay} orders/day
                    </span>
                  </div>
                  <div className="p-2 rounded bg-emerald-50/80 border border-emerald-100">
                    <span className="text-emerald-800 block text-[10px] font-semibold">Net Profit</span>
                    <span className="font-bold text-emerald-950 font-mono-num">
                      +{formatTZS(klinFitzCalc.monthlyOperatingProfit, true)}/mo
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-700 group-hover:text-black">
                <span>View Operations & Equipment</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 2: Zanzibar Airbnb JV */}
          <div
            onClick={() => setActiveTab('zanzibar')}
            className="group rounded-xl border border-gray-200 bg-white overflow-hidden shadow-2xs hover:border-gray-900 hover:shadow-xs transition-all cursor-pointer flex flex-col"
          >
            <div className="relative h-36 w-full overflow-hidden bg-gray-100">
              <img
                src={zanzibarImg}
                alt="Zanzibar Villa"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 right-2.5 rounded-md bg-black/60 backdrop-blur-xs px-2 py-1 text-[11px] font-bold text-white font-mono-num">
                {formatTZS(state.allocations.zanzibarAirbnb, true)} Cap
              </div>
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-md bg-sky-950/80 backdrop-blur-xs px-2 py-1 text-xs font-semibold text-sky-200">
                <Palmtree className="h-3.5 w-3.5" />
                <span>Zanzibar Airbnb JV</span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <p className="text-xs text-gray-600 line-clamp-2">
                  50/50 partnership with Alice targeting tourism demand in coastal Zanzibar.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 block text-[10px]">Occupancy</span>
                    <span className="font-bold text-gray-900 font-mono-num">
                      {state.zanzibarAirbnb.occupancyPct}% ({formatTZS(state.zanzibarAirbnb.nightlyPrice, true)}/n)
                    </span>
                  </div>
                  <div className="p-2 rounded bg-sky-50/80 border border-sky-100">
                    <span className="text-sky-800 block text-[10px] font-semibold">Your 50% Share</span>
                    <span className="font-bold text-sky-950 font-mono-num">
                      +{formatTZS(zanzibarCalc.userProfitShare, true)}/mo
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-700 group-hover:text-black">
                <span>View Partnership Model</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 3: Mom's Poultry Pilot */}
          <div
            onClick={() => setActiveTab('poultry')}
            className="group rounded-xl border border-gray-200 bg-white overflow-hidden shadow-2xs hover:border-gray-900 hover:shadow-xs transition-all cursor-pointer flex flex-col"
          >
            <div className="relative h-36 w-full overflow-hidden bg-gray-100">
              <img
                src={poultryImg}
                alt="Mom's Poultry Farm"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 right-2.5 rounded-md bg-black/60 backdrop-blur-xs px-2 py-1 text-[11px] font-bold text-white font-mono-num">
                {formatTZS(state.allocations.momsPoultry, true)} Cap
              </div>
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-md bg-lime-950/80 backdrop-blur-xs px-2 py-1 text-xs font-semibold text-lime-200">
                <Egg className="h-3.5 w-3.5" />
                <span>Mom’s Poultry Pilot</span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <p className="text-xs text-gray-600 line-clamp-2">
                  Rapid-turnover broiler batch production managed in partnership with Mom.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 block text-[10px]">Batch Size</span>
                    <span className="font-bold text-gray-900 font-mono-num">
                      {state.poultry.numChicks} chicks ({state.poultry.expectedSellingAgeWeeks}w)
                    </span>
                  </div>
                  <div className="p-2 rounded bg-lime-50/80 border border-lime-100">
                    <span className="text-lime-800 block text-[10px] font-semibold">Batch Profit</span>
                    <span className="font-bold text-lime-950 font-mono-num">
                      +{formatTZS(poultryCalc.recurringBatchProfit, true)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-700 group-hover:text-black">
                <span>View Feed & Mortality Model</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 4: UTT AMIS Bond Fund */}
          <div
            onClick={() => setActiveTab('utt')}
            className="group rounded-xl border border-gray-200 bg-white overflow-hidden shadow-2xs hover:border-gray-900 hover:shadow-xs transition-all cursor-pointer flex flex-col"
          >
            <div className="relative h-36 w-full overflow-hidden bg-gray-100">
              <img
                src={wealthImg}
                alt="UTT Wealth Growth"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 right-2.5 rounded-md bg-black/60 backdrop-blur-xs px-2 py-1 text-[11px] font-bold text-white font-mono-num">
                {formatTZS(state.allocations.utt, true)} Cap
              </div>
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-md bg-gray-950/80 backdrop-blur-xs px-2 py-1 text-xs font-semibold text-gray-200">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>UTT AMIS Bond Fund</span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <p className="text-xs text-gray-600 line-clamp-2">
                  Untouchable wealth preservation compounding safely at 13.5% annual yield.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 block text-[10px]">Expected Yield</span>
                    <span className="font-bold text-gray-900 font-mono-num">
                      {state.utt.expectedAnnualReturnPct}% p.a.
                    </span>
                  </div>
                  <div className="p-2 rounded bg-gray-100 border border-gray-200">
                    <span className="text-gray-700 block text-[10px] font-semibold">5-Year Value</span>
                    <span className="font-bold text-gray-950 font-mono-num">
                      {formatTZS(uttCalc.projectedValue5Y, true)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-700 group-hover:text-black">
                <span>View Compound Projections</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 5: Mobility & Tech Guardrails */}
          <div
            onClick={() => setActiveTab('car_laptop')}
            className="group rounded-xl border border-gray-200 bg-white overflow-hidden shadow-2xs hover:border-gray-900 hover:shadow-xs transition-all cursor-pointer flex flex-col"
          >
            <div className="relative h-36 w-full overflow-hidden bg-gray-100">
              <img
                src={carImg}
                alt="Mobility and Car Guardrail"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 right-2.5 rounded-md bg-black/60 backdrop-blur-xs px-2 py-1 text-[11px] font-bold text-white font-mono-num">
                {formatTZS(state.allocations.car + state.allocations.laptop, true)} Cap
              </div>
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-md bg-stone-950/80 backdrop-blur-xs px-2 py-1 text-xs font-semibold text-stone-200">
                <Car className="h-3.5 w-3.5" />
                <span>Car & Laptop Guardrails</span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <p className="text-xs text-gray-600 line-clamp-2">
                  Strict budget cap (10M TZS vehicle + 1M TZS laptop) to preserve working capital.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 block text-[10px]">Car Cap</span>
                    <span className="font-bold text-gray-900 font-mono-num">
                      {formatTZS(state.allocations.car, true)}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 block text-[10px]">Laptop Cap</span>
                    <span className="font-bold text-gray-900 font-mono-num">
                      {formatTZS(state.allocations.laptop, true)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-700 group-hover:text-black">
                <span>View TCO & Asset Guardrails</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 6: 12-Month Pro-Forma Ledger Card */}
          <div
            onClick={() => setActiveTab('monthly_tracker')}
            className="group rounded-xl border border-dashed border-gray-300 bg-gray-50/70 p-5 shadow-2xs hover:border-gray-900 hover:bg-white transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white font-bold text-xs">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    12-Month Pro-Forma
                  </h3>
                  <span className="text-xs text-gray-500">Execution Timeline & Tracking</span>
                </div>
              </div>

              <p className="text-xs text-gray-600">
                Track month-by-month debt payments, venture ramp-ups, and actual vs forecasted cash reserves across 2026.
              </p>

              <div className="p-3 rounded-lg bg-white border border-gray-200 text-xs flex items-center justify-between">
                <span className="text-gray-600 font-medium">Year 1 Cumulative Net</span>
                <span className="font-mono-num font-bold text-emerald-800 text-sm">
                  +{formatTZS(masterCalc.monthlyCashFlowAfterDebt * 12, true)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs font-semibold text-gray-700 group-hover:text-black">
              <span>Open 12-Month Tracker</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Minimalist Yields & Capital Allocation Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {activeChartTab === 'yield' ? 'Monthly Profit Comparison by Engine' : '30M Loan Capital Allocation Breakdown'}
            </h3>
            <p className="text-xs text-gray-500">
              {activeChartTab === 'yield'
                ? 'Comparing net monthly cash output across all 4 capital engines.'
                : 'Distribution of the full 30,000,000 TZS loan across 7 allocation buckets.'}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveChartTab('yield')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeChartTab === 'yield'
                  ? 'bg-white text-gray-900 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly Profits
            </button>
            <button
              type="button"
              onClick={() => setActiveChartTab('spend')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeChartTab === 'spend'
                  ? 'bg-white text-gray-900 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              30M Allocation
            </button>
          </div>
        </div>

        <div className="mt-5">
          {activeChartTab === 'yield' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yieldComparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="shortName" tick={{ fontSize: 11, fill: '#4B5563' }} />
                    <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#4B5563' }} />
                    <Tooltip
                      formatter={(val: any) => [formatTZS(Number(val)), 'Net Operating Profit']}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E5E7EB',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="monthlyNetProfit" radius={[4, 4, 0, 0]}>
                      {yieldComparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="lg:col-span-5 space-y-2">
                {yieldComparisonData.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-gray-50/70"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-xs font-semibold text-gray-800">{item.name}</span>
                    </div>
                    <div className="font-mono-num text-xs font-bold text-gray-900">
                      +{formatTZS(item.monthlyNetProfit)}/mo
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="h-48 w-48 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={spendData}
                        dataKey="amount"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={75}
                        paddingAngle={2}
                      >
                        {spendData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: any) => [formatTZS(Number(val)), 'Allocation']} />
                    </RechartsPie>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Total</span>
                    <span className="font-mono-num text-sm font-bold text-gray-900">30M TZS</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {spendData.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-medium text-gray-800 truncate">{item.name}</span>
                    </div>
                    <span className="font-mono-num font-bold text-gray-900 shrink-0 ml-2">
                      {formatTZS(item.amount, true)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Numbers Modal */}
      <QuickNumbersModal
        isOpen={isNumbersModalOpen}
        onClose={() => setIsNumbersModalOpen(false)}
      />
    </div>
  );
};
