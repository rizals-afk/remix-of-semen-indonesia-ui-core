import { RatingStars } from "@/components/common/RatingStars";

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  body: string;
  photos?: string[];
}

/** Single review row with avatar, name, rating, body, and optional photo evidence. */
export function ReviewItem({ review }: { review: Review }) {
  const initial = review.author.charAt(0).toUpperCase();
  return (
    <article className="flex gap-3 border-b border-border py-5 last:border-b-0">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-muted text-sm font-bold text-foreground">
        {initial}
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-bold text-foreground">{review.author}</p>
            <RatingStars value={review.rating} size="sm" />
          </div>
          <p className="text-xs text-muted-foreground">{review.date}</p>
        </div>
        <p className="mt-2 text-sm text-foreground/80">{review.body}</p>
        {review.photos?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {review.photos.map((src, i) => (
              <img
                key={src + i}
                src={src}
                alt="Foto ulasan"
                loading="lazy"
                className="h-20 w-20 rounded-md border border-border object-cover"
              />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
