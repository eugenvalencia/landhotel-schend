export type ConfirmationExtra = {
  id: string;
  name: string;
  price: number;
  perNight: boolean;
  total: number;
};

export type BookingConfirmationData = {
  bookingNumber: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  persons: number;
  roomName: string;
  roomType: string;
  roomNumber: number;
  roomPrice: number;
  roomPhoto: string;
  roomSubtotal: number;
  extras: ConfirmationExtra[];
  extrasTotal: number;
  totalPrice: number;
  notes?: string | null;
};

const STORAGE_KEY = "landhotel-schend-booking-confirmation";

const fallbackDigits = () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);
  return `${yy}${mm}${dd}`;
};

export const toDisplayBookingNumber = (raw?: string | null) => {
  const digits = raw?.replace(/\D/g, "") ?? "";
  return `LS-${(digits.slice(0, 6) || fallbackDigits()).padEnd(6, "0")}`;
};

export const saveBookingConfirmation = (data: BookingConfirmationData) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadBookingConfirmation = (): BookingConfirmationData | null => {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as BookingConfirmationData;
  } catch {
    return null;
  }
};
