import type { ReactNode } from "react";

interface PromoBannerProps {
  title: string;
  description: string;
  ctaLabel?: string;
  illustration?: ReactNode;
  /** Tone matches the soft tinted bands on the home page. */
  tone?: "lavender" | "peach";
}

/**
 * Wide promotional banner with a soft tint, title, sub-copy, CTA, and right-aligned illustration.
 * Used for "Material Bangunan Lengkap" and "Semen Berkualitas Tinggi" on the home page.
 */
export function PromoBanner({
  title,
  description,
  ctaLabel = "Learn More",
  illustration,
  tone = "lavender",
}: PromoBannerProps) {
  const toneClass =
    tone === "lavender" ? "bg-promo-lavender" : "bg-promo-peach";
  return (
    <div
      className={`relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl px-6 py-6 md:px-8 ${toneClass}`}
    >
      <div className="max-w-md space-y-2">
        <h3 className="text-lg font-bold text-primary md:text-xl">{title}</h3>
        <p className="text-sm text-foreground/80">{description}</p>
        <button
          type="button"
          className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {ctaLabel}
        </button>
      </div>
      {illustration ? (
        <div className="hidden shrink-0 md:block">{illustration}</div>
      ) : null}
    </div>
  );
}
