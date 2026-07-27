import { apiFetch } from "../api";

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  product_variant_id: number;
  qty: number;
  created_at: string;
  updated_at: string;
  branch_id: number;
  price: number;
  subtotal: number;
  product: {
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
  };
  product_variant: {
    id: number;
    product_id: number;
    variant_sku: string;
    variant_name: string;
    created_at: string;
    updated_at: string;
    uuid: string;
    old_material: string;
    weight: string;
    volume: string;
    photo: string | null;
  };
  branch: {
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
  };
}

export interface CartResponse {
  current_page: number;
  data: CartItem[];
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

export interface FetchCartParams {
  page?: number;
  per_page?: number;
}

export async function fetchCart(params: FetchCartParams = {}): Promise<CartResponse> {
  const { page = 1, per_page = 15 } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
  });

  return apiFetch<CartResponse>(`/cart?${queryParams.toString()}`);
}

export interface AddToCartPayload {
  product_id: number;
  product_variant_id: number;
  branch_id?: number;
  qty: number;
}

export async function addToCart(payload: AddToCartPayload): Promise<CartResponse> {
  return apiFetch<CartResponse>("/cart", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface CartCountResponse {
  count: number;
}

export async function fetchCartCount(): Promise<CartCountResponse> {
  return apiFetch<CartCountResponse>("/cart/count");
}
