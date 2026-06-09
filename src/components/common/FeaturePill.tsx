import type { LucideIcon } from "lucide-react";

interface FeaturePillProps {
  icon: LucideIcon;
  label: string;
}

/**
 * Soft tinted square card with an icon + 1-2 line label.
 * Used in "Mengapa Belanja di Bahan Material?" section.
 */
export function FeaturePill({ icon: Icon, label }: FeaturePillProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-primary-soft px-4 py-6 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground">
        <Icon className="h-6 w-6" />
      </span>
      <span className="text-sm font-semibold text-primary">{label}</span>
    </div>
  );
}
