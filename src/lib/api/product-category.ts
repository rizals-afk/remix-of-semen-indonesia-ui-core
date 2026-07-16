import { apiFetch } from "../api";

export interface ProductCategory {
  id: string;
  name: string;
  photo: string | null;
  parent_id: string | null;
}

export interface CategoryListResponse {
  data: ProductCategory[];
  current_page: number;
  per_page: number;
  total: number;
}

export interface FetchCategoriesParams {
  per_page?: number;
  page?: number;
}

export async function fetchCategories(params: FetchCategoriesParams = {}): Promise<CategoryListResponse> {
  const { per_page = 999, page = 1 } = params;
  const queryParams = new URLSearchParams({
    per_page: per_page.toString(),
    page: page.toString(),
  });

  return apiFetch<CategoryListResponse>(`/product-categories?${queryParams.toString()}`);
}

/**
 * Build hierarchical category tree from flat list
 */
export interface CategoryNode {
  id: string;
  name: string;
  photo: string | null;
  parent_id: string | null;
  children: CategoryNode[];
}

export function buildCategoryTree(categories: ProductCategory[]): CategoryNode[] {
  const categoryMap = new Map<string, CategoryNode>();
  
  // Initialize all categories as nodes
  categories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });
  
  // Build tree structure
  const tree: CategoryNode[] = [];
  categories.forEach(cat => {
    const node = categoryMap.get(cat.id)!;
    if (cat.parent_id === null) {
      // Root category
      tree.push(node);
    } else {
      // Child category
      const parent = categoryMap.get(cat.parent_id);
      if (parent) {
        parent.children.push(node);
      }
    }
  });
  
  return tree;
}

/**
 * Get only child categories (categories with parent_id)
 */
export function getChildCategories(categories: ProductCategory[]): ProductCategory[] {
  return categories.filter(cat => cat.parent_id !== null);
}

/**
 * Get placeholder image for categories without photo
 */
export const CATEGORY_PLACEHOLDER = "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&q=70";

/**
 * Get category image URL or placeholder
 */
export function getCategoryPhoto(photo: string | null): string {
  return photo || CATEGORY_PLACEHOLDER;
}
