import { apiFetch } from "../api";

export interface FavouriteResponse {
  id: number;
  product_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export async function toggleFavourite(productId: string): Promise<FavouriteResponse> {
  return apiFetch<FavouriteResponse>(`/favourites/${productId}/toggle`, {
    method: "POST",
  });
}
