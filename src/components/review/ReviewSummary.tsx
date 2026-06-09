import { RatingStars } from "@/components/common/RatingStars";

interface ReviewSummaryProps {
  average: number;
  count: number;
  satisfactionPercent: number;
}

/** "4.8 / 5  ★★★★ — 98% pembeli merasa puas" header on the Ulasan tab. */
export function ReviewSummary({ average, count, satisfactionPercent }: ReviewSummaryProps) {
  return (
    <div className="flex flex-wrap items-center gap-6 text-sm">
      <div>
        <span className="text-2xl font-bold text-foreground">{average.toFixed(1)}</span>
        <span className="text-muted-foreground"> /5</span>
        <p className="text-xs text-muted-foreground">{count} ulasan</p>
      </div>
      <div className="flex items-center gap-3">
        <RatingStars value={average} size="md" />
        <span className="text-muted-foreground">
          {satisfactionPercent}% pembeli merasa puas
        </span>
      </div>
    </div>
  );
}
