"use client";

import { useSyncExternalStore } from "react";

// Compare tray kept in localStorage so it survives page navigation. Max 3 items.
const KEY = "campuscloset-compare";
const EVENT = "campuscloset-compare-change";
export const MAX_COMPARE = 3;

const EMPTY: string[] = [];
let cachedRaw: string | null = null;
let cachedIds: string[] = EMPTY;

function read(): string[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      cachedIds = Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string").slice(0, MAX_COMPARE) : EMPTY;
    } catch {
      cachedIds = EMPTY;
    }
  }
  return cachedIds;
}

function write(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // storage unavailable (private mode etc.) — compare just won't persist
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useCompareIds(): string[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function toggleCompare(id: string) {
  const ids = read();
  if (ids.includes(id)) write(ids.filter((x) => x !== id));
  else write([...ids, id].slice(-MAX_COMPARE));
}

export function clearCompare() {
  write([]);
}
