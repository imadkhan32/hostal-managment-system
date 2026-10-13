import {
  Room,
  Booking,
  PaymentTransaction,
  MaintenanceTicket,
  NotificationItem,
  SentEmail,
  ChatMessage,
  DashboardWidgetConfig,
  UserProfile,
} from '../types';
import {
  INITIAL_ROOMS,
  INITIAL_BOOKINGS,
  INITIAL_PAYMENTS,
  INITIAL_MAINTENANCE,
  INITIAL_NOTIFICATIONS,
  INITIAL_EMAILS,
  INITIAL_CHATS,
  DEFAULT_WIDGETS,
  INITIAL_USERS,
} from '../data/initialData';

const STORAGE_KEYS = {
  ROOMS: 'unistay_rooms_v1',
  BOOKINGS: 'unistay_bookings_v1',
  PAYMENTS: 'unistay_payments_v1',
  MAINTENANCE: 'unistay_maintenance_v1',
  NOTIFICATIONS: 'unistay_notifications_v1',
  EMAILS: 'unistay_emails_v1',
  CHATS: 'unistay_chats_v1',
  WIDGETS: 'unistay_widgets_v1',
  CURRENT_USER: 'unistay_user_v1',
  THEME: 'unistay_theme_v1',
  LANG: 'unistay_lang_v1',
};

export function loadStoredData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading key ${key}:`, err);
    return fallback;
  }
}

export function saveStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving key ${key}:`, err);
  }
}

export const StorageService = {
  getRooms: (): Room[] => loadStoredData(STORAGE_KEYS.ROOMS, INITIAL_ROOMS),
  saveRooms: (rooms: Room[]) => saveStoredData(STORAGE_KEYS.ROOMS, rooms),

  getBookings: (): Booking[] => loadStoredData(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS),
  saveBookings: (bookings: Booking[]) => saveStoredData(STORAGE_KEYS.BOOKINGS, bookings),

  getPayments: (): PaymentTransaction[] => loadStoredData(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS),
  savePayments: (payments: PaymentTransaction[]) => saveStoredData(STORAGE_KEYS.PAYMENTS, payments),

  getMaintenance: (): MaintenanceTicket[] => loadStoredData(STORAGE_KEYS.MAINTENANCE, INITIAL_MAINTENANCE),
  saveMaintenance: (tickets: MaintenanceTicket[]) => saveStoredData(STORAGE_KEYS.MAINTENANCE, tickets),

  getNotifications: (): NotificationItem[] => loadStoredData(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  saveNotifications: (items: NotificationItem[]) => saveStoredData(STORAGE_KEYS.NOTIFICATIONS, items),

  getEmails: (): SentEmail[] => loadStoredData(STORAGE_KEYS.EMAILS, INITIAL_EMAILS),
  saveEmails: (emails: SentEmail[]) => saveStoredData(STORAGE_KEYS.EMAILS, emails),

  getChats: (): ChatMessage[] => loadStoredData(STORAGE_KEYS.CHATS, INITIAL_CHATS),
  saveChats: (chats: ChatMessage[]) => saveStoredData(STORAGE_KEYS.CHATS, chats),

  getWidgets: (): DashboardWidgetConfig[] => loadStoredData(STORAGE_KEYS.WIDGETS, DEFAULT_WIDGETS),
  saveWidgets: (widgets: DashboardWidgetConfig[]) => saveStoredData(STORAGE_KEYS.WIDGETS, widgets),

  getUsers: (): UserProfile[] => INITIAL_USERS,

  resetToDefault: () => {
    localStorage.removeItem(STORAGE_KEYS.ROOMS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.MAINTENANCE);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.EMAILS);
    localStorage.removeItem(STORAGE_KEYS.CHATS);
    localStorage.removeItem(STORAGE_KEYS.WIDGETS);
  },
};
