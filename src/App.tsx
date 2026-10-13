import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { RoomManagement } from './components/RoomManagement';
import { BookingManagement } from './components/BookingManagement';
import { CheckInOutDesk } from './components/CheckInOutDesk';
import { PaymentsModule } from './components/PaymentsModule';
import { ReportsModule } from './components/ReportsModule';
import { CalendarModule } from './components/CalendarModule';
import { MaintenanceModule } from './components/MaintenanceModule';
import { TeamChatModule } from './components/TeamChatModule';
import { StudentPortal } from './components/StudentPortal';
import { NewBookingModal } from './components/NewBookingModal';
import { EmailCenterModal } from './components/EmailCenterModal';

const AppContent: React.FC = () => {
  const { activeTab, isOffline } = useApp();

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'rooms':
        return <RoomManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'checkInOut':
        return <CheckInOutDesk />;
      case 'payments':
        return <PaymentsModule />;
      case 'reports':
        return <ReportsModule />;
      case 'calendar':
        return <CalendarModule />;
      case 'maintenance':
        return <MaintenanceModule />;
      case 'chat':
        return <TeamChatModule />;
      case 'myRoom':
        return <StudentPortal />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Banner if Offline Simulation active */}
      {isOffline && (
        <div className="bg-amber-500 text-white text-xs font-semibold py-1 px-4 text-center">
          ⚡ Offline Simulation Active — Changes are cached locally and will synchronize once restored online.
        </div>
      )}

      {/* Primary Top Navbar */}
      <Navbar />

      {/* Main Workspace: Sidebar + Responsive Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveModule()}
        </main>
      </div>

      {/* Global Modals */}
      <NewBookingModal />
      <EmailCenterModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
