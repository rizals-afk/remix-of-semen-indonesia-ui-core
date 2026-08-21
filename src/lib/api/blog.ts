import { apiFetch } from "../api";

export interface Blog {
  id: string;
  title: string;
  author: string;
  banner_photo: string | null;
  tags: string[];
  content: string;
  created_at: string;
  updated_at: string;
  uuid: string;
  is_active: boolean;
  blog_products: BlogProductItem[];
}

export interface BlogProductItem {
  id: number;
  blog_id: number;
  product_id: number;
  product_variant_id: number;
  product: Product;
  product_variant: ProductVariant;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  photo: string | null;
  category: Category;
  brand: Brand;
  variants: ProductVariant[];
  media: Media[];
}

export interface ProductVariant {
  id: number;
  product_id: number;
  variant_sku: string;
  variant_name: string;
  weight: string | null;
  volume: string | null;
  division: string | null;
  pricelists: Pricelist[];
  media: Media[];
  stocks: Stock[];
}

export interface Category {
  id: number;
  name: string;
  photo: string | null;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Pricelist {
  id: number;
  branch_id: number;
  branch_code: string;
  branch_price: string;
  default_price: string;
  product_variant_id: number;
  ratio_min: string;
  ratio_max: string;
  branch_price_min: number;
  branch_price_max: number;
  branch: Branch;
}

export interface Branch {
  id: number;
  name: string;
  code: string;
}

export interface Media {
  id: number;
  url: string;
}

export interface Stock {
  id: number;
  branch_id: number;
  available_stock: number;
  branch: Branch;
}

export interface BlogListResponse {
  data: Blog[];
  current_page: number;
  per_page: number;
  total: number;
}

export interface FetchBlogsParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export async function fetchBlogs(params: FetchBlogsParams = {}): Promise<BlogListResponse> {
  const { page = 1, per_page = 10, search } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
  });

  if (search) {
    queryParams.append("search", search);
  }

  return apiFetch<BlogListResponse>(`/blogs?${queryParams.toString()}`);
}

export async function fetchBlogById(id: string): Promise<Blog> {
  return apiFetch<Blog>(`/blogs/${id}`);
}

export interface BlogProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  warehouse: string;
  rating?: number;
  categorySlug?: string;
  originalPrice?: number;
  discountPercent?: number;
}

export interface BlogProductsResponse {
  data: BlogProduct[];
  current_page: number;
  per_page: number;
  total: number;
}

export interface FetchBlogProductsParams {
  page?: number;
  per_page?: number;
  blog_id: string;
}

export async function fetchBlogProducts(params: FetchBlogProductsParams): Promise<BlogProductsResponse> {
  const { page = 1, per_page = 15, blog_id } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
    blog_id: blog_id,
  });

  return apiFetch<BlogProductsResponse>(`/blog-products?${queryParams.toString()}`);
}
