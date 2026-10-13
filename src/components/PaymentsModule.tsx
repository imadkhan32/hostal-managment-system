import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentTransaction, Booking } from '../types';
import { THEME_CONFIG } from '../utils/theme';
import { exportPaymentsReport } from '../utils/export';
import {
  CreditCard,
  DollarSign,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  Printer,
  X,
  Lock,
  ArrowUpRight,
  ShieldCheck,
  Building,
  Plus,
} from 'lucide-react';

export const PaymentsModule: React.FC = () => {
  const {
    payments,
    bookings,
    processPayment,
    openPaymentModal,
    setOpenPaymentModal,
    selectedBookingForAction,
    setSelectedBookingForAction,
    themeAccent,
  } = useApp();

  const theme = THEME_CONFIG[themeAccent];

  const [search, setSearch] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [viewReceipt, setViewReceipt] = useState<PaymentTransaction | null>(null);

  // New Payment Form state
  const [targetBookingId, setTargetBookingId] = useState<string>(
    selectedBookingForAction ? selectedBookingForAction.id : bookings[0]?.id || ''
  );
  const [payAmount, setPayAmount] = useState<string>('500');
  const [payMethod, setPayMethod] = useState<PaymentTransaction['paymentMethod']>('credit_card');
  const [payNote, setPayNote] = useState('Fall Semester Rent Installment');

  // Calculations
  const totalCollected = payments.reduce(
    (acc, p) => (p.status === 'completed' ? acc + p.amount : acc),
    0
  );
  const totalOutstanding = bookings.reduce(
    (acc, b) => acc + Math.max(0, b.totalAmount - b.amountPaid),
    0
  );

  const filteredPayments = payments.filter((p) => {
    const matchSearch =
      p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionRef.toLowerCase().includes(search.toLowerCase()) ||
      p.bookingCode.toLowerCase().includes(search.toLowerCase());

    const matchMethod = selectedMethod === 'all' || p.paymentMethod === selectedMethod;
    return matchSearch && matchMethod;
  });

  const handleProcessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payAmount);
    if (!amountNum || amountNum <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    processPayment(targetBookingId, amountNum, payMethod, payNote);
    setOpenPaymentModal(false);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const activeBookingForPay = bookings.find((b) => b.id === targetBookingId);
  const outstandingForActiveBooking = activeBookingForPay
    ? Math.max(0, activeBookingForPay.totalAmount - activeBookingForPay.amountPaid)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Billing & Payment Gateway Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time financial audits, online card settlements, campus wallet integration, and automated receipts.
          </p>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            type="button"
            onClick={() => exportPaymentsReport(payments)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Transactions</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedBookingForAction(null);
              setOpenPaymentModal(true);
            }}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-bold ${theme.primary} ${theme.primaryHover} shadow-sm transition`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
            Total Revenue Settled
          </span>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            ${totalCollected.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{payments.length} verified transactions</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
            Outstanding Student Dues
          </span>
          <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
            ${totalOutstanding.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Receivable across current academic term
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
            Average Bed Value
          </span>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            $1,850
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Blended semester rate per resident
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, receipt number, reference, or booking code..."
              className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Payment Gateways & Channels</option>
              <option value="credit_card">Online Credit / Debit Card (Stripe)</option>
              <option value="campus_wallet">University Campus Wallet</option>
              <option value="bank_transfer">Direct Bank Wire</option>
              <option value="cash">Front Desk Cash</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/60 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-semibold">Receipt & Date</th>
                <th className="py-3 px-3 font-semibold">Student & Booking</th>
                <th className="py-3 px-3 font-semibold">Amount</th>
                <th className="py-3 px-3 font-semibold">Method</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Receipt Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900 dark:text-white block">
                      {p.receiptNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">{p.date}</span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      {p.studentName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {p.bookingCode} • Ref: {p.transactionRef}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white text-sm">
                    ${p.amount.toFixed(2)}
                  </td>

                  <td className="py-3 px-3">
                    <span className="capitalize text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      {p.paymentMethod.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {p.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setViewReceipt(p)}
                      className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {openPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Process Accommodation Payment
                </h3>
              </div>
              <button
                onClick={() => setOpenPaymentModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessSubmit} className="space-y-4 my-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Select Student Resident / Booking
                </label>
                <select
                  value={targetBookingId}
                  onChange={(e) => setTargetBookingId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.studentName} ({b.roomNumber}) - Due: ${b.totalAmount - b.amountPaid}
                    </option>
                  ))}
                </select>
              </div>

              {activeBookingForPay && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400">Total Rent:</span>
                    <strong className="ml-1 text-slate-900 dark:text-white">
                      ${activeBookingForPay.totalAmount}
                    </strong>
                    <span className="text-slate-400 ml-3">Already Paid:</span>
                    <strong className="ml-1 text-emerald-600">${activeBookingForPay.amountPaid}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPayAmount(String(outstandingForActiveBooking))}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    Pay Remaining (${outstandingForActiveBooking})
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Amount to Charge ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={outstandingForActiveBooking > 0 ? outstandingForActiveBooking : 9999}
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Payment Gateway
                  </label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="credit_card">Online Credit Card (Stripe)</option>
                    <option value="campus_wallet">University Student Card</option>
                    <option value="bank_transfer">Direct Bank Transfer</option>
                    <option value="cash">Front Desk Cash</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Payment Description / Line Item
                </label>
                <input
                  type="text"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  placeholder="e.g. Room security deposit or rent instalment"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setOpenPaymentModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                >
                  Charge & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt / Tax Invoice Modal */}
      {viewReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">
                Official Housing Receipt
              </span>
              <button
                onClick={() => setViewReceipt(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">
                    UniStay Residences
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Student Housing Accounts Office
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-600 text-sm block">
                    {viewReceipt.receiptNumber}
                  </span>
                  <span className="text-[10px] text-slate-400">{viewReceipt.date}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Payer:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{viewReceipt.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student ID:</span>
                  <span className="font-mono">{viewReceipt.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking Reference:</span>
                  <span className="font-mono">{viewReceipt.bookingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Gateway Ref:</span>
                  <span className="font-mono text-[11px]">{viewReceipt.transactionRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Settlement Method:</span>
                  <span className="capitalize">{viewReceipt.paymentMethod.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">Total Amount Settled:</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  ${viewReceipt.amount.toFixed(2)} USD
                </span>
              </div>

              <p className="text-[10px] text-center text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                This transaction has been logged in central university auditing systems. An automated copy was emailed to the resident.
              </p>

              <button
                type="button"
                onClick={handlePrintReceipt}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 flex items-center justify-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official PDF Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
