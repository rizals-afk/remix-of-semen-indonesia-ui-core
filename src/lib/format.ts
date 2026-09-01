/** Format integer as Indonesian Rupiah (e.g. 100000 -> "Rp 100.000"). */
export function formatRupiah(value: number | string | undefined | null): string {
  if (value === undefined || value === null) {
    return "Rp -";
  }
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) {
    return "Rp -";
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
}
