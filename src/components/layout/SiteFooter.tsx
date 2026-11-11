import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

const TENTANG = [
  { label: "Tentang Kami", to: "/tentang" },
  { label: "Kebijakan Privasi", to: "/privasi" },
  { label: "Syarat & Ketentuan", to: "/syarat" },
] as const;

const PANDUAN = [
  { label: "Seputar Belanja", to: "/panduan/belanja" },
  { label: "Seputar Pembayaran", to: "/panduan/pembayaran" },
  { label: "Seputar Pengiriman", to: "/panduan/pengiriman" },
  { label: "Seputar Pengembalian", to: "/panduan/pengembalian" },
] as const;

/**
 * Site footer — identical structure on every uploaded screen.
 * Four-column layout with brand block, "Tentang", "Panduan & Layanan",
 * and "Temukan Kami" (socials + Play Store badge).
 */
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="container mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3 text-sm">
          <BrandLogo />
          <p className="pt-2 text-xs text-muted-foreground">Supported by</p>
          <p className="font-semibold text-foreground">PT. Semen Indonesia Distributor</p>
          <ul className="space-y-2 pt-2 text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>
                Jl. Dr. Wahidin Sudirohusodo No.728A,
                <br />
                Dahanrejo, Kec. Kebomas, Kabupaten Gresik, Jawa Timur 61122
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" />
              <a href="mailto:sales@bahanmaterial.com" className="hover:text-primary">
                sales@bahanmaterial.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent" />
              <a href="tel:081133331800" className="hover:text-primary">
                081133331800
              </a>
            </li>
          </ul>
        </div>

        <FooterColumn title="Tentang" items={TENTANG} />
        <FooterColumn title="Panduan & Layanan" items={PANDUAN} />

        <div className="space-y-4 text-sm">
          <h3 className="text-base font-semibold text-primary">Temukan Kami</h3>
          <div className="flex items-center gap-3">
            <SocialIcon href="https://www.instagram.com/bahanmaterial.official" label="Instagram">
              <Instagram className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://www.facebook.com/profile.php?id=61572641804024" label="Facebook">
              <Facebook className="h-4 w-4" />
            </SocialIcon>
            {/* lucide-react has no TikTok icon, so use inline SVG */}
            <SocialIcon href="https://www.tiktok.com/@bahanmaterialofficial" label="TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://www.youtube.com/@bahanmaterialofficial" label="YouTube" className="bg-destructive text-white">
              <Youtube className="h-4 w-4" />
            </SocialIcon>
          </div>
          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium text-foreground">Download Aplikasi BahanMaterial</p>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-3 py-2 text-xs text-background"
            >
              <span className="text-lg">▶</span>
              <span className="flex flex-col leading-tight">
                <span className="text-[10px] opacity-80">GET IT ON</span>
                <span className="font-semibold">Google Play</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto max-w-7xl px-4 py-4 text-center text-xs text-muted-foreground">
          Copyright © 2026. PT Semen Indonesia Distributor. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: ReadonlyArray<{ label: string; to: string }>;
}) {
  return (
    <div className="space-y-3 text-sm">
      <h3 className="text-base font-semibold text-primary">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  children,
  href,
  label,
  className = "bg-accent text-accent-foreground",
}: {
  children: React.ReactNode;
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={`grid h-8 w-8 place-items-center rounded-md ${className}`}
    >
      {children}
    </a>
  );
}
