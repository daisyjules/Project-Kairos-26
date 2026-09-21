import React from 'react';
import { useKairos } from '../context/KairosContext';
import { CurrencyInput } from './CurrencyInput';
import { StatCard } from './StatCard';
import { WarningBanner } from './WarningBanner';
import { formatTZS, formatPercent } from '../utils/formatters';
import {
  Sparkles,
  Layers,
  Shirt,
  Palmtree,
  Calendar,
  Compass,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const RetroAtelierView: React.FC = () => {
  const { state, setActiveTab, updateRetroAtelier } = useKairos();
  const ra = state.retroAtelier;
  const projectedAnnualProfit = ra.targetMonthlyProfit * 12;
  const projectedAnnualROI = ra.estimatedCapitalRequired > 0
    ? (projectedAnnualProfit / ra.estimatedCapitalRequired) * 100
    : 0;

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
            onClick={() => setActiveTab('apex_ecosystem')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A2F] dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <span>APEX Ecosystem</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1E3A2F]/10 text-[#1E3A2F] dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Future APEX Phase • Hospitality & Design
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              Retro Atelier (Concept & Roadmap)
            </h1>
            <p className="mt-1 font-serif-body text-sm text-stone-600 dark:text-stone-300 max-w-2xl">
              An APEX design, aesthetic living & boutique hospitality project. It has not received capital yet
              and does not generate income yet, but forms the creative flagship of the APEX ecosystem.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50/80 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
            <Clock className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300">Phase Status</span>
              <div className="font-mono-num text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                {ra.status}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Capital Discipline Warning */}
      <WarningBanner
        type="info"
        title="Capital Discipline Rule: No Initial 30M Loan Capital Allocated"
        message="No initial capital allocated yet. Launch should be funded from business cash flow, reinvested profits from Klin Fitz & Zanzibar, or future external capital rather than the initial 30M loan unless explicitly reallocated."
      />

      {/* 4 Projected Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Target Launch Window"
          value={ra.targetLaunchDate}
          subValue="Post Klin Fitz & Zanzibar stabilization"
          badge={{ text: 'Roadmap Milestone', variant: 'info' }}
          icon={<Calendar className="h-4 w-4" />}
        />

        <StatCard
          label="Required Launch Capital"
          value={formatTZS(ra.estimatedCapitalRequired)}
          subValue="To be funded from organic business surplus"
          badge={{ text: 'Funding Target', variant: 'neutral' }}
          icon={<Compass className="h-4 w-4" />}
        />

        <StatCard
          label="Target Monthly Revenue"
          value={formatTZS(ra.targetMonthlyRevenue)}
          subValue={`Target profit: ${formatTZS(ra.targetMonthlyProfit)}/mo`}
          badge={{ text: 'Projected Model', variant: 'neutral' }}
          icon={<TrendingUp className="h-4 w-4" />}
        />

        <StatCard
          label="Projected Annual Profit"
          value={formatTZS(projectedAnnualProfit)}
          subValue={`Projected ROI: ${formatPercent(projectedAnnualROI, 1)}`}
          badge={{ text: 'Stabilized APEX Run-rate', variant: 'success' }}
          icon={<Sparkles className="h-4 w-4" />}
        />
      </div>

      {/* DUAL COLUMN: ROADMAP TARGETS & ECOSYSTEM SYNERGY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Editable Target Modeling */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              Concept Target Projections
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Model the financial footprint and launch criteria for Retro Atelier.
            </p>

            <div className="space-y-4">
              <CurrencyInput
                label="Estimated Capital Required to Launch"
                value={ra.estimatedCapitalRequired}
                onChange={(v) => updateRetroAtelier({ estimatedCapitalRequired: v })}
                step={500000}
                helperText="Interior renovation, curated inventory, bespoke fittings"
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-stone-600 dark:text-stone-400">
                  Target Launch Quarter / Year
                </label>
                <input
                  type="text"
                  value={ra.targetLaunchDate}
                  onChange={(e) => updateRetroAtelier({ targetLaunchDate: e.target.value })}
                  placeholder="e.g. Q4 2026 / Q1 2027"
                  className="rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-xs text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                />
              </div>

              <CurrencyInput
                label="Target Monthly Revenue"
                value={ra.targetMonthlyRevenue}
                onChange={(v) => updateRetroAtelier({ targetMonthlyRevenue: v })}
                step={250000}
                helperText="Hospitality bookings & custom design sales"
              />

              <CurrencyInput
                label="Target Monthly Operating Profit"
                value={ra.targetMonthlyProfit}
                onChange={(v) => updateRetroAtelier({ targetMonthlyProfit: v })}
                step={100000}
                helperText="Estimated net operating surplus"
              />
            </div>
          </div>
        </div>

        {/* Right Column: APEX Ecosystem Synergy Links */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              APEX Ecosystem Multiplier Synergies
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              How Retro Atelier integrates with existing Kairos 26 cash engines.
            </p>

            <div className="space-y-4">
              {/* Synergy 1: Klin Fitz */}
              <div className="rounded-lg border border-stone-200 bg-stone-50/50 p-4 dark:border-stone-800 dark:bg-stone-800/30 flex items-start gap-3">
                <div className="rounded-md bg-[#4E7764]/20 p-2 text-[#2D4A3E] dark:text-emerald-400">
                  <Shirt className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    Laundry & Linen Service by Klin Fitz
                  </h4>
                  <p className="text-[11px] font-serif-body text-stone-600 dark:text-stone-400 mt-0.5">
                    Retro Atelier’s hospitality suites route 100% of guest linen, bedding, and uniform turnover directly to Klin Fitz, securing guaranteed B2B revenue for the family business.
                  </p>
                </div>
              </div>

              {/* Synergy 2: Zanzibar Airbnb */}
              <div className="rounded-lg border border-stone-200 bg-stone-50/50 p-4 dark:border-stone-800 dark:bg-stone-800/30 flex items-start gap-3">
                <div className="rounded-md bg-[#7E9F8E]/20 p-2 text-[#2D4A3E] dark:text-emerald-400">
                  <Palmtree className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    Guest Cross-Selling & Island Stays
                  </h4>
                  <p className="text-[11px] font-serif-body text-stone-600 dark:text-stone-400 mt-0.5">
                    Guests visiting Zanzibar Airbnb receive curated direct booking access to Retro Atelier properties on the mainland, reducing third-party OTA commissions.
                  </p>
                </div>
              </div>

              {/* Synergy 3: Design & Craft */}
              <div className="rounded-lg border border-stone-200 bg-stone-50/50 p-4 dark:border-stone-800 dark:bg-stone-800/30 flex items-start gap-3">
                <div className="rounded-md bg-[#8C7A6B]/20 p-2 text-[#8C7A6B]">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    Bespoke Aesthetic Design & Furnishing
                  </h4>
                  <p className="text-[11px] font-serif-body text-stone-600 dark:text-stone-400 mt-0.5">
                    Retro Atelier designs and manufactures custom furniture and finishes for all APEX units, elevating rental value and establishing a tangible luxury lifestyle brand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
