import React, { useState } from 'react';
import { useKairos } from '../context/KairosContext';
import { StatCard } from './StatCard';
import { CurrencyInput } from './CurrencyInput';
import { formatTZS, formatPercent } from '../utils/formatters';
import {
  Calendar,
  TrendingUp,
  CreditCard,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Edit2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Plus,
  Shield,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { MonthlyRecord } from '../types';

export const MonthlyTrackerView: React.FC = () => {
  const { state, setActiveTab, updateMonthlyRecord, resetToDefaults } = useKairos();
  const records = state.monthlyRecords || [];
  const loan = state.loan;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Totals calculations across all months
  const totalRevenue = records.reduce((acc, r) => acc + (r.revenue || 0), 0);
  const totalExpenses = records.reduce((acc, r) => acc + (r.expenses || 0), 0);
  const totalProfit = records.reduce((acc, r) => acc + (r.profit || (r.revenue - r.expenses)), 0);
  const totalLoanRepaid = records.reduce((acc, r) => acc + (r.loanPayment || loan.monthlyRepayment), 0);
  const totalNetCashFlow = records.reduce(
    (acc, r) => acc + ((r.profit || (r.revenue - r.expenses)) - (r.loanPayment || loan.monthlyRepayment)),
    0
  );

  // Chart data
  const chartData = records.map((r, idx) => {
    const profit = r.profit || (r.revenue - r.expenses);
    const loanPay = r.loanPayment || loan.monthlyRepayment;
    const net = profit - loanPay;
    return {
      month: r.monthName || `M${idx + 1}`,
      revenue: r.revenue,
      expenses: r.expenses,
      profit: profit,
      loan: loanPay,
      netCashFlow: net,
    };
  });

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
            onClick={() => setActiveTab('roadmap')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A2F] dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <span>Next: Execution Roadmap</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1E3A2F]/10 text-[#1E3A2F] dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
              <Calendar className="h-3.5 w-3.5" />
              12-Month Pro-Forma Cash Flow Engine
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              12-Month Cash Flow & Debt Service Ledger
            </h1>
            <p className="mt-1 font-serif-body text-sm text-stone-600 dark:text-stone-300 max-w-2xl">
              Month-by-month trajectory tracking the ramp-up from Month 1 setup to Month 12 stabilized surplus.
              Click any month's row to customize actual or revised projections.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Summary 12-Month Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total 12-Month Revenue"
          value={formatTZS(totalRevenue)}
          subValue="Gross inflows across Klin Fitz, Airbnb & Poultry"
          badge={{ text: 'Gross Inflow', variant: 'neutral' }}
          icon={<TrendingUp className="h-4 w-4" />}
        />

        <StatCard
          label="Total 12-Month Operating Profit"
          value={formatTZS(totalProfit)}
          subValue={`Blended margin: ${formatPercent(
            totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
            1
          )}`}
          badge={{ text: 'Net Operating', variant: 'success' }}
          icon={<DollarSign className="h-4 w-4" />}
        />

        <StatCard
          label="12-Month Bank Debt Paid"
          value={formatTZS(totalLoanRepaid)}
          subValue={`12 × ${formatTZS(loan.monthlyRepayment)}/mo`}
          badge={{ text: 'Year 1 Amortization', variant: 'warning' }}
          icon={<CreditCard className="h-4 w-4" />}
        />

        <StatCard
          label="Cumulative Net Cash Cushion"
          value={formatTZS(totalNetCashFlow)}
          subValue="After all debt service payments"
          badge={{
            text: totalNetCashFlow >= 0 ? 'Net Surplus' : 'Deficit / Subsidy',
            variant: totalNetCashFlow >= 0 ? 'success' : 'danger',
          }}
          icon={<Sparkles className="h-4 w-4" />}
          highlight={totalNetCashFlow >= 0}
        />
      </div>

      {/* 12-Month Trend Visualizer Chart */}
      <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
        <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
          12-Month Cash Flow vs Debt Service Trajectory
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body mb-4">
          Shows the trajectory from Month 1 initial ramp-up through Month 12 autonomous debt coverage.
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val: any) => [formatTZS(Number(val)), '']}
                contentStyle={{
                  backgroundColor: state.theme === 'dark' ? '#1C1917' : '#FFFFFF',
                  borderColor: '#78716C',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="revenue" name="Total Revenue" stroke="#41788E" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="profit" name="Operating Profit" stroke="#1E3A2F" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="loan" name="Debt Obligation" stroke="#C86D51" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="netCashFlow" name="Net Cash Cushion" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 12-Month Pro-Forma Interactive Data Table */}
      <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100">
              Month-by-Month Financial Ledger
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-body">
              Click “Edit” on any month to enter realized actuals or modify projections.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                <th className="py-3 px-3">Month</th>
                <th className="py-3 px-3">Revenue</th>
                <th className="py-3 px-3">Expenses</th>
                <th className="py-3 px-3">Net Profit</th>
                <th className="py-3 px-3">Loan Service</th>
                <th className="py-3 px-3">Net Cushion</th>
                <th className="py-3 px-3">Status / Notes</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {records.map((r, idx) => {
                const isEditing = editingIndex === idx;
                const profit = r.profit || (r.revenue - r.expenses);
                const loanPay = r.loanPayment || loan.monthlyRepayment;
                const net = profit - loanPay;

                return (
                  <tr
                    key={idx}
                    className={`hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors ${
                      isEditing ? 'bg-stone-50 dark:bg-stone-800/60' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-semibold text-stone-900 dark:text-stone-100">
                      {r.monthName || `Month ${idx + 1}`}
                    </td>
                    <td className="py-3 px-3 font-mono-num">
                      {isEditing ? (
                        <input
                          type="number"
                          value={r.revenue}
                          onChange={(e) =>
                            updateMonthlyRecord(idx, { revenue: parseInt(e.target.value) || 0 })
                          }
                          className="w-24 rounded border border-stone-300 px-1.5 py-0.5 text-xs dark:border-stone-700 dark:bg-stone-800"
                        />
                      ) : (
                        formatTZS(r.revenue)
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono-num text-stone-500">
                      {isEditing ? (
                        <input
                          type="number"
                          value={r.expenses}
                          onChange={(e) =>
                            updateMonthlyRecord(idx, { expenses: parseInt(e.target.value) || 0 })
                          }
                          className="w-24 rounded border border-stone-300 px-1.5 py-0.5 text-xs dark:border-stone-700 dark:bg-stone-800"
                        />
                      ) : (
                        formatTZS(r.expenses)
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono-num font-bold text-stone-900 dark:text-stone-100">
                      {formatTZS(profit)}
                    </td>
                    <td className="py-3 px-3 font-mono-num text-rose-600 dark:text-rose-400">
                      -{formatTZS(loanPay)}
                    </td>
                    <td
                      className={`py-3 px-3 font-mono-num font-bold ${
                        net >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {net >= 0 ? '+' : ''}
                      {formatTZS(net)}
                    </td>
                    <td className="py-3 px-3 text-stone-500 dark:text-stone-400 max-w-xs truncate">
                      {isEditing ? (
                        <input
                          type="text"
                          value={r.assetsPurchased || ''}
                          onChange={(e) => updateMonthlyRecord(idx, { assetsPurchased: e.target.value })}
                          className="w-full rounded border border-stone-300 px-1.5 py-0.5 text-xs dark:border-stone-700 dark:bg-stone-800"
                        />
                      ) : (
                        r.assetsPurchased || (r.isActual ? 'Actual Realized' : 'Pro-Forma Target')
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setEditingIndex(isEditing ? null : idx)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-[#1E3A2F] hover:bg-stone-100 dark:text-emerald-400 dark:hover:bg-stone-800 cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
                        {isEditing ? 'Done' : 'Edit'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
