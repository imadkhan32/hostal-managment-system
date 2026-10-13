import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { THEME_CONFIG } from '../utils/theme';
import {
  KeyRound,
  CheckCircle2,
  LogOut,
  Search,
  Clock,
  Sparkles,
  QrCode,
  Tag,
  BedDouble,
  User,
  ShieldCheck,
  CreditCard,
  Printer,
  ChevronRight,
} from 'lucide-react';

export const CheckInOutDesk: React.FC = () => {
  const {
    bookings,
    checkInBooking,
    checkOutBooking,
    themeAccent,
    setSelectedBookingForAction,
    setOpenPaymentModal,
  } = useApp();

  const theme = THEME_CONFIG[themeAccent];
  const [search, setSearch] = useState('');
  const [activeSegment, setActiveSegment] = useState<'arrivals' | 'departures'>('arrivals');
  const [scannedCode, setScannedCode] = useState('');
  const [quickKeyAssigned, setQuickKeyAssigned] = useState<string | null>(null);

  // Incoming arrivals
  const pendingArrivals = bookings.filter((b) => b.status === 'confirmed');
  // Current residents ready for checkout
  const currentResidents = bookings.filter((b) => b.status === 'checked-in');

  const filteredArrivals = pendingArrivals.filter((b) =>
    b.studentName.toLowerCase().includes(search.toLowerCase()) ||
    b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
    b.roomNumber.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDepartures = currentResidents.filter((b) =>
    b.studentName.toLowerCase().includes(search.toLowerCase()) ||
    b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
    b.roomNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleInstantExpressCheckIn = (b: Booking) => {
    checkInBooking(b.id);
    setQuickKeyAssigned(`NFC-${Math.floor(100000 + Math.random() * 900000)} for ${b.studentName} (Room ${b.roomNumber})`);
    setTimeout(() => {
      setQuickKeyAssigned(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-amber-500 text-white">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Front Desk Check-In & Check-Out Terminal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Express keycard encoding, identity verification, balance settlement, and room handover.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Keycard Assigned Alert Notification */}
      {quickKeyAssigned && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-semibold flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>
              <strong>Keycard Issued & Encoded!</strong> {quickKeyAssigned}. Automated welcome email sent to student.
            </span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">ACTIVE NFC</span>
        </div>
      )}

      {/* Barcode / QR Code Quick Scan Box */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/10 rounded-xl">
              <QrCode className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Fast QR Pass Scanner</h3>
              <p className="text-xs text-slate-300">
                Type or scan digital confirmation code (e.g. UNS-8841-A or STU-2026-8841)
              </p>
            </div>
          </div>

          <div className="flex items-center w-full md:w-auto space-x-2">
            <input
              type="text"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              placeholder="Scan/Enter reservation code..."
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full md:w-64 font-mono"
            />
            <button
              onClick={() => {
                const match = bookings.find(
                  (b) =>
                    b.bookingCode.toLowerCase() === scannedCode.trim().toLowerCase() ||
                    b.studentId.toLowerCase() === scannedCode.trim().toLowerCase()
                );
                if (match) {
                  if (match.status === 'confirmed') {
                    handleInstantExpressCheckIn(match);
                  } else {
                    alert(`Reservation ${match.bookingCode} status is already '${match.status}'.`);
                  }
                  setScannedCode('');
                } else {
                  alert('No booking found matching code.');
                }
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition shrink-0"
            >
              Verify & Check In
            </button>
          </div>
        </div>
      </div>

      {/* Segment Tabs: Arrivals vs Departures */}
      <div className="flex items-center space-x-2 rtl:space-x-reverse border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSegment('arrivals')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSegment === 'arrivals'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Expected Arrivals Today ({pendingArrivals.length})</span>
        </button>

        <button
          onClick={() => setActiveSegment('departures')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSegment === 'departures'
              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <LogOut className="w-4 h-4 text-blue-600" />
          <span>Active Residents & Check-Out ({currentResidents.length})</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 rtl:left-auto rtl:right-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter student name, booking code, or room..."
          className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
        />
      </div>

      {/* Cards list for Arrivals */}
      {activeSegment === 'arrivals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArrivals.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              No pending student arrivals at the moment.
            </div>
          ) : (
            filteredArrivals.map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                        {b.bookingCode}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {b.studentName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {b.studentId} • {b.nationality}
                      </p>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                      Arrival Expected
                    </span>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Allocated Room</span>
                      <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                        {b.roomNumber} ({b.bedNumber})
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{b.building}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Payment Status</span>
                      <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                        ${b.amountPaid} / ${b.totalAmount}
                      </p>
                      <span
                        className={`text-[10px] font-semibold ${
                          b.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-rose-500'
                        }`}
                      >
                        {b.paymentStatus === 'paid' ? 'Paid in Full' : `Due: $${b.totalAmount - b.amountPaid}`}
                      </span>
                    </div>
                  </div>

                  {b.notes && (
                    <p className="text-[11px] text-slate-500 mt-3 italic bg-slate-50/60 dark:bg-slate-800/40 p-2 rounded-lg">
                      Note: {b.notes}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {b.paymentStatus !== 'paid' && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBookingForAction(b);
                        setOpenPaymentModal(true);
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center space-x-1"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Collect Balance</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleInstantExpressCheckIn(b)}
                    className="ml-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center space-x-1.5"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Issue RFID Keycard & Check In</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Cards list for Departures */}
      {activeSegment === 'departures' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDepartures.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              No currently checked-in residents found.
            </div>
          ) : (
            filteredDepartures.map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {b.bookingCode}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {b.studentName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Room {b.roomNumber} ({b.bedNumber}) • {b.studentId}
                      </p>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                      Active Resident
                    </span>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Check-in Date:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{b.checkInDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Scheduled Departure:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{b.checkOutDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Returns room to Housekeeping turnover
                  </span>

                  <button
                    type="button"
                    onClick={() => checkOutBooking(b.id)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition flex items-center space-x-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Complete Check-Out & Release Bed</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
