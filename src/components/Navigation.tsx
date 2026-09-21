import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Shirt,
  Palmtree,
  Egg,
  TrendingUp,
  CreditCard,
  PieChart,
  Car,
  CalendarCheck,
  Table,
  Compass,
  Sparkles,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { useKairos } from '../context/KairosContext';
import { TabKey } from '../types';

export const Navigation: React.FC = () => {
  const { state, setActiveTab, masterCalc } = useKairos();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryTabs: { key: TabKey; label: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[] = [
    { key: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { key: 'diary', label: 'Diary', icon: <Sparkles className="h-4 w-4 text-amber-500" /> },
    { key: 'klinfitz', label: 'Klin Fitz', icon: <Shirt className="h-4 w-4" /> },
    { key: 'zanzibar', label: 'Zanzibar Airbnb', icon: <Palmtree className="h-4 w-4" /> },
    { key: 'poultry', label: 'Mom’s Poultry', icon: <Egg className="h-4 w-4" /> },
    { key: 'utt', label: 'UTT Wealth', icon: <TrendingUp className="h-4 w-4" /> },
    {
      key: 'loan',
      label: 'Debt & Solvency',
      icon: <CreditCard className="h-4 w-4" />,
      badge: masterCalc.dscr < 1.0 ? 'Deficit' : undefined,
      badgeColor: 'bg-rose-600 text-white',
    },
  ];

  const secondaryTabs: { key: TabKey; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: 'allocation',
      label: '30M Allocations',
      desc: 'Capital allocation buckets & custom categories',
      icon: <PieChart className="h-4 w-4 text-gray-700" />,
    },
    {
      key: 'monthly_tracker',
      label: 'Monthly Ledger',
      desc: 'Cashflow forecast and editable actuals',
      icon: <Table className="h-4 w-4 text-gray-700" />,
    },
    {
      key: 'roadmap',
      label: 'Roadmap',
      desc: 'Phase milestones from Month 1 to Year 2',
      icon: <CalendarCheck className="h-4 w-4 text-gray-700" />,
    },
    {
      key: 'car_laptop',
      label: 'Car & Laptop Caps',
      desc: 'Asset purchase caps & utility analysis',
      icon: <Car className="h-4 w-4 text-gray-700" />,
    },
    {
      key: 'apex_ecosystem',
      label: 'APEX Ecosystem',
      desc: 'Business synergy matrix and reinvestment',
      icon: <Compass className="h-4 w-4 text-gray-700" />,
    },
    {
      key: 'retro_atelier',
      label: 'Retro Atelier',
      desc: 'Future design studio and listening residency',
      icon: <Sparkles className="h-4 w-4 text-gray-700" />,
    },
  ];

  const isSecondaryActive = secondaryTabs.some((t) => t.key === state.activeTab);
  const activeSecondaryItem = secondaryTabs.find((t) => t.key === state.activeTab);

  return (
    <nav className="rounded-xl border border-gray-200 bg-white p-1.5 shadow-2xs">
      <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
        {/* Primary Tabs */}
        <div className="flex items-center gap-1 min-w-max">
          {primaryTabs.map((tab) => {
            const isActive = state.activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                id={`tab-${tab.key}`}
                className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold tracking-tight transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span
                  className={`${
                    isActive
                      ? 'text-gray-200'
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                >
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Secondary Sections Dropdown */}
        <div className="relative pl-1 shrink-0" ref={moreRef}>
          <button
            type="button"
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            id="more-sections-dropdown-btn"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold tracking-tight transition-all cursor-pointer select-none ${
              isSecondaryActive
                ? 'bg-gray-100 text-gray-900 font-bold border border-gray-300'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-gray-400" />
            <span>{isSecondaryActive ? activeSecondaryItem?.label.split(' ')[0] + '...' : 'More'}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-150 ${
                isMoreOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isMoreOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg z-50 animate-in fade-in duration-100">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 mb-1">
                More Modules
              </div>
              <div className="space-y-0.5">
                {secondaryTabs.map((item) => {
                  const isActive = state.activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.key);
                        setIsMoreOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 rounded-lg p-2 text-left text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-gray-100 text-gray-900 font-bold'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="p-1 rounded bg-gray-100 text-gray-700">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
