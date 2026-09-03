/**
 * Account + notification preference store (localStorage persisted).
 * Swap for Lovable Cloud auth/profile tables when the backend is connected.
 */

import { useEffect, useState } from "react";

export interface AccountProfile {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

export const notificationKeys = [
  "projectUpdates",
  "billUpdates",
  "paymentUpdates",
  "workerUpdates",
  "materialUpdates",
  "aiAnalysis",
  "system",
  "email",
  "inApp",
] as const;

export type NotificationKey = (typeof notificationKeys)[number];

export const notificationLabels: Record<NotificationKey, { label: string; detail: string }> = {
  projectUpdates: { label: "Project Updates", detail: "Stage changes and completions" },
  billUpdates: { label: "Bill Updates", detail: "Quotations and confirmations" },
  paymentUpdates: { label: "Payment Updates", detail: "Received and overdue payments" },
  workerUpdates: { label: "Worker Updates", detail: "Assignments and availability" },
  materialUpdates: { label: "Material Updates", detail: "Pricing and stock changes" },
  aiAnalysis: { label: "AI Analysis Completion", detail: "Blueprint and re-analysis results" },
  system: { label: "System Notifications", detail: "Maintenance and product news" },
  email: { label: "Email Notifications", detail: "Send alerts to your inbox" },
  inApp: { label: "In-App Notifications", detail: "Show alerts inside Buildify" },
};

export type NotificationPrefs = Record<NotificationKey, boolean>;

interface AccountState {
  profile: AccountProfile;
  notifications: NotificationPrefs;
}

const STORAGE_KEY = "buildify-account-v1";

const defaultState: AccountState = {
  profile: {
    fullName: "Mohammed Abdul Haseeb",
    email: "haseeb@buildify.in",
    phone: "+91 98765 43210",
    role: "Administrator",
    createdAt: "12 Jan 2026",
  },
  notifications: {
    projectUpdates: true,
    billUpdates: true,
    paymentUpdates: true,
    workerUpdates: false,
    materialUpdates: true,
    aiAnalysis: true,
    system: false,
    email: true,
    inApp: true,
  },
};

let state: AccountState = defaultState;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AccountState>;
      state = {
        profile: { ...defaultState.profile, ...parsed.profile },
        notifications: { ...defaultState.notifications, ...parsed.notifications },
      };
      emit();
    }
  } catch {
    /* ignore */
  }
}

export function useAccount() {
  const [snapshot, setSnapshot] = useState(state);

  useEffect(() => {
    hydrate();
    setSnapshot(state);
    const listener = () => setSnapshot({ ...state });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return snapshot;
}

export function updateProfile(patch: Partial<AccountProfile>) {
  state = { ...state, profile: { ...state.profile, ...patch } };
  persist();
  emit();
}

export function toggleNotification(key: NotificationKey, value: boolean) {
  state = { ...state, notifications: { ...state.notifications, [key]: value } };
  persist();
  emit();
}

/** Placeholder password update — replace with Lovable Cloud auth later. */
export function updatePassword(current: string, next: string) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (!current) reject(new Error("Enter your current password."));
      else if (next.length < 8) reject(new Error("Password must be at least 8 characters."));
      else resolve();
    }, 600);
  });
}
