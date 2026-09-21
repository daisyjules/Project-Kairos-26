import React, { useState } from 'react';
import { Check, Palette, ShoppingBag, Shirt, Truck } from 'lucide-react';

const priorities = [
  'Define the first capsule collection',
  'Confirm reliable blank garment suppliers',
  'Create a simple product and pricing sheet',
  'Test sales through friends, pop-ups, and online orders',
];

export const SteazyView: React.FC = () => {
  const [completed, setCompleted] = useState<string[]>([]);

  const togglePriority = (priority: string) => {
    setCompleted((current) => current.includes(priority)
      ? current.filter((item) => item !== priority)
      : [...current, priority]);
  };

  return (
    <div className="space-y-6 pb-12">
      <header className="border-b border-stone-200 pb-6 dark:border-stone-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-950 dark:text-stone-300">New venture</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white sm:text-3xl">Steazy</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black dark:text-stone-200">A clothing brand making T-shirts, caps, tote bags, and other everyday pieces with a distinct point of view.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-950 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-200">
            <Palette className="h-3.5 w-3.5" /> Founder idea
          </span>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Steazy focus areas">
        <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <Palette className="h-5 w-5 text-violet-700 dark:text-violet-400" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-black dark:text-stone-300">Identity</p>
          <p className="mt-1 text-sm font-medium text-black dark:text-white">A clear visual language</p>
          <p className="mt-2 text-xs leading-relaxed text-black dark:text-stone-200">Build a recognizable point of view before making too many products.</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <ShoppingBag className="h-5 w-5 text-violet-700 dark:text-violet-400" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-black dark:text-stone-300">Products</p>
          <p className="mt-1 text-sm font-medium text-black dark:text-white">Small, useful collections</p>
          <p className="mt-2 text-xs leading-relaxed text-black dark:text-stone-200">T-shirts, caps, totes, and accessories made in focused drops.</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <Truck className="h-5 w-5 text-violet-700 dark:text-violet-400" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-black dark:text-stone-300">Market</p>
          <p className="mt-1 text-sm font-medium text-black dark:text-white">Direct and wholesale</p>
          <p className="mt-2 text-xs leading-relaxed text-black dark:text-stone-200">Start close to home, learn what sells, then grow into wholesale relationships.</p>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-[#FDFBF7] p-5 dark:border-stone-800 dark:bg-stone-900/70" aria-labelledby="steazy-roles-title">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black dark:text-stone-300">Brand direction</p>
            <h2 id="steazy-roles-title" className="mt-2 text-lg font-semibold text-black dark:text-white">Make the first drop small and memorable.</h2>
          </div>
          <div className="grid gap-3 text-sm sm:min-w-72">
            <div className="flex items-center justify-between gap-6 border-b border-stone-200 pb-2 dark:border-stone-800"><span className="text-black dark:text-stone-300">Product focus</span><strong className="text-black dark:text-white">Apparel and accessories</strong></div>
            <div className="flex items-center justify-between gap-6"><span className="text-black dark:text-stone-300">Founder and approver</span><strong className="text-black dark:text-white">You</strong></div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900" aria-labelledby="steazy-priorities-title">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black dark:text-stone-300">Next decisions</p>
            <h2 id="steazy-priorities-title" className="mt-2 text-lg font-semibold text-black dark:text-white">Turn the idea into a first collection.</h2>
          </div>
          <span className="text-xs text-black dark:text-stone-300">{completed.length}/{priorities.length} done</span>
        </div>
        <div className="mt-4 grid gap-2">
          {priorities.map((priority) => {
            const isDone = completed.includes(priority);
            return (
              <button key={priority} type="button" onClick={() => togglePriority(priority)} className="flex items-center gap-3 rounded-lg border border-stone-200 px-3 py-3 text-left text-sm text-black transition-colors hover:bg-stone-50 dark:border-stone-800 dark:text-stone-100 dark:hover:bg-stone-800/60">
                <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${isDone ? 'border-violet-700 bg-violet-700 text-white' : 'border-stone-400 text-transparent dark:border-stone-600'}`}><Check className="h-3 w-3" /></span>
                <span className={isDone ? 'text-stone-500 line-through' : 'text-black dark:text-stone-100'}>{priority}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex items-center gap-2 text-xs text-black dark:text-stone-300"><Shirt className="h-4 w-4" /> Keep this as an idea until the first product, supplier, and customer are clear.</div>
    </div>
  );
};

export default SteazyView;
