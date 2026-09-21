import React, { useState } from 'react';
import { Check, MapPin, Package, ShieldCheck, Truck } from 'lucide-react';

const priorities = [
  'Map reliable rural crop and spice suppliers',
  'Set quality, grading, and storage standards',
  'Build wholesale relationships in Dar es Salaam',
  'Validate export requirements before scaling',
];

export const MamaKubwaView: React.FC = () => {
  const [completed, setCompleted] = useState<string[]>([]);

  const togglePriority = (priority: string) => {
    setCompleted((current) => current.includes(priority)
      ? current.filter((item) => item !== priority)
      : [...current, priority]);
  };

  return (
    <div className="space-y-6 pb-12">
      <header className="border-b border-stone-200 pb-6 dark:border-stone-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">New venture</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-stone-950 dark:text-stone-100 sm:text-3xl">Mama Kubwa Enterprises</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600 dark:text-stone-400">A rural-to-market crop and spice supply business serving Dar es Salaam wholesalers and future export buyers.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" /> Founder approved
          </span>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Venture responsibilities">
        <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <MapPin className="h-5 w-5 text-[#1E3A2F] dark:text-emerald-400" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Sourcing</p>
          <p className="mt-1 text-sm font-medium text-stone-900 dark:text-stone-100">Rural producer network</p>
          <p className="mt-2 text-xs leading-relaxed text-stone-500">Work with trusted growers and collection points close to production.</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <Package className="h-5 w-5 text-[#1E3A2F] dark:text-emerald-400" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Operations</p>
          <p className="mt-1 text-sm font-medium text-stone-900 dark:text-stone-100">Storage and quality</p>
          <p className="mt-2 text-xs leading-relaxed text-stone-500">Clean, grade, store, and dispatch consistent stock with clear records.</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <Truck className="h-5 w-5 text-[#1E3A2F] dark:text-emerald-400" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Sales</p>
          <p className="mt-1 text-sm font-medium text-stone-900 dark:text-stone-100">Wholesale and export</p>
          <p className="mt-2 text-xs leading-relaxed text-stone-500">Move volume to Dar es Salaam first, then expand into compliant export channels.</p>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-[#FDFBF7] p-5 dark:border-stone-800 dark:bg-stone-900/70" aria-labelledby="roles-title">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Ownership and accountability</p>
            <h2 id="roles-title" className="mt-2 text-lg font-semibold text-stone-950 dark:text-stone-100">Clear roles keep the business grounded.</h2>
          </div>
          <div className="grid gap-3 text-sm sm:min-w-72">
            <div className="flex items-center justify-between gap-6 border-b border-stone-200 pb-2 dark:border-stone-800"><span className="text-stone-500">Operations</span><strong className="text-stone-900 dark:text-stone-100">Mom and Dad</strong></div>
            <div className="flex items-center justify-between gap-6"><span className="text-stone-500">Approval and founding</span><strong className="text-stone-900 dark:text-stone-100">You</strong></div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900" aria-labelledby="priorities-title">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Next decisions</p>
            <h2 id="priorities-title" className="mt-2 text-lg font-semibold text-stone-950 dark:text-stone-100">Build the supply chain before chasing scale.</h2>
          </div>
          <span className="text-xs text-stone-500">{completed.length}/{priorities.length} done</span>
        </div>
        <div className="mt-4 grid gap-2">
          {priorities.map((priority) => {
            const isDone = completed.includes(priority);
            return (
              <button key={priority} type="button" onClick={() => togglePriority(priority)} className="flex items-center gap-3 rounded-lg border border-stone-200 px-3 py-3 text-left text-sm transition-colors hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/60">
                <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${isDone ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-stone-300 text-transparent dark:border-stone-600'}`}><Check className="h-3 w-3" /></span>
                <span className={isDone ? 'text-stone-400 line-through' : 'text-stone-700 dark:text-stone-300'}>{priority}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default MamaKubwaView;

