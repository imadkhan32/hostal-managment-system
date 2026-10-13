import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MaintenanceTicket, MaintenanceCategory, MaintenancePriority } from '../types';
import { THEME_CONFIG } from '../utils/theme';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  User,
  X,
  Droplet,
  Zap,
  Wifi,
  Armchair,
  Sparkles,
} from 'lucide-react';

export const MaintenanceModule: React.FC = () => {
  const {
    maintenance,
    addMaintenanceTicket,
    updateMaintenanceStatus,
    currentUser,
    themeAccent,
  } = useApp();

  const theme = THEME_CONFIG[themeAccent];

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // New ticket form
  const [roomNumber, setRoomNumber] = useState('A-102');
  const [building, setBuilding] = useState('Block A (North Hall)');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MaintenanceCategory>('plumbing');
  const [priority, setPriority] = useState<MaintenancePriority>('medium');
  const [assignedTo, setAssignedTo] = useState('Dave (HVAC Facilities)');

  const filteredTickets = maintenance.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.reportedBy.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());

    const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchStat = selectedStatus === 'all' || t.status === selectedStatus;
    return matchSearch && matchCat && matchStat;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    addMaintenanceTicket({
      roomNumber,
      building,
      reportedBy: currentUser.name,
      studentId: currentUser.studentId,
      title,
      description,
      category,
      priority,
      status: 'open',
      assignedTo,
    });

    setTitle('');
    setDescription('');
    setModalOpen(false);
  };

  const getCategoryIcon = (cat: MaintenanceCategory) => {
    switch (cat) {
      case 'plumbing':
        return <Droplet className="w-4 h-4 text-blue-500" />;
      case 'electrical':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'wifi':
        return <Wifi className="w-4 h-4 text-indigo-500" />;
      case 'furniture':
        return <Armchair className="w-4 h-4 text-orange-500" />;
      default:
        return <Wrench className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Facilities & Maintenance Work Desk
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track student repair requests, room equipment maintenance, technician dispatch, and service level agreements.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-bold ${theme.primary} ${theme.primaryHover} shadow-sm transition`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Report New Maintenance Issue</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, room, reporter..."
              className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Service Categories</option>
              <option value="plumbing">Plumbing & Bathroom</option>
              <option value="electrical">Electrical & Lighting</option>
              <option value="appliance">HVAC & Appliances</option>
              <option value="furniture">Furniture & Desks</option>
              <option value="wifi">Wi-Fi & Networking</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Ticket Statuses</option>
              <option value="open">Open (Needs Attention)</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTickets.map((t) => (
          <div
            key={t.id}
            className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700">
                    {getCategoryIcon(t.category)}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      Room {t.roomNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">{t.category}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                    t.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : t.priority === 'high'
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t.priority}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-3 leading-snug">
                {t.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {t.description}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div>Reported by: <strong>{t.reportedBy}</strong></div>
                <div>Assigned: <strong>{t.assignedTo || 'Unassigned'}</strong></div>
                <div>Created: {t.createdAt}</div>
              </div>
            </div>

            {/* Bottom Status Controls */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  t.status === 'resolved'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : t.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
              >
                {t.status.replace('_', ' ')}
              </span>

              {currentUser.role !== 'student' && (
                <div className="flex items-center space-x-1">
                  {t.status !== 'in_progress' && (
                    <button
                      onClick={() => updateMaintenanceStatus(t.id, 'in_progress')}
                      className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 text-slate-700 dark:text-slate-200"
                    >
                      Start Work
                    </button>
                  )}
                  {t.status !== 'resolved' && (
                    <button
                      onClick={() => updateMaintenanceStatus(t.id, 'resolved')}
                      className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      Resolve ✓
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Maintenance Ticket Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Report Room Maintenance Issue
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 my-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Room Number
                  </label>
                  <input
                    type="text"
                    required
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Campus Block
                  </label>
                  <input
                    type="text"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Issue Summary *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Desk chair wheel broken, leaking faucet"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="appliance">HVAC / Appliance</option>
                    <option value="furniture">Furniture</option>
                    <option value="wifi">Wi-Fi</option>
                    <option value="cleaning">Cleaning</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Description & Details *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide precise location or symptoms..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-sm"
                >
                  Submit Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
