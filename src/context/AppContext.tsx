import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  LanguageCode,
  ThemeAccent,
  Room,
  Booking,
  PaymentTransaction,
  MaintenanceTicket,
  NotificationItem,
  SentEmail,
  ChatMessage,
  DashboardWidgetConfig,
} from '../types';
import { StorageService } from '../utils/storage';
import { t } from '../utils/i18n';
import confetti from 'canvas-confetti';

interface AppContextType {
  // User & Role
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  allUsers: UserProfile[];
  switchRole: (role: UserRole) => void;

  // Language & Theme
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  themeAccent: ThemeAccent;
  setThemeAccent: (accent: ThemeAccent) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  t: (key: string) => string;

  // Offline simulation
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  isSyncing: boolean;
  syncData: () => void;

  // Data Stores
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  payments: PaymentTransaction[];
  setPayments: React.Dispatch<React.SetStateAction<PaymentTransaction[]>>;
  maintenance: MaintenanceTicket[];
  setMaintenance: React.Dispatch<React.SetStateAction<MaintenanceTicket[]>>;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  emails: SentEmail[];
  setEmails: React.Dispatch<React.SetStateAction<SentEmail[]>>;
  chats: ChatMessage[];
  setChats: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  widgets: DashboardWidgetConfig[];
  setWidgets: React.Dispatch<React.SetStateAction<DashboardWidgetConfig[]>>;

  // Helper Actions
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openEmailModal: boolean;
  setOpenEmailModal: (open: boolean) => void;
  openNewBookingModal: boolean;
  setOpenNewBookingModal: (open: boolean) => void;
  openPaymentModal: boolean;
  setOpenPaymentModal: (open: boolean) => void;
  selectedBookingForAction: Booking | null;
  setSelectedBookingForAction: (b: Booking | null) => void;
  
  // High-Level Domain Operations
  createBooking: (newBookingData: Omit<Booking, 'id' | 'createdAt' | 'bookingCode'>, initialPayment?: { amount: number; method: PaymentTransaction['paymentMethod'] }) => void;
  checkInBooking: (bookingId: string) => void;
  checkOutBooking: (bookingId: string) => void;
  processPayment: (bookingId: string, amount: number, method: PaymentTransaction['paymentMethod'], note?: string) => void;
  addMaintenanceTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'createdAt'>) => void;
  updateMaintenanceStatus: (ticketId: string, status: MaintenanceTicket['status']) => void;
  sendChatMessage: (channel: ChatMessage['channel'], content: string) => void;
  markAllNotificationsRead: () => void;
  reorderWidgets: (dragIndex: number, hoverIndex: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const allUsers = StorageService.getUsers();
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    return allUsers.find((u) => u.role === 'admin') || allUsers[0];
  });

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('unistay_lang') as LanguageCode) || 'en';
  });

  const [themeAccent, setThemeAccentState] = useState<ThemeAccent>(() => {
    return (localStorage.getItem('unistay_accent') as ThemeAccent) || 'emerald';
  });

  const [isDarkMode, setIsDarkModeState] = useState<boolean>(() => {
    return localStorage.getItem('unistay_dark') === 'true';
  });

  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Entities
  const [rooms, setRooms] = useState<Room[]>(() => StorageService.getRooms());
  const [bookings, setBookings] = useState<Booking[]>(() => StorageService.getBookings());
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => StorageService.getPayments());
  const [maintenance, setMaintenance] = useState<MaintenanceTicket[]>(() => StorageService.getMaintenance());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => StorageService.getNotifications());
  const [emails, setEmails] = useState<SentEmail[]>(() => StorageService.getEmails());
  const [chats, setChats] = useState<ChatMessage[]>(() => StorageService.getChats());
  const [widgets, setWidgets] = useState<DashboardWidgetConfig[]>(() => StorageService.getWidgets());

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false);
  const [openNewBookingModal, setOpenNewBookingModal] = useState<boolean>(false);
  const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false);
  const [selectedBookingForAction, setSelectedBookingForAction] = useState<Booking | null>(null);

  // Sync to storage
  useEffect(() => {
    StorageService.saveRooms(rooms);
  }, [rooms]);

  useEffect(() => {
    StorageService.saveBookings(bookings);
  }, [bookings]);

  useEffect(() => {
    StorageService.savePayments(payments);
  }, [payments]);

  useEffect(() => {
    StorageService.saveMaintenance(maintenance);
  }, [maintenance]);

  useEffect(() => {
    StorageService.saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    StorageService.saveEmails(emails);
  }, [emails]);

  useEffect(() => {
    StorageService.saveChats(chats);
  }, [chats]);

  useEffect(() => {
    StorageService.saveWidgets(widgets);
  }, [widgets]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('unistay_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const setThemeAccent = (accent: ThemeAccent) => {
    setThemeAccentState(accent);
    localStorage.setItem('unistay_accent', accent);
  };

  const setIsDarkMode = (dark: boolean) => {
    setIsDarkModeState(dark);
    localStorage.setItem('unistay_dark', String(dark));
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initial Dark Mode sync
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, []);

  const switchRole = (role: UserRole) => {
    const found = allUsers.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      if (role === 'student') {
        setActiveTab('myRoom');
      } else if (activeTab === 'myRoom') {
        setActiveTab('dashboard');
      }
    }
  };

  const syncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: 'Cloud Sync Successful',
          message: 'All local hostel modifications have been committed to central storage.',
          type: 'announcement',
          timestamp: 'Just now',
          read: false,
        },
        ...prev,
      ]);
    }, 900);
  };

  const translateHelper = (key: string) => t(key, language);

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Domain logic: Create Booking
  const createBooking = (
    newBookingData: Omit<Booking, 'id' | 'createdAt' | 'bookingCode'>,
    initialPayment?: { amount: number; method: PaymentTransaction['paymentMethod'] }
  ) => {
    const newId = `bk-${Date.now().toString().slice(-6)}`;
    const bookingCode = `UNS-${Math.floor(1000 + Math.random() * 9000)}-${newBookingData.roomNumber.charAt(0)}`;
    const createdAt = new Date().toISOString().split('T')[0];

    const hasPaid = initialPayment && initialPayment.amount >= newBookingData.totalAmount;
    const isPartial = initialPayment && initialPayment.amount > 0 && initialPayment.amount < newBookingData.totalAmount;
    const paymentStatus: Booking['paymentStatus'] = hasPaid ? 'paid' : isPartial ? 'partial' : 'unpaid';
    const amountPaid = initialPayment ? initialPayment.amount : 0;

    const newBooking: Booking = {
      ...newBookingData,
      id: newId,
      bookingCode,
      createdAt,
      paymentStatus,
      amountPaid,
    };

    // Update Room & Bed status
    setRooms((prevRooms) =>
      prevRooms.map((rm) => {
        if (rm.id === newBooking.roomId) {
          const updatedBeds = rm.beds.map((b) => {
            if (b.bedNumber === newBooking.bedNumber) {
              return {
                ...b,
                status: 'occupied' as const,
                studentId: newBooking.studentId,
                studentName: newBooking.studentName,
              };
            }
            return b;
          });
          const occCount = updatedBeds.filter((b) => b.status === 'occupied').length;
          return {
            ...rm,
            beds: updatedBeds,
            occupiedBeds: occCount,
            status: occCount >= rm.totalBeds ? ('occupied' as const) : ('available' as const),
          };
        }
        return rm;
      })
    );

    setBookings((prev) => [newBooking, ...prev]);

    // Record Payment transaction if provided
    if (initialPayment && initialPayment.amount > 0) {
      const newPayTx: PaymentTransaction = {
        id: `pay-${Date.now()}`,
        bookingId: newId,
        bookingCode,
        studentName: newBooking.studentName,
        studentId: newBooking.studentId,
        amount: initialPayment.amount,
        currency: 'USD',
        paymentMethod: initialPayment.method,
        status: 'completed',
        transactionRef: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleString(),
        receiptNumber: `RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        description: `Accommodation Fee for Room ${newBooking.roomNumber} (${newBooking.bedNumber})`,
      };
      setPayments((prev) => [newPayTx, ...prev]);
    }

    // Automated Email Dispatch
    const emailSubject = `UniStay Booking Confirmation & Digital Keycard Pass [${bookingCode}]`;
    const emailBody = `Dear ${newBooking.studentName},\n\nYour accommodation at UniStay (${newBooking.building}, Room ${newBooking.roomNumber}, ${newBooking.bedNumber}) is officially confirmed!\n\nCheck-in Date: ${newBooking.checkInDate}\nCheck-out Date: ${newBooking.checkOutDate}\nTotal Rent: $${newBooking.totalAmount} (Paid: $${amountPaid})\n\nPlease present this email or the included QR code at front desk upon arrival.\n\nUniStay Housing Office`;
    const newEmail: SentEmail = {
      id: `em-${Date.now()}`,
      recipientEmail: newBooking.studentEmail,
      recipientName: newBooking.studentName,
      subject: emailSubject,
      templateType: 'booking_confirmation',
      sentAt: new Date().toLocaleString(),
      body: emailBody,
      qrCodeData: `UNISTAY:RESIDENT:${newBooking.studentId}:ROOM-${newBooking.roomNumber}`,
      status: 'delivered',
    };
    setEmails((prev) => [newEmail, ...prev]);

    // Push Notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Booking Confirmed',
        message: `${newBooking.studentName} booked ${newBooking.roomNumber} (${newBooking.bedNumber}). Automated confirmation email dispatched.`,
        type: 'booking',
        timestamp: 'Just now',
        read: false,
        targetRole: 'all',
      },
      ...prev,
    ]);

    // Trigger visual confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  const checkInBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return { ...b, status: 'checked-in' };
        }
        return b;
      })
    );

    const b = bookings.find((item) => item.id === bookingId);
    if (b) {
      // Dispatch check-in welcome email
      const newEmail: SentEmail = {
        id: `em-${Date.now()}`,
        recipientEmail: b.studentEmail,
        recipientName: b.studentName,
        subject: `Welcome to UniStay! Room ${b.roomNumber} Keycard Issued`,
        templateType: 'room_assignment',
        sentAt: new Date().toLocaleString(),
        body: `Hello ${b.studentName},\n\nYou have successfully completed check-in for Room ${b.roomNumber} (${b.bedNumber}) at ${b.building}.\nYour RFID access card is active. Wi-Fi network: 'UniStay-Secure' (Student ID login). Enjoy your semester!`,
        qrCodeData: `CHECKED-IN:${b.bookingCode}`,
        status: 'delivered',
      };
      setEmails((prev) => [newEmail, ...prev]);

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: 'Guest Checked In',
          message: `${b.studentName} has checked into Room ${b.roomNumber}. Welcome email sent.`,
          type: 'checkin',
          timestamp: 'Just now',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  const checkOutBooking = (bookingId: string) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'checked-out' } : b))
    );

    // Free up the bed and set room to 'cleaning'
    setRooms((prevRooms) =>
      prevRooms.map((rm) => {
        if (rm.id === target.roomId) {
          const updatedBeds = rm.beds.map((bed) => {
            if (bed.bedNumber === target.bedNumber) {
              return { ...bed, status: 'available' as const, studentId: undefined, studentName: undefined };
            }
            return bed;
          });
          const occCount = updatedBeds.filter((b) => b.status === 'occupied').length;
          return {
            ...rm,
            beds: updatedBeds,
            occupiedBeds: occCount,
            status: occCount === 0 ? ('cleaning' as const) : ('available' as const),
          };
        }
        return rm;
      })
    );

    // Send checkout survey email
    setEmails((prev) => [
      {
        id: `em-${Date.now()}`,
        recipientEmail: target.studentEmail,
        recipientName: target.studentName,
        subject: `UniStay Checkout Complete: Deposit Release & Residence Survey`,
        templateType: 'checkout_survey',
        sentAt: new Date().toLocaleString(),
        body: `Dear ${target.studentName},\n\nYour checkout for ${target.roomNumber} has been logged. Keycard returned. Room inspection will conclude today. Thank you for staying with us!`,
        status: 'delivered',
      },
      ...prev,
    ]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Resident Checked Out',
        message: `${target.studentName} checked out of ${target.roomNumber}. Housekeeping notified for turnover.`,
        type: 'checkin',
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  const processPayment = (
    bookingId: string,
    amount: number,
    method: PaymentTransaction['paymentMethod'],
    note?: string
  ) => {
    let targetBooking: Booking | undefined;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const newPaid = b.amountPaid + amount;
          const newStatus = newPaid >= b.totalAmount ? 'paid' : 'partial';
          targetBooking = { ...b, amountPaid: newPaid, paymentStatus: newStatus };
          return targetBooking;
        }
        return b;
      })
    );

    if (targetBooking) {
      const receiptNum = `RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newPay: PaymentTransaction = {
        id: `pay-${Date.now()}`,
        bookingId,
        bookingCode: targetBooking.bookingCode,
        studentName: targetBooking.studentName,
        studentId: targetBooking.studentId,
        amount,
        currency: 'USD',
        paymentMethod: method,
        status: 'completed',
        transactionRef: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleString(),
        receiptNumber: receiptNum,
        description: note || `Payment installment for Room ${targetBooking.roomNumber}`,
      };

      setPayments((prev) => [newPay, ...prev]);

      // Automated receipt email
      setEmails((prev) => [
        {
          id: `em-${Date.now()}`,
          recipientEmail: targetBooking!.studentEmail,
          recipientName: targetBooking!.studentName,
          subject: `UniStay Official Payment Receipt [${receiptNum}] - $${amount}`,
          templateType: 'payment_receipt',
          sentAt: new Date().toLocaleString(),
          body: `Dear ${targetBooking!.studentName},\n\nWe acknowledge payment receipt of $${amount.toFixed(
            2
          )} for booking ${targetBooking!.bookingCode} via ${method.replace('_', ' ').toUpperCase()}.\nReceipt Number: ${receiptNum}\nRemaining Balance: $${Math.max(
            0,
            targetBooking!.totalAmount - (targetBooking!.amountPaid + amount)
          ).toFixed(2)}\n\nThank you,\nUniStay Student Accounts Department`,
          status: 'delivered',
        },
        ...prev,
      ]);

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: 'Payment Processed',
          message: `Payment of $${amount} collected from ${targetBooking!.studentName}. Digital receipt issued.`,
          type: 'payment',
          timestamp: 'Just now',
          read: false,
        },
        ...prev,
      ]);

      try {
        confetti({
          particleCount: 50,
          spread: 45,
          origin: { y: 0.7 },
        });
      } catch {}
    }
  };

  const addMaintenanceTicket = (ticketData: Omit<MaintenanceTicket, 'id' | 'createdAt'>) => {
    const newTicket: MaintenanceTicket = {
      ...ticketData,
      id: `mnt-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toLocaleString(),
    };
    setMaintenance((prev) => [newTicket, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Maintenance Work Order',
        message: `${newTicket.title} reported for Room ${newTicket.roomNumber} (${newTicket.priority.toUpperCase()}).`,
        type: 'maintenance',
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  const updateMaintenanceStatus = (ticketId: string, status: MaintenanceTicket['status']) => {
    setMaintenance((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status,
            resolvedAt: status === 'resolved' ? new Date().toLocaleString() : t.resolvedAt,
          };
        }
        return t;
      })
    );
  };

  const sendChatMessage = (channel: ChatMessage['channel'], content: string) => {
    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      channel,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChats((prev) => [...prev, newMsg]);
  };

  const reorderWidgets = (dragIndex: number, hoverIndex: number) => {
    setWidgets((prev) => {
      const copy = [...prev];
      const [dragged] = copy.splice(dragIndex, 1);
      copy.splice(hoverIndex, 0, dragged);
      return copy.map((w, idx) => ({ ...w, order: idx + 1 }));
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        allUsers,
        switchRole,
        language,
        setLanguage,
        themeAccent,
        setThemeAccent,
        isDarkMode,
        setIsDarkMode,
        t: translateHelper,
        isOffline,
        setIsOffline,
        isSyncing,
        syncData,
        rooms,
        setRooms,
        bookings,
        setBookings,
        payments,
        setPayments,
        maintenance,
        setMaintenance,
        notifications,
        setNotifications,
        emails,
        setEmails,
        chats,
        setChats,
        widgets,
        setWidgets,
        activeTab,
        setActiveTab,
        openEmailModal,
        setOpenEmailModal,
        openNewBookingModal,
        setOpenNewBookingModal,
        openPaymentModal,
        setOpenPaymentModal,
        selectedBookingForAction,
        setSelectedBookingForAction,
        createBooking,
        checkInBooking,
        checkOutBooking,
        processPayment,
        addMaintenanceTicket,
        updateMaintenanceStatus,
        sendChatMessage,
        markAllNotificationsRead,
        reorderWidgets,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
