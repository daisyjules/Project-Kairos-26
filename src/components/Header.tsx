import React from 'react';
import { useKairos } from '../context/KairosContext';
import { formatTZS, formatRatio } from '../utils/formatters';
import { BookOpen, AlertTriangle } from 'lucide-react';

export const Header: React.FC = () => {
  const { masterCalc, setActiveTab } = useKairos();

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Brand & Clean Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-all cursor-pointer font-bold text-sm"
              title="Return to Master Overview"
            >
              K
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
                  Project Kairos 26
                </h1>
                <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                  • 30M Capital Plan
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Founder capital deployment, cash flow engines & debt coverage
              </p>
            </div>
          </div>

          {/* Key Indicators & Shortcuts */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Net Monthly Cushion Badge - High Contrast & High Legibility */}
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-1.5 shadow-2xs">
              <span className="text-xs font-semibold text-gray-700">
                Net Cushion:
              </span>
              <span
                className={`font-mono-num text-xs font-bold ${
                  masterCalc.monthlyCashFlowAfterDebt >= 0
                    ? 'text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded'
                    : 'text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded'
                }`}
              >
                {masterCalc.monthlyCashFlowAfterDebt >= 0 ? '+' : ''}
                {formatTZS(masterCalc.monthlyCashFlowAfterDebt)}/mo
              </span>
            </div>

            {/* DSCR Health Pill */}
            <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>DSCR {formatRatio(masterCalc.dscr)}</span>
            </div>

            {/* Diary Button Shortcut */}
            <button
              type="button"
              onClick={() => setActiveTab('diary')}
              className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 transition-all cursor-pointer shadow-2xs"
            >
              <BookOpen className="h-3.5 w-3.5 text-gray-600" />
              <span>Diary</span>
            </button>
          </div>
        </div>

        {/* Over-allocation warning banner */}
        {masterCalc.isOverAllocated && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              Total allocations exceed 30,000,000 TZS by {formatTZS(masterCalc.totalAllocated - masterCalc.startingCapital)}.
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

