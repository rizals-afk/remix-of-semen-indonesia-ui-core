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
