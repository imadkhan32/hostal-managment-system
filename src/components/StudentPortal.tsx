import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { THEME_CONFIG } from '../utils/theme';
import {
  Home,
  BedDouble,
  CreditCard,
  Wrench,
  CheckCircle2,
  QrCode,
  ShieldAlert,
  Users,
  Sparkles,
  Phone,
  FileText,
  Lock,
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const {
    currentUser,
    bookings,
    rooms,
    payments,
    addMaintenanceTicket,
    themeAccent,
    setOpenPaymentModal,
  } = useApp();

  const theme = THEME_CONFIG[themeAccent];

  // Find booking for current user
  const myBooking = bookings.find(
    (b) => b.studentId === currentUser.studentId || b.studentEmail === currentUser.email
  ) || bookings[0];

  const myRoom = rooms.find((r) => r.id === myBooking?.roomId) || rooms[0];
  const roommates = myRoom.beds.filter((b) => b.bedNumber !== myBooking?.bedNumber && b.status === 'occupied');

  const [issueTitle, setIssueTitle] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle) return;

    addMaintenanceTicket({
      roomNumber: myBooking.roomNumber,
      building: myBooking.building,
      reportedBy: currentUser.name,
      studentId: currentUser.studentId,
      title: issueTitle,
      description: issueDesc || 'Reported via Student Residence Portal',
      category: 'other',
      priority: 'medium',
      status: 'open',
    });

    setIssueTitle('');
    setIssueDesc('');
    setTicketSubmitted(true);
    setTimeout(() => setTicketSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-emerald-600 text-white">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Student Resident Self-Service Portal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Welcome, {currentUser.name}! Manage your room pass, roommates, billing balance, and maintenance.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Room Pass & Key Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Room details and pass */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Unit Card */}
          <div className="bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono tracking-widest text-emerald-300 uppercase">
                  Official Room Allocation
                </span>
                <h2 className="text-3xl font-black mt-1">
                  Room {myBooking.roomNumber}
                </h2>
                <p className="text-sm text-emerald-100 font-semibold mt-0.5">
                  {myBooking.bedNumber} • {myBooking.building}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md font-semibold">
                    🔑 RFID Access Active
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md font-semibold">
                    Term: {myBooking.checkInDate} to {myBooking.checkOutDate}
                  </span>
                </div>
              </div>

              {/* QR Code Pass */}
              <div className="bg-white p-3 rounded-2xl shadow-md text-slate-900 flex flex-col items-center shrink-0">
                <svg className="w-24 h-24" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="5" y="5" width="28" height="28" rx="2" fill="#065f46" />
                  <rect x="10" y="10" width="18" height="18" rx="1" fill="#ffffff" />
                  <rect x="14" y="14" width="10" height="10" fill="#065f46" />
                  <rect x="67" y="5" width="28" height="28" rx="2" fill="#065f46" />
                  <rect x="72" y="10" width="18" height="18" rx="1" fill="#ffffff" />
                  <rect x="76" y="14" width="10" height="10" fill="#065f46" />
                  <rect x="5" y="67" width="28" height="28" rx="2" fill="#065f46" />
                  <rect x="10" y="72" width="18" height="18" rx="1" fill="#ffffff" />
                  <rect x="14" y="76" width="10" height="10" fill="#065f46" />
                  <rect x="42" y="15" width="8" height="8" fill="#065f46" />
                  <rect x="42" y="42" width="16" height="16" fill="#065f46" />
                  <rect x="65" y="65" width="12" height="12" fill="#065f46" />
                </svg>
                <span className="text-[9px] font-bold font-mono text-slate-500 mt-1">
                  {myBooking.bookingCode}
                </span>
              </div>
            </div>
          </div>

          {/* Roommates Directory */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-500" />
              <span>Roommates in {myBooking.roomNumber}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Fellow students assigned to your room unit for this academic year.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roommates.length === 0 ? (
                <div className="col-span-2 text-xs text-slate-400 py-4 text-center">
                  You currently have a single occupancy studio with no roommates.
                </div>
              ) : (
                roommates.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                      {b.studentName ? b.studentName.charAt(0) : 'S'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {b.studentName}
                      </p>
                      <p className="text-[11px] text-slate-500">{b.bedNumber}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Room Maintenance Request */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-rose-500" />
              <span>Need Facilities Assistance in Your Room?</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Report plumbing, electrical, air conditioning, or study furniture issues directly to on-call maintenance.
            </p>

            {ticketSubmitted && (
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ticket submitted! A technician has been assigned to Room {myBooking.roomNumber}.</span>
              </div>
            )}

            <form onSubmit={handleTicketSubmit} className="space-y-3">
              <input
                type="text"
                required
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                placeholder="What seems to be the issue? (e.g. Desk lamp socket, bathroom tap)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
              <textarea
                rows={2}
                value={issueDesc}
                onChange={(e) => setIssueDesc(e.target.value)}
                placeholder="Additional notes or urgency..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90"
              >
                Send Request to Warden Desk
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Account & Financials */}
        <div className="space-y-6">
          {/* Financial Account Card */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Student Housing Account
            </span>
            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500">Semester Total:</span>
                <p className="text-xl font-black text-slate-900 dark:text-white">
                  ${myBooking.totalAmount}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Paid to Date:</span>
                <p className="text-xl font-black text-emerald-600">
                  ${myBooking.amountPaid}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Outstanding Balance:
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white">
                ${Math.max(0, myBooking.totalAmount - myBooking.amountPaid)}
              </span>
            </div>

            {myBooking.amountPaid < myBooking.totalAmount && (
              <button
                type="button"
                onClick={() => setOpenPaymentModal(true)}
                className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Settle Balance Online
              </button>
            )}
          </div>

          {/* Residence Contacts & Rules */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Campus Residence Guidelines</span>
            </h4>
            <div className="space-y-2 text-slate-600 dark:text-slate-300">
              <p>• <strong>Quiet Hours:</strong> 10:00 PM – 7:00 AM daily.</p>
              <p>• <strong>Guest Policy:</strong> Signed visitors allowed until 11:00 PM.</p>
              <p>• <strong>Laundry:</strong> Facilities located on Floor 1 & 2 (24/7 card access).</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-900 dark:text-white">Emergency Contacts:</p>
              <p>Warden Hotline: +1 (555) 014-9982</p>
              <p>Campus Security: +1 (555) 019-9999</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
