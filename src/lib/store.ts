"use client";

// Simple localStorage store for prototyping
export const mockStore = {
  get: (key: string) => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(`bossbook_${key}`);
    return data ? JSON.parse(data) : [];
  },
  add: (key: string, item: unknown) => {
    if (typeof window === "undefined") return;
    const existing = mockStore.get(key);
    const updated = [item, ...existing];
    localStorage.setItem(`bossbook_${key}`, JSON.stringify(updated));
  },
  reset: (key: string) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`bossbook_${key}`);
  }
};
