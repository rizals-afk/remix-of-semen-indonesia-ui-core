import { apiFetch } from "../api";

export interface TrxLine {
  id?: number;
  trx_line_id?: number;
  product_variant_id: number;
  product_id: number;
  price: number;
  qty: number;
  subtotal: number;
  division?: string;
  delivery_date?: string;
  trx_review?: unknown | null;
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
    division?: string;
    media?: Array<{
      id: string;
      url: string;
      type: "image" | "video";
      alt?: string;
    }>;
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
  status: "pending" | "approve" | "process" | "delivery" | "done" | "cancel" | "retur";
  trx_type: string;
  created_at: string;
  updated_at: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  customer_location_id: number;
  branch_id: number;
  branch?: { id: number; name: string };
  customer_id?: number;
  payment_id?: number;
  customer_location?: CustomerLocation;
  customer_location_name?: string;
  customer_location_phone?: string;
  customer_location_address?: string;
  customer_location_city?: string;
  customer_location_postal_code?: string;
  customer_location_lat?: number;
  customer_location_long?: number;
  verification_date?: string;
  date_done?: string;
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

export interface BulkTrxItem {
  doc_type: string;
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
  is_pay_store?: boolean;
  review_id?: number;
  branch_id?: number;
  division?: string;
  delivery_rule_id?: number;
  notes?: string;
  shipping_address?: string;
  shipping_phone?: string;
  customer_location_address?: string;
  customer_location_phone?: string;
  customer_location_lat?: number;
  customer_location_long?: number;
  lines: TrxLine[];
}

export interface BulkTrxRequest {
  items: BulkTrxItem[];
}

export interface BulkTrxResponse {
  data: TrxResponse[];
  errors?: any[];
  total?: number;
  success?: number;
  failed?: number;
}

export interface TrxResponse {
  id: number;
  code: string;
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

export async function createBulkTrx(data: BulkTrxRequest): Promise<BulkTrxResponse> {
  return apiFetch<BulkTrxResponse>("/trx/bulk", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function cancelTrx(id: number, cancelMessage?: string): Promise<Trx> {
  return apiFetch<Trx>(`/trx/${id}/cancel`, {
    method: "PUT",
    body: cancelMessage ? JSON.stringify({ cancel_message: cancelMessage }) : undefined,
  });
}

export async function markTrxDone(id: number): Promise<Trx> {
  return apiFetch<Trx>(`/trx/${id}/done`, {
    method: "PUT",
  });
}

export interface SnapTokenResponse {
  token: string;
  redirect_url: string;
}

export async function generateSnapToken(trxId: number): Promise<SnapTokenResponse> {
  return apiFetch<SnapTokenResponse>(`/trx/${trxId}/gen_snap_token`);
}

export interface ReturnPhoto {
  url: string;
  description: string;
}

export interface ReturnLine {
  product_id: number;
  product_variant_id: number;
  qty: number;
}

export interface CreateReturnRequest {
  lines: ReturnLine[];
  photos: ReturnPhoto[];
  customer_location_name: string;
  customer_location_address: string;
  customer_location_city: string;
  customer_location_postal_code: string;
  customer_location_lat: number;
  customer_location_long: number;
  retur_type: "barang" | "dana";
  retur_reason: string;
  retur_description: string;
}

export async function createReturn(trxId: number, data: CreateReturnRequest): Promise<unknown> {
  return apiFetch<unknown>(`/trx/${trxId}/retur`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface CreateReviewRequest {
  trx_line_id: number;
  rating: number;
  product_id: number;
  product_variant_id: number;
  review: string;
  photos: string;
}

export async function createReview(data: CreateReviewRequest): Promise<unknown> {
  return apiFetch<unknown>("/trx-reviews", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
