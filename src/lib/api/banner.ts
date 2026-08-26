import { apiFetch } from "../api";

export interface Banner {
  id: number;
  title: string;
  photo: string;
  is_mobile: boolean;
  is_website: boolean;
  active_period_start: string;
  active_period_end: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface BannerListResponse {
  data: Banner[];
  current_page: number;
  per_page: number;
  total: number;
}

export interface FetchBannersParams {
  page?: number;
  per_page?: number;
  is_website?: number;
  active?: boolean;
}

export async function fetchBanners(params: FetchBannersParams = {}): Promise<BannerListResponse> {
  const { page = 1, per_page = 99, is_website = 1, active = true } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
    is_website: is_website.toString(),
    active: active.toString(),
  });

  return apiFetch<BannerListResponse>(`/banners?${queryParams.toString()}`);
}
