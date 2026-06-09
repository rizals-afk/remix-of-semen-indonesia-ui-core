import type { Category } from "@/components/product/CategoryTile";
import type { Product } from "@/components/product/ProductCard";
import type { Spec } from "@/components/product/SpecsTable";
import type { Review } from "@/components/review/ReviewItem";
import type { BlogPost } from "@/components/common/BlogCard";

/**
 * Static demo data extracted directly from the uploaded UI screens
 * (product names, prices, warehouses, category labels).
 * Replace with real API responses once the backend is connected.
 */

const PLACEHOLDER = "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&q=70";

export const CATEGORIES: Category[] = [
  { slug: "semen", label: "Semen", image: PLACEHOLDER },
  { slug: "baja-ringan", label: "Baja Ringan", image: PLACEHOLDER },
  { slug: "mortar", label: "Mortar", image: PLACEHOLDER },
  { slug: "bata-ringan", label: "Bata Ringan", image: PLACEHOLDER },
  { slug: "besi", label: "Besi", image: PLACEHOLDER },
  { slug: "produk-atap", label: "Produk Atap", image: PLACEHOLDER },
  { slug: "produk-lantai", label: "Produk Lantai", image: PLACEHOLDER },
  { slug: "cat", label: "Cat", image: PLACEHOLDER },
  { slug: "sanitari", label: "Sanitari", image: PLACEHOLDER },
  { slug: "produk-beton", label: "Produk Beton", image: PLACEHOLDER },
  { slug: "aksesoris-pintu-jendela", label: "Aksesoris Pintu & Jendela", image: PLACEHOLDER },
  { slug: "peralatan-perkakas", label: "Peralatan & Perkakas", image: PLACEHOLDER },
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: "semen-merah-putih",
    name: "Semen Merah Putih",
    price: 100000,
    originalPrice: 120000,
    discountPercent: 17,
    image: PLACEHOLDER,
    warehouse: "Gudang Gresik",
    rating: 4.8,
  },
  { id: "bata-ringan", name: "Bata Ringan", price: 100000, image: PLACEHOLDER, warehouse: "Gudang Gresik", rating: 4.7 },
  { id: "mortar-perekat", name: "Mortar Perekat", price: 100000, image: PLACEHOLDER, warehouse: "Gudang Gresik", rating: 4.6 },
  { id: "atap-upvc", name: "Atap UPVC", price: 100000, image: PLACEHOLDER, warehouse: "Gudang Gresik", rating: 4.5 },
  { id: "kanal-c", name: "Kanal C", price: 100000, image: PLACEHOLDER, warehouse: "Gudang Gresik", rating: 4.4 },
  { id: "besi", name: "Besi", price: 100000, image: PLACEHOLDER, warehouse: "Gudang Gresik", rating: 4.6 },
  { id: "semen-merdeka", name: "Semen Merdeka", price: 100000, image: PLACEHOLDER, warehouse: "Gudang Gresik", rating: 4.7 },
];

const WAREHOUSES = [
  "Gudang Gresik",
  "Gudang Surabaya",
  "Gudang Madiun",
  "Gudang Sidoarjo",
  "Gudang Lamongan",
  "Gudang Mojokerto",
  "Gudang Pasuruan",
];

/** Larger product catalog used for the search / listing page. */
export const ALL_PRODUCTS: Product[] = [
  ...FEATURED_PRODUCTS,
  ...Array.from({ length: 18 }).map((_, i) => ({
    id: `semen-gresik-${i + 1}`,
    name: "Semen Gresik",
    price: 55000 + i * 1500,
    originalPrice: i % 3 === 0 ? 70000 + i * 1500 : undefined,
    discountPercent: i % 3 === 0 ? 15 : undefined,
    image: PLACEHOLDER,
    warehouse: WAREHOUSES[i % WAREHOUSES.length],
    rating: 4.5 + ((i % 5) * 0.1),
    categorySlug: i % 2 === 0 ? "semen" : "mortar",
  })),
];

export interface ProductDetail extends Product {
  categorySlug: string;
  categoryLabel: string;
  subCategory?: string;
  images: string[];
  stock: number;
  sold: number;
  reviewCount: number;
  variants?: string[];
  description: string;
  specs: Spec[];
  reviews: Review[];
  satisfactionPercent: number;
  shippingFrom: string;
  shippingDistanceKm: number;
  shippingMethod: string;
  shippingEta: string;
}

const REVIEW_PHOTO = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200&q=70";

export const PRODUCT_DETAILS: Record<string, ProductDetail> = {
  "semen-gresik-pcc": {
    id: "semen-gresik-pcc",
    name: "Semen Gresik PCC",
    price: 60500,
    originalPrice: 69540,
    discountPercent: 17,
    image: PLACEHOLDER,
    warehouse: "Gudang Surabaya Barat",
    rating: 4.8,
    categorySlug: "semen",
    categoryLabel: "Semen",
    subCategory: "Semen Portland",
    images: [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER],
    stock: 2500,
    sold: 20,
    reviewCount: 17,
    variants: ["40 Kg", "50 Kg"],
    description:
      "Semen Gresik merupakan semen berkualitas tinggi yang diproduksi dengan teknologi modern dan standar mutu nasional. Cocok digunakan untuk berbagai kebutuhan konstruksi, mulai dari pembangunan rumah, gedung, jalan, hingga proyek infrastruktur skala besar. Dikenal dengan daya rekat kuat, hasil akhir yang halus, dan ketahanan tinggi terhadap cuaca, Semen Gresik menjadi pilihan terpercaya para profesional konstruksi di Indonesia.\n\nKeunggulan:\n• Kuat dan tahan lama\n• Mudah diaplikasikan\n• Hasil bangunan lebih kokoh dan rapi\n• Sesuai untuk berbagai jenis pekerjaan konstruksi",
    specs: [
      { label: "Satuan", value: "Sak" },
      { label: "Pembelian Minimal", value: "200 Sak" },
      { label: "Kelipatan Pembelian", value: "200 Sak" },
      { label: "Dimensi Produk", value: "40 cm x 20 cm x 10 cm" },
      { label: "Berat", value: "50 Kg" },
      { label: "Merk", value: "Gresik" },
      { label: "Kategori", value: "Semen" },
    ],
    reviews: [
      {
        id: "r1",
        author: "Budi Santoso",
        rating: 5,
        date: "2 hari yang lalu",
        body: "Semennya kualitas bagus, daya rekat kuat. Dipakai untuk pengecoran teras rumah hasilnya padat dan tidak mudah retak. Pengiriman juga cepat dan karung tidak rusak.",
        photos: [REVIEW_PHOTO, REVIEW_PHOTO],
      },
      {
        id: "r2",
        author: "Anton",
        rating: 5,
        date: "25-12-28 16:27",
        body: "Semennya kualitas bagus, daya rekat kuat. Dipakai untuk pengecoran teras rumah hasilnya padat dan tidak mudah retak. Pengiriman juga cepat dan karung tidak rusak.",
        photos: [REVIEW_PHOTO, REVIEW_PHOTO],
      },
      {
        id: "r3",
        author: "Citra",
        rating: 4,
        date: "1 minggu yang lalu",
        body: "Kualitas baik, harga bersaing. Recommended.",
      },
    ],
    satisfactionPercent: 98,
    shippingFrom: "Gudang Surabaya Barat",
    shippingDistanceKm: 3.5,
    shippingMethod: "Armada Toko Engkel",
    shippingEta: "Estimasi Tiba: Besok, 10.00 - 14.00",
  },
};

/** Look up a product detail by slug, falling back to a synthesised one. */
export function getProductDetail(slug: string): ProductDetail {
  if (PRODUCT_DETAILS[slug]) return PRODUCT_DETAILS[slug];
  const base =
    ALL_PRODUCTS.find((p) => p.id === slug) ?? PRODUCT_DETAILS["semen-gresik-pcc"];
  return {
    ...PRODUCT_DETAILS["semen-gresik-pcc"],
    id: base.id,
    name: base.name,
    price: base.price,
    originalPrice: base.originalPrice,
    discountPercent: base.discountPercent,
    warehouse: base.warehouse,
    rating: base.rating ?? 4.8,
  };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "inovasi-ramah-lingkungan",
    title: "Inovasi Material Ramah Lingkungan Untuk Masa Depan",
    excerpt:
      "Mengurangi jejak karbon dengan bahan material dari daur ulang ramah lingkungan namun, tetap kuat dan tahan lama.",
    date: "18 Januari 2026",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=70",
  },
  {
    id: "jenis-bangunan-rumah",
    title: "10+ Jenis Material Bangunan Rumah dan Tips Memilihnya",
    excerpt:
      "Memahami material bangunan rumah merupakan langkah penting saat membangun rumah idaman keluarga.",
    date: "9 Januari 2026",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=70",
  },
  {
    id: "pondasi-kokoh",
    title: "Rahasia Pondasi Kokoh untuk Rumah 2 Lantai",
    excerpt:
      "Memahami material bangunan rumah merupakan langkah penting saat membangun rumah idaman.",
    date: "9 Januari 2026",
    image: "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=800&q=70",
  },
];

export const PARTNER_BRANDS = [
  "DYNAMIX",
  "CITICON",
  "Semen Tonasa",
  "Semen Gresik",
  "SIG",
  "Semen Padang",
  "BLESSCON",
  "Grand Elephant",
  "APLUS",
];
