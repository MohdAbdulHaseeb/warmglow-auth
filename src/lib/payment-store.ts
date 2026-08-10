/**
 * Client-side payment overrides for the Project Monitor.
 *
 * Payments are keyed by project id and persisted to localStorage so the
 * "Update Payment" action survives reloads. Swap these read/write helpers
 * for a `payments` table query when Cloud is connected.
 */
import { useSyncExternalStore } from "react";
import type { PaymentRecord, PaymentStatus } from "./projects-data";

const STORAGE_KEY = "buildify-payments-v1";

type Overrides = Record<string, PaymentRecord>;

let overrides: Overrides = {};
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function hydratePayments() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      overrides = JSON.parse(raw) as Overrides;
      emit();
    }
  } catch {
    /* corrupt payload — ignore */
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot() {
  return overrides;
}

export function setPayment(projectId: string, payment: PaymentRecord) {
  overrides = { ...overrides, [projectId]: payment };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    /* quota / private mode — keep in memory */
  }
  emit();
}

/** Reactive map of project id → overridden payment. */
export function usePaymentOverrides() {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

/** Derives a status from the amounts, respecting an explicit user choice. */
export function derivePaymentStatus(total: number, paid: number, chosen: PaymentStatus): PaymentStatus {
  if (chosen === "Overdue") return "Overdue";
  if (paid <= 0) return "Unpaid";
  if (paid >= total) return "Paid";
  return "Partially Paid";
}
