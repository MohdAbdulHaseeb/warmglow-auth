import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { derivePaymentStatus, setPayment } from "@/lib/payment-store";
import { formatINR, type PaymentRecord, type PaymentStatus } from "@/lib/projects-data";

interface Props {
  projectId: string;
  total: number;
  payment: PaymentRecord;
  open: boolean;
  onClose: () => void;
}

const fieldClass =
  "w-full rounded-2xl border border-border bg-input/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Modal for recording a payment against a project's bill. */
export function PaymentUpdateModal({ projectId, total, payment, open, onClose }: Props) {
  const [status, setStatus] = useState<PaymentStatus>(payment.status);
  const [paid, setPaid] = useState(String(payment.paid));
  const [date, setDate] = useState(payment.paidOn ?? "");
  const [method, setMethod] = useState(payment.method ?? "Bank Transfer");
  const [notes, setNotes] = useState(payment.notes);

  const paidAmount = Math.max(0, Math.min(total, Number(paid) || 0));
  const remaining = Math.max(0, total - paidAmount);
  const resolved = derivePaymentStatus(total, paidAmount, status);

  const save = () => {
    setPayment(projectId, {
      status: resolved,
      paid: paidAmount,
      paidOn: date || null,
      method: method || null,
      notes,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Update payment"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel w-full max-w-md rounded-[18px] p-5 sm:p-6"
          >
            <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div>
                <h2 className="text-base font-semibold">Update Payment</h2>
                <p className="mt-1 text-xs text-muted-foreground">Total billed {formatINR(total)}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-xl p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="pay-status" className="mb-1 block text-xs text-muted-foreground">Payment status</label>
                <select id="pay-status" className={fieldClass} value={status} onChange={(e) => setStatus(e.target.value as PaymentStatus)}>
                  <option value="Paid">Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label htmlFor="pay-amount" className="mb-1 block text-xs text-muted-foreground">Amount paid (₹)</label>
                <input id="pay-amount" inputMode="numeric" className={fieldClass} value={paid} onChange={(e) => setPaid(e.target.value)} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="pay-date" className="mb-1 block text-xs text-muted-foreground">Payment date</label>
                  <input id="pay-date" className={fieldClass} placeholder="12 Aug 2026" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="pay-method" className="mb-1 block text-xs text-muted-foreground">Method</label>
                  <select id="pay-method" className={fieldClass} value={method} onChange={(e) => setMethod(e.target.value)}>
                    <option>Bank Transfer</option>
                    <option>UPI</option>
                    <option>Cash</option>
                    <option>Cheque</option>
                    <option>Card</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="pay-notes" className="mb-1 block text-xs text-muted-foreground">Notes</label>
                <textarea id="pay-notes" rows={2} className={fieldClass} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              <div className="rounded-2xl border border-border bg-foreground/[0.03] p-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span>{formatINR(total)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Paid</span><span>{formatINR(paidAmount)}</span></div>
                <div className="flex justify-between font-medium"><span className="text-muted-foreground">Remaining</span><span>{formatINR(remaining)}</span></div>
                <p className="mt-2 text-xs text-muted-foreground">Resolved status: {resolved}</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-border px-4 py-2 text-sm text-secondary-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                className="ember-gradient ember-glow rounded-2xl px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Save Payment
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
