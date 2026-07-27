import { apiFetch } from "../api";

export interface CustomerLocation {
  id: string;
  name: string;
  phone: string;
  address: string;
  is_default: boolean;
  lat?: number;
  long?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerLocationResponse {
  current_page: number;
  data: CustomerLocation[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
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

export interface FetchCustomerLocationsParams {
  page?: number;
  per_page?: number;
}

export async function fetchCustomerLocations(params: FetchCustomerLocationsParams = {}): Promise<CustomerLocationResponse> {
  const { page = 1, per_page = 15 } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
  });

  return apiFetch<CustomerLocationResponse>(`/customer-locations?${queryParams.toString()}`);
}

export async function fetchCustomerLocationById(id: string): Promise<CustomerLocation> {
  return apiFetch<CustomerLocation>(`/customer-locations/${id}`);
}

export interface CreateCustomerLocationPayload {
  name?: string;
  phone?: string;
  address: string;
  is_default?: boolean;
  lat?: number;
  long?: number;
}

export async function createCustomerLocation(payload: CreateCustomerLocationPayload): Promise<CustomerLocation> {
  return apiFetch<CustomerLocation>("/customer-locations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface UpdateCustomerLocationPayload {
  name?: string;
  phone?: string;
  address?: string;
  is_default?: boolean;
  lat?: number;
  long?: number;
}

export async function updateCustomerLocation(id: string, payload: UpdateCustomerLocationPayload): Promise<CustomerLocation> {
  return apiFetch<CustomerLocation>(`/customer-locations/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteCustomerLocation(id: string): Promise<void> {
  return apiFetch<void>(`/customer-locations/${id}`, {
    method: "DELETE",
  });
}
