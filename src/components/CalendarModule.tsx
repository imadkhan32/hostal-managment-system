import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { THEME_CONFIG } from '../utils/theme';
import { Booking } from '../types';
import { createGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Download,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Users,
} from 'lucide-react';

export const CalendarModule: React.FC = () => {
  const { bookings, maintenance, themeAccent } = useApp();
  const theme = THEME_CONFIG[themeAccent];

  // Current view: October 2026 (matching simulated date)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = October
  const [selectedEventBooking, setSelectedEventBooking] = useState<Booking | null>(null);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Generate calendar days
  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  const formatDayDate = (day: number) => {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${currentYear}-${mm}-${dd}`;
  };

  const getEventsForDay = (day: number) => {
    const dateStr = formatDayDate(day);
    const arrivals = bookings.filter((b) => b.checkInDate === dateStr);
    const departures = bookings.filter((b) => b.checkOutDate === dateStr);
    return { arrivals, departures };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Schedule & Turnover Calendar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual check-in timelines, room departure turnover, housekeeping, and Google/Outlook calendar synchronization.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-slate-900 dark:text-white px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
            {monthNames[currentMonth]} {currentYear}
          </span>

          <button
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Days of week */}
        <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/60 text-center py-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800/80">
          {calendarCells.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="h-28 bg-slate-50/30 dark:bg-slate-900/20" />;
            }

            const { arrivals, departures } = getEventsForDay(day);
            const isToday = day === 13 && currentMonth === 9 && currentYear === 2026;

            return (
              <div
                key={`day-${day}`}
                className={`h-28 p-1.5 overflow-y-auto transition ${
                  isToday ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                      isToday
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {day}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      Today
                    </span>
                  )}
                </div>

                {/* Event badges */}
                <div className="space-y-1">
                  {arrivals.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedEventBooking(b)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 truncate cursor-pointer hover:opacity-80"
                      title={`Arrival: ${b.studentName} (${b.roomNumber})`}
                    >
                      🟢 In: {b.studentName.split(' ')[0]} ({b.roomNumber})
                    </div>
                  ))}

                  {departures.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedEventBooking(b)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 truncate cursor-pointer hover:opacity-80"
                      title={`Departure: ${b.studentName} (${b.roomNumber})`}
                    >
                      🔵 Out: {b.studentName.split(' ')[0]} ({b.roomNumber})
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Event Details Modal with Google/Outlook Sync */}
      {selectedEventBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Schedule Event Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedEventBooking(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Resident</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  {selectedEventBooking.studentName} ({selectedEventBooking.studentId})
                </p>
                <p className="text-slate-500 mt-0.5">
                  Unit: Room {selectedEventBooking.roomNumber} ({selectedEventBooking.bedNumber}) • {selectedEventBooking.building}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Check-In Date</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedEventBooking.checkInDate}</p>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Check-Out Date</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedEventBooking.checkOutDate}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Calendar App Integrations
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={createGoogleCalendarUrl(selectedEventBooking)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold flex items-center justify-center space-x-1 hover:bg-blue-100"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Google Calendar</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => downloadIcsFile(selectedEventBooking)}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold flex items-center justify-center space-x-1 hover:bg-slate-200"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Outlook (.ics)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
