import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/brand/BrandLogo";

/**
 * Two-column shell used for every authentication screen:
 * brand logo top-left, form on one side, decorative illustration on the other.
 * Falls back to single column on small screens.
 */
export function AuthShell({
  children,
  illustration,
  reverse = false,
}: {
  children: ReactNode;
  illustration: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 pt-8 md:px-12">
        <BrandLogo />
      </header>
      <div className="container mx-auto grid max-w-7xl items-center gap-10 px-6 py-10 md:grid-cols-2 md:gap-16 md:px-12 md:py-16">
        {reverse ? (
          <>
            <div className="order-2 md:order-1">{illustration}</div>
            <div className="order-1 md:order-2">{children}</div>
          </>
        ) : (
          <>
            <div>{children}</div>
            <div className="hidden md:block">{illustration}</div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Soft circular illustration backdrop with a centered icon — keeps the look
 * of the uploaded screens without shipping bitmap assets.
 */
export function AuthIllustration({
  children,
  tone = "accent",
}: {
  children: ReactNode;
  tone?: "accent" | "primary";
}) {
  const bg = tone === "accent" ? "bg-accent-soft" : "bg-primary-soft";
  const fg = tone === "accent" ? "text-accent" : "text-primary";
  return (
    <div className={`relative mx-auto grid aspect-square w-full max-w-md place-items-center rounded-full ${bg}`}>
      <div className={`grid h-3/5 w-3/5 place-items-center rounded-3xl bg-background shadow-sm ${fg}`}>
        {children}
      </div>
    </div>
  );
}

/** Solid primary CTA used as the form's main submit button. */
export function PrimarySubmit({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      {...rest}
      className={
        "w-full rounded-md bg-gradient-to-r from-primary to-[oklch(0.22_0.08_264)] py-3 text-sm font-bold text-primary-foreground shadow transition-opacity hover:opacity-95 disabled:opacity-60 " +
        (rest.className ?? "")
      }
    >
      {children}
    </button>
  );
}

/** Notched-label outlined input used on every auth form (matches Material-style fields in the screens). */
export function NotchedInput({
  label,
  id,
  trailing,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; trailing?: ReactNode }) {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="absolute -top-2 left-3 z-10 bg-background px-1 text-xs font-medium text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        {...rest}
        className={
          "h-14 w-full rounded-md border border-border bg-background px-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary " +
          (rest.className ?? "")
        }
      />
      {trailing ? (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{trailing}</div>
      ) : null}
    </div>
  );
}

export function SocialAuthRow({ mode = "login" }: { mode?: "login" | "signup" }) {
  const label = mode === "login" ? "Or login with" : "Or Sign up with";
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <span>{label}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SocialButton label="Facebook" icon={<FacebookIcon />} />
        <SocialButton label="Google" icon={<GoogleIcon />} />
      </div>
    </div>
  );
}

function SocialButton({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-background text-sm font-semibold text-foreground hover:bg-muted"
    >
      {icon}
      {label}
    </button>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M13.5 12.5h2l.3-2.5h-2.3V8.4c0-.7.2-1.2 1.2-1.2H16V5c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.4V10H8v2.5h2.5V19h3v-6.5z"
        fill="#fff"
      />
    </svg>
  );
}
function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2c-2 1.5-4.6 2.4-7.3 2.4-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.2-4.5 5.6l6.2 5.2C40.9 35.7 44 30.3 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export function AuthFooterLink({ children, to, prompt }: { children: string; to: string; prompt: string }) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {prompt}{" "}
      <Link to={to} className="font-bold text-accent hover:underline">
        {children}
      </Link>
    </p>
  );
}