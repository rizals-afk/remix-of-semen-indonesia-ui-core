import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/brand/logo.png.asset.json";

/**
 * Brand wordmark used in header + footer.
 * Two-tone: "bahan" in orange (accent), "material" in navy (primary),
 * with a small house icon above — mirrors the logo in every uploaded screen.
 */
export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center leading-none ${className}`}>
      <img
        src={logoAsset.url}
        alt="BahanMaterial.com"
        className="h-12 w-auto object-contain"
      />
    </Link>
  );
}
