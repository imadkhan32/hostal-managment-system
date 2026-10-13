import { Booking } from '../types';

export function createGoogleCalendarUrl(booking: Booking): string {
  const title = encodeURIComponent(`UniStay Check-In: Room ${booking.roomNumber} (${booking.studentName})`);
  const details = encodeURIComponent(
    `Hostel Check-In Reservation: ${booking.bookingCode}\nStudent: ${booking.studentName} (${booking.studentId})\nRoom: ${booking.roomNumber}, Bed ${booking.bedNumber}\nBuilding: ${booking.building}\nFront Desk 24/7 Hotline: +1 (555) 012-3456`
  );
  const location = encodeURIComponent(`${booking.building}, UniStay Residences`);
  
  // Format YYYYMMDD
  const startDateStr = booking.checkInDate.replace(/-/g, '') + 'T140000Z';
  const endDateStr = booking.checkInDate.replace(/-/g, '') + 'T160000Z';

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateStr}/${endDateStr}&details=${details}&location=${location}`;
}

export function downloadIcsFile(booking: Booking) {
  const startYearMonthDay = booking.checkInDate.replace(/-/g, '');
  const uid = `unistay-${booking.id}-${Date.now()}@unistay.edu`;
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UniStay Residences//Hostel Management System//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `SUMMARY:UniStay Check-In: Room ${booking.roomNumber} - ${booking.studentName}`,
    `DESCRIPTION:Hostel Reservation ${booking.bookingCode}\\nBed: ${booking.bedNumber}\\nBuilding: ${booking.building}`,
    `LOCATION:${booking.building}, UniStay Residences`,
    `DTSTART:${startYearMonthDay}T140000Z`,
    `DTEND:${startYearMonthDay}T160000Z`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `UniStay_CheckIn_${booking.bookingCode}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
