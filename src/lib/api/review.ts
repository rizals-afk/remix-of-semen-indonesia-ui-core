import { apiFetch } from "../api";

export interface TrxReviewComment {
  id: number;
  trx_review_id: number;
  user_id: number;
  comments: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface TrxReview {
  id: number;
  trx_line_id: number;
  rating: number;
  product_id: number;
  product_variant_id: number;
  review: string;
  created_at: string;
  updated_at: string;
  photos: string[];
  comments: TrxReviewComment[];
  product: {
    id: number;
    name: string;
    sku: string;
  };
  product_variant: {
    id: number;
    variant_name: string;
  };
  trx_line: {
    id: number;
    trx_id: number;
  };
}

export interface TrxReviewListResponse {
  current_page: number;
  data: TrxReview[];
  first_page_url: string | null;
  from: number;
  last_page: number;
  last_page_url: string | null;
  links: Array<{
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface FetchTrxReviewsParams {
  product_id?: number;
  page?: number;
  per_page?: number;
}

export async function fetchTrxReviews(params?: FetchTrxReviewsParams): Promise<TrxReviewListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.product_id) queryParams.append("product_id", params.product_id.toString());
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.per_page) queryParams.append("per_page", params.per_page.toString());
  const queryString = queryParams.toString();
  const url = queryString ? `/trx-reviews?${queryString}` : "/trx-reviews";
  return apiFetch<TrxReviewListResponse>(url);
}
