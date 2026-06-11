import type { Product } from "@/components/product/ProductCard";

export interface Address {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  address: string;
  city: string;
  isPrimary?: boolean;
}

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  hours: string;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: number;
  minSpend: number;
  expiresAt: string;
  type: "shipping" | "discount" | "cashback";
}

export interface PaymentMethod {
  id: string;
  name: string;
  category: "QRIS" | "Transfer Bank" | "E-Wallet" | "Tunai";
  description?: string;
  fee?: number;
}

export const ADDRESSES: Address[] = [
  {
    id: "addr-1",
    label: "Auliya Gita",
    recipient: "Auliya Gita",
    phone: "0851234567890",
    address: "Jl. Dr. Wahidin Sudirohusodo No.728A, Dahanrejo, Kec. Kebomas",
    city: "Kabupaten Gresik, Jawa Timur 61122",
    isPrimary: true,
  },
  {
    id: "addr-2",
    label: "Kantor",
    recipient: "Auliya Gita Ananda",
    phone: "+62 812-3456-7890",
    address: "Jl. Raya Darmo No. 90, Gedung Wisma Cendana Lt. 4",
    city: "Surabaya, Jawa Timur, 60264",
  },
  {
    id: "addr-3",
    label: "Proyek Perumahan Citra",
    recipient: "Bagus Pratama",
    phone: "+62 813-9988-7700",
    address: "Jl. Citra Land Blok B2 No. 5",
    city: "Surabaya, Jawa Timur, 60219",
  },
];

export const WAREHOUSES: Warehouse[] = [
  {
    id: "wh-gresik",
    name: "Gudang Utama Semen Gresik",
    address: "Jl. Veteran Sidokumpul, Kebomas, Gresik",
    distanceKm: 3.5,
    hours: "09.00 - 15.00 WIB",
  },
  {
    id: "wh-sby-barat",
    name: "Gudang Surabaya Barat",
    address: "Jl. Margomulyo No. 44, Surabaya",
    distanceKm: 12.7,
    hours: "08.00 - 17.00",
  },
  {
    id: "wh-sidoarjo",
    name: "Gudang Sidoarjo",
    address: "Jl. Raya Waru KM 12, Sidoarjo",
    distanceKm: 15.1,
    hours: "07.30 - 16.30",
  },
];

export const VOUCHERS: Voucher[] = [
  {
    id: "v1",
    code: "GRATISONGKIR",
    title: "Voucher Gratis Ongkir",
    description: "Hemat ongkos kirim s/d Rp 50.000",
    discount: 50000,
    minSpend: 500000,
    expiresAt: "30 Jun 2026",
    type: "shipping",
  },
  {
    id: "v2",
    code: "DISKON10",
    title: "Voucher Diskon 10%",
    description: "Minimal belanja Rp 1.000.000",
    discount: 200000,
    minSpend: 1000000,
    expiresAt: "30 Jun 2026",
    type: "discount",
  },
  {
    id: "v3",
    code: "CASHBACK25",
    title: "Cashback Rp 25.000",
    description: "Minimal belanja Rp 250.000",
    discount: 25000,
    minSpend: 250000,
    expiresAt: "15 Jul 2026",
    type: "cashback",
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "qris", name: "QRIS", category: "QRIS", description: "Scan menggunakan aplikasi e-wallet atau m-banking" },
  { id: "bca-va", name: "BCA Virtual Account", category: "Transfer Bank" },
  { id: "mandiri-va", name: "Mandiri Virtual Account", category: "Transfer Bank" },
  { id: "bni-va", name: "BNI Virtual Account", category: "Transfer Bank" },
  { id: "gopay", name: "GoPay", category: "E-Wallet" },
  { id: "ovo", name: "OVO", category: "E-Wallet" },
  { id: "dana", name: "DANA", category: "E-Wallet" },
  { id: "tunai-mitra", name: "Bayar Tunai di Mitra/Agen", category: "Tunai", description: "Bayar langsung di mitra Bahan Material terdekat" },
];

export interface CartProduct extends Product {
  qty: number;
  unit: string;
  variant?: string;
  /** Weight per single unit in kg. Used to compute tonase. */
  weightKg?: number;
}

export const DEMO_CART: CartProduct[] = [
  {
    id: "semen-gresik-pcc",
    name: "Semen Gresik PCC",
    price: 60500,
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&q=70",
    warehouse: "Gudang Cabang Gresik",
    qty: 120,
    unit: "Sak",
    variant: "50 Kg",
    weightKg: 50,
  },
  {
    id: "semen-merdeka-pcc",
    name: "Semen Merdeka PCC",
    price: 62500,
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&q=70",
    warehouse: "Gudang Cabang Gresik",
    qty: 100,
    unit: "Sak",
    variant: "40 Kg",
    weightKg: 40,
  },
  {
    id: "closet-duduk-volk",
    name: "Closet Duduk Volk",
    price: 750600,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=70",
    warehouse: "Gudang Cabang Surabaya",
    qty: 1,
    unit: "Pcs",
    variant: "Putih",
    weightKg: 25,
  },
];

/** Estimated per-warehouse delivery fee (used pre-verification display). */
export const ESTIMATED_GROUP_SHIPPING_FEE = 85000;
