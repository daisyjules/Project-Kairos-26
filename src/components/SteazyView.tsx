import React, { useState } from 'react';
import { ArrowLeft, Check, Palette, ShoppingBag, Shirt, Truck } from 'lucide-react';
import { useKairos } from '../context/KairosContext';
import steazyImg from '../assets/images/clean_laundry_1787307764343.jpg';

const priorities = [
  'Define the first capsule collection',
  'Confirm reliable blank garment suppliers',
  'Create a simple product and pricing sheet',
  'Test sales through friends, pop-ups, and online orders',
];

export const SteazyView: React.FC = () => {
  const { setActiveTab } = useKairos();
  const [completed, setCompleted] = useState<string[]>([]);
  const togglePriority = (priority: string) => setCompleted((current) => current.includes(priority) ? current.filter((item) => item !== priority) : [...current, priority]);

  return (
    <div className="space-y-8 pb-12 text-black dark:text-white">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => setActiveTab('dashboard')} className="inline-flex items-center gap-2 text-xs font-semibold text-black transition-colors hover:text-violet-700 dark:text-white dark:hover:text-violet-300"><ArrowLeft className="h-4 w-4" /> Back to Overview</button>
        <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-950 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-200">Founder idea</span>
      </div>

      <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="grid lg:grid-cols-12">
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-8">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-black dark:text-white">Chapter 04 · Apparel and accessories</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Steazy</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-black dark:text-white">A clothing brand for T-shirts, caps, tote bags, and everyday pieces with a recognisable point of view. Start with a small drop, learn quickly, and grow deliberately.</p></div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-stone-200 pt-4 text-xs font-semibold dark:border-stone-700"><span>Founder and approver: You</span><span>Model: Direct and wholesale</span></div>
          </div>
          <div className="min-h-56 lg:col-span-4"><img src={steazyImg} alt="Clean folded clothing ready for a collection" className="h-full w-full object-cover" /></div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Steazy summary dashboard">
        {[['Identity', 'Build a clear visual language', Palette], ['First drop', 'T-shirts, caps, and totes', ShoppingBag], ['Route to market', 'Direct first, wholesale next', Truck]].map(([label, value, Icon]) => <div key={label as string} className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900"><Icon className="h-5 w-5 text-violet-700 dark:text-violet-300" /><p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-black dark:text-white">{label as string}</p><p className="mt-1 text-sm font-semibold text-black dark:text-white">{value as string}</p></div>)}
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-2xl border border-stone-200 bg-[#FDFBF7] p-6 dark:border-stone-800 dark:bg-stone-900 lg:col-span-3"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-black dark:text-white">Brand direction</p><h2 className="mt-2 text-xl font-semibold">Make the first drop small and memorable.</h2><p className="mt-3 text-sm leading-relaxed text-black dark:text-white">Use the same discipline as the Zanzibar plan: understand setup costs, unit economics, demand, and the path from an idea to a repeatable operation.</p><div className="mt-6 grid gap-3 text-sm"><div className="flex justify-between border-b border-stone-200 pb-3 dark:border-stone-700"><span>Product focus</span><strong>Apparel and accessories</strong></div><div className="flex justify-between"><span>Decision owner</span><strong>You</strong></div></div></section>
        <section className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 lg:col-span-2"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-black dark:text-white">Monthly summary</p><div className="mt-5 grid gap-4"><div><p className="text-xs text-black dark:text-white">Current stage</p><p className="mt-1 text-lg font-semibold">Idea validation</p></div><div><p className="text-xs text-black dark:text-white">Priority this month</p><p className="mt-1 text-sm font-semibold">Choose the first collection</p></div><div><p className="text-xs text-black dark:text-white">Founder note</p><p className="mt-1 text-sm leading-relaxed">Do not scale before the product, supplier, and customer are clear.</p></div></div></section>
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900" aria-labelledby="steazy-priorities-title"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-black dark:text-white">Next decisions</p><h2 id="steazy-priorities-title" className="mt-2 text-xl font-semibold">Turn the idea into a first collection.</h2></div><span className="text-xs font-semibold text-black dark:text-white">{completed.length}/{priorities.length} done</span></div><div className="mt-5 grid gap-2">{priorities.map((priority) => { const isDone = completed.includes(priority); return <button key={priority} type="button" onClick={() => togglePriority(priority)} className="flex items-center gap-3 rounded-lg border border-stone-200 px-3 py-3 text-left text-sm text-black transition-colors hover:bg-stone-50 dark:border-stone-700 dark:text-white dark:hover:bg-stone-800"><span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${isDone ? 'border-violet-700 bg-violet-700 text-white' : 'border-stone-500 text-transparent'}`}><Check className="h-3 w-3" /></span><span className={isDone ? 'text-stone-500 line-through' : ''}>{priority}</span></button>; })}</div></section>
      <div className="flex items-center gap-2 text-xs font-semibold text-black dark:text-white"><Shirt className="h-4 w-4" /> Keep this as an idea until the first product, supplier, and customer are clear.</div>
    </div>
  );
};
export default SteazyView;
