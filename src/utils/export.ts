import { Booking, PaymentTransaction, Room } from '../types';

export function exportToCSV(filename: string, rows: (string | number)[][]) {
  const processRow = (row: (string | number)[]) => {
    return row
      .map((val) => {
        let str = String(val ?? '');
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          str = `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(',');
  };

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(processRow).join('\r\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportBookingsReport(bookings: Booking[]) {
  const headers = [
    'Booking Code',
    'Student Name',
    'Student ID',
    'Email',
    'Phone',
    'Nationality',
    'Department',
    'Room Number',
    'Building',
    'Bed Number',
    'Check-In Date',
    'Check-Out Date',
    'Status',
    'Payment Status',
    'Total Amount ($)',
    'Amount Paid ($)',
    'Created At',
  ];

  const rows = bookings.map((b) => [
    b.bookingCode,
    b.studentName,
    b.studentId,
    b.studentEmail,
    b.studentPhone,
    b.nationality,
    b.department,
    b.roomNumber,
    b.building,
    b.bedNumber,
    b.checkInDate,
    b.checkOutDate,
    b.status,
    b.paymentStatus,
    b.totalAmount,
    b.amountPaid,
    b.createdAt,
  ]);

  exportToCSV(`UniStay_Bookings_Report_${new Date().toISOString().split('T')[0]}`, [headers, ...rows]);
}

export function exportPaymentsReport(payments: PaymentTransaction[]) {
  const headers = [
    'Receipt Number',
    'Transaction Ref',
    'Student Name',
    'Student ID',
    'Booking Code',
    'Amount ($)',
    'Payment Method',
    'Status',
    'Date & Time',
    'Description',
  ];

  const rows = payments.map((p) => [
    p.receiptNumber,
    p.transactionRef,
    p.studentName,
    p.studentId,
    p.bookingCode,
    p.amount,
    p.paymentMethod,
    p.status,
    p.date,
    p.description,
  ]);

  exportToCSV(`UniStay_Financial_Payments_${new Date().toISOString().split('T')[0]}`, [headers, ...rows]);
}

export function exportRoomsReport(rooms: Room[]) {
  const headers = [
    'Room Number',
    'Building',
    'Floor',
    'Room Type',
    'Status',
    'Total Beds',
    'Occupied Beds',
    'Available Beds',
    'Semester Rate ($)',
    'Gender Allocation',
    'Amenities',
  ];

  const rows = rooms.map((r) => [
    r.number,
    r.building,
    r.floor,
    r.type,
    r.status,
    r.totalBeds,
    r.occupiedBeds,
    r.totalBeds - r.occupiedBeds,
    r.pricePerSemester,
    r.gender,
    r.amenities.join(' | '),
  ]);

  exportToCSV(`UniStay_Rooms_Occupancy_${new Date().toISOString().split('T')[0]}`, [headers, ...rows]);
}
