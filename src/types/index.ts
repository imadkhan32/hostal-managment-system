export type UserRole = 'admin' | 'warden' | 'receptionist' | 'student';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  studentId?: string;
  phone?: string;
  department?: string;
  assignedRoom?: string;
  assignedBed?: string;
  balance?: number;
}

export type RoomType = 'single' | 'double' | 'dorm-4' | 'dorm-6' | 'suite';
export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'reserved';
export type GenderRestriction = 'all' | 'male' | 'female';

export interface Bed {
  id: string;
  roomId: string;
  bedNumber: string;
  status: 'available' | 'occupied' | 'reserved';
  studentId?: string;
  studentName?: string;
}

export interface Room {
  id: string;
  number: string;
  building: string;
  floor: number;
  type: RoomType;
  totalBeds: number;
  occupiedBeds: number;
  pricePerSemester: number;
  status: RoomStatus;
  amenities: string[];
  gender: GenderRestriction;
  description: string;
  beds: Bed[];
  lastCleaned?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded';

export interface Booking {
  id: string;
  bookingCode: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  nationality: string;
  department: string;
  yearOfStudy: string;
  roomId: string;
  roomNumber: string;
  building: string;
  bedNumber: string;
  checkInDate: string;
  checkOutDate: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  amountPaid: number;
  createdAt: string;
  notes?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  bookingCode: string;
  studentName: string;
  studentId: string;
  amount: number;
  currency: string;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'campus_wallet' | 'cash';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  transactionRef: string;
  date: string;
  receiptNumber: string;
  description: string;
}

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';
export type MaintenanceStatus = 'open' | 'in_progress' | 'resolved';
export type MaintenanceCategory = 'plumbing' | 'electrical' | 'furniture' | 'wifi' | 'cleaning' | 'appliance' | 'other';

export interface MaintenanceTicket {
  id: string;
  roomNumber: string;
  building: string;
  reportedBy: string;
  studentId?: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  createdAt: string;
  assignedTo?: string;
  resolvedAt?: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'maintenance' | 'checkin' | 'announcement';
  timestamp: string;
  read: boolean;
  targetRole?: UserRole | 'all';
}

export interface SentEmail {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  templateType: 'booking_confirmation' | 'checkin_reminder' | 'payment_receipt' | 'room_assignment' | 'checkout_survey';
  sentAt: string;
  body: string;
  qrCodeData?: string;
  status: 'sent' | 'delivered';
}

export interface ChatMessage {
  id: string;
  channel: 'staff' | 'warden' | 'announcements' | 'residents';
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  content: string;
  timestamp: string;
}

export type DashboardWidgetId =
  | 'stats_overview'
  | 'occupancy_chart'
  | 'revenue_trend'
  | 'room_distribution'
  | 'quick_actions'
  | 'recent_bookings'
  | 'pending_checkins'
  | 'maintenance_alerts'
  | 'calendar_snapshot';

export interface DashboardWidgetConfig {
  id: DashboardWidgetId;
  title: string;
  enabled: boolean;
  order: number;
  width: 'full' | 'half' | 'third';
}

export type LanguageCode = 'en' | 'es' | 'fr' | 'ar' | 'zh' | 'hi' | 'de';
export type ThemeAccent = 'emerald' | 'indigo' | 'crimson' | 'amber';
