import { Star } from "lucide-react";

interface RatingStarsProps {
  value: number;
  /** Show numeric value beside the stars. */
  showValue?: boolean;
  size?: "sm" | "md";
  className?: string;
}

/** Five-star rating row used on product cards, PDP, and review items. */
export function RatingStars({ value, showValue = false, size = "sm", className = "" }: RatingStarsProps) {
  const px = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="inline-flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.round(value);
          return (
            <Star
              key={i}
              className={`${px} ${filled ? "fill-rating text-rating" : "text-rating/40"}`}
            />
          );
        })}
      </span>
      {showValue ? (
        <span className="text-xs font-semibold text-foreground">{value.toFixed(1)}</span>
      ) : null}
    </span>
  );
}
