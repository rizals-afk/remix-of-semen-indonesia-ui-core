import { apiFetch } from "../api";

export interface Voucher {
  id: number;
  name: string;
  description: string | null;
  code: string;
  valid_start: string | null;
  valid_end: string | null;
  quota_promo: number;
  type: string;
  max_discount: string;
  discount_amount: string | null;
  discount_percentage: string | null;
  min_purchase: string;
  apply_on: string;
  apply_on_id: number | null;
  created_at: string;
  updated_at: string;
  discount_type: string;
  branch_id: number | null;
  is_claim: boolean;
  claimed: boolean;
  voucher_apply_lines: VoucherApplyLine[];
  branch: Branch | null;
}

export interface VoucherApplyLine {
  id: number;
  voucher_id: number;
  product_id: number;
  product_variant_id: number;
  created_at: string;
  updated_at: string;
  product: VoucherProduct;
  product_variant: VoucherProductVariant;
}

export interface VoucherProduct {
  id: number;
  name: string;
  sku: string;
  description: string;
  product_category_id: number;
  brand_id: number;
  created_at: string;
  updated_at: string;
  uuid: string;
  is_active: boolean;
  photo: string | null;
  average_rating: number;
}

export interface VoucherProductVariant {
  id: number;
  product_id: number;
  variant_sku: string;
  variant_name: string;
  created_at: string;
  updated_at: string;
  uuid: string;
  old_material: string;
  weight: string | null;
  volume: string | null;
  photo: string | null;
  division: string;
  average_rating: number;
  total_sales: number;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  lat: string;
  long: string;
  created_at: string;
  updated_at: string;
  uuid: string;
  is_default: boolean;
  min_tonase: string;
  max_tonase: string;
  code: string;
  ratio_min: string;
  ratio_max: string;
  owner: string;
  global_percentage: string;
  is_active: boolean;
  profit_center: string | null;
}

export interface VoucherListResponse {
  data: Voucher[];
  current_page: number;
  per_page: number;
  total: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  from: number;
  to: number;
  last_page: number;
  path: string;
  links: Array<{
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }>;
}

export interface FetchVouchersParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: string;
  applicable?: boolean;
}

export async function fetchVouchers(params: FetchVouchersParams = {}): Promise<VoucherListResponse> {
  const { page = 1, per_page = 15, search, sort_by = "created_at", sort_order = "desc", applicable = true } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
    sort_by,
    sort_order,
    applicable: applicable.toString(),
  });

  if (search) {
    queryParams.append("search", search);
  }

  return apiFetch<VoucherListResponse>(`/vouchers?${queryParams.toString()}`);
}

export async function claimVoucher(voucherId: number): Promise<Voucher> {
  return apiFetch<Voucher>(`/vouchers/${voucherId}/claim`, {
    method: "POST",
  });
}
