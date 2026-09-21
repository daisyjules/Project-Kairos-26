import React from 'react';
import { useKairos } from '../context/KairosContext';
import { CurrencyInput } from './CurrencyInput';
import { StatCard } from './StatCard';
import { WarningBanner } from './WarningBanner';
import { formatTZS, formatPercent, formatRatio } from '../utils/formatters';
import {
  Palmtree,
  Users,
  Percent,
  Calendar,
  AlertTriangle,
  Clock,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  DollarSign,
  Layers,
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
import zanzibarImg from '../assets/images/zanzibar_beach_1787307751785.jpg';
import { PinnedCorkboard } from './PinnedCorkboard';
import { CommentsSection } from './CommentsSection';

export const ZanzibarView: React.FC = () => {
  const { state, setActiveTab, updateZanzibar, zanzibarCalc } = useKairos();
  const zb = state.zanzibarAirbnb;

  // Occupancy scenario comparison
  const occupancyScenarios = [
    { occupancy: 30, label: '30% Low Season' },
    { occupancy: 50, label: '50% Base Target' },
    { occupancy: 70, label: '70% High Season' },
  ].map((sc) => {
    const bookedNights = Math.round((sc.occupancy / 100) * zb.availableNightsPerMonth);
    const stays = Math.max(1, Math.round(bookedNights / 3.2));
    const gross = bookedNights * zb.nightlyPrice + stays * zb.cleaningFeePerStay;
    const platformFee = gross * (zb.platformFeePct / 100);
    const cleaningCosts = stays * zb.monthlyCleaning;
    const expenses = platformFee + cleaningCosts + zb.monthlyRent + zb.monthlyUtilities + zb.monthlyInternet + zb.monthlyMaintenance + zb.monthlySupplies + zb.otherMonthlyCosts;
    const profit = gross - expenses;
    const userProfit = profit * (zanzibarCalc.userOwnershipPct / 100);
    return {
      name: sc.label,
      gross,
      totalProfit: profit,
      userProfit,
    };
  });

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
            <span>Read Zanzibar Diary Notes</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('poultry')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#41788E] dark:text-sky-400 hover:underline cursor-pointer"
          >
            <span>Next: Poultry Pilot</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Warm Header Banner with Zanzibar Photo */}
      <div className="rounded-3xl border border-stone-200/90 bg-white overflow-hidden dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-100/80 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 px-3 py-1 text-xs font-semibold mb-2">
                <Palmtree className="h-3.5 w-3.5" />
                <span>Chapter 2 • 50/50 Joint Venture with Alice</span>
              </div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                Zanzibar Airbnb Joint Venture
              </h1>
              <p className="mt-1 font-serif-body text-sm text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
                Hospitality in Stone Town. Capital capped at <strong>{formatTZS(zb.userContribution)}</strong>, generating passive monthly dividends to service our debt.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-sky-700 dark:text-sky-400" />
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Ownership: 50% You • 50% Alice
                </span>
              </div>
              <div className="text-xs font-mono-num font-bold text-sky-700 dark:text-sky-400">
                Dividend: +{formatTZS(zanzibarCalc.userProfitShare)}/mo
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 relative min-h-[180px] lg:min-h-full">
            <img
              src={zanzibarImg}
              alt="Turquoise ocean and white sand beach in Zanzibar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-b-3xl lg:rounded-b-none lg:rounded-r-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-3 left-4 text-white font-handwriting text-base font-semibold drop-shadow-md lg:hidden">
              🏝️ Stone Town & island breezes
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Joint Venture Legal Warning */}
      <WarningBanner
        type="warning"
        title="Joint Venture Governance Protocol"
        message="Joint venture checklist: confirm written agreements covering ownership split (50/50), initial setup contributions, ongoing profit payout dates, operating responsibilities, maintenance reserves, and exit rights."
      />

      {/* 4 Output Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Your Monthly Profit Share"
          value={formatTZS(zanzibarCalc.userProfitShare)}
          subValue={`Based on ${zb.occupancyPct}% occupancy (${zanzibarCalc.bookedNights} booked nights)`}
          badge={{
            text: zanzibarCalc.userProfitShare > 0 ? 'Cash Inflow' : 'Deficit',
            variant: zanzibarCalc.userProfitShare > 0 ? 'success' : 'danger',
          }}
          icon={<TrendingUp className="h-4 w-4" />}
          highlight={zanzibarCalc.userProfitShare > 0}
        />

        <StatCard
          label="Gross Property Revenue"
          value={formatTZS(zanzibarCalc.grossRevenue)}
          subValue={`Total property profit: ${formatTZS(zanzibarCalc.totalOperatingProfit)}/mo`}
          badge={{ text: 'Entire Unit', variant: 'info' }}
          icon={<DollarSign className="h-4 w-4" />}
        />

        <StatCard
          label="Annual ROI on Capital"
          value={formatPercent(zanzibarCalc.annualROI, 1)}
          subValue={`On TZS ${formatTZS(zb.userContribution, true)} contribution`}
          badge={{ text: 'Cash-on-Cash', variant: 'success' }}
          icon={<Sparkles className="h-4 w-4" />}
        />

        <StatCard
          label="Break-Even Occupancy"
          value={`${formatPercent(zanzibarCalc.breakEvenOccupancyPct, 1)}`}
          subValue={`Requires ${zanzibarCalc.breakEvenNights} nights/mo to cover costs`}
          badge={{
            text: zb.occupancyPct >= zanzibarCalc.breakEvenOccupancyPct ? 'Above Break-Even' : 'Below Break-Even',
            variant: zb.occupancyPct >= zanzibarCalc.breakEvenOccupancyPct ? 'success' : 'warning',
          }}
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      {/* DUAL COLUMN: INPUTS & UNIT ECONOMICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Capital Setup & Ownership */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-6 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              1. Setup Capital & Partnership Structure
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Your investment contribution towards furnishing and fitting the Zanzibar property.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CurrencyInput
                label="Your Capital Contribution"
                value={zb.userContribution}
                onChange={(val) => updateZanzibar({ userContribution: val })}
                helperText="Capital from Kairos loan (Target: 3,000,000)"
              />
              <CurrencyInput
                label="Alice’s Contribution"
                value={zb.aliceContribution}
                onChange={(val) => updateZanzibar({ aliceContribution: val })}
                helperText="Partner cash/asset equity (Target: 3,000,000)"
              />
              <CurrencyInput
                label="Property Furnishing & Setup"
                value={zb.furnishingCost}
                onChange={(val) => updateZanzibar({ furnishingCost: val })}
                helperText="Bedding, decor, AC, kitchenware"
              />
              <CurrencyInput
                label="Lease Advance / Security Deposit"
                value={zb.leaseDeposit}
                onChange={(val) => updateZanzibar({ leaseDeposit: val })}
                helperText="Advance rent to landlord"
              />
            </div>
          </div>

          {/* Section 2: Nightly Rate & Occupancy Engine */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-6 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              2. Revenue Drivers & Occupancy Target
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Calibrate ADR (Average Daily Rate) and seasonal booked nights.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Occupancy Rate: <span className="font-mono-num font-bold text-sky-700 dark:text-sky-400">{zb.occupancyPct}%</span> ({zanzibarCalc.bookedNights} nights/mo)
                </label>
                <input
                  type="range"
                  min={10}
                  max={95}
                  step={5}
                  value={zb.occupancyPct}
                  onChange={(e) => updateZanzibar({ occupancyPct: parseInt(e.target.value) })}
                  className="w-full accent-[#41788E] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>10% (Low)</span>
                  <span>50% (Base)</span>
                  <span>95% (Peak)</span>
                </div>
              </div>

              <CurrencyInput
                label="Nightly Rental Rate (ADR)"
                value={zb.nightlyPrice}
                onChange={(val) => updateZanzibar({ nightlyPrice: val })}
                helperText="Average nightly rate in TZS"
              />

              <CurrencyInput
                label="Guest Cleaning Fee (Per Stay)"
                value={zb.cleaningFeePerStay}
                onChange={(val) => updateZanzibar({ cleaningFeePerStay: val })}
                helperText="Fee billed directly to guest"
              />

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  OTA Platform Commission Fee: <span className="font-mono-num font-bold">{zb.platformFeePct}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={1}
                  value={zb.platformFeePct}
                  onChange={(e) => updateZanzibar({ platformFeePct: parseInt(e.target.value) })}
                  className="w-full accent-[#41788E] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>Direct (0%)</span>
                  <span>Airbnb (14%)</span>
                  <span>Booking.com (18%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Monthly Fixed Operating Costs */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-6 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              3. Monthly Property Expenses
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Recurring property obligations before profit distribution.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CurrencyInput
                label="Monthly Property Rent"
                value={zb.monthlyRent}
                onChange={(val) => updateZanzibar({ monthlyRent: val })}
                helperText="Lease paid to property owner"
              />
              <CurrencyInput
                label="Electricity (AC / TANESCO)"
                value={zb.monthlyUtilities}
                onChange={(val) => updateZanzibar({ monthlyUtilities: val })}
                helperText="Air conditioning & water tokens"
              />
              <CurrencyInput
                label="High-Speed Wi-Fi Internet"
                value={zb.monthlyInternet}
                onChange={(val) => updateZanzibar({ monthlyInternet: val })}
                helperText="Fiber / 4G broadband for guests"
              />
              <CurrencyInput
                label="Guest Supplies & Toiletries"
                value={zb.monthlySupplies}
                onChange={(val) => updateZanzibar({ monthlySupplies: val })}
                helperText="Coffee, water bottles, bath supplies"
              />
              <CurrencyInput
                label="Monthly Maintenance Reserve"
                value={zb.monthlyMaintenance}
                onChange={(val) => updateZanzibar({ monthlyMaintenance: val })}
                helperText="Repairs, plumbing, touch-ups"
              />
              <CurrencyInput
                label="Cleaning Staff Allowance"
                value={zb.monthlyCleaning}
                onChange={(val) => updateZanzibar({ monthlyCleaning: val })}
                helperText="Per-stay turnaround cleaner"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Scenario Stress Testing & JV Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Monthly P&L Ledger Card */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-6 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-4">
              Monthly Property P&L Statement
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-600 dark:text-stone-400">Nightly Accommodation Revenue:</span>
                <span className="font-mono-num font-bold text-stone-900 dark:text-stone-100">
                  {formatTZS(zanzibarCalc.bookedNights * zb.nightlyPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-600 dark:text-stone-400">Total Operating Expenses:</span>
                <span className="font-mono-num text-rose-600 dark:text-rose-400">
                  -{formatTZS(zanzibarCalc.totalOperatingExpenses)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 bg-stone-50 dark:bg-stone-800/60 px-3 rounded-xl">
                <span className="font-bold text-stone-800 dark:text-stone-200">Total Net Property Profit:</span>
                <span className="font-mono-num font-bold text-sky-800 dark:text-sky-300">
                  {formatTZS(zanzibarCalc.totalOperatingProfit)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-600 dark:text-stone-400">Alice’s 50% Profit Share:</span>
                <span className="font-mono-num text-stone-900 dark:text-stone-100">
                  {formatTZS(zanzibarCalc.aliceProfitShare)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-stone-100 dark:border-stone-800">
                <span className="font-bold text-[#1E3A2F] dark:text-emerald-400">Your 50% Profit Share:</span>
                <span className="font-mono-num font-bold text-emerald-700 dark:text-emerald-400">
                  +{formatTZS(zanzibarCalc.userProfitShare)}
                </span>
              </div>
            </div>
          </div>

          {/* Occupancy Scenario Chart */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-6 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              Seasonal Occupancy Scenarios
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Your 50% profit across low, base, and peak tourist seasons.
            </p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancyScenarios} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                  <Tooltip
                    formatter={(val: any) => [formatTZS(Number(val)), 'Your Profit Share']}
                    contentStyle={{
                      backgroundColor: state.theme === 'dark' ? '#1C1917' : '#FFFFFF',
                      borderColor: '#78716C',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="userProfit" name="Your Share" fill="#41788E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Notes for Zanzibar */}
      <PinnedCorkboard
        filterTarget="zanzibar"
        title="Pinned Zanzibar Agreement & Notes"
      />

      {/* Comments for Zanzibar */}
      <CommentsSection
        targetId="zanzibar"
        title="Zanzibar JV Feedback & Alice Notes"
        subtitle="Log conversations with Alice, apartment lease renewals, and guest review feedback."
      />
    </div>
  );
};
