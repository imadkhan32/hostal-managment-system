import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Room, Bed, PaymentTransaction } from '../types';
import { THEME_CONFIG } from '../utils/theme';
import {
  X,
  User,
  BedDouble,
  CreditCard,
  CheckCircle2,
  Calendar,
  DollarSign,
  ShieldCheck,
  Building,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
} from 'lucide-react';

export const NewBookingModal: React.FC = () => {
  const {
    openNewBookingModal,
    setOpenNewBookingModal,
    rooms,
    createBooking,
    themeAccent,
  } = useApp();

  const theme = THEME_CONFIG[themeAccent];

  const [step, setStep] = useState<number>(1);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState(`STU-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('+1 (555) 019-');
  const [nationality, setNationality] = useState('Germany');
  const [department, setDepartment] = useState('Computer Science');
  const [yearOfStudy, setYearOfStudy] = useState('1st Year Undergraduate');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (555) 018-');

  // Room & Bed State
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [selectedBedNumber, setSelectedBedNumber] = useState<string>('');

  // Dates
  const [checkInDate, setCheckInDate] = useState('2026-10-15');
  const [checkOutDate, setCheckOutDate] = useState('2027-05-30');
  const [notes, setNotes] = useState('');

  // Payment Gateway
  const [paymentOption, setPaymentOption] = useState<'pay_full' | 'deposit_only' | 'pay_at_desk'>('pay_full');
  const [paymentMethod, setPaymentMethod] = useState<PaymentTransaction['paymentMethod']>('credit_card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('884');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!openNewBookingModal) return null;

  // Filter rooms with open beds
  const roomsWithOpenBeds = rooms.filter((r) => r.beds.some((b) => b.status === 'available') && r.status !== 'maintenance');
  const activeRoom = rooms.find((r) => r.id === selectedRoomId);
  const openBedsInActiveRoom = activeRoom ? activeRoom.beds.filter((b) => b.status === 'available') : [];

  const totalAmount = activeRoom ? activeRoom.pricePerSemester : 1800;
  const depositAmount = 500;
  const amountToChargeNow = paymentOption === 'pay_full' ? totalAmount : paymentOption === 'deposit_only' ? depositAmount : 0;

  const handleComplete = () => {
    if (!selectedRoomId || !selectedBedNumber || !studentName || !studentEmail) {
      alert('Please fill out all required student and room details.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      createBooking(
        {
          studentId,
          studentName,
          studentEmail,
          studentPhone,
          nationality,
          department,
          yearOfStudy,
          roomId: selectedRoomId,
          roomNumber: activeRoom?.number || 'A-101',
          building: activeRoom?.building || 'Block A',
          bedNumber: selectedBedNumber,
          checkInDate,
          checkOutDate,
          status: 'confirmed',
          paymentStatus: amountToChargeNow >= totalAmount ? 'paid' : amountToChargeNow > 0 ? 'partial' : 'unpaid',
          totalAmount,
          amountPaid: amountToChargeNow,
          notes,
          emergencyContact: {
            name: emergencyName || 'Family Contact',
            relationship: 'Guardian',
            phone: emergencyPhone,
          },
        },
        amountToChargeNow > 0
          ? {
              amount: amountToChargeNow,
              method: paymentMethod,
            }
          : undefined
      );

      setIsProcessing(false);
      setOpenNewBookingModal(false);
      setStep(1);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Online Reservation Gateway
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Student Accommodation Booking
            </h2>
          </div>
          <button
            onClick={() => setOpenNewBookingModal(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Pills */}
        <div className="px-6 pt-4 pb-2 bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              1
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Student Info</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200 dark:bg-slate-700" />

          <div className="flex items-center space-x-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Room & Bed</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200 dark:bg-slate-700" />

          <div className="flex items-center space-x-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Payment & Confirm</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* STEP 1: Student Demographics */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Liam Henderson"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Student ID Number *
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Student Email Address * (For Confirmation)
                  </label>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="l.henderson@university.edu"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone / Mobile
                  </label>
                  <input
                    type="text"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nationality (International Student Support)
                  </label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="e.g. Canada, Germany, Japan, Spain"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Academic Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Electrical Engineering"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Emergency Contact / Guardian
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="Guardian Full Name"
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="Guardian Emergency Phone"
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Room Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Select Campus Room (With Available Beds)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1">
                  {roomsWithOpenBeds.map((room) => {
                    const isSelected = selectedRoomId === room.id;
                    const freeBeds = room.beds.filter((b) => b.status === 'available').length;
                    return (
                      <div
                        key={room.id}
                        onClick={() => {
                          setSelectedRoomId(room.id);
                          const firstFree = room.beds.find((b) => b.status === 'available');
                          if (firstFree) setSelectedBedNumber(firstFree.bedNumber);
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {room.number}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            ${room.pricePerSemester}/sem
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{room.building}</p>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="capitalize">{room.type.replace('-', ' ')}</span>
                          <span className="font-semibold text-emerald-600">
                            {freeBeds} bed{freeBeds > 1 ? 's' : ''} available
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {activeRoom && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block mb-2">
                    Select Specific Bed Slot in {activeRoom.number}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {activeRoom.beds.map((b) => {
                      const isFree = b.status === 'available';
                      const isChosen = selectedBedNumber === b.bedNumber;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          disabled={!isFree}
                          onClick={() => setSelectedBedNumber(b.bedNumber)}
                          className={`p-2.5 rounded-lg border text-xs font-semibold transition text-center ${
                            isChosen
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : isFree
                              ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 hover:border-emerald-500'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border-transparent'
                          }`}
                        >
                          <div>{b.bedNumber}</div>
                          <div className="text-[9px] font-normal mt-0.5">
                            {isFree ? 'Vacant' : 'Occupied'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Check-In / Check-Out dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Check-In Date
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Check-Out Date
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Gateway & Settlement */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      Accommodation Fee Breakdown
                    </span>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                      Room {activeRoom?.number} ({selectedBedNumber}) • {checkInDate} to {checkOutDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-950 dark:text-white">
                      ${totalAmount.toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-emerald-700">Semester Total</span>
                  </div>
                </div>
              </div>

              {/* Payment Option Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Select Payment Option
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentOption('pay_full')}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
                      paymentOption === 'pay_full'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>Full Semester</div>
                    <div className="text-[10px] font-bold text-emerald-600 mt-0.5">${totalAmount}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentOption('deposit_only')}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
                      paymentOption === 'deposit_only'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>Security Deposit</div>
                    <div className="text-[10px] font-bold text-emerald-600 mt-0.5">${depositAmount}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentOption('pay_at_desk')}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
                      paymentOption === 'pay_at_desk'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>Pay at Desk</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Collect Keycard</div>
                  </button>
                </div>
              </div>

              {/* Simulated Gateway Fields if Paying Now */}
              {paymentOption !== 'pay_at_desk' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Secure Payment Processing (256-Bit SSL)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                      <span>Visa</span>
                      <span>Mastercard</span>
                      <span>Student Wallet</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`p-2 rounded-lg text-xs font-semibold border ${
                        paymentMethod === 'credit_card'
                          ? 'border-emerald-500 bg-white dark:bg-slate-900 text-emerald-600'
                          : 'border-slate-200 text-slate-500'
                      }`}
                    >
                      Credit / Debit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('campus_wallet')}
                      className={`p-2 rounded-lg text-xs font-semibold border ${
                        paymentMethod === 'campus_wallet'
                          ? 'border-emerald-500 bg-white dark:bg-slate-900 text-emerald-600'
                          : 'border-slate-200 text-slate-500'
                      }`}
                    >
                      Campus Student Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`p-2 rounded-lg text-xs font-semibold border ${
                        paymentMethod === 'bank_transfer'
                          ? 'border-emerald-500 bg-white dark:bg-slate-900 text-emerald-600'
                          : 'border-slate-200 text-slate-500'
                      }`}
                    >
                      Bank Wire
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                      Card / Account Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                        Expiry MM/YY
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                        CVC Security Code
                      </label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Automated Email Guarantee notice */}
              <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                <span>
                  Automated booking confirmation and digital QR check-in pass will be dispatched immediately to <strong>{studentEmail || 'student email'}</strong>.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && (!studentName || !studentEmail)) {
                  alert('Please enter student name and email address.');
                  return;
                }
                if (step === 2 && (!selectedRoomId || !selectedBedNumber)) {
                  alert('Please choose a room and bed number.');
                  return;
                }
                setStep(step + 1);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white ${theme.primary} ${theme.primaryHover} shadow-sm flex items-center space-x-1.5`}
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleComplete}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center space-x-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isProcessing ? 'Confirming Reservation...' : `Confirm & Pay $${amountToChargeNow}`}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
