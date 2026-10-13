import React from 'react';
import { useApp } from '../context/AppContext';
import { THEME_CONFIG } from '../utils/theme';
import {
  LayoutDashboard,
  BedDouble,
  Users,
  CheckCircle,
  CreditCard,
  BarChart3,
  Calendar,
  Wrench,
  MessageSquare,
  Home,
  Shield,
  Layers,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, t, themeAccent, rooms, bookings, maintenance } = useApp();
  const theme = THEME_CONFIG[themeAccent];

  // Badges calculation
  const pendingCheckinsCount = bookings.filter((b) => b.status === 'confirmed').length;
  const openMaintenanceCount = maintenance.filter((m) => m.status === 'open').length;
  const availableBedsCount = rooms.reduce((acc, r) => acc + (r.totalBeds - r.occupiedBeds), 0);

  const navItems = [
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: LayoutDashboard,
      allowedRoles: ['admin', 'warden', 'receptionist'],
    },
    {
      id: 'rooms',
      label: t('rooms'),
      icon: BedDouble,
      badge: `${availableBedsCount} open`,
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
      allowedRoles: ['admin', 'warden', 'receptionist', 'student'],
    },
    {
      id: 'bookings',
      label: t('bookings'),
      icon: Users,
      badge: `${bookings.length}`,
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      allowedRoles: ['admin', 'warden', 'receptionist'],
    },
    {
      id: 'checkInOut',
      label: t('checkInOut'),
      icon: CheckCircle,
      badge: pendingCheckinsCount > 0 ? `${pendingCheckinsCount} due` : undefined,
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      allowedRoles: ['admin', 'warden', 'receptionist'],
    },
    {
      id: 'payments',
      label: t('payments'),
      icon: CreditCard,
      allowedRoles: ['admin', 'warden', 'receptionist'],
    },
    {
      id: 'reports',
      label: t('reports'),
      icon: BarChart3,
      allowedRoles: ['admin', 'warden'],
    },
    {
      id: 'calendar',
      label: t('calendar'),
      icon: Calendar,
      allowedRoles: ['admin', 'warden', 'receptionist', 'student'],
    },
    {
      id: 'maintenance',
      label: t('maintenance'),
      icon: Wrench,
      badge: openMaintenanceCount > 0 ? `${openMaintenanceCount}` : undefined,
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
      allowedRoles: ['admin', 'warden', 'receptionist', 'student'],
    },
    {
      id: 'chat',
      label: t('chat'),
      icon: MessageSquare,
      allowedRoles: ['admin', 'warden', 'receptionist', 'student'],
    },
    {
      id: 'myRoom',
      label: t('myRoom'),
      icon: Home,
      highlight: true,
      allowedRoles: ['student', 'admin'],
    },
  ];

  const visibleItems = navItems.filter((item) => item.allowedRoles.includes(currentUser.role));

  return (
    <aside className="w-full lg:w-64 bg-slate-50/80 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 p-3 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Main Navigation</span>
          <span className="flex items-center text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold lowercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
            v2.6 live
          </span>
        </div>

        <nav className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? `${theme.primary} text-white shadow-sm font-semibold`
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role permissions card */}
      <div className="mt-6 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-semibold text-slate-900 dark:text-white">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>Active Role: {t(currentUser.role)}</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          {currentUser.role === 'admin' && 'Unrestricted system privileges, audits & exports.'}
          {currentUser.role === 'warden' && 'Hostel warden view: inspections & room allocation.'}
          {currentUser.role === 'receptionist' && 'Front desk check-in / out & key issuance.'}
          {currentUser.role === 'student' && 'Resident self-service portal & payment receipts.'}
        </p>
      </div>
    </aside>
  );
};
