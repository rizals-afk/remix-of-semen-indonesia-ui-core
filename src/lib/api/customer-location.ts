import { apiFetch } from "../api";

export interface CustomerLocation {
  id: string;
  name: string;
  phone: string;
  address: string;
  city?: string;
  postal_code?: string;
  lat: number;
  long: number;
  is_default: boolean;
}

export interface CustomerLocationListResponse {
  data: CustomerLocation[];
  current_page: number;
  per_page: number;
  total: number;
}

export interface FetchCustomerLocationsParams {
  search?: string;
  per_page?: number;
  page?: number;
}

export interface CreateCustomerLocationRequest {
  name: string;
  phone: string;
  address: string;
  city?: string;
  postal_code?: string;
  lat: number;
  long: number;
  is_default: boolean;
}

export interface UpdateCustomerLocationRequest {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  lat?: number;
  long?: number;
  is_default?: boolean;
}

export async function fetchCustomerLocations(params: FetchCustomerLocationsParams = {}): Promise<CustomerLocationListResponse> {
  const { search = "", per_page = 999, page = 1 } = params;
  const queryParams = new URLSearchParams({
    per_page: per_page.toString(),
    page: page.toString(),
  });
  
  if (search) {
    queryParams.append("search", search);
  }

  return apiFetch<CustomerLocationListResponse>(`/customer-locations?${queryParams.toString()}`);
}

export async function createCustomerLocation(data: CreateCustomerLocationRequest): Promise<CustomerLocation> {
  return apiFetch<CustomerLocation>("/customer-locations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCustomerLocation(id: string, data: UpdateCustomerLocationRequest): Promise<CustomerLocation> {
  return apiFetch<CustomerLocation>(`/customer-locations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCustomerLocation(id: string): Promise<void> {
  return apiFetch<void>(`/customer-locations/${id}`, {
    method: "DELETE",
  });
}
