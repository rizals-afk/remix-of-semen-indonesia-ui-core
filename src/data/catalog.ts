import type { Category } from "@/components/product/CategoryTile";
import type { Product } from "@/components/product/ProductCard";
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
  },
  {
    id: "bata-ringan",
    name: "Bata Ringan",
    price: 100000,
    image: PLACEHOLDER,
    warehouse: "Gudang Gresik",
  },
  {
    id: "mortar-perekat",
    name: "Mortar Perekat",
    price: 100000,
    image: PLACEHOLDER,
    warehouse: "Gudang Gresik",
  },
  {
    id: "atap-upvc",
    name: "Atap UPVC",
    price: 100000,
    image: PLACEHOLDER,
    warehouse: "Gudang Gresik",
  },
  {
    id: "kanal-c",
    name: "Kanal C",
    price: 100000,
    image: PLACEHOLDER,
    warehouse: "Gudang Gresik",
  },
  {
    id: "besi",
    name: "Besi",
    price: 100000,
    image: PLACEHOLDER,
    warehouse: "Gudang Gresik",
  },
  {
    id: "semen-merdeka",
    name: "Semen Merdeka",
    price: 100000,
    image: PLACEHOLDER,
    warehouse: "Gudang Gresik",
  },
];

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
