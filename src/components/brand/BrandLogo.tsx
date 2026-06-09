import { Link } from "@tanstack/react-router";

/**
 * Brand wordmark used in header + footer.
 * Two-tone: "bahan" in orange (accent), "material" in navy (primary),
 * with a small house icon above — mirrors the logo in every uploaded screen.
 */
export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-end gap-1 leading-none ${className}`}>
      <div className="flex flex-col items-start">
        <svg
          aria-hidden
          viewBox="0 0 32 24"
          className="mb-0.5 h-5 w-6 text-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12 16 3l13 9" />
          <path d="M6 11v10h20V11" />
        </svg>
        <div className="flex items-baseline gap-0.5">
          <span className="text-2xl font-extrabold tracking-tight text-accent">bahan</span>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-2xl font-extrabold tracking-tight text-primary">material</span>
          <span className="text-xs font-semibold text-primary">.com</span>
        </div>
      </div>
    </Link>
  );
}
