import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../utils/i18n';
import { THEME_CONFIG } from '../utils/theme';
import { UserRole, ThemeAccent, LanguageCode } from '../types';
import {
  Building2,
  Bell,
  Mail,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  RefreshCw,
  Globe,
  Palette,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  KeyRound,
  X,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchRole,
    language,
    setLanguage,
    themeAccent,
    setThemeAccent,
    isDarkMode,
    setIsDarkMode,
    t,
    isOffline,
    setIsOffline,
    isSyncing,
    syncData,
    notifications,
    markAllNotificationsRead,
    emails,
    setOpenEmailModal,
    setActiveTab,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const theme = THEME_CONFIG[themeAccent];

  const roleLabels: Record<UserRole, { label: string; desc: string }> = {
    admin: { label: t('admin'), desc: 'Full Administrative & Financial Access' },
    warden: { label: t('warden'), desc: 'Discipline, Facilities & Check-In Authority' },
    receptionist: { label: t('receptionist'), desc: 'Front Desk, Bookings & Key Issuance' },
    student: { label: t('student'), desc: 'Personal Room Portal & Billing Self-Service' },
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'checkin':
        return <KeyRound className="w-4 h-4 text-amber-500" />;
      case 'maintenance':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className={`p-2 rounded-xl text-white ${theme.primary} shadow-md shadow-emerald-900/10`}>
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  {t('appName')}
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Campus Housing
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
            
            {/* Online / Offline Sync Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 text-xs">
              <button
                type="button"
                onClick={() => setIsOffline(!isOffline)}
                title={isOffline ? 'Click to restore online mode' : 'Click to simulate offline network'}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-all ${
                  isOffline
                    ? 'bg-amber-500 text-white font-medium'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5 text-emerald-500" />}
                <span className="hidden lg:inline">{isOffline ? t('offline') : t('online')}</span>
              </button>

              <button
                type="button"
                onClick={syncData}
                disabled={isSyncing}
                title={t('syncNow')}
                className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-500' : ''}`} />
              </button>
            </div>

            {/* Automated Email Queue trigger button */}
            <button
              type="button"
              onClick={() => setOpenEmailModal(true)}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Automated Email Dispatcher & Logs"
            >
              <Mail className="w-4 h-4" />
              {emails.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {emails.length}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title={t('notifications')}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">
                        {t('notifications')}
                      </span>
                      {unreadCount > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-full font-medium">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-medium"
                      >
                        {t('markAllRead')}
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 mt-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-center py-6 text-slate-500">{t('noNotifications')}</p>
                    ) : (
                      notifications.slice(0, 6).map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-2.5 flex space-x-3 rtl:space-x-reverse rounded-lg transition ${
                            notif.read ? 'opacity-70' : 'bg-slate-50 dark:bg-slate-800/40'
                          }`}
                        >
                          <div className="mt-0.5">{getNotifIcon(notif.type)}</div>
                          <div className="flex-1 text-xs">
                            <p className="font-semibold text-slate-800 dark:text-slate-100">{notif.title}</p>
                            <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-1 p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-medium"
                title="Select Interface Language"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase font-bold">{language}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Languages (اللغات)
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as LanguageCode);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left rtl:text-right px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                        language === lang.code ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] uppercase text-slate-400">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Accent Picker */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Color Themes"
              >
                <Palette className="w-4 h-4" />
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-40 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50">
                  <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase">Theme Accent</div>
                  {(['emerald', 'indigo', 'crimson', 'amber'] as ThemeAccent[]).map((acc) => (
                    <button
                      key={acc}
                      onClick={() => {
                        setThemeAccent(acc);
                        setShowThemeMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 rtl:space-x-reverse px-2 py-1.5 rounded-md text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 capitalize"
                    >
                      <span
                        className={`w-3 h-3 rounded-full ${
                          acc === 'emerald'
                            ? 'bg-emerald-500'
                            : acc === 'indigo'
                            ? 'bg-indigo-500'
                            : acc === 'crimson'
                            ? 'bg-rose-500'
                            : 'bg-amber-500'
                        }`}
                      />
                      <span>{acc}</span>
                      {themeAccent === acc && <span className="ml-auto text-[10px] text-emerald-500 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* RBAC Role Switcher */}
            <div className="relative pl-1">
              <button
                type="button"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-2 rtl:space-x-reverse p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-600"
                />
                <div className="hidden sm:block text-left rtl:text-right">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {t(currentUser.role)}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                  </div>

                  <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Role-Based Access (Switch Demo View)
                  </div>

                  {(['admin', 'warden', 'receptionist', 'student'] as UserRole[]).map((r) => {
                    const info = roleLabels[r];
                    const isActive = currentUser.role === r;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          switchRole(r);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left rtl:text-right px-3 py-2 text-xs flex flex-col hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                          isActive ? 'bg-emerald-50 dark:bg-emerald-950/30' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {info.label}
                          </span>
                          {isActive && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5">{info.desc}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
