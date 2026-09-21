import React from 'react';
import { useKairos } from '../context/KairosContext';
import { CurrencyInput } from './CurrencyInput';
import { StatCard } from './StatCard';
import { WarningBanner } from './WarningBanner';
import { formatTZS, formatPercent } from '../utils/formatters';
import {
  Car,
  Laptop,
  AlertTriangle,
  CheckSquare,
  Square,
  Wrench,
  Fuel,
  Shield,
  Briefcase,
  Layers,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

export const CarLaptopView: React.FC = () => {
  const { state, setActiveTab, updateCar, updateLaptop, carCalc } = useKairos();
  const car = state.car;
  const laptop = state.laptop;

  const utilityChecklist = [
    {
      key: 'useForKlinFitz',
      label: 'Klin Fitz Laundry Deliveries & Customer Pickups',
      desc: 'Transporting bulk laundry loads, linens from hotels',
      value: car.useForKlinFitz,
    },
    {
      key: 'useForSuppliers',
      label: 'Wholesale Supplier Runs',
      desc: 'Bulk detergent, packaging, poultry feed sourcing trips',
      value: car.useForSuppliers,
    },
    {
      key: 'useForAirbnb',
      label: 'Zanzibar Airbnb Logistics & Emergency Runs',
      desc: 'Airport guest assistance, linen turnover, hardware repairs',
      value: car.useForAirbnb,
    },
    {
      key: 'useForPoultry',
      label: 'Mom’s Poultry Feed & Chick Delivery Logistics',
      desc: 'Transporting 50kg feed bags, live crates, farm visits',
      value: car.useForPoultry,
    },
    {
      key: 'useForPersonal',
      label: 'Personal & Lifestyle Commutes',
      desc: 'Daily personal transit and founder mobility',
      value: car.useForPersonal,
    },
  ];

  const toggleUtility = (key: string) => {
    updateCar({ [key]: !car[key as keyof typeof car] });
  };

  const businessUtilityCount = [
    car.useForKlinFitz,
    car.useForSuppliers,
    car.useForAirbnb,
    car.useForPoultry,
  ].filter(Boolean).length;

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
            onClick={() => setActiveTab('allocation')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A2F] dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <span>30M Allocation</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#C86D51]/10 text-[#C86D51] dark:bg-rose-950/40 dark:text-rose-300 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
              <Car className="h-3.5 w-3.5" />
              Transport & Productivity Assets
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              Vehicle & Productivity Hard Caps
            </h1>
            <p className="mt-1 font-serif-body text-sm text-stone-600 dark:text-stone-300 max-w-2xl">
              Strict budget guardrails: Car purchase maximum is <strong>TZS 10,000,000</strong>.
              Laptop maximum is <strong>TZS 1,000,000</strong>. Modeling true first-year total cost of ownership.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-800">
            <Briefcase className="h-5 w-5 text-[#1E3A2F] dark:text-emerald-400" />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-stone-500">Business Utility Score</span>
              <div className="font-mono-num text-sm font-bold text-stone-900 dark:text-stone-100">
                {businessUtilityCount} / 4 Business Engines Served
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings if caps exceeded */}
      {carCalc.isOverBudget && (
        <WarningBanner
          type="danger"
          title="Car Purchase Price Exceeds Hard Ceiling of TZS 10,000,000"
          message={`The car purchase price is entered as ${formatTZS(
            car.purchasePrice
          )}. This exceeds the maximum 10M cap by ${formatTZS(
            car.purchasePrice - 10000000
          )}. The car is a depreciating utility expense, not an investment asset.`}
        />
      )}

      {laptop.purchasePrice > 1000000 && (
        <WarningBanner
          type="warning"
          title="Laptop Budget Exceeds Hard Ceiling of TZS 1,000,000"
          message={`The laptop price is entered as ${formatTZS(
            laptop.purchasePrice
          )}. The ceiling is TZS 1,000,000 for a functional refurbished productivity machine.`}
        />
      )}

      {/* 4 Car & Laptop Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Initial Car Outlay"
          value={formatTZS(carCalc.totalInitialCost)}
          subValue={`Price: ${formatTZS(car.purchasePrice)} + ${formatTZS(
            carCalc.totalInitialCost - car.purchasePrice
          )} setup/repairs`}
          badge={{
            text: carCalc.isOverBudget ? 'Above 10M Cap' : 'Under 10M Cap',
            variant: carCalc.isOverBudget ? 'danger' : 'success',
          }}
          icon={<Car className="h-4 w-4" />}
        />

        <StatCard
          label="Monthly Running Cost"
          value={formatTZS(carCalc.monthlyRunningCost)}
          subValue={`Fuel: ${formatTZS(car.monthlyFuel)}/mo • Maint: ${formatTZS(car.monthlyMaintenance)}/mo`}
          badge={{ text: 'Monthly Drain', variant: 'warning' }}
          icon={<Fuel className="h-4 w-4" />}
        />

        <StatCard
          label="First-Year Total Cost"
          value={formatTZS(carCalc.firstYearTotalCost)}
          subValue="Initial acquisition + 12 months running expenses"
          badge={{ text: 'Year 1 TCO', variant: 'neutral' }}
          icon={<Wrench className="h-4 w-4" />}
        />

        <StatCard
          label="Laptop (Productivity Tool)"
          value={formatTZS(laptop.purchasePrice)}
          subValue="Productivity asset (Not investment income)"
          badge={{
            text: laptop.purchasePrice > 1000000 ? 'Over 1M Cap' : 'Under 1M Cap',
            variant: laptop.purchasePrice > 1000000 ? 'danger' : 'success',
          }}
          icon={<Laptop className="h-4 w-4" />}
        />
      </div>

      {/* DUAL COLUMN: CAR COST OF OWNERSHIP & UTILITY AUDIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Car Initial Costs & Monthly Upkeep */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Car Acquisition & Initial Reconditioning */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              1. Car Acquisition & Setup Outlay
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Hard maximum purchase ceiling: <strong>TZS 10,000,000</strong>. Plus initial compliance and roadworthiness.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CurrencyInput
                label="Vehicle Purchase Price"
                value={car.purchasePrice}
                onChange={(v) => updateCar({ purchasePrice: v })}
                step={250000}
                slider
                max={12000000}
                warningIfAbove={10000000}
                warningMessage="Exceeds 10M cap!"
                helperText="Maximum allowed budget: TZS 10,000,000"
              />
              <CurrencyInput
                label="Insurance (Comprehensive / 3rd Party)"
                value={car.insurance}
                onChange={(v) => updateCar({ insurance: v })}
                step={50000}
                helperText="Annual motor cover"
              />
              <CurrencyInput
                label="TRA Registration & Ownership Transfer"
                value={car.registration}
                onChange={(v) => updateCar({ registration: v })}
                step={25000}
                helperText="Legal title and plate fee"
              />
              <CurrencyInput
                label="Initial Roadworthiness & Repairs"
                value={car.initialRepairs}
                onChange={(v) => updateCar({ initialRepairs: v })}
                step={50000}
                helperText="Brakes, suspension, AC check"
              />
              <CurrencyInput
                label="Initial Major Servicing & Fluids"
                value={car.initialServicing}
                onChange={(v) => updateCar({ initialServicing: v })}
                step={25000}
                helperText="Engine oil, transmission fluid, filters"
              />
              <CurrencyInput
                label="New Tyres (Set of 4)"
                value={car.tyres}
                onChange={(v) => updateCar({ tyres: v })}
                step={50000}
                helperText="Safety & commercial grip"
              />
            </div>
          </div>

          {/* Section 2: Ongoing Monthly Running Expenses */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              2. Ongoing Monthly Running Costs
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Monthly cash drain: <strong>{formatTZS(carCalc.monthlyRunningCost)}/mo</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CurrencyInput
                label="Monthly Fuel Budget"
                value={car.monthlyFuel}
                onChange={(v) => updateCar({ monthlyFuel: v })}
                step={25000}
                helperText="Estimated commercial + personal fuel"
              />
              <CurrencyInput
                label="Monthly Maintenance Reserve"
                value={car.monthlyMaintenance}
                onChange={(v) => updateCar({ monthlyMaintenance: v })}
                step={10000}
                helperText="Routine wash, punctures, minor repairs"
              />
            </div>
          </div>

          {/* Section 3: Laptop Productivity Asset */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Laptop className="h-5 w-5 text-[#2D4A3E] dark:text-emerald-400" />
              <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100">
                3. Laptop Productivity Asset
              </h3>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              Budget cap: <strong>TZS 1,000,000</strong>. Strictly classified as a <em>Productivity Asset</em> for founder operations, not income-generating investment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CurrencyInput
                label="Laptop Purchase Price"
                value={laptop.purchasePrice}
                onChange={(v) => updateLaptop({ purchasePrice: v })}
                step={25000}
                slider
                max={2000000}
                warningIfAbove={1000000}
                warningMessage="Exceeds 1M cap!"
                helperText="Target: TZS 900,000 – 1,000,000 max"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-stone-600 dark:text-stone-400">
                  Target Spec / Model
                </label>
                <input
                  type="text"
                  value={laptop.brandModel}
                  onChange={(e) => updateLaptop({ brandModel: e.target.value })}
                  className="rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-xs text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Business Utility vs. Lifestyle Classification */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              Business Utility vs. Lifestyle Audit
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
              The dashboard does not forbid buying a car; it audits whether the car serves revenue-generating operations.
            </p>

            <div className="space-y-3">
              {utilityChecklist.map((item) => (
                <div
                  key={item.key}
                  onClick={() => toggleUtility(item.key)}
                  className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                    item.value
                      ? 'border-[#2D4A3E]/40 bg-[#2D4A3E]/5 dark:border-emerald-800 dark:bg-emerald-950/20'
                      : 'border-stone-200 bg-stone-50/50 dark:border-stone-800 dark:bg-stone-800/30'
                  }`}
                >
                  <div className="mt-0.5 text-[#2D4A3E] dark:text-emerald-400">
                    {item.value ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4 text-stone-400" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {item.label}
                    </h5>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 font-serif-body">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Utility Score Evaluation */}
            <div className="mt-5 rounded-lg bg-stone-100 dark:bg-stone-800 p-4 text-xs font-serif-body text-stone-700 dark:text-stone-300">
              {businessUtilityCount >= 3 ? (
                <p>
                  ✓ <strong>High Commercial Utility</strong>: The vehicle actively powers {businessUtilityCount} business engines (laundry pickup, supplier runs, Airbnb turnovers, poultry logistics). The operating fuel expense is justified by operational efficiency.
                </p>
              ) : (
                <p>
                  ⚠️ <strong>Low Commercial Utility ({businessUtilityCount}/4)</strong>: The car is primarily functioning as a personal transport expense. Keep purchase price strictly below TZS 8.5M–9M to conserve capital for cash-flow businesses.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
