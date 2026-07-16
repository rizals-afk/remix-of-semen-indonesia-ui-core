import { apiFetch } from "../api";

// Base Product interfaces from backend
export interface ProductMedia {
  id: string;
  url: string;
  type: "image" | "video";
  alt?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  media: ProductMedia[];
  pricelists?: ProductPricelist[];
}

export interface ProductPricelist {
  id: string;
  branch_id: string;
  branch_price_max: number;
  branch_price_min?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category_id: string;
  category_name?: string;
  brand_id?: string;
  brand_name?: string;
  sku?: string;
  media: ProductMedia[];
  variants: ProductVariant[];
  pricelists: ProductPricelist[];
  // Additional fields for UI compatibility
  rating?: number;
  reviewCount?: number;
  sold?: number;
  stock?: number;
  specs?: Array<{ label: string; value: string }>;
  reviews?: Array<{ id: string; author: string; rating: number; date: string; body: string; photos?: string[] }>;
  satisfactionPercent?: number;
  shippingFrom?: string;
  shippingDistanceKm?: number;
  shippingMethod?: string;
  shippingEta?: string;
}

export interface ProductListResponse {
  data: Product[];
  current_page: number;
  per_page: number;
  total: number;
}

export interface FetchProductsParams {
  page?: number;
  per_page?: number;
  product_category_id?: string;
  branch_id?: string; // Prepared for future use
}

export async function fetchProducts(params: FetchProductsParams = {}): Promise<ProductListResponse> {
  const { page = 1, per_page = 9, product_category_id, branch_id } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
  });

  if (product_category_id) {
    queryParams.append("product_category_id", product_category_id);
  }

  if (branch_id) {
    queryParams.append("branch_id", branch_id);
  }

  return apiFetch<ProductListResponse>(`/products?${queryParams.toString()}`);
}

export async function fetchProductById(id: string, branchId?: string): Promise<Product> {
  const queryParams = new URLSearchParams();
  if (branchId) {
    queryParams.append("branch_id", branchId);
  }

  const queryString = queryParams.toString();
  return apiFetch<Product>(`/products/${id}${queryString ? `?${queryString}` : ""}`);
}

/**
 * Get product price based on variant and branch
 * 
 * Current implementation: First variant → First pricelist → branch_price_max
 * Future implementation: Selected variant → Match pricelist by branch_id → branch_price_max
 */
export function getProductPrice(
  product: Product,
  variantId?: string,
  branchId?: string
): number | null {
  if (!product || !product.variants || product.variants.length === 0) {
    return null;
  }

  // Get the variant (first if not specified)
  const variant = variantId
    ? product.variants.find((v) => v.id === variantId)
    : product.variants[0];

  if (!variant) return null;

  // Future: Find pricelist by branch_id
  // For now: Use first pricelist as fallback
  const pricelist = branchId
    ? variant.pricelists?.find((p) => p.branch_id === branchId) || variant.pricelists?.[0]
    : variant.pricelists?.[0];

  if (!pricelist) return null;

  return pricelist.branch_price_max;
}

/**
 * Get product images with priority:
 * 1. Selected variant media
 * 2. Product media
 * 3. Placeholder
 */
export function getProductImages(product: Product, variantId?: string): string[] {
  console.log("getProductImages - product:", product);
  console.log("getProductImages - variantId:", variantId);
  
  if (!product) return ["https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&q=70"];

  const variant = variantId
    ? product.variants.find((v) => v.id === variantId)
    : product.variants[0];

  console.log("getProductImages - selected variant:", variant);
  console.log("getProductImages - variant.media:", variant?.media);

  // If variant has media, use it
  if (variant && variant.media && variant.media.length > 0) {
    const variantImages = variant.media.filter((m) => m.type === "image").map((m) => m.url);
    console.log("getProductImages - returning variant images:", variantImages);
    return variantImages;
  }

  console.log("getProductImages - product.media:", product.media);

  // Otherwise use product media
  if (product.media && product.media.length > 0) {
    const productImages = product.media.filter((m) => m.type === "image").map((m) => m.url);
    console.log("getProductImages - returning product images:", productImages);
    return productImages;
  }

  console.log("getProductImages - using placeholder");
  // Fallback to placeholder
  return ["https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&q=70"];
}

/**
 * Get first product image (for product card)
 * For product list: always use product media (not variant media)
 */
export function getProductImage(product: Product, variantId?: string): string {
  // For product list, always use product media (not variant media)
  console.log("getProductImage - product.media:", product.media);
  
  if (product.media && product.media.length > 0) {
    const imageMedia = product.media.filter((m) => m.type === "image");
    console.log("getProductImage - imageMedia:", imageMedia);
    
    if (imageMedia.length > 0) {
      // Use first image
      const imageUrl = imageMedia[0].url;
      console.log("getProductImage - returning:", imageUrl);
      return imageUrl;
    }
  }

  console.log("getProductImage - using placeholder");
  return "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&q=70";
}

/**
 * Transform API Product to ProductCard-compatible format
 */
export interface ProductCardData {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  image: string;
  warehouse: string;
  rating?: number;
  categorySlug?: string;
  category: string;
  brand?: string;
  sku?: string;
}

export function transformProductToCard(
  product: Product,
  warehouseName?: string,
  variantId?: string,
  branchId?: string
): ProductCardData {
  const price = getProductPrice(product, variantId, branchId);
  const image = getProductImage(product, variantId);

  return {
    id: product.id,
    name: product.name,
    price: price || 0,
    image,
    warehouse: warehouseName || "Gudang Utama",
    category: product.category_name || "Umum",
    brand: product.brand_name,
    sku: product.sku,
    categorySlug: product.category_id,
  };
}
