export interface Spec {
  label: string;
  value: string;
}

/** Two-column specification table used on the Spesifikasi tab. */
export function SpecsTable({ items }: { items: Spec[] }) {
  return (
    <dl className="divide-y divide-border">
      {items.map((s) => (
        <div key={s.label} className="grid grid-cols-1 gap-1 py-3 md:grid-cols-[260px_1fr] md:gap-6">
          <dt className="text-sm font-semibold text-foreground">{s.label}</dt>
          <dd className="text-sm text-foreground/80">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
