import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

/** Numeric stepper with − / + buttons. Used in PDP "Jumlah Pembelian" and cart rows. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99999,
  step = 1,
}: QuantityStepperProps) {
  const set = (v: number) => onChange(Math.max(min, Math.min(max, v)));
  return (
    <div className="inline-flex h-10 items-stretch overflow-hidden rounded-md border border-border">
      <button
        type="button"
        aria-label="Kurangi"
        onClick={() => set(value - step)}
        className="grid w-10 place-items-center text-foreground hover:bg-muted disabled:opacity-40"
        disabled={value <= min}
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => set(Number(e.target.value) || min)}
        className="w-16 border-x border-border bg-background text-center text-sm font-semibold focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Tambah"
        onClick={() => set(value + step)}
        className="grid w-10 place-items-center text-foreground hover:bg-muted disabled:opacity-40"
        disabled={value >= max}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
