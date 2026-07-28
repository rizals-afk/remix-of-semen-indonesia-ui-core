import { Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface QuantityStepperProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

/** Numeric stepper with − / + buttons. Used in PDP "Jumlah Pembelian" and cart rows. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99999,
  step = 1,
  disabled = false,
}: QuantityStepperProps) {
  const [inputValue, setInputValue] = useState(String(value));

  // Sync local input value when prop value changes externally
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const set = (v: number) => {
    const clamped = Math.max(min, Math.min(max, v));
    setInputValue(String(clamped));
    onChange(clamped);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const num = Number(inputValue);
    
    // Validate: only allow positive integers
    if (isNaN(num) || num < min || !Number.isInteger(num)) {
      // Restore previous value if invalid
      setInputValue(String(value));
      return;
    }
    
    set(num);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInputBlur();
    }
  };

  return (
    <div className="inline-flex h-10 items-stretch overflow-hidden rounded-md border border-border">
      <button
        type="button"
        aria-label="Kurangi"
        onClick={() => set(value - step)}
        className="grid w-10 place-items-center text-foreground hover:bg-muted disabled:opacity-40"
        disabled={disabled || value <= min}
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="w-16 border-x border-border bg-background text-center text-sm font-semibold focus:outline-none disabled:opacity-40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Tambah"
        onClick={() => set(value + step)}
        className="grid w-10 place-items-center text-foreground hover:bg-muted disabled:opacity-40"
        disabled={disabled || value >= max}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
