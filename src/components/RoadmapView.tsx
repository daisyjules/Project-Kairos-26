import React, { useState } from 'react';
import { useKairos } from '../context/KairosContext';
import { StatCard } from './StatCard';
import { formatPercent } from '../utils/formatters';
import {
  MapPin,
  CheckCircle2,
  Circle,
  Calendar,
  Flag,
  Sparkles,
  Layers,
  Award,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const { state, setActiveTab, toggleMilestone } = useKairos();
  const roadmap = state.roadmap || [];

  const allMilestones = roadmap.flatMap((p) => p.milestones || []);
  const completedCount = allMilestones.filter((m) => m.completed).length;
  const totalCount = allMilestones.length;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

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
            <span>Next: APEX Ecosystem</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1E3A2F]/10 text-[#1E3A2F] dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="h-3.5 w-3.5" />
              Strategic Execution Roadmap
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              Project Kairos 26: 12-Month Action Milestones
            </h1>
            <p className="mt-1 font-serif-body text-sm text-stone-600 dark:text-stone-300 max-w-2xl">
              From Month 1 foundation and ringfenced reserves, through stabilization and selective scaling, to year-end APEX consolidation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-800 text-center min-w-[140px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Overall Progress
              </span>
              <div className="font-mono-num text-2xl font-bold text-[#1E3A2F] dark:text-emerald-400">
                {formatPercent(progressPct, 0)}
              </div>
              <span className="text-[11px] font-semibold text-stone-500">
                {completedCount} of {totalCount} Milestones
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Phase Timeline Cards */}
      <div className="space-y-6">
        {roadmap.map((phase, idx) => {
          const phaseCompleted = phase.milestones.filter((m) => m.completed).length;
          const phaseTotal = phase.milestones.length;
          const isPhaseDone = phaseTotal > 0 && phaseCompleted === phaseTotal;

          return (
            <div
              key={phase.id || idx}
              className={`rounded-3xl border p-6 sm:p-8 transition-all ${
                isPhaseDone
                  ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-950 dark:bg-emerald-950/10'
                  : 'border-stone-200/90 bg-white dark:border-stone-800/80 dark:bg-stone-900/90'
              } shadow-xs`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-bold text-stone-700 dark:bg-stone-800 dark:text-stone-300 uppercase tracking-wider">
                      {phase.period}
                    </span>
                    <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100">
                      {phase.title}
                    </h3>
                  </div>
                  <p className="mt-1 font-serif-body text-xs text-stone-500 dark:text-stone-400">
                    <strong>Core Focus:</strong> {phase.focus}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono-num font-semibold text-stone-500">
                    {phaseCompleted} / {phaseTotal} completed
                  </span>
                </div>
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-3">
                {phase.milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(phase.id, m.id)}
                    className={`flex items-start gap-3.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                      m.completed
                        ? 'border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20 text-stone-800 dark:text-stone-200'
                        : 'border-stone-200/70 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-800/40 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-stone-400 hover:text-stone-600 transition-colors focus:outline-hidden"
                    >
                      {m.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="h-4 w-4 text-stone-300 dark:text-stone-600" />
                      )}
                    </button>
                    <span
                      className={`text-xs font-serif-body flex-1 ${
                        m.completed ? 'line-through opacity-75' : ''
                      }`}
                    >
                      {m.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
