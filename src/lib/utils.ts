import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Strip HTML tags and decode entities, returning plain text. */
export function stripHtml(html: string): string {
  if (!html) return "";
  if (typeof DOMParser !== "undefined") {
    return new DOMParser().parseFromString(html, "text/html").body.textContent ?? "";
  }
  return html.replace(/<[^>]*>/g, "");
}

/** Plain-text excerpt from an HTML string, truncated to `length` chars. */
export function excerptFromHtml(html: string, length = 150): string {
  const text = stripHtml(html).replace(/\s+/g, " ").trim();
  return text.length > length ? `${text.slice(0, length).trimEnd()}...` : text;
}
