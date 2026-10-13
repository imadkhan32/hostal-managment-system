import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { THEME_CONFIG } from '../utils/theme';
import { exportRoomsReport } from '../utils/export';
import { WidgetCustomizerModal } from './WidgetCustomizerModal';
import {
  Bed,
  Users,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  ArrowRight,
  TrendingUp,
  Download,
  CalendarCheck,
  CalendarDays,
  ShieldCheck,
  GripVertical,
  PlusCircle,
  KeyRound,
  FileSpreadsheet,
  Building,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    t,
    rooms,
    bookings,
    payments,
    maintenance,
    widgets,
    reorderWidgets,
    themeAccent,
    setActiveTab,
    setOpenNewBookingModal,
    checkInBooking,
  } = useApp();

  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const theme = THEME_CONFIG[themeAccent];

  // Derived KPI calculations
  const totalRoomsCount = rooms.length;
  const totalBedsCount = rooms.reduce((acc, r) => acc + r.totalBeds, 0);
  const occupiedBedsCount = rooms.reduce((acc, r) => acc + r.occupiedBeds, 0);
  const occupancyPercentage = totalBedsCount > 0 ? Math.round((occupiedBedsCount / totalBedsCount) * 100) : 0;
  
  const activeResidentsCount = bookings.filter((b) => b.status === 'checked-in').length;
  const monthlyRevenue = payments.reduce((acc, p) => (p.status === 'completed' ? acc + p.amount : acc), 0);
  const pendingCheckins = bookings.filter((b) => b.status === 'confirmed');
  const openMaintenanceTickets = maintenance.filter((m) => m.status === 'open' || m.priority === 'urgent');

  // Drag and drop HTML5 handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIdx !== null && draggedIdx !== targetIndex) {
      reorderWidgets(draggedIdx, targetIndex);
    }
    setDraggedIdx(null);
  };

  // Render Widget implementations
  const renderWidget = (widgetId: string, index: number) => {
    switch (widgetId) {
      case 'stats_overview':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Stat 1: Occupancy */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 transition">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{t('occupancyRate')}</span>
                <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline space-x-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {occupancyPercentage}%
                </span>
                <span className="text-[11px] text-slate-400">
                  ({occupiedBedsCount}/{totalBedsCount} beds)
                </span>
              </div>
              <div className="mt-2 w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${occupancyPercentage}%` }}
                />
              </div>
            </div>

            {/* Stat 2: Total Rooms */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 transition">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{t('totalRooms')}</span>
                <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                  <Building className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {totalRoomsCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Across 2 campus blocks</p>
            </div>

            {/* Stat 3: Active Residents */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 transition">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{t('activeGuests')}</span>
                <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                  <Users className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {activeResidentsCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Checked-in residents</p>
            </div>

            {/* Stat 4: Revenue */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 transition">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{t('monthlyRevenue')}</span>
                <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                  <DollarSign className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                ${monthlyRevenue.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">+14.8% vs last mo</p>
            </div>

            {/* Stat 5: Pending Check-Ins */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 transition">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{t('pendingCheckInsToday')}</span>
                <span className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                  <CalendarCheck className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {pendingCheckins.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Awaiting key collection</p>
            </div>

            {/* Stat 6: Open Work Orders */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 transition">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{t('openMaintenance')}</span>
                <span className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {openMaintenanceTickets.length}
              </div>
              <p className="text-[11px] text-rose-500 font-medium mt-1">Facilities attention</p>
            </div>
          </div>
        );

      case 'quick_actions':
        return (
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {t('quickActionsTitle')}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              <button
                type="button"
                onClick={() => setOpenNewBookingModal(true)}
                className="flex items-center space-x-2.5 rtl:space-x-reverse p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-700/60 transition group text-left rtl:text-right"
              >
                <div className="p-2 rounded-lg bg-emerald-500 text-white group-hover:scale-105 transition">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{t('newBooking')}</p>
                  <p className="text-[10px] text-slate-500">Student reservation</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('checkInOut')}
                className="flex items-center space-x-2.5 rtl:space-x-reverse p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-slate-200 dark:border-slate-700/60 transition group text-left rtl:text-right"
              >
                <div className="p-2 rounded-lg bg-amber-500 text-white group-hover:scale-105 transition">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{t('expressCheckIn')}</p>
                  <p className="text-[10px] text-slate-500">Issue keycards</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('payments')}
                className="flex items-center space-x-2.5 rtl:space-x-reverse p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-200 dark:border-slate-700/60 transition group text-left rtl:text-right"
              >
                <div className="p-2 rounded-lg bg-blue-500 text-white group-hover:scale-105 transition">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{t('collectPayment')}</p>
                  <p className="text-[10px] text-slate-500">Billing gateway</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('maintenance')}
                className="flex items-center space-x-2.5 rtl:space-x-reverse p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700/60 transition group text-left rtl:text-right"
              >
                <div className="p-2 rounded-lg bg-rose-500 text-white group-hover:scale-105 transition">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{t('reportIssue')}</p>
                  <p className="text-[10px] text-slate-500">Facility dispatch</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => exportRoomsReport(rooms)}
                className="flex items-center space-x-2.5 rtl:space-x-reverse p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/30 border border-slate-200 dark:border-slate-700/60 transition group text-left rtl:text-right"
              >
                <div className="p-2 rounded-lg bg-purple-500 text-white group-hover:scale-105 transition">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{t('exportReport')}</p>
                  <p className="text-[10px] text-slate-500">CSV spreadsheet</p>
                </div>
              </button>
            </div>
          </div>
        );

      case 'occupancy_chart':
        // Compute counts per type
        const singleBeds = rooms.filter((r) => r.type === 'single').reduce((acc, r) => acc + r.occupiedBeds, 0);
        const doubleBeds = rooms.filter((r) => r.type === 'double').reduce((acc, r) => acc + r.occupiedBeds, 0);
        const dormBeds = rooms.filter((r) => r.type === 'dorm-4' || r.type === 'dorm-6').reduce((acc, r) => acc + r.occupiedBeds, 0);
        const suiteBeds = rooms.filter((r) => r.type === 'suite').reduce((acc, r) => acc + r.occupiedBeds, 0);

        return (
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t('occupancyBreakdown')}
                </h4>
                <p className="text-xs text-slate-500">Allocation across room types</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {occupiedBedsCount} Allocated Beds
              </span>
            </div>

            {/* Donut representation */}
            <div className="flex items-center justify-around my-2">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background circle */}
                  <path
                    className="text-slate-100 dark:text-slate-700"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progress stroke */}
                  <path
                    className="text-emerald-500"
                    strokeDasharray={`${occupancyPercentage}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-black text-slate-900 dark:text-white">{occupancyPercentage}%</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400">Capacity</span>
                </div>
              </div>

              {/* Legend with bed counts */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                  <span className="text-slate-600 dark:text-slate-300">Dormitory Bunks:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{dormBeds} beds</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
                  <span className="text-slate-600 dark:text-slate-300">Double Sharing:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{doubleBeds} beds</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span>
                  <span className="text-slate-600 dark:text-slate-300">Single Studios:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{singleBeds} beds</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
                  <span className="text-slate-600 dark:text-slate-300">Suites:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{suiteBeds} beds</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('rooms')}
              className="mt-3 w-full py-2 text-center text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium border-t border-slate-100 dark:border-slate-800 flex items-center justify-center space-x-1"
            >
              <span>Explore Interactive Room Grid</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        );

      case 'revenue_trend':
        const months = ['Jul', 'Aug', 'Sep', 'Oct (Now)', 'Nov (Proj)', 'Dec (Proj)'];
        const dataValues = [8400, 11200, 16800, monthlyRevenue || 14500, 19200, 21500];
        const maxVal = Math.max(...dataValues);

        return (
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t('revenueAnalytics')}
                </h4>
                <p className="text-xs text-slate-500">Historical performance & intake projections</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Target: $22,000
                </span>
              </div>
            </div>

            {/* SVG Bar Chart */}
            <div className="h-44 flex items-end justify-between pt-6 pb-2 px-2 gap-2">
              {months.map((m, idx) => {
                const heightPct = Math.round((dataValues[idx] / maxVal) * 100);
                const isCurrent = idx === 3;
                return (
                  <div key={m} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-semibold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                      ${Math.round(dataValues[idx] / 1000)}k
                    </span>
                    <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-700/60 rounded-t-lg h-full flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isCurrent
                            ? 'bg-emerald-500 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-300 dark:bg-slate-600 group-hover:bg-slate-400'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className={`text-[10px] mt-2 font-medium ${isCurrent ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                      {m}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setActiveTab('reports')}
              className="mt-2 w-full py-2 text-center text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium border-t border-slate-100 dark:border-slate-800 flex items-center justify-center space-x-1"
            >
              <span>View Full Financial Ledger & Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        );

      case 'pending_checkins':
        return (
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t('todayArrivals')}
                </h4>
                <p className="text-xs text-slate-500">Pending front-desk student arrivals</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold">
                {pendingCheckins.length} Incoming
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 my-1 overflow-y-auto max-h-56">
              {pendingCheckins.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  All expected residents have checked in.
                </div>
              ) : (
                pendingCheckins.map((b) => (
                  <div key={b.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{b.studentName}</p>
                      <p className="text-[11px] text-slate-500">
                        {b.roomNumber} ({b.bedNumber}) • {b.nationality}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => checkInBooking(b.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-1 shadow-xs transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('checkIn')}</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setActiveTab('checkInOut')}
              className="mt-2 w-full py-2 text-center text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium border-t border-slate-100 dark:border-slate-800 flex items-center justify-center space-x-1"
            >
              <span>Open Express Check-In Station</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        );

      case 'maintenance_alerts':
        return (
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Active Facilities & Repairs
                </h4>
                <p className="text-xs text-slate-500">Priority hostel maintenance tickets</p>
              </div>
              <button
                onClick={() => setActiveTab('maintenance')}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
              >
                + New Ticket
              </button>
            </div>

            <div className="space-y-2.5 my-1 overflow-y-auto max-h-56">
              {maintenance.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Room {item.roomNumber}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          item.priority === 'urgent' || item.priority === 'high'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Reported by {item.reportedBy} • Assigned: {item.assignedTo || 'Pending'}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : item.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('maintenance')}
              className="mt-2 w-full py-2 text-center text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium border-t border-slate-100 dark:border-slate-800 flex items-center justify-center space-x-1"
            >
              <span>Manage All Maintenance Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        );

      case 'recent_bookings':
        return (
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t('recentActivity')}
                </h4>
                <p className="text-xs text-slate-500">Live student bookings & assignments</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>View Full Registry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-2 font-semibold">Ref Code</th>
                    <th className="pb-2 font-semibold">Student Name</th>
                    <th className="pb-2 font-semibold">Allocated Room</th>
                    <th className="pb-2 font-semibold">Stay Duration</th>
                    <th className="pb-2 font-semibold">Status</th>
                    <th className="pb-2 font-semibold">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {b.bookingCode}
                      </td>
                      <td className="py-2.5">
                        <span className="font-semibold text-slate-900 dark:text-white">{b.studentName}</span>
                        <span className="block text-[10px] text-slate-400">{b.department}</span>
                      </td>
                      <td className="py-2.5 font-medium text-slate-700 dark:text-slate-300">
                        {b.roomNumber} ({b.bedNumber})
                      </td>
                      <td className="py-2.5 text-slate-500">
                        {b.checkInDate} → {b.checkOutDate}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'checked-in'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : b.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`text-[10px] font-bold ${
                            b.paymentStatus === 'paid'
                              ? 'text-emerald-600'
                              : b.paymentStatus === 'partial'
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          ${b.amountPaid} / ${b.totalAmount} ({b.paymentStatus})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Executive Residence Dashboard
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              Live Real-Time
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time occupancy rates, student arrivals, financial collections, and room turnover.
          </p>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            type="button"
            onClick={() => setCustomizerOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('customizeDashboard')}</span>
          </button>

          <button
            type="button"
            onClick={() => setOpenNewBookingModal(true)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-bold ${theme.primary} ${theme.primaryHover} transition shadow-sm`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t('newBooking')}</span>
          </button>
        </div>
      </div>

      {/* Render Enabled Widgets in User Configured Order */}
      <div className="space-y-4">
        {widgets
          .filter((w) => w.enabled)
          .map((widget, idx) => (
            <div
              key={widget.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              className="relative group transition-all"
            >
              {/* Drag Handle Indicator */}
              <div
                className="absolute top-2 right-2 p-1 text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition z-10"
                title="Drag to reorder widget"
              >
                <GripVertical className="w-4 h-4" />
              </div>

              {renderWidget(widget.id, idx)}
            </div>
          ))}
      </div>

      {/* Widget Customizer Modal */}
      <WidgetCustomizerModal isOpen={customizerOpen} onClose={() => setCustomizerOpen(false)} />
    </div>
  );
};
