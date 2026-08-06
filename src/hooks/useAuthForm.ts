import { useCallback, useState } from "react";

export type AuthErrors<T> = Partial<Record<keyof T | "form", string | undefined>>;

interface UseAuthFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => AuthErrors<T>;
  /** Placeholder submit handler — swap for Lovable Cloud auth later. */
  onSubmit: (values: T) => Promise<void> | void;
}

export function useAuthForm<T extends Record<string, string | boolean>>({
  initialValues,
  validate,
  onSubmit,
}: UseAuthFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<AuthErrors<T>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const setField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined, form: undefined }));
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const nextErrors = validate?.(values) ?? {};
      setErrors(nextErrors);
      if (Object.values(nextErrors).some(Boolean)) return;

      setLoading(true);
      try {
        await onSubmit(values);
        setSuccess(true);
      } catch (error) {
        setErrors({
          form: error instanceof Error ? error.message : "Something went wrong",
        } as AuthErrors<T>);
      } finally {
        setLoading(false);
      }
    },
    [onSubmit, validate, values],
  );

  return { values, errors, loading, success, setField, handleSubmit };
}

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
