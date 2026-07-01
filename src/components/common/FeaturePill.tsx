import type { LucideIcon } from "lucide-react";

interface FeaturePillProps {
  icon?: LucideIcon;
  image?: string;
  label: string;
}

/**
 * Soft tinted square card with an icon or illustration + 1-2 line label.
 * Used in "Mengapa Belanja di Bahan Material?" section.
 */
export function FeaturePill({ icon: Icon, image, label }: FeaturePillProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-primary-soft px-4 py-6 text-center">
      {image ? (
        <img src={image} alt="" className="h-20 w-20 object-contain" loading="lazy" />
      ) : Icon ? (
        <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground">
          <Icon className="h-6 w-6" />
        </span>
      ) : null}
      <span className="text-sm font-semibold text-primary">{label}</span>
    </div>
  );
}
