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
  category: "Virtual Account" | "E-Wallet" | "Transfer Manual" | "Kredit";
  logo?: string;
  fee?: number;
  description?: string;
}

export const ADDRESSES: Address[] = [
  {
    id: "addr-1",
    label: "Rumah",
    recipient: "Auliya Gita Ananda",
    phone: "+62 812-3456-7890",
    address: "Jl. Veteran No. 17, RT 03 / RW 02, Sidokumpul",
    city: "Gresik, Jawa Timur, 61111",
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
    id: "wh-sby-barat",
    name: "Gudang Surabaya Barat",
    address: "Jl. Margomulyo No. 44, Surabaya",
    distanceKm: 3.5,
    hours: "08.00 - 17.00",
  },
  {
    id: "wh-gresik",
    name: "Gudang Gresik",
    address: "Jl. Veteran No. 100, Gresik",
    distanceKm: 8.2,
    hours: "08.00 - 17.00",
  },
  {
    id: "wh-sidoarjo",
    name: "Gudang Sidoarjo",
    address: "Jl. Raya Waru KM 12, Sidoarjo",
    distanceKm: 15.1,
    hours: "07.30 - 16.30",
  },
  {
    id: "wh-mojokerto",
    name: "Gudang Mojokerto",
    address: "Jl. Raya Bypass No. 22, Mojokerto",
    distanceKm: 38.4,
    hours: "08.00 - 17.00",
  },
];

export const VOUCHERS: Voucher[] = [
  {
    id: "v1",
    code: "GRATISONGKIR",
    title: "Gratis Ongkir s/d Rp 50.000",
    description: "Minimal belanja Rp 500.000",
    discount: 50000,
    minSpend: 500000,
    expiresAt: "30 Jun 2026",
    type: "shipping",
  },
  {
    id: "v2",
    code: "DISKON10",
    title: "Diskon 10% s/d Rp 100.000",
    description: "Minimal belanja Rp 1.000.000",
    discount: 100000,
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
  { id: "bca-va", name: "BCA Virtual Account", category: "Virtual Account", fee: 4000 },
  { id: "mandiri-va", name: "Mandiri Virtual Account", category: "Virtual Account", fee: 4000 },
  { id: "bni-va", name: "BNI Virtual Account", category: "Virtual Account", fee: 4000 },
  { id: "bri-va", name: "BRI Virtual Account", category: "Virtual Account", fee: 4000 },
  { id: "gopay", name: "GoPay", category: "E-Wallet", fee: 0 },
  { id: "ovo", name: "OVO", category: "E-Wallet", fee: 0 },
  { id: "dana", name: "DANA", category: "E-Wallet", fee: 0 },
  { id: "shopeepay", name: "ShopeePay", category: "E-Wallet", fee: 0 },
  { id: "transfer", name: "Transfer Bank Manual", category: "Transfer Manual", fee: 0, description: "Konfirmasi manual setelah transfer" },
  { id: "kredivo", name: "Kredivo (Cicilan)", category: "Kredit", fee: 0, description: "Cicilan 3, 6, 12 bulan" },
];

export interface CartProduct extends Product {
  qty: number;
  unit: string;
}

export const DEMO_CART: CartProduct[] = [
  {
    id: "semen-gresik-pcc",
    name: "Semen Gresik PCC 50 Kg",
    price: 60500,
    originalPrice: 69540,
    discountPercent: 17,
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&q=70",
    warehouse: "Gudang Surabaya Barat",
    qty: 200,
    unit: "Sak",
  },
  {
    id: "bata-ringan",
    name: "Bata Ringan AAC 60x20x10",
    price: 9500,
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&q=70",
    warehouse: "Gudang Surabaya Barat",
    qty: 300,
    unit: "Pcs",
  },
];
