import React from 'react';
import { ArrowUpRight, BookOpen, CalendarDays, Menu, Quote, Sparkles } from 'lucide-react';
import { useKairos } from '../context/KairosContext';
import { formatTZS } from '../utils/formatters';
import founderDeskImg from '../assets/images/founder_minimalist_desk_1787316891526.jpg';

export const WelcomeOverview: React.FC = () => {
  const { state, masterCalc, setActiveTab } = useKairos();
  const latestMonth = state.monthlyRecords[0];

  return (
    <div className="space-y-5 pb-10">
      <section className="relative min-h-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-[#12221d] text-white shadow-xl">
        <img src={founderDeskImg} alt="A calm founder workspace" className="absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#12221d]/95 via-[#12221d]/75 to-[#12221d]/20" />
        <div className="relative flex min-h-[360px] flex-col justify-between p-6 sm:p-9">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75 backdrop-blur-md"><Sparkles className="size-3.5" /> Founder workspace</span>
            <span className="text-xs text-white/55">Ideas in motion · 2026</span>
          </div>
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-medium text-[#c2d6b9]">Welcome to Project Kairos 26, Ncine.</p>
            <h1 className="max-w-xl text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-6xl">Are you motivated enough to move?</h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-white/70 sm:text-base">We need to build Apex Group of Companies. These are your ideas, your projects, and the future you are choosing to make real — one deliberate move at a time.</p>
            <button type="button" onClick={() => setActiveTab('diary')} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-[#12221d] transition-transform hover:-translate-y-0.5">Open founder diary <ArrowUpRight className="size-4" /></button>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <section className="rounded-2xl border border-black/8 bg-white/75 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5" aria-labelledby="quote-title">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-700"><Quote className="size-4" /> The principle</div>
          <h2 id="quote-title" className="mt-5 max-w-xl text-2xl font-medium leading-tight tracking-tight text-stone-900 dark:text-white">{state.heroQuote.text}</h2>
          <p className="mt-4 text-xs text-stone-700">{state.heroQuote.author}</p>
        </section>
        <section className="rounded-2xl border border-black/8 bg-white/75 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5" aria-labelledby="month-title">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-700"><CalendarDays className="size-4" /> Monthly summary</div><span className="rounded-full bg-[#e9f0e4] px-2 py-1 text-[10px] font-bold text-[#31523b]">Live plan</span></div>
          <h2 id="month-title" className="mt-5 text-xl font-semibold tracking-tight text-stone-900 dark:text-white">{latestMonth?.monthName || 'This month'}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3"><div><p className="text-xs text-stone-700">Planned inflow</p><p className="mt-1 font-mono-num text-sm font-semibold text-stone-900 dark:text-white">{formatTZS(latestMonth?.plannedIncome || 0)}</p></div><div><p className="text-xs text-stone-700">Net cushion</p><p className="mt-1 font-mono-num text-sm font-semibold text-emerald-700 dark:text-emerald-400">{formatTZS(masterCalc.monthlyCashFlowAfterDebt)}</p></div></div>
        </section>
      </div>

      <section className="rounded-2xl border border-black/8 bg-[#f2eee7] p-5 dark:border-white/10 dark:bg-white/5" aria-label="Workspace shortcuts">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-700">Your workspace</p><p className="mt-1 text-sm text-stone-700 dark:text-stone-300">Use the menu to move between ideas, plans, and numbers.</p></div><button type="button" onClick={() => setActiveTab('diary')} className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-50 dark:border-white/15 dark:bg-white/10 dark:text-white"><BookOpen className="size-4" /> Continue writing</button></div>
      </section>
    </div>
  );
};

export default WelcomeOverview;
