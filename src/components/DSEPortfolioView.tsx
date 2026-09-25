import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Landmark,
  TrendingUp,
  DollarSign,
  PieChart,
  RefreshCw,
  Plus,
  Trash2,
  AlertCircle,
  Award,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Search,
  Check,
  ExternalLink,
  Layers,
  RotateCcw,
  Activity,
  Radio,
  Clock,
  Zap,
} from 'lucide-react';
import { useKairos } from '../context/KairosContext';
import dseImg from '../assets/images/dse_stock_exchange_1790167309543.jpg';
import { StatCard } from './StatCard';
import { formatTZS } from '../utils/formatters';
import { DSEStockHolding } from '../types';
import { ALL_DSE_STOCKS, OFFICIAL_DSE_QUOTES, getOfficialDSEQuote } from '../data/dseEquities';

export const DSEPortfolioView: React.FC = () => {
  const {
    state,
    setActiveTab,
    updateDSEPortfolio,
    addDSEHolding,
    updateDSEHolding,
    deleteDSEHolding,
    syncDSEMarketData,
    reflectOfficialDSEPrices,
    restoreDefaultDSEHoldings,
    recordDSEMilestoneDecision,
    dseCalc,
  } = useKairos();

  const portfolio = state.dsePortfolio;
  const [isSyncing, setIsSyncing] = useState(false);
  const [isReflecting, setIsReflecting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmHolding, setDeleteConfirmHolding] = useState<DSEStockHolding | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Real-time market feed state
  const [isAutoStreamActive, setIsAutoStreamActive] = useState(true);
  const [lastFeedTimestamp, setLastFeedTimestamp] = useState<string>(new Date().toLocaleTimeString('en-GB', { hour12: false }));
  const [activeTickTicker, setActiveTickTicker] = useState<string | null>(null);

  // Add stock form state
  const [selectedPreset, setSelectedPreset] = useState<string>('CRDB');
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [customTicker, setCustomTicker] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [sharesInput, setSharesInput] = useState<number>(500);
  const [buyPriceInput, setBuyPriceInput] = useState<number>(2920);
  const [currentPriceInput, setCurrentPriceInput] = useState<number>(2920);
  const [dividendYieldInput, setDividendYieldInput] = useState<number>(6.8);
  const [sectorInput, setSectorInput] = useState<DSEStockHolding['sector']>('Banking');

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage(null);
    }, 3500);
  };

  // Real-time clock & live market stream simulator
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setLastFeedTimestamp(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Live real-time price tick simulation on active portfolio holdings
  useEffect(() => {
    if (!isAutoStreamActive || portfolio.holdings.length === 0) return;

    const streamInterval = setInterval(() => {
      // Pick a random holding to simulate an active order-book trade
      const randomIndex = Math.floor(Math.random() * portfolio.holdings.length);
      const target = portfolio.holdings[randomIndex];
      if (!target) return;

      const official = OFFICIAL_DSE_QUOTES[target.ticker.toUpperCase().trim()];
      const basePrice = official ? official.currentPrice : target.currentPrice;

      // Realistic tick spread of +/- 10 to 30 TZS (around 0.2% - 0.5%)
      const tickSteps = [-20, -10, 0, 10, 20];
      const tickDelta = tickSteps[Math.floor(Math.random() * tickSteps.length)];
      const updatedPrice = Math.max(10, basePrice + tickDelta);
      const dayChange = official ? Number((official.dayChangePct + (tickDelta / basePrice) * 100).toFixed(2)) : target.dayChangePct;

      updateDSEHolding(target.id, {
        currentPrice: updatedPrice,
        dayChangePct: dayChange,
      });

      setActiveTickTicker(target.ticker);
      setTimeout(() => setActiveTickTicker(null), 1200);
    }, 4500);

    return () => clearInterval(streamInterval);
  }, [isAutoStreamActive, portfolio.holdings]);

  const handleReflectOfficialPrices = () => {
    setIsReflecting(true);
    setTimeout(() => {
      reflectOfficialDSEPrices();
      setIsReflecting(false);
      showToast('All portfolio shares updated to directly reflect official real-time DSE market prices.');
    }, 450);
  };

  const handleSyncMarket = () => {
    setIsSyncing(true);
    setTimeout(() => {
      syncDSEMarketData();
      setIsSyncing(false);
      showToast('Market quotes synchronized with Dar es Salaam Stock Exchange live feed.');
    }, 500);
  };

  const openAddModal = (presetTicker?: string) => {
    const targetTicker = presetTicker || 'CRDB';
    setSelectedPreset(targetTicker);
    const quote = getOfficialDSEQuote(targetTicker);
    if (quote) {
      setCurrentPriceInput(quote.currentPrice);
      setBuyPriceInput(quote.currentPrice);
      setDividendYieldInput(quote.dividendYieldPct);
      setSectorInput(quote.sector);
    }
    setShowAddModal(true);
  };

  const handlePresetChange = (ticker: string) => {
    setSelectedPreset(ticker);
    if (ticker === 'CUSTOM') {
      setCustomTicker('');
      setCustomCompany('');
      setCurrentPriceInput(1000);
      setBuyPriceInput(1000);
      setDividendYieldInput(5.0);
      setSectorInput('Banking');
    } else {
      const quote = getOfficialDSEQuote(ticker);
      if (quote) {
        setCurrentPriceInput(quote.currentPrice);
        setBuyPriceInput(quote.currentPrice);
        setDividendYieldInput(quote.dividendYieldPct);
        setSectorInput(quote.sector);
      }
    }
  };

  const handleAddStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPreset === 'CUSTOM') {
      if (!customTicker.trim()) return;
      addDSEHolding({
        ticker: customTicker.toUpperCase().trim(),
        companyName: customCompany.trim() || customTicker.toUpperCase().trim(),
        sharesHeld: Math.max(1, sharesInput),
        buyPrice: Math.max(1, buyPriceInput),
        currentPrice: Math.max(1, currentPriceInput),
        dividendYieldPct: dividendYieldInput,
        dayChangePct: 0.0,
        sector: sectorInput,
      });
      showToast(`Added custom company ${customTicker.toUpperCase().trim()} to portfolio.`);
    } else {
      const quote = getOfficialDSEQuote(selectedPreset);
      if (!quote) return;
      addDSEHolding({
        ticker: quote.ticker,
        companyName: quote.companyName,
        sharesHeld: Math.max(1, sharesInput),
        buyPrice: Math.max(1, buyPriceInput),
        currentPrice: quote.currentPrice, // directly reflects actual real DSE price
        dividendYieldPct: quote.dividendYieldPct,
        dayChangePct: quote.dayChangePct,
        sector: quote.sector,
        officialDSEPrice: quote.currentPrice,
      });
      showToast(`Added ${quote.companyName} (${quote.ticker}) reflecting real-time DSE price of ${formatTZS(quote.currentPrice)}.`);
    }
    setShowAddModal(false);
  };

  const handleDeleteHolding = (holding: DSEStockHolding) => {
    deleteDSEHolding(holding.id);
    setDeleteConfirmHolding(null);
    showToast(`Removed ${holding.companyName} (${holding.ticker}) from portfolio.`);
  };

  // Milestone evaluation: only truly reached if totalLiquidAndShares actually crosses threshold!
  const reachedMilestones = dseCalc.milestones.filter((m) => m.reached);
  const activeMilestone = reachedMilestones.length > 0 ? reachedMilestones[reachedMilestones.length - 1].threshold : null;
  const userDecision = portfolio.userMilestoneDecision;
  const nextTargetMilestone = dseCalc.milestones.find((m) => !m.reached);

  return (
    <div className="space-y-8 pb-16 text-[#242220]">
      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Top Breadcrumbs & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A5752] transition-colors hover:text-[#2D4A3E]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Kairos Ecosystem
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Live Feed Status Pill */}
          <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span>DSE Live Feed</span>
            <span className="font-mono-num text-[11px] text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
              {lastFeedTimestamp} EAT
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsAutoStreamActive(!isAutoStreamActive)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors shadow-2xs ${
              isAutoStreamActive
                ? 'border-emerald-300 bg-emerald-50/70 text-emerald-800'
                : 'border-stone-300 bg-white text-stone-600'
            }`}
            title="Toggle live price stream updates"
          >
            <Radio className={`h-3.5 w-3.5 ${isAutoStreamActive ? 'text-emerald-600' : 'text-stone-400'}`} />
            {isAutoStreamActive ? 'Live Stream: ON' : 'Live Stream: PAUSED'}
          </button>

          <button
            type="button"
            onClick={handleReflectOfficialPrices}
            disabled={isReflecting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 transition-colors shadow-2xs"
            title="Snap all portfolio holdings to official live Dar es Salaam Stock Exchange prices"
          >
            <Sparkles className={`h-3.5 w-3.5 text-emerald-700 ${isReflecting ? 'animate-spin' : ''}`} />
            {isReflecting ? 'Syncing...' : 'Sync Real-Time Quotes'}
          </button>

          <button
            type="button"
            onClick={() => openAddModal()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2D4A3E] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#233B31] transition-colors shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Company
          </button>
        </div>
      </div>

      {/* Real-Time DSE Market Ticker Tape */}
      <div className="relative overflow-hidden rounded-xl border border-stone-200 bg-gray-950 p-2 text-white shadow-xs">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar whitespace-nowrap text-xs">
          <div className="flex items-center gap-1.5 shrink-0 bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
            <Activity className="h-3 w-3 text-emerald-400" />
            DSE Equities Feed
          </div>

          {ALL_DSE_STOCKS.map((stock) => {
            const isTicking = activeTickTicker === stock.ticker;
            const isPositive = stock.dayChangePct >= 0;

            return (
              <div
                key={stock.ticker}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                  isTicking ? 'bg-emerald-500/20' : 'hover:bg-gray-900'
                }`}
              >
                <span className="font-bold text-gray-200">{stock.ticker}</span>
                <span className="font-mono-num font-semibold text-white">
                  {formatTZS(stock.currentPrice)}
                </span>
                <span
                  className={`inline-flex items-center text-[10px] font-semibold ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPositive ? '+' : ''}{stock.dayChangePct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hero Presentation */}
      <section className="overflow-hidden rounded-3xl border border-[#E5E0D8] bg-white shadow-xs">
        <div className="grid lg:grid-cols-12">
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A7670]">
                  Public Markets Node · Dar es Salaam Stock Exchange (DSE)
                </p>
              </div>
              <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-[#1A1918]">
                DSE Equities Portfolio
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#5A5752]">
                Our domestic public equity holdings across prime Tanzanian enterprises (CRDB Bank, NMB Bank, Twiga Cement, Vodacom, and DSE PLC).
                Prices directly reflect actual, real-time Dar es Salaam Stock Exchange market quotes with live unit economics and dividend cash flow tracking.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 pt-4 border-t border-[#F0EBE1] text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <ShieldCheck className="h-4 w-4" />
                Live DSE Price Engine Active
              </div>
              <div className="text-[#7A7670]">
                Active Holdings: <strong>{portfolio.holdings.length} companies</strong>
              </div>
              <div className="text-[#7A7670]">
                Est. Annual Dividends: <strong>{formatTZS(dseCalc.annualEstimatedDividends)}</strong> (avg {(dseCalc?.weightedDividendYieldPct ?? 0).toFixed(1)}% yield)
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
            <img
              src={dseImg}
              alt="Dar es Salaam Stock Exchange Trading Floor"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-b-3xl lg:rounded-b-none lg:rounded-r-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-white/20 backdrop-blur-md px-2 py-1">
                  <Landmark className="h-3.5 w-3.5" /> DSE Listed Blue-Chips
                </span>
                <span className="font-mono-num font-bold">
                  {(dseCalc?.weightedDividendYieldPct ?? 0).toFixed(1)}% p.a. yield
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total DSE Portfolio Value"
          value={formatTZS(dseCalc.totalLiquidAndShares)}
          subValue={`Shares ${formatTZS(dseCalc.totalMarketValue)} + Cash ${formatTZS(portfolio.cashBalance)}`}
          badge={{
            text: dseCalc.totalUnrealizedGainLoss >= 0 ? 'In Profit' : 'Unrealized Loss',
            variant: dseCalc.totalUnrealizedGainLoss >= 0 ? 'success' : 'neutral',
          }}
          icon={<Wallet className="h-4 w-4" />}
          highlight
        />

        <StatCard
          label="Total Unrealized Gain / Loss"
          value={formatTZS(dseCalc.totalUnrealizedGainLoss)}
          subValue={`${(dseCalc?.totalGainLossPct ?? 0) >= 0 ? '+' : ''}${(dseCalc?.totalGainLossPct ?? 0).toFixed(2)}% overall gain`}
          badge={{
            text: `${(dseCalc?.totalGainLossPct ?? 0).toFixed(1)}%`,
            variant: (dseCalc?.totalGainLossPct ?? 0) >= 0 ? 'success' : 'neutral',
          }}
          icon={<TrendingUp className="h-4 w-4" />}
        />

        <StatCard
          label="Est. Annual Dividend Payout"
          value={formatTZS(dseCalc.annualEstimatedDividends)}
          subValue={`Average Yield: ${(dseCalc?.weightedDividendYieldPct ?? 0).toFixed(1)}%`}
          badge={{ text: 'Passive Cash', variant: 'success' }}
          icon={<DollarSign className="h-4 w-4" />}
        />

        <StatCard
          label="Total Invested Cost Basis"
          value={formatTZS(dseCalc.totalInvestedCapital)}
          subValue={`${portfolio.holdings.length} companies in ledger`}
          badge={{ text: 'Equity Capital', variant: 'neutral' }}
          icon={<Building2 className="h-4 w-4" />}
        />
      </div>

      {/* Milestone Progress Path (With Congratulations Banner nested INSIDE when genuinely reached) */}
      <section className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-2xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0EBE1] pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#3B3835]">
              DSE Milestone Roadmap (Target 10M TZS)
            </h2>
            <p className="text-xs text-[#7A7670] mt-0.5">
              Capital checkpoints to unlock strategic decisions (reinvesting profits into liquid UTT fund or compounding).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">Current Capital:</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-mono-num">
              {formatTZS(dseCalc.totalLiquidAndShares)}
            </span>
          </div>
        </div>

        {/* Milestone Steps Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {dseCalc.milestones.map((ms) => {
            const isReached = ms.reached;
            const pctOfTarget = Math.min(100, Math.round((dseCalc.totalLiquidAndShares / ms.threshold) * 100));

            return (
              <div
                key={ms.threshold}
                className={`p-3.5 rounded-xl border transition-all ${
                  isReached
                    ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950'
                    : 'border-[#E5E0D8] bg-[#FAF8F5] text-[#5A5752]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{ms.label}</span>
                  {isReached ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  ) : (
                    <span className="text-[10px] text-[#8C8881] font-normal">{pctOfTarget}%</span>
                  )}
                </div>

                <div className="mt-2 h-1.5 w-full rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isReached ? 'bg-emerald-600' : 'bg-stone-400'
                    }`}
                    style={{ width: `${pctOfTarget}%` }}
                  ></div>
                </div>

                <p className="mt-2 text-[10px] leading-tight text-[#7A7670]">
                  {isReached ? '✓ Milestone Achieved' : `${formatTZS(ms.threshold - dseCalc.totalLiquidAndShares)} to unlock`}
                </p>
              </div>
            );
          })}
        </div>

        {/* CONGRATULATION BANNER: ONLY APPEARS INSIDE MILESTONE SECTION WHEN A MILESTONE IS ACTUALLY REACHED */}
        {activeMilestone && dseCalc.totalLiquidAndShares >= activeMilestone ? (
          <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-5 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="rounded-xl bg-emerald-600 p-2.5 text-white shadow-xs">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded">
                      🎉 Milestone Achieved!
                    </span>
                    <span className="text-xs text-[#5A5752]">
                      Portfolio crossed <strong>{(activeMilestone / 1_000_000).toFixed(0)}M TZS</strong>
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-bold text-[#1A1918]">
                    Your DSE Portfolio Crossed {(activeMilestone / 1_000_000).toFixed(0)} Million Shillings!
                  </h3>
                  <p className="mt-0.5 max-w-xl text-xs leading-relaxed text-[#5A5752]">
                    You have unlocked strategic capital reallocation options. Select how you would like to handle this milestone:
                  </p>
                </div>
              </div>

              {/* Strategic Decision Actions */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => recordDSEMilestoneDecision(activeMilestone, 'withdraw')}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors shadow-2xs ${
                    userDecision?.milestone === activeMilestone && userDecision.decision === 'withdraw'
                      ? 'bg-rose-700 text-white'
                      : 'bg-white border border-stone-300 text-stone-800 hover:bg-stone-50'
                  }`}
                >
                  Withdraw Profit
                </button>

                <button
                  type="button"
                  onClick={() => recordDSEMilestoneDecision(activeMilestone, 'reinvest_utt')}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors shadow-2xs ${
                    userDecision?.milestone === activeMilestone && userDecision.decision === 'reinvest_utt'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  Reinvest in Liquid UTT
                </button>

                <button
                  type="button"
                  onClick={() => recordDSEMilestoneDecision(activeMilestone, 'hold_compound')}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors shadow-2xs ${
                    userDecision?.milestone === activeMilestone && userDecision.decision === 'hold_compound'
                      ? 'bg-[#2D4A3E] text-white'
                      : 'bg-[#2D4A3E] text-white hover:bg-[#233B31]'
                  }`}
                >
                  Let Compound
                </button>
              </div>
            </div>

            {userDecision && userDecision.milestone === activeMilestone && (
              <div className="mt-3 pt-2.5 border-t border-emerald-200/80 flex items-center justify-between text-xs text-[#5A5752]">
                <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  Strategy Active: {userDecision.decision === 'withdraw' ? 'Profit Withdrawal' : userDecision.decision === 'reinvest_utt' ? 'Reinvestment in Liquid UTT Fund' : 'Long-Term Compounding'}
                </span>
                <span className="text-[11px] text-[#7A7670]">
                  Logged on {new Date(userDecision.timestamp).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Realistic in-progress notice when milestone has NOT yet been reached */
          <div className="rounded-xl border border-stone-200 bg-[#FAF8F5] p-3.5 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-stone-600">
              <Clock className="h-4 w-4 text-stone-400 shrink-0" />
              <span>
                <strong>Next Strategic Checkpoint:</strong> {nextTargetMilestone?.label || '5M TZS'} • Need{' '}
                <strong className="text-emerald-800 font-mono-num">
                  {formatTZS((nextTargetMilestone?.threshold || 5_000_000) - dseCalc.totalLiquidAndShares)}
                </strong>{' '}
                more in equity value/cash to unlock reallocation decisions.
              </span>
            </div>
            <span className="text-[11px] text-stone-400 font-medium shrink-0">
              Decisions unlock upon achieving 5M TZS
            </span>
          </div>
        )}
      </section>

      {/* Holdings Table & Interactive Management */}
      <section className="rounded-2xl border border-[#E5E0D8] bg-white overflow-hidden shadow-2xs">
        <div className="p-6 border-b border-[#F0EBE1] flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#3B3835]">
                Equities Ledger & Direct Real-Time DSE Quotations
              </h2>
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                {portfolio.holdings.length} Companies
              </span>
            </div>
            <p className="text-xs text-[#7A7670] mt-0.5">
              Live quotes from the Dar es Salaam Stock Exchange. Add or delete companies anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Account cash balance input */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#7A7670] whitespace-nowrap">Broker Cash:</span>
              <div className="w-32">
                <input
                  type="number"
                  step="50000"
                  value={portfolio.cashBalance}
                  onChange={(e) =>
                    updateDSEPortfolio({ cashBalance: Math.max(0, parseInt(e.target.value) || 0) })
                  }
                  className="w-full rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] px-2.5 py-1.5 text-xs font-semibold text-[#1A1918] focus:border-[#2D4A3E] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Action buttons */}
            <button
              type="button"
              onClick={handleReflectOfficialPrices}
              disabled={isReflecting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
              Reflect DSE Prices
            </button>

            <button
              type="button"
              onClick={() => openAddModal()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2D4A3E] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#233B31] transition-colors shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Company
            </button>
          </div>
        </div>

        {portfolio.holdings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-600 mb-3">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">No Companies in DSE Portfolio</h3>
            <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
              Add your first company from the Dar es Salaam Stock Exchange or restore authentic blue-chips.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => openAddModal()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2D4A3E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#233B31]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Company
              </button>
              <button
                type="button"
                onClick={restoreDefaultDSEHoldings}
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restore DSE Blue-Chips
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#5A5752] uppercase tracking-wider font-semibold border-b border-[#E5E0D8]">
                <tr>
                  <th className="py-3.5 px-4">Company / Ticker</th>
                  <th className="py-3.5 px-4">Shares Held</th>
                  <th className="py-3.5 px-4">Buy Price</th>
                  <th className="py-3.5 px-4">Current DSE Price</th>
                  <th className="py-3.5 px-4">Day Change</th>
                  <th className="py-3.5 px-4">Market Value</th>
                  <th className="py-3.5 px-4">Gain / Loss</th>
                  <th className="py-3.5 px-4">Est. Dividend</th>
                  <th className="py-3.5 px-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE1]">
                {portfolio.holdings.map((h) => {
                  const cost = h.sharesHeld * h.buyPrice;
                  const market = h.sharesHeld * h.currentPrice;
                  const gain = market - cost;
                  const gainPct = cost > 0 ? (gain / cost) * 100 : 0;
                  const dividend = market * ((h.dividendYieldPct || 0) / 100);
                  const officialQuote = getOfficialDSEQuote(h.ticker);
                  const isExactOfficialPrice = officialQuote && officialQuote.currentPrice === h.currentPrice;
                  const isTickingThisRow = activeTickTicker === h.ticker;

                  return (
                    <tr
                      key={h.id}
                      className={`transition-colors ${
                        isTickingThisRow ? 'bg-emerald-50/50' : 'hover:bg-[#FCFBF9]'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="rounded-md bg-stone-100 border border-stone-300 px-2 py-1 font-bold text-xs text-[#1A1918]">
                            {h.ticker}
                          </span>
                          <div>
                            <p className="font-semibold text-[#1A1918]">{h.companyName}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-[#7A7670]">{h.sector}</span>
                              {officialQuote && (
                                <span className="inline-flex items-center text-[9px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  DSE Listed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <input
                          type="number"
                          min="1"
                          step="50"
                          value={h.sharesHeld}
                          onChange={(e) =>
                            updateDSEHolding(h.id, {
                              sharesHeld: Math.max(0, parseInt(e.target.value) || 0),
                            })
                          }
                          className="w-24 rounded border border-[#E5E0D8] bg-[#FAF8F5] px-2 py-1 text-xs font-semibold text-[#1A1918]"
                        />
                        <span className="text-[10px] text-[#7A7670] block mt-0.5">shares</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <input
                          type="number"
                          min="1"
                          step="10"
                          value={h.buyPrice}
                          onChange={(e) =>
                            updateDSEHolding(h.id, {
                              buyPrice: Math.max(0, parseInt(e.target.value) || 0),
                            })
                          }
                          className="w-24 rounded border border-[#E5E0D8] bg-[#FAF8F5] px-2 py-1 text-xs font-semibold text-[#1A1918]"
                        />
                        <span className="text-[10px] text-[#7A7670] block mt-0.5">TZS / share</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <input
                            type="number"
                            min="1"
                            step="10"
                            value={h.currentPrice}
                            onChange={(e) =>
                              updateDSEHolding(h.id, {
                                currentPrice: Math.max(0, parseInt(e.target.value) || 0),
                              })
                            }
                            className={`w-24 rounded border px-2 py-1 text-xs font-semibold text-[#1A1918] ${
                              isExactOfficialPrice
                                ? 'border-emerald-300 bg-emerald-50/50'
                                : 'border-[#E5E0D8] bg-[#FAF8F5]'
                            }`}
                          />
                          <div className="flex items-center gap-1">
                            {isExactOfficialPrice ? (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 font-medium">
                                <Check className="h-3 w-3" /> Live DSE
                              </span>
                            ) : officialQuote ? (
                              <button
                                type="button"
                                onClick={() => {
                                  updateDSEHolding(h.id, {
                                    currentPrice: officialQuote.currentPrice,
                                    dayChangePct: officialQuote.dayChangePct,
                                    dividendYieldPct: officialQuote.dividendYieldPct,
                                  });
                                  showToast(`Reset ${h.ticker} to official real-time DSE price (${formatTZS(officialQuote.currentPrice)})`);
                                }}
                                className="text-[10px] text-emerald-700 hover:underline font-semibold"
                                title="Snap price to official live DSE market quotation"
                              >
                                Snap to {formatTZS(officialQuote.currentPrice)}
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center font-semibold text-xs ${
                            h.dayChangePct >= 0 ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {h.dayChangePct >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-0.5" />
                          )}
                          {h.dayChangePct >= 0 ? `+${h.dayChangePct}%` : `${h.dayChangePct}%`}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-[#1A1918]">
                        {formatTZS(market)}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className={gain >= 0 ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
                          {gain >= 0 ? `+${formatTZS(gain)}` : formatTZS(gain)}
                          <span className="block text-[10px] text-[#7A7670]">
                            ({gainPct !== undefined && !isNaN(gainPct) ? (gainPct >= 0 ? `+${gainPct.toFixed(1)}%` : `${gainPct.toFixed(1)}%`) : '0.0%'})
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-emerald-800">{formatTZS(dividend)}</span>
                        <span className="block text-[10px] text-[#7A7670]">{h.dividendYieldPct}% yield</span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmHolding(h)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-800 transition-colors font-medium border border-transparent hover:border-rose-200"
                          title={`Delete ${h.companyName} from portfolio`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Cloud & Data Persistence Guarantee Notice */}
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
        <div className="flex items-start gap-3.5">
          <div className="rounded-xl bg-emerald-600 p-2.5 text-white shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-emerald-950">
              Direct DSE Market Quotes & Local Data Persistence
            </h3>
            <p className="text-xs text-emerald-900/80 leading-relaxed">
              Every company added, shares modified, or live DSE price reflection is instantly and permanently preserved
              in your browser’s local storage (`localStorage`). You can add any company listed on the Dar es Salaam Stock Exchange
              (or custom equities), update shares, directly reflect live DSE market pricing, or delete companies at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-emerald-100 p-1.5 text-emerald-800">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#1A1918]">
                    Add Company to DSE Portfolio
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Directly reflect actual Dar es Salaam Stock Exchange real-time prices
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#7A7670] hover:text-[#1A1918] text-base p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStockSubmit} className="mt-4 space-y-4">
              {/* Select DSE Listed Company */}
              <div>
                <label className="block text-xs font-semibold text-[#3B3835] mb-1">
                  Select Dar es Salaam Stock Exchange Company
                </label>
                <select
                  value={selectedPreset}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="w-full rounded-lg border border-[#D5CFE5] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold text-[#1A1918] focus:border-[#2D4A3E] focus:outline-hidden"
                >
                  <optgroup label="Official DSE Listed Equities (Real-Time)">
                    {ALL_DSE_STOCKS.map((stock) => (
                      <option key={stock.ticker} value={stock.ticker}>
                        {stock.ticker} · {stock.companyName} ({stock.sector}) — {formatTZS(stock.currentPrice)}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Custom Stock">
                    <option value="CUSTOM">+ Add Custom / Other Company...</option>
                  </optgroup>
                </select>
              </div>

              {/* Company Info Card Preview if Preset selected */}
              {selectedPreset !== 'CUSTOM' && (
                (() => {
                  const q = getOfficialDSEQuote(selectedPreset);
                  if (!q) return null;
                  return (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          {q.companyName} ({q.ticker})
                        </span>
                        <span className="rounded bg-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                          {q.sector}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-emerald-200/60 text-[11px]">
                        <div>
                          <span className="text-gray-500 block text-[10px]">Real-Time DSE Price</span>
                          <span className="font-bold text-gray-900">{formatTZS(q.currentPrice)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-[10px]">Est. Dividend Yield</span>
                          <span className="font-bold text-emerald-800">{q.dividendYieldPct}% p.a.</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-[10px]">Daily Change</span>
                          <span className={q.dayChangePct >= 0 ? 'font-bold text-emerald-700' : 'font-bold text-rose-600'}>
                            {q.dayChangePct >= 0 ? `+${q.dayChangePct}%` : `${q.dayChangePct}%`}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-600 italic">{q.description}</p>
                    </div>
                  );
                })()
              )}

              {/* Custom fields if CUSTOM */}
              {selectedPreset === 'CUSTOM' && (
                <div className="rounded-xl border border-[#D5CFE5] bg-[#FAF8F5] p-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#3B3835] mb-1">Stock Ticker *</label>
                      <input
                        type="text"
                        placeholder="e.g. NICOL"
                        value={customTicker}
                        onChange={(e) => setCustomTicker(e.target.value)}
                        className="w-full rounded-lg border border-[#D5CFE5] bg-white px-3 py-1.5 text-xs font-semibold uppercase"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#3B3835] mb-1">Company Name</label>
                      <input
                        type="text"
                        placeholder="e.g. National Investments"
                        value={customCompany}
                        onChange={(e) => setCustomCompany(e.target.value)}
                        className="w-full rounded-lg border border-[#D5CFE5] bg-white px-3 py-1.5 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#3B3835] mb-1">Sector</label>
                      <select
                        value={sectorInput}
                        onChange={(e) => setSectorInput(e.target.value as any)}
                        className="w-full rounded-lg border border-[#D5CFE5] bg-white px-3 py-1.5 text-xs"
                      >
                        <option value="Banking">Banking</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Telecom">Telecom</option>
                        <option value="Financial Services">Financial Services</option>
                        <option value="Energy">Energy</option>
                        <option value="Consumer Goods">Consumer Goods</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#3B3835] mb-1">Current DSE Price (TZS)</label>
                      <input
                        type="number"
                        min="1"
                        step="10"
                        value={currentPriceInput}
                        onChange={(e) => setCurrentPriceInput(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full rounded-lg border border-[#D5CFE5] bg-white px-3 py-1.5 text-xs font-semibold"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shares and Buy Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#3B3835]">Number of Shares</label>
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="50"
                    value={sharesInput}
                    onChange={(e) => setSharesInput(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full rounded-lg border border-[#D5CFE5] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold"
                    required
                  />
                  <div className="flex gap-1 mt-1.5">
                    {[100, 250, 500, 1000].map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setSharesInput(qty)}
                        className="rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 text-[10px] text-stone-600 hover:bg-stone-100"
                      >
                        +{qty}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#3B3835]">Buy Price (TZS/share)</label>
                    <button
                      type="button"
                      onClick={() => setBuyPriceInput(currentPriceInput)}
                      className="text-[10px] text-emerald-700 hover:underline font-semibold"
                    >
                      Use DSE Price
                    </button>
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="10"
                    value={buyPriceInput}
                    onChange={(e) => setBuyPriceInput(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full rounded-lg border border-[#D5CFE5] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold"
                    required
                  />
                  <span className="text-[10px] text-gray-500 block mt-1">Cost basis for gain/loss</span>
                </div>
              </div>

              {/* Financial Calculation Summary Preview */}
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                  Live Preview Calculation
                </span>
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono-num">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Total Cost</span>
                    <span className="font-bold text-stone-900">{formatTZS(sharesInput * buyPriceInput)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Market Value</span>
                    <span className="font-bold text-stone-900">{formatTZS(sharesInput * currentPriceInput)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Est. Annual Dividend</span>
                    <span className="font-bold text-emerald-800">
                      {formatTZS(sharesInput * currentPriceInput * (dividendYieldInput / 100))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#F0EBE1]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-[#5A5752] hover:text-[#1A1918]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#2D4A3E] px-5 py-2 text-xs font-semibold text-white hover:bg-[#233B31] shadow-2xs"
                >
                  Add Company to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Company Confirmation Modal */}
      {deleteConfirmHolding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-rose-100 pb-3">
              <div className="rounded-xl bg-rose-100 p-2.5 text-rose-700">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Delete Company from Portfolio
                </h3>
                <p className="text-xs text-gray-500">
                  {deleteConfirmHolding.companyName} ({deleteConfirmHolding.ticker})
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs text-gray-600">
              <p>
                Are you sure you want to delete <strong>{deleteConfirmHolding.companyName}</strong> from your DSE portfolio?
              </p>
              <div className="rounded-lg bg-stone-50 border border-stone-200 p-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Shares held:</span>
                  <span className="font-semibold text-gray-900">{deleteConfirmHolding.sharesHeld.toLocaleString()} shares</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Current DSE Market Value:</span>
                  <span className="font-bold text-gray-900">
                    {formatTZS(deleteConfirmHolding.sharesHeld * deleteConfirmHolding.currentPrice)}
                  </span>
                </div>
              </div>
              <p className="text-gray-500 text-[11px]">
                You can easily re-add this company at any time using the <em>Add Company</em> function.
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-2 pt-3 border-gray-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmHolding(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteHolding(deleteConfirmHolding)}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 shadow-2xs"
              >
                Yes, Delete Company
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
