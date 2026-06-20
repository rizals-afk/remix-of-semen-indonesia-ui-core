import { DEMO_CART, type CartProduct } from "./shopping";

export type OrderStatus =
  | "menunggu-verifikasi"
  | "menunggu-pembayaran"
  | "diproses"
  | "dikirim"
  | "selesai"
  | "pengembalian"
  | "dibatalkan";

export interface OrderItem extends CartProduct {}

export interface OrderWarehouseGroup {
  warehouse: string;
  items: OrderItem[];
  shippingFee: number;
  note?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  mode: "dikirim" | "diambil";
  cod: boolean;
  paymentMethod: string;
  recipient: string;
  phone: string;
  address: string;
  voucherDiscount?: number;
  groups: OrderWarehouseGroup[];
  /** ISO-ish display deadline depending on status (pay-by, ship-by, confirm-by). */
  deadline?: string;
  /** Estimated arrival window for shipped orders. */
  etaWindow?: string;
  /** Coins earned hint for completed orders. */
  coinsHint?: number;
}

const c = DEMO_CART;

export const ORDERS: Order[] = [
  {
    id: "ORD-19062026-482910",
    createdAt: "19 Jun 2026, 10:24",
    status: "menunggu-pembayaran",
    mode: "dikirim",
    cod: false,
    paymentMethod: "BCA Virtual Account",
    recipient: "Auliya Gita Ananda",
    phone: "0851234567890",
    address: "Jl. Dr. Wahidin Sudirohusodo No.728A, Dahanrejo, Kebomas, Gresik",
    voucherDiscount: 50000,
    deadline: "31-01-2026",
    groups: [
      { warehouse: "Gudang Cabang Gresik", items: [c[0], c[1]], shippingFee: 170000, note: "Tolong dibungkus rapi" },
      { warehouse: "Gudang Cabang Surabaya", items: [c[2]], shippingFee: 85000 },
    ],
  },
  {
    id: "ORD-15062026-118233",
    createdAt: "15 Jun 2026, 14:02",
    status: "dikirim",
    mode: "dikirim",
    cod: false,
    paymentMethod: "QRIS",
    recipient: "Auliya Gita Ananda",
    phone: "0851234567890",
    address: "Jl. Dr. Wahidin Sudirohusodo No.728A, Gresik",
    deadline: "31-01-2026",
    etaWindow: "1 Feb 2026, 09.00 - 15.00 WIB",
    groups: [{ warehouse: "Gudang Cabang Gresik", items: [c[0]], shippingFee: 170000 }],
  },
  {
    id: "ORD-08062026-559001",
    createdAt: "08 Jun 2026, 09:11",
    status: "selesai",
    mode: "diambil",
    cod: true,
    paymentMethod: "COD (Cash On Delivery)",
    recipient: "Auliya Gita Ananda",
    phone: "0851234567890",
    address: "Diambil di Gudang Cabang Gresik",
    coinsHint: 80,
    deadline: "03 Jan 2027",
    groups: [{ warehouse: "Gudang Cabang Gresik", items: [c[1]], shippingFee: 0 }],
  },
  {
    id: "ORD-02062026-220194",
    createdAt: "02 Jun 2026, 16:45",
    status: "menunggu-verifikasi",
    mode: "dikirim",
    cod: false,
    paymentMethod: "—",
    recipient: "Auliya Gita Ananda",
    phone: "0851234567890",
    address: "Jl. Raya Darmo No. 90, Surabaya",
    groups: [{ warehouse: "Gudang Cabang Surabaya", items: [c[2]], shippingFee: 0 }],
  },
  {
    id: "ORD-28052026-770341",
    createdAt: "28 Mei 2026, 11:30",
    status: "diproses",
    mode: "dikirim",
    cod: false,
    paymentMethod: "Mandiri Virtual Account",
    recipient: "Auliya Gita Ananda",
    phone: "0851234567890",
    address: "Jl. Dr. Wahidin Sudirohusodo No.728A, Gresik",
    deadline: "29-01-2026",
    groups: [{ warehouse: "Gudang Cabang Gresik", items: [c[0], c[1]], shippingFee: 170000 }],
  },
  {
    id: "ORD-25052026-447120",
    createdAt: "25 Mei 2026, 13:18",
    status: "pengembalian",
    mode: "dikirim",
    cod: false,
    paymentMethod: "BCA Virtual Account",
    recipient: "Auliya Gita Ananda",
    phone: "0851234567890",
    address: "Jl. Dr. Wahidin Sudirohusodo No.728A, Gresik",
    deadline: "28-01-2026",
    groups: [{ warehouse: "Gudang Cabang Gresik", items: [c[0]], shippingFee: 0 }],
  },
  {
    id: "ORD-21052026-998817",
    createdAt: "21 Mei 2026, 08:05",
    status: "dibatalkan",
    mode: "dikirim",
    cod: false,
    paymentMethod: "BCA Virtual Account",
    recipient: "Auliya Gita Ananda",
    phone: "0851234567890",
    address: "Jl. Dr. Wahidin Sudirohusodo No.728A, Gresik",
    deadline: "28-01-2026",
    groups: [{ warehouse: "Gudang Cabang Gresik", items: [c[0]], shippingFee: 0 }],
  },
];

export function orderSubtotal(o: Order) {
  return o.groups.reduce((s, g) => s + g.items.reduce((ss, i) => ss + i.price * i.qty, 0), 0);
}
export function orderShipping(o: Order) {
  return o.groups.reduce((s, g) => s + g.shippingFee, 0);
}
export function orderTotal(o: Order) {
  return orderSubtotal(o) + orderShipping(o) - (o.voucherDiscount ?? 0);
}
export function orderTonase(o: Order) {
  return o.groups.reduce(
    (s, g) => s + g.items.reduce((ss, i) => ss + ((i.weightKg ?? 0) * i.qty) / 1000, 0),
    0,
  );
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  "menunggu-verifikasi": "Menunggu Verifikasi",
  "menunggu-pembayaran": "Belum Bayar",
  diproses: "Diproses",
  dikirim: "Dikirim",
  selesai: "Selesai",
  pengembalian: "Pengembalian",
  dibatalkan: "Dibatalkan",
};

export function getOrder(id: string) {
  return ORDERS.find((o) => o.id === id) ?? null;
}
