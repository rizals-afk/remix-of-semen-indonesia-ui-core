import { apiFetch } from "../api";

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  lat?: number;
  long?: number;
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
}

export async function fetchWarehouses(params: FetchWarehousesParams = {}): Promise<BranchListResponse> {
  const { search = "", per_page = 999, page = 1 } = params;
  const queryParams = new URLSearchParams({
    per_page: per_page.toString(),
    page: page.toString(),
  });
  
  if (search) {
    queryParams.append("search", search);
  }

  return apiFetch<BranchListResponse>(`/branches?${queryParams.toString()}`);
}
