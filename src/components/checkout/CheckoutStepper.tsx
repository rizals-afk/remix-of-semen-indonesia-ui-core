import { Check } from "lucide-react";

interface CheckoutStepperProps {
  current: number;
  steps?: string[];
}

const DEFAULT_STEPS = ["Keranjang", "Checkout", "Pembayaran", "Selesai"];

/** Horizontal step indicator used across the checkout flow. */
export function CheckoutStepper({ current, steps = DEFAULT_STEPS }: CheckoutStepperProps) {
  return (
    <ol className="mx-auto flex w-full max-w-2xl items-center gap-2">
      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={
                  "grid h-9 w-9 place-items-center rounded-full border-2 text-sm font-bold transition-colors " +
                  (done
                    ? "border-primary bg-primary text-primary-foreground"
                    : active
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-background text-muted-foreground")
                }
              >
                {done ? <Check className="h-4 w-4" /> : stepNum}
              </div>
              <span
                className={
                  "whitespace-nowrap text-xs font-medium " +
                  (active || done ? "text-foreground" : "text-muted-foreground")
                }
              >
                {label}
              </span>
            </div>
            {idx < steps.length - 1 ? (
              <div
                className={
                  "mb-5 h-0.5 flex-1 " + (stepNum < current ? "bg-primary" : "bg-border")
                }
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
