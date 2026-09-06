import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Mail, Phone, ShieldCheck, CalendarDays, LogOut, Pencil, Check } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SectionCard } from "@/components/SectionCard";
import { PasswordInput } from "@/components/PasswordInput";
import {
  notificationKeys,
  notificationLabels,
  toggleNotification,
  updatePassword,
  updateProfile,
  useAccount,
} from "@/lib/account-store";

const field =
  "w-full rounded-2xl border border-border bg-input/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60";

export default function Settings() {
  const { profile, notifications } = useAccount();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState<Record<string, string | undefined>>({});
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.fullName.trim()) {
      toast.error("Full name is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
      toast.error("Enter a valid email address.");
      return;
    }
    updateProfile(draft);
    setEditing(false);
    toast.success("Profile updated successfully.");
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string | undefined> = {};
    if (!passwords.current) errors["current"] = "Enter your current password.";
    if (passwords.next.length < 8) errors["next"] = "Password must be at least 8 characters.";
    if (passwords.next !== passwords.confirm) errors["confirm"] = "Passwords do not match.";
    setPwErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    setSaving(true);
    try {
      await updatePassword(passwords.current, passwords.next);
      setPasswords({ current: "", next: "", confirm: "" });
      toast.success("Password updated successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update password.");
    } finally {
      setSaving(false);
    }
  };

  const initials = profile.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold sm:text-3xl">Settings</h1>
          <p className="mt-2 text-sm text-secondary-foreground">
            Manage your account details, password and notification preferences.
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard
            title="Account Details"
            description="Your personal information"
            action={
              !editing ? (
                <button
                  type="button"
                  onClick={startEdit}
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-accent/40 px-3 py-1.5 text-xs text-accent transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Pencil size={13} aria-hidden /> Edit Profile
                </button>
              ) : undefined
            }
            className="xl:col-span-2"
          >
            <form onSubmit={saveProfile} className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)]">
              <span className="ember-gradient grid size-20 place-items-center rounded-[18px] text-xl font-semibold text-primary-foreground">
                {initials}
              </span>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs text-secondary-foreground">
                  Full Name
                  <input
                    className={`${field} mt-1`}
                    disabled={!editing}
                    value={editing ? draft.fullName : profile.fullName}
                    onChange={(e) => setDraft((d) => ({ ...d, fullName: e.target.value }))}
                  />
                </label>
                <label className="block text-xs text-secondary-foreground">
                  Email
                  <input
                    type="email"
                    className={`${field} mt-1`}
                    disabled={!editing}
                    value={editing ? draft.email : profile.email}
                    onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                  />
                </label>
                <label className="block text-xs text-secondary-foreground">
                  Phone Number
                  <input
                    className={`${field} mt-1`}
                    disabled={!editing}
                    value={editing ? draft.phone : profile.phone}
                    onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                  />
                </label>
                <label className="block text-xs text-secondary-foreground">
                  Role
                  <input className={`${field} mt-1`} disabled value={profile.role} />
                </label>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground sm:col-span-2">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={13} aria-hidden /> Account created {profile.createdAt}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck size={13} aria-hidden /> {profile.role}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={13} aria-hidden /> {profile.email}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Phone size={13} aria-hidden /> {profile.phone}
                  </span>
                </div>
                {editing && (
                  <div className="flex flex-wrap gap-2 sm:col-span-2">
                    <button
                      type="submit"
                      className="ember-gradient inline-flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Check size={15} aria-hidden /> Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="rounded-2xl border border-border px-4 py-2 text-sm hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </form>
          </SectionCard>

          <SectionCard title="Password & Security" description="Update your account password">
            <form onSubmit={submitPassword} className="space-y-4">
              <PasswordInput
                id="current-password"
                label="Current Password"
                value={passwords.current}
                error={pwErrors["current"]}
                onChange={(e) => {
                  const v = e.target.value;
                  setPasswords((p) => ({ ...p, current: v }));
                  setPwErrors((e) => ({ ...e, current: undefined }));
                }}
              />
              <PasswordInput
                id="new-password"
                label="New Password"
                value={passwords.next}
                error={pwErrors["next"]}
                onChange={(e) => {
                  const v = e.target.value;
                  setPasswords((p) => ({ ...p, next: v }));
                  setPwErrors((e) => ({ ...e, next: undefined }));
                }}
              />
              <PasswordInput
                id="confirm-password"
                label="Confirm New Password"
                value={passwords.confirm}
                error={pwErrors["confirm"]}
                onChange={(e) => {
                  const v = e.target.value;
                  setPasswords((p) => ({ ...p, confirm: v }));
                  setPwErrors((e) => ({ ...e, confirm: undefined }));
                }}
              />
              <p className="text-[11px] text-muted-foreground">
                Use at least 8 characters. Passwords are never shown or stored in plain text.
              </p>
              <button
                type="submit"
                disabled={saving}
                className="ember-gradient rounded-2xl px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {saving ? "Updating…" : "Update Password"}
              </button>
            </form>
          </SectionCard>

          <SectionCard title="Notification Preferences" description="Choose what Buildify tells you about">
            <ul className="space-y-3">
              {notificationKeys.map((key) => {
                const on = notifications[key];
                const meta = notificationLabels[key];
                return (
                  <li
                    key={key}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-foreground/[0.03] p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{meta.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{meta.detail}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={on}
                      aria-label={meta.label}
                      onClick={() => toggleNotification(key, !on)}
                      className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        on ? "ember-gradient justify-end" : "justify-start bg-foreground/10"
                      }`}
                    >
                      <motion.span layout className="size-5 rounded-full bg-white" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </SectionCard>

          <SectionCard title="Account Actions" description="Session management" className="xl:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-destructive/40 px-4 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LogOut size={15} aria-hidden /> Logout
            </Link>
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
