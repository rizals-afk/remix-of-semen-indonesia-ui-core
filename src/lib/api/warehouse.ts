import { apiFetch } from "../api";

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  lat?: number;
  long?: number;
  is_default?: boolean;
}

export interface BranchListResponse {
  data: Warehouse[];
  current_page: number;
  per_page: number;
  total: number;
}

export interface FetchWarehousesParams {
  search?: string;
  per_page?: number;
  page?: number;
  is_default?: boolean;
  is_active?: boolean;
}

export async function fetchWarehouses(params: FetchWarehousesParams = {}): Promise<BranchListResponse> {
  const { search = "", per_page = 999, page = 1, is_default, is_active } = params;
  const queryParams = new URLSearchParams({
    per_page: per_page.toString(),
    page: page.toString(),
  });
  
  if (search) {
    queryParams.append("search", search);
  }

  if (is_default !== undefined) {
    queryParams.append("is_default", is_default.toString());
  }

  if (is_active !== undefined) {
    queryParams.append("is_active", is_active.toString());
  }

  return apiFetch<BranchListResponse>(`/branches?${queryParams.toString()}`);
}
