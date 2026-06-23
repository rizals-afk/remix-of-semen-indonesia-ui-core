import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface OtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  submitLabel?: string;
  length?: number;
  onSubmit: (code: string) => void;
  onResend?: () => void;
}

/**
 * Reusable OTP modal used for "Verify Email" and "OTP Verification" flows.
 * Mirrors the boxed 5-cell layout in the uploaded screens.
 */
export function OtpDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = "Verify",
  length = 5,
  onSubmit,
  onResend,
}: OtpDialogProps) {
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(""));
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (open) {
      setDigits(Array(length).fill(""));
      setTimeout(() => refs.current[0]?.focus(), 50);
    }
  }, [open, length]);

  function set(i: number, v: string) {
    const next = [...digits];
    next[i] = v.slice(-1);
    setDigits(next);
    if (v && i < length - 1) refs.current[i + 1]?.focus();
  }

  const code = digits.join("");
  const complete = code.length === length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border-none p-10 sm:rounded-2xl [&>button]:right-6 [&>button]:top-6">
        <h2 className="text-center text-2xl font-extrabold text-primary">{title}</h2>
        <p className="mx-auto max-w-sm text-center text-sm text-foreground">{description}</p>

        <div className="my-4 flex justify-center gap-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              onChange={(e) => set(i, e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
              }}
              inputMode="numeric"
              maxLength={1}
              className="h-16 w-16 rounded-md border-2 border-primary/30 bg-background text-center text-2xl font-bold text-primary focus:border-primary focus:outline-none"
            />
          ))}
        </div>

        <p className="text-center text-sm text-primary">
          You didn’t received any code?{" "}
          <button
            type="button"
            onClick={onResend}
            className="font-bold text-accent hover:underline"
          >
            Resent code
          </button>
        </p>

        <button
          type="button"
          disabled={!complete}
          onClick={() => onSubmit(code)}
          className="mt-2 w-full rounded-md bg-gradient-to-r from-primary to-[oklch(0.22_0.08_264)] py-3 text-sm font-bold text-primary-foreground shadow disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </DialogContent>
    </Dialog>
  );
}