/** Format integer as Indonesian Rupiah (e.g. 100000 -> "Rp 100.000"). */
export function formatRupiah(value: number): string {
  return "Rp " + value.toLocaleString("id-ID");
}
