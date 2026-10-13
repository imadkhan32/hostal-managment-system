import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SentEmail } from '../types';
import {
  Mail,
  X,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  QrCode,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const EmailCenterModal: React.FC = () => {
  const { openEmailModal, setOpenEmailModal, emails, setEmails, setNotifications } = useApp();
  const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(emails[0] || null);

  // Quick Dispatch form
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  if (!openEmailModal) return null;

  const handleSendManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !subject) return;

    setSending(true);
    setTimeout(() => {
      const newEmail: SentEmail = {
        id: `em-${Date.now()}`,
        recipientEmail: recipient,
        recipientName: recipient.split('@')[0],
        subject,
        templateType: 'booking_confirmation',
        sentAt: new Date().toLocaleString(),
        body,
        status: 'delivered',
      };
      setEmails((prev) => [newEmail, ...prev]);
      setSelectedEmail(newEmail);
      setSending(false);
      setRecipient('');
      setSubject('');
      setBody('');

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: 'Automated Email Dispatched',
          message: `Email "${subject}" delivered successfully to ${recipient}.`,
          type: 'booking',
          timestamp: 'Just now',
          read: false,
        },
        ...prev,
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full h-[85vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Automated Notification & Confirmation Email Center
              </h2>
              <p className="text-xs text-slate-500">
                Outbound SMTP transaction queue, digital passes, and instant delivery verification.
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpenEmailModal(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split Left (Queue list) and Right (Email Preview) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 overflow-hidden">
          {/* Left 2 Cols: Email Queue List */}
          <div className="md:col-span-2 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-3 space-y-2 bg-slate-50/30 dark:bg-slate-900/30">
            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Dispatched Emails ({emails.length})</span>
              <span className="text-emerald-600 font-semibold">100% Delivered</span>
            </div>

            {emails.map((em) => {
              const isSelected = selectedEmail?.id === em.id;
              return (
                <div
                  key={em.id}
                  onClick={() => setSelectedEmail(em)}
                  className={`p-3 rounded-2xl cursor-pointer transition border text-xs ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                      : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                      {em.recipientName}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Delivered</span>
                    </span>
                  </div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">
                    {em.subject}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">{em.sentAt}</p>
                </div>
              );
            })}
          </div>

          {/* Right 3 Cols: Selected Email Preview */}
          <div className="md:col-span-3 flex flex-col justify-between p-6 overflow-y-auto bg-white dark:bg-slate-900">
            {selectedEmail ? (
              <div className="space-y-4">
                {/* Meta details */}
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Recipient:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">
                      {selectedEmail.recipientName} &lt;{selectedEmail.recipientEmail}&gt;
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subject:</span>
                    <strong className="text-slate-900 dark:text-white">{selectedEmail.subject}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Timestamp:</span>
                    <span className="text-slate-500">{selectedEmail.sentAt}</span>
                  </div>
                </div>

                {/* Simulated Email Body Container */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 text-xs font-sans">
                  {/* University branding banner inside email */}
                  <div className="flex items-center space-x-2 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-xs">
                      U
                    </div>
                    <div>
                      <span className="font-black text-slate-900 dark:text-white text-xs block">
                        UniStay Student Residences
                      </span>
                      <span className="text-[10px] text-slate-400">Official Automated Dispatch</span>
                    </div>
                  </div>

                  <p className="whitespace-pre-line text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                    {selectedEmail.body}
                  </p>

                  {/* If email has QR pass representation */}
                  {selectedEmail.qrCodeData && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-emerald-500 text-center space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                        Included Digital Check-In Pass
                      </span>
                      <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                        <QrCode className="w-10 h-10 text-slate-800 dark:text-slate-200" />
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 block">
                        {selectedEmail.qrCodeData}
                      </span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-400 text-center">
                    This is an automated system email from UniStay Residences. For assistance, contact reception@unistay.edu.
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-xs text-slate-400">
                Select an email from the left queue to view details.
              </div>
            )}

            {/* Quick Dispatch Box at bottom */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Simulate Direct Email Dispatch
              </span>
              <form onSubmit={handleSendManual} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Subject (e.g. Room Inspection Reminder)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Message notice body..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 disabled:opacity-50 flex items-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
