/** Format integer as Indonesian Rupiah (e.g. 100000 -> "Rp 100.000"). */
export function formatRupiah(value: number | undefined | null): string {
  if (value === undefined || value === null) {
    return "Rp -";
  }
  return "Rp " + value.toLocaleString("id-ID");
}
