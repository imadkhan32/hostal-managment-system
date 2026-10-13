import React from 'react';
import { useApp } from '../context/AppContext';
import { THEME_CONFIG } from '../utils/theme';
import { exportBookingsReport, exportPaymentsReport, exportRoomsReport } from '../utils/export';
import {
  BarChart3,
  FileSpreadsheet,
  Printer,
  TrendingUp,
  DollarSign,
  Users,
  Building,
  CheckCircle2,
  Calendar,
  Globe2,
} from 'lucide-react';

export const ReportsModule: React.FC = () => {
  const { rooms, bookings, payments, maintenance, themeAccent } = useApp();
  const theme = THEME_CONFIG[themeAccent];

  // Derived metrics
  const totalBeds = rooms.reduce((acc, r) => acc + r.totalBeds, 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupiedBeds, 0);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  const totalRevenue = payments.reduce((acc, p) => (p.status === 'completed' ? acc + p.amount : acc), 0);
  const totalDue = bookings.reduce((acc, b) => acc + Math.max(0, b.totalAmount - b.amountPaid), 0);

  // Nationality breakdown
  const nationalityMap: Record<string, number> = {};
  bookings.forEach((b) => {
    nationalityMap[b.nationality] = (nationalityMap[b.nationality] || 0) + 1;
  });

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Executive Analytics & Performance Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official university residency metrics, monthly revenue tracking, occupancy rates, and multi-format exports.
          </p>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            type="button"
            onClick={() => exportBookingsReport(bookings)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel / CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrintReport}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-bold ${theme.primary} ${theme.primaryHover} shadow-sm transition`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Printable PDF Report</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Average Occupancy Rate
          </span>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {occupancyRate}%
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            {occupiedBeds} out of {totalBeds} total beds
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Current Term Collections
          </span>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ${totalRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Settled payments</p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Outstanding Balances
          </span>
          <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
            ${totalDue.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Pending student payments</p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Maintenance Resolution
          </span>
          <div className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400">
            {Math.round(
              (maintenance.filter((m) => m.status === 'resolved').length / Math.max(1, maintenance.length)) * 100
            )}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Average turnaround: 24h</p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue vs Target Chart */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Revenue Performance
              </h3>
              <p className="text-xs text-slate-500">Actual collections vs Fiscal Target ($20k)</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              On Track
            </span>
          </div>

          <div className="h-48 flex items-end justify-between px-2 gap-3 pt-6">
            {[
              { m: 'May', val: 9200, target: 12000 },
              { m: 'Jun', val: 12400, target: 14000 },
              { m: 'Jul', val: 15100, target: 16000 },
              { m: 'Aug', val: 18400, target: 18000 },
              { m: 'Sep', val: 21200, target: 20000 },
              { m: 'Oct', val: totalRevenue || 19500, target: 20000, current: true },
            ].map((item) => {
              const max = 22000;
              const hPct = Math.round((item.val / max) * 100);
              return (
                <div key={item.m} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1 opacity-0 group-hover:opacity-100 transition">
                    ${Math.round(item.val / 1000)}k
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-lg h-full flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        item.current ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                      style={{ height: `${hPct}%` }}
                    />
                  </div>
                  <span className={`text-[10px] mt-2 font-semibold ${item.current ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {item.m}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* International Student Diversity Demographics */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe2 className="w-4 h-4 text-emerald-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  International Student Demographics
                </h3>
                <p className="text-xs text-slate-500">Global representation across residences</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(nationalityMap).map(([nat, count]) => {
              const pct = Math.round((count / bookings.length) * 100);
              return (
                <div key={nat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{nat}</span>
                    <span className="text-slate-500">
                      {count} resident{count > 1 ? 's' : ''} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Export Options Banner */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">
            Automated Audit & Compliance Archiving
          </span>
          <p className="text-slate-500">
            Export complete datasets for university housing committees and registrar boards.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => exportRoomsReport(rooms)}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
          >
            Rooms Audit (.csv)
          </button>
          <button
            type="button"
            onClick={() => exportPaymentsReport(payments)}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
          >
            Payments Audit (.csv)
          </button>
        </div>
      </div>
    </div>
  );
};
