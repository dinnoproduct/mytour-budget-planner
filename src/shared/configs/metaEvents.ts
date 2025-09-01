import { v4 as uuid } from "uuid";

// Meta Events Configuration

interface FacebookPixel {
  (command: "init", pixelId: string): void;
  (command: "track", event: string, parameters?: Record<string, unknown>): void;
  (
    command: "trackCustom",
    event: string,
    parameters?: Record<string, unknown>,
  ): void;
  push: (...args: unknown[]) => void;
}

declare global {
  interface Window {
    fbq?: FacebookPixel;
    dataLayer: any[];
    gtag: any;
  }
}

import {
  PaymentMethod,
  PaymentModalView,
} from "@/widgets/BookingFlow/ui/PaymentModal/types";

// Facebook Pixel Events
export const metaEvents = {
  // Page View Event
  pageView: (pageName?: string) => {
    if (window.fbq) {
      window.fbq("track", "PageView", {
        page_name: pageName || window.location.pathname,
        timestamp: new Date().toISOString(),
      });
    }
  },

  // 1️⃣ Core Commerce Events (Standard)

  // 1.1 InitiateCheckout
  initiateCheckout: (data: {
    event_id: string;
    content_type: "hotel" | "package" | "flight";
    content_ids: string[];
    value: number;
    currency: string;
    num_items: number;
    hotel_id?: number;
    hotel_name?: string;
    destination?: string;
    destination_country?: string;
    checkin_date?: string;
    checkout_date?: string;
    num_nights?: number;
    num_adults?: number;
    num_children?: number;
    num_rooms?: number;
    room_type?: string;
    booking_step?: string;
  }) => {
    if (window.fbq) {
      window.fbq("track", "InitiateCheckout", {
        ...data,
        timestamp: new Date().toISOString(),
      });
    }
  },

  // 1.2 AddPaymentInfo
  addPaymentInfo: (data: {
    event_id: string;
    content_type: "hotel" | "package" | "flight";
    content_ids: string[];
    value: number;
    currency: string;
    payment_type: PaymentMethod | null;
    hotel_id?: number;
    destination?: string;
    checkin_date?: string;
    checkout_date?: string;
    room_type?: string;
  }) => {
    if (window.fbq) {
      window.fbq("track", "AddPaymentInfo", {
        ...data,
        timestamp: new Date().toISOString(),
      });
    }
  },

  // 1.3 Purchase
  purchase: (data: {
    event_id: string;
    content_type: "hotel" | "package" | "flight";
    content_ids: string[];
    value: number;
    currency: string;
    order_id: string;
    hotel_id?: number;
    destination?: string;
    checkin_date?: string;
    checkout_date?: string;
    num_nights?: number;
    num_adults?: number;
    num_children?: number;
    num_rooms?: number;
    room_type?: string;
  }) => {
    if (window.fbq) {
      window.fbq("track", "Purchase", {
        ...data,
        timestamp: new Date().toISOString(),
      });
    }
  },

  // 2️⃣ Booking Funnel Micro-Events

  // 2.1 BookingStepCompleted
  bookingStepCompleted: (data: {
    event_id: string;
    hotel_id: number;
    step_number: number;
    step_name:
      | "room_selection"
      | "guest_details_entered"
      | "payment_method_selected"
      | "terms_confirmed";
  }) => {
    if (window.fbq) {
      window.fbq("trackCustom", "BookingStepCompleted", {
        ...data,
        timestamp: new Date().toISOString(),
      });
    }
  },

  // 3️⃣ Behavioral Intent Signals

  // 3.1 HotelGalleryOpened
  hotelGalleryOpened: (data: {
    event_id: string;
    hotel_id: number;
    images_viewed: number;
    gallery_time_seconds: number;
    user_session_id: string;
  }) => {
    if (window.fbq) {
      window.fbq("trackCustom", "HotelGalleryOpened", {
        ...data,
        timestamp: new Date().toISOString(),
      });
    }
  },

  // 3.2 PriceCalendarViewed
  priceCalendarViewed: (data: {
    event_id: string;
    hotel_id: number;
    dates_checked: string[];
    price_range_viewed: { min: number; max: number };
    flexible_dates: boolean;
  }) => {
    if (window.fbq) {
      window.fbq("trackCustom", "PriceCalendarViewed", {
        ...data,
        timestamp: new Date().toISOString(),
      });
    }
  },

  // 3.3 RoomComparison
  roomComparison: (data: {
    event_id: string;
    hotel_id: number;
    rooms_compared: string[];
    amenities_focused: string[];
    price_sensitivity: "low" | "medium" | "high";
  }) => {
    if (window.fbq) {
      window.fbq("trackCustom", "RoomComparison", {
        ...data,
        timestamp: new Date().toISOString(),
      });
    }
  },
};

export const generateEventId = (): string => {
  return uuid();
};
