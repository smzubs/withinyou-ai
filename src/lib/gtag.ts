// src/lib/gtag.ts
"use client";

export const GA_ID = "G-69K81LZV5Z";

function hasGA() {
  return typeof window !== "undefined" && typeof window.gtag === "function" && GA_ID.length > 0;
}

export type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function pageview(path: string) {
  if (!hasGA()) {
    console.warn("[GA] pageview skipped (gtag not ready or GA_ID missing)", { path, GA_ID });
    return;
  }
  window.gtag!("config", GA_ID, { page_path: path, debug_mode: true });
}

export function track(eventName: string, params: GtagParams = {}) {
  if (!hasGA()) {
    console.warn("[GA] event skipped (gtag not ready or GA_ID missing)", { eventName, params, GA_ID });
    return;
  }
  console.log("[GA] event", eventName, params);
  window.gtag!("event", eventName, params);
}
