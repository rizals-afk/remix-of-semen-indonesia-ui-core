import { apiFetch } from "../api";

export interface TrxLine {
  product_variant_id: number;
  product_id: number;
  price: number;
  qty: number;
  subtotal: number;
  product?: {
    id: number;
    name: string;
    sku: string;
    photo?: string;
  };
  product_variant?: {
    id: number;
    variant_name: string;
    weight: string;
  };
}

export interface CustomerLocation {
  id: number;
  name: string;
  phone: string;
  address: string;
  lat: number;
  long: number;
}

export interface Trx {
  id: number;
  code: string;
  status: "pending" | "approve" | "proses" | "delivery" | "done" | "cancel";
  trx_type: string;
  created_at: string;
  updated_at: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  customer_location_id: number;
  branch_id: number;
  customer_location?: CustomerLocation;
  lines: TrxLine[];
}

export interface TrxListResponse {
  data: Trx[];
  current_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
}

export interface FetchTrxParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
}

export interface CreateTrxRequest {
  trx_type: "order";
  status?: string;
  subtotal?: number;
  shipping_cost?: number;
  total?: number;
  verificator_id?: number;
  verification_date?: string;
  reject_message?: string;
  payment_id?: number;
  verification_due_date?: string;
  shipping_method?: string;
  shipping_type?: string;
  so_number?: string;
  do_number?: string;
  billing_number?: string;
  is_billing_sap?: boolean;
  is_post_payment?: boolean;
  review_id?: number;
  branch_id?: number;
  shipping_address?: string;
  shipping_phone?: string;
  customer_location_address?: string;
  customer_location_phone?: string;
  customer_location_lat?: number;
  customer_location_long?: number;
  lines: TrxLine[];
}

export interface TrxResponse {
  id: number;
  customer_location_id: number;
  trx_type: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  branch_id: number;
  shipping_address: string;
  shipping_phone: string;
  lines: TrxLine[];
  created_at: string;
  updated_at: string;
}

export async function fetchTrx(params: FetchTrxParams = {}): Promise<TrxListResponse> {
  const { page = 1, per_page = 10, search = "", status = "" } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
  });
  
  if (search) {
    queryParams.append("search", search);
  }
  
  if (status) {
    queryParams.append("status", status);
  }

  return apiFetch<TrxListResponse>(`/trx?${queryParams.toString()}`);
}

export async function fetchTrxById(id: number): Promise<Trx> {
  return apiFetch<Trx>(`/trx/${id}`);
}

export async function createTrx(data: CreateTrxRequest): Promise<TrxResponse> {
  return apiFetch<TrxResponse>("/trx", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
