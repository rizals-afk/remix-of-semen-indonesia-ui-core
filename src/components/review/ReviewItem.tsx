import { RatingStars } from "@/components/common/RatingStars";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import type { TrxReview } from "@/lib/api/review";

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  body: string;
  photos?: string[];
  variant?: string;
  comments?: Array<{ user: string; comment: string; date: string }>;
}

export function transformTrxReviewToReview(trxReview: TrxReview): Review {
  return {
    id: trxReview.id.toString(),
    author: "Pelanggan",
    rating: trxReview.rating,
    date: formatDistanceToNow(new Date(trxReview.created_at), { addSuffix: true, locale: id }),
    body: trxReview.review,
    photos: trxReview.photos,
    variant: trxReview.product_variant?.variant_name,
    comments: trxReview.comments.map(c => ({
      user: c.user.name,
      comment: c.comments,
      date: formatDistanceToNow(new Date(c.created_at), { addSuffix: true, locale: id }),
    })),
  };
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
            {review.variant && (
              <p className="text-xs text-muted-foreground">{review.variant}</p>
            )}
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
        {review.comments?.length ? (
          <div className="mt-3 space-y-2 rounded-lg bg-muted/50 p-3">
            {review.comments.map((comment, i) => (
              <div key={i} className="text-xs">
                <span className="font-semibold text-foreground">{comment.user}: </span>
                <span className="text-foreground/80">{comment.comment}</span>
                <span className="ml-2 text-muted-foreground">{comment.date}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
