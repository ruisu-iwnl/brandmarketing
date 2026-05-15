"use client";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

/**
 * Log a page view
 */
export const pageview = (url: string) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

/**
 * Log a custom event
 */
export const trackEvent = (action: string, category: string, label: string, value?: number) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Types for gtag
declare global {
  interface Window {
    gtag: (command: string, id: string, config?: any) => void;
    dataLayer: any[];
  }
}
