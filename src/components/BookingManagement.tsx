import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, BookingStatus, PaymentStatus } from '../types';
import { THEME_CONFIG } from '../utils/theme';
import { exportBookingsReport } from '../utils/export';
import { createGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  LogOut,
  CreditCard,
  Mail,
  Calendar,
  FileSpreadsheet,
  QrCode,
  Download,
  ExternalLink,
  Printer,
  X,
  Plus,
  Shield,
  Eye,
  Phone,
  AlertCircle,
} from 'lucide-react';

export const BookingManagement: React.FC = () => {
  const {
    bookings,
    checkInBooking,
    checkOutBooking,
    setOpenNewBookingModal,
    setOpenPaymentModal,
    setSelectedBookingForAction,
    t,
    themeAccent,
    setEmails,
    setNotifications,
  } = useApp();

  const theme = THEME_CONFIG[themeAccent];

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all');
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      b.studentName.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      b.studentId.toLowerCase().includes(search.toLowerCase()) ||
      b.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.department.toLowerCase().includes(search.toLowerCase()) ||
      b.nationality.toLowerCase().includes(search.toLowerCase());

    const matchStatus = selectedStatus === 'all' || b.status === selectedStatus;
    const matchPay = selectedPaymentStatus === 'all' || b.paymentStatus === selectedPaymentStatus;

    return matchSearch && matchStatus && matchPay;
  });

  const resendConfirmationEmail = (booking: Booking) => {
    setEmails((prev) => [
      {
        id: `em-${Date.now()}`,
        recipientEmail: booking.studentEmail,
        recipientName: booking.studentName,
        subject: `[Re-sent] UniStay Booking Pass & Confirmation [${booking.bookingCode}]`,
        templateType: 'booking_confirmation',
        sentAt: new Date().toLocaleString(),
        body: `Dear ${booking.studentName},\n\nHere is your re-issued digital registration confirmation for Room ${booking.roomNumber} (${booking.bedNumber}) at UniStay Residences.\nTotal Paid: $${booking.amountPaid} / $${booking.totalAmount}.\n\nUniStay Housing Services`,
        qrCodeData: `UNISTAY:RESIDENT:${booking.studentId}:ROOM-${booking.roomNumber}`,
        status: 'delivered',
      },
      ...prev,
    ]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Confirmation Email Re-sent',
        message: `Booking confirmation re-dispatched to ${booking.studentEmail}.`,
        type: 'booking',
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  const handlePrintPass = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Guest Reservations & Registrations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete student directory, room check-in workflows, automated digital confirmation passes, and billing audits.
          </p>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            type="button"
            onClick={() => exportBookingsReport(bookings)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50 shadow-xs transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export to Excel/CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setOpenNewBookingModal(true)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-bold ${theme.primary} ${theme.primaryHover} shadow-sm transition`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('newBooking')}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, ID, reference code, room, nationality..."
              className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Reservation Statuses</option>
              <option value="confirmed">Confirmed (Pending Arrival)</option>
              <option value="checked-in">Checked-In (Active Resident)</option>
              <option value="checked-out">Checked-Out (Completed)</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div>
            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Fully Settled ($0 balance)</option>
              <option value="partial">Partial Payment</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>Showing <strong>{filteredBookings.length}</strong> matching student records</span>
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>{bookings.filter((b) => b.status === 'checked-in').length} Checked In</span>
            </span>
            <span className="flex items-center space-x-1 text-amber-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              <span>{bookings.filter((b) => b.status === 'confirmed').length} Incoming</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/60 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-semibold">Student & ID</th>
                <th className="py-3 px-3 font-semibold">Allocated Room</th>
                <th className="py-3 px-3 font-semibold">Stay Timeline</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold">Billing Status</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No reservations matching current search filter.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const isCheckedIn = b.status === 'checked-in';
                  const isConfirmed = b.status === 'confirmed';
                  const hasDue = b.amountPaid < b.totalAmount;

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-xs shrink-0">
                            {b.studentName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {b.studentName}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {b.studentId} • {b.nationality}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {b.roomNumber} ({b.bedNumber})
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[130px]">
                          {b.building}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-slate-700 dark:text-slate-200 block font-medium">
                          {b.checkInDate}
                        </span>
                        <span className="text-[10px] text-slate-400">until {b.checkOutDate}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isCheckedIn
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : isConfirmed
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                              : b.status === 'checked-out'
                              ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white">
                            ${b.amountPaid} / ${b.totalAmount}
                          </span>
                          <span
                            className={`block text-[10px] font-semibold ${
                              b.paymentStatus === 'paid'
                                ? 'text-emerald-600'
                                : b.paymentStatus === 'partial'
                                ? 'text-amber-600'
                                : 'text-rose-600'
                            }`}
                          >
                            {b.paymentStatus === 'paid'
                              ? '✓ Settled'
                              : `Due: $${b.totalAmount - b.amountPaid}`}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1 rtl:space-x-reverse">
                          {/* View Digital Pass */}
                          <button
                            type="button"
                            onClick={() => setSelectedBookingForModal(b)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                            title="View Digital Check-In Pass & QR Code"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          {/* Express Check In */}
                          {isConfirmed && (
                            <button
                              type="button"
                              onClick={() => checkInBooking(b.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs flex items-center space-x-1"
                              title="Express Check-In & Issue Keycard"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Check-In</span>
                            </button>
                          )}

                          {/* Express Check Out */}
                          {isCheckedIn && (
                            <button
                              type="button"
                              onClick={() => checkOutBooking(b.id)}
                              className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-bold text-[11px] flex items-center space-x-1"
                              title="Check-Out Resident"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>Check-Out</span>
                            </button>
                          )}

                          {/* Collect Payment */}
                          {hasDue && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBookingForAction(b);
                                setOpenPaymentModal(true);
                              }}
                              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                              title="Collect Outstanding Balance"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                          )}

                          {/* Resend Email */}
                          <button
                            type="button"
                            onClick={() => resendConfirmationEmail(b)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                            title="Resend Automated Confirmation Email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Check-In Pass / Registration Modal */}
      {selectedBookingForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-emerald-200" />
                <h3 className="font-bold text-sm tracking-wide">
                  Official Digital Residence Pass
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForModal(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* University Header */}
              <div className="text-center pb-2 border-b border-dashed border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  University Student Housing Department
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  UniStay Residences Pass
                </h2>
                <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                  {selectedBookingForModal.bookingCode}
                </p>
              </div>

              {/* Student and Room Card Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Student Name</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedBookingForModal.studentName}
                  </p>
                  <p className="text-[10px] text-slate-500">{selectedBookingForModal.studentId}</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Assigned Unit</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 text-sm">
                    Room {selectedBookingForModal.roomNumber}
                  </p>
                  <p className="text-[10px] text-slate-500">{selectedBookingForModal.bedNumber}</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Check-In Date</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedBookingForModal.checkInDate}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Valid Until</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedBookingForModal.checkOutDate}
                  </p>
                </div>
              </div>

              {/* High-Fidelity SVG QR Code representation */}
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="p-3 bg-white rounded-xl shadow-xs">
                  <svg className="w-32 h-32" viewBox="0 0 100 100" fill="currentColor">
                    {/* Outer QR Corner 1 */}
                    <rect x="5" y="5" width="30" height="30" rx="3" fill="#0f172a" />
                    <rect x="10" y="10" width="20" height="20" rx="2" fill="#ffffff" />
                    <rect x="15" y="15" width="10" height="10" rx="1" fill="#059669" />
                    
                    {/* Outer QR Corner 2 */}
                    <rect x="65" y="5" width="30" height="30" rx="3" fill="#0f172a" />
                    <rect x="70" y="10" width="20" height="20" rx="2" fill="#ffffff" />
                    <rect x="75" y="15" width="10" height="10" rx="1" fill="#059669" />
                    
                    {/* Outer QR Corner 3 */}
                    <rect x="5" y="65" width="30" height="30" rx="3" fill="#0f172a" />
                    <rect x="10" y="70" width="20" height="20" rx="2" fill="#ffffff" />
                    <rect x="15" y="75" width="10" height="10" rx="1" fill="#059669" />

                    {/* Matrix patterns */}
                    <rect x="42" y="10" width="6" height="6" fill="#0f172a" />
                    <rect x="52" y="18" width="6" height="6" fill="#0f172a" />
                    <rect x="42" y="26" width="6" height="6" fill="#0f172a" />
                    <rect x="42" y="42" width="16" height="16" rx="2" fill="#0f172a" />
                    <rect x="12" y="45" width="8" height="8" fill="#0f172a" />
                    <rect x="25" y="50" width="6" height="6" fill="#0f172a" />
                    <rect x="70" y="45" width="10" height="6" fill="#0f172a" />
                    <rect x="85" y="55" width="8" height="8" fill="#0f172a" />
                    <rect x="45" y="70" width="12" height="6" fill="#0f172a" />
                    <rect x="62" y="75" width="8" height="12" fill="#0f172a" />
                    <rect x="80" y="72" width="12" height="6" fill="#0f172a" />
                    <rect x="75" y="85" width="15" height="8" fill="#059669" />
                  </svg>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 font-mono">
                  Scan at front-desk terminal for NFC keycard encoding
                </span>
              </div>

              {/* Action Buttons inside modal */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={createGoogleCalendarUrl(selectedBookingForModal)}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 flex items-center justify-center space-x-1"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>Google Calendar</span>
                </a>

                <button
                  type="button"
                  onClick={() => downloadIcsFile(selectedBookingForModal)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 flex items-center justify-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Outlook (.ics)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handlePrintPass}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 flex items-center justify-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Registration Card</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
