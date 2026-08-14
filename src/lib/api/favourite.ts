import { apiFetch } from "../api";
import type { Product, ProductVariant } from "./product";

export interface FavouriteResponse {
  id: number;
  product_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface Favourite {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  product: Product;
}

export interface FavouriteListResponse {
  current_page: number;
  data: Favourite[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface FetchFavouritesParams {
  page?: number;
  per_page?: number;
}

export async function toggleFavourite(productId: string): Promise<FavouriteResponse> {
  return apiFetch<FavouriteResponse>(`/favourites/${productId}/toggle`, {
    method: "POST",
  });
}

export async function fetchFavourites(params: FetchFavouritesParams = {}): Promise<FavouriteListResponse> {
  const { page = 1, per_page = 15 } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
  });

  return apiFetch<FavouriteListResponse>(`/favourites?${queryParams.toString()}`);
}
