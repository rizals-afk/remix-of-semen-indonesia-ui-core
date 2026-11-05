import { apiFetch } from "../api";

export interface Brand {
  id: string;
  name: string;
  uuid: string;
  photo: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrandListResponse {
  data: Brand[];
  current_page: number;
  per_page: number;
  total: number;
}

export interface FetchBrandsParams {
  per_page?: number;
  page?: number;
  is_active?: boolean;
}

export async function fetchBrands(params: FetchBrandsParams = {}): Promise<BrandListResponse> {
  const { per_page = 999, page = 1, is_active = true } = params;
  const queryParams = new URLSearchParams({
    per_page: per_page.toString(),
    page: page.toString(),
  });

  if (is_active !== undefined) {
    queryParams.append("is_active", is_active.toString());
  }

  return apiFetch<BrandListResponse>(`/brands?${queryParams.toString()}`);
}
