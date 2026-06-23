export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  longDate: string;
  author: string;
  image: string;
  tags: string[];
}

const IMG = {
  roof: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=70",
  panels: "https://images.unsplash.com/photo-1581090700227-1e8e2a4a8b2a?auto=format&fit=crop&w=900&q=70",
  ecoHouse: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=70",
  warehouse: "https://images.unsplash.com/photo-1581094651181-35942459ef74?auto=format&fit=crop&w=900&q=70",
  bricks: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=900&q=70",
  house2: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=900&q=70",
};

const PARAGRAPHS = [
  "Mengurangi jejak karbon dengan bahan material dari daur ulang ramah lingkungan namun tetap mempertahankan kualitas dan ketahanan produk merupakan langkah strategis dalam mendukung pembangunan berkelanjutan. Penggunaan material daur ulang tidak hanya membantu meminimalkan limbah yang berakhir di lingkungan, tetapi juga menekan kebutuhan akan sumber daya alam baru yang proses ekstraksinya menghasilkan emisi tinggi.",
  "Melalui inovasi teknologi, material hasil daur ulang kini mampu bersaing dari segi kekuatan, estetika, hingga keamanan, sehingga dapat diaplikasikan pada berbagai kebutuhan konstruksi maupun produk sehari-hari. Selain itu, penerapan material ramah lingkungan juga mendorong perubahan pola pikir industri dan konsumen menuju praktik yang lebih bertanggung jawab.",
  "Pada akhirnya, inovasi material ramah lingkungan merupakan investasi penting untuk masa depan. Dengan mengadopsi material yang lebih bertanggung jawab terhadap lingkungan, kita tidak hanya menjaga kualitas hidup generasi saat ini, tetapi juga memastikan ketersediaan sumber daya bagi generasi mendatang.",
];

export const BLOG_POSTS: BlogArticle[] = [
  {
    slug: "kesalahan-umum-memilih-material-bangunan",
    title: "Kesalahan Umum dalam Memilih Material Bangunan",
    excerpt: "Banyak orang tergiur harga murah tanpa mempertimbangkan kualitas material yang digunakan…",
    content: PARAGRAPHS,
    date: "8 Januari 2026",
    longDate: "8 Januari 2026, 07.45 WIB",
    author: "Bambang Santoso",
    image: IMG.roof,
    tags: ["Material", "Tips", "Bangunan"],
  },
  {
    slug: "panduan-lengkap-mengenal-material-konstruksi",
    title: "Panduan Lengkap Mengenal Material Konstruksi",
    excerpt: "Material konstruksi adalah fondasi utama dalam setiap proyek pembangunan. Dari material struktur seperti beton…",
    content: PARAGRAPHS,
    date: "8 Januari 2026",
    longDate: "8 Januari 2026, 09.00 WIB",
    author: "Bambang Santoso",
    image: IMG.panels,
    tags: ["Material", "Konstruksi", "Panduan"],
  },
  {
    slug: "inovasi-material-ramah-lingkungan",
    title: "Inovasi Material Ramah Lingkungan untuk Masa Depan",
    excerpt: "Mengurangi jejak karbon dengan bahan material dari daur ulang ramah lingkungan namun tetap mempertahankan kualitas dan…",
    content: PARAGRAPHS,
    date: "8 Januari 2026",
    longDate: "18 Januari 2026, 07.45 WIB",
    author: "Bambang Santoso",
    image: IMG.ecoHouse,
    tags: ["Ramah Lingkungan", "Ramah", "Material", "Inovasi"],
  },
  {
    slug: "jenis-material-bangunan-rumah",
    title: "10+ Jenis Material Bangunan Rumah dan Tips Memilihnya",
    excerpt: "Memahami material bangunan rumah merupakan langkah penting saat membangun…",
    content: PARAGRAPHS,
    date: "8 Januari 2026",
    longDate: "11 Februari 2026, 10.20 WIB",
    author: "Bambang Santoso",
    image: IMG.warehouse,
    tags: ["Material", "Tips", "Rumah"],
  },
  {
    slug: "memilih-bata-merah-berkualitas",
    title: "Cara Memilih Bata Merah yang Berkualitas untuk Dinding…",
    excerpt: "Material konstruksi adalah fondasi utama dalam setiap proyek pembangunan. Dari material struktur seperti beton…",
    content: PARAGRAPHS,
    date: "8 Januari 2026",
    longDate: "11 Februari 2026, 11.05 WIB",
    author: "Bambang Santoso",
    image: IMG.bricks,
    tags: ["Bata Merah", "Material", "Dinding"],
  },
  {
    slug: "pondasi-kokoh-rumah-2-lantai",
    title: "Rahasia Pondasi Kokoh untuk Rumah 2 Lantai",
    excerpt: "Mengurangi jejak karbon dengan bahan material dari daur ulang ramah lingkungan namun tetap mempertahankan kualitas dan…",
    content: PARAGRAPHS,
    date: "8 Januari 2026",
    longDate: "11 Februari 2026, 13.10 WIB",
    author: "Bambang Santoso",
    image: IMG.house2,
    tags: ["Pondasi", "Konstruksi", "Rumah"],
  },
];

export function getPostBySlug(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getPostsByTag(tag: string) {
  const t = tag.toLowerCase();
  return BLOG_POSTS.filter((p) => p.tags.some((x) => x.toLowerCase() === t));
}

export function relatedPosts(slug: string, n = 4) {
  return BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, n);
}

export function tagSlug(tag: string) {
  return tag.toLowerCase().replace(/\s+/g, "-");
}

export function tagFromSlug(slug: string) {
  return slug.replace(/-/g, " ");
}