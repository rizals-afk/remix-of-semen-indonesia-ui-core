import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

/**
 * Site-wide search input. Submitting navigates to /produk?q=...
 * Mirrors the search bar shown in every header across the uploaded screens.
 */
export function SearchBar({
  placeholder = "Cari kebutuhan material Anda",
  defaultValue = "",
  className = "",
}: SearchBarProps) {
  const navigate = useNavigate();
  const [q, setQ] = useState(defaultValue);
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        navigate({ to: "/produk", search: { q } });
      }}
      className={`flex w-full items-stretch overflow-hidden rounded-md border border-border bg-background ${className}`}
    >
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Cari"
        className="flex items-center justify-center bg-primary px-5 text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
}
