interface UnderlineTabsProps<T extends string> {
  tabs: readonly T[];
  value: T;
  onChange: (v: T) => void;
  /** Visual tone of the active underline. Defaults to "accent" (orange). */
  tone?: "accent" | "primary";
  align?: "start" | "center";
  className?: string;
}

/**
 * Horizontal tab bar with an underline indicator under the active tab.
 * Matches the "Terlaris / Promo Spesial / Baru Masuk" and
 * "Spesifikasi / Deskripsi / Ulasan" tabs in the uploaded screens.
 */
export function UnderlineTabs<T extends string>({
  tabs,
  value,
  onChange,
  tone = "accent",
  align = "start",
  className = "",
}: UnderlineTabsProps<T>) {
  const activeColor = tone === "accent" ? "text-accent" : "text-primary";
  const underline = tone === "accent" ? "bg-accent" : "bg-primary";
  const justify = align === "center" ? "justify-center" : "justify-start";
  return (
    <div className={`flex border-b border-border ${justify} gap-8 ${className}`}>
      {tabs.map((tab) => {
        const active = tab === value;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={
              "relative pb-3 text-sm font-semibold transition-colors md:text-base " +
              (active ? activeColor : "text-muted-foreground hover:text-foreground")
            }
          >
            {tab}
            {active && <span className={`absolute inset-x-0 -bottom-px h-0.5 ${underline}`} />}
          </button>
        );
      })}
    </div>
  );
}
