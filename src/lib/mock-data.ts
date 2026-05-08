/* ===========================
   MyPromise — Mock Data
   Used for development before Supabase is connected
   =========================== */

import { Template, Order, RSVPResponse } from "./types";

// ---- Mock Templates ----
export const mockTemplates: Template[] = [
  {
    id: "tpl-001",
    name: "Minimalist Elegance",
    category: "Minimalist",
    slug: "minimalist-elegance",
    description:
      "Desain bersih dan elegan dengan tipografi serif yang mewah. Foto pasangan menjadi fokus utama dengan overlay hangat dan layout yang modern.",
    price: 119000,
    is_active: true,
    field_schema: [
      { key: "groom_name", label: "Nama Panggilan Mempelai Pria", type: "text", required: true },
      { key: "bride_name", label: "Nama Panggilan Mempelai Wanita", type: "text", required: true },
      { key: "groom_full_name", label: "Nama Lengkap Mempelai Pria", type: "text", required: true },
      { key: "bride_full_name", label: "Nama Lengkap Mempelai Wanita", type: "text", required: true },
      { key: "groom_parents", label: "Nama Orang Tua Mempelai Pria", type: "text", required: true, hint: "Contoh: Bapak Ahmad & Ibu Sari" },
      { key: "bride_parents", label: "Nama Orang Tua Mempelai Wanita", type: "text", required: true },
      { key: "akad_date", label: "Tanggal Akad", type: "date", required: true },
      { key: "akad_time", label: "Waktu Akad", type: "time", required: true },
      { key: "akad_venue", label: "Nama Tempat Akad", type: "text", required: true },
      { key: "akad_address", label: "Alamat Lengkap Akad", type: "textarea", required: true },
      { key: "reception_date", label: "Tanggal Resepsi", type: "date", required: true },
      { key: "reception_time", label: "Waktu Resepsi", type: "time", required: true },
      { key: "reception_venue", label: "Nama Tempat Resepsi", type: "text", required: true },
      { key: "reception_address", label: "Alamat Lengkap Resepsi", type: "textarea", required: true },
      { key: "maps_link", label: "Link Google Maps Venue", type: "url", required: false },
      { key: "love_quote", label: "Kutipan / Ayat / Quote", type: "textarea", required: false, hint: "Ayat Al-Quran, puisi, atau kata-kata favorit kalian." },
      { key: "bank_account_1", label: "Rekening 1", type: "text", required: false, hint: "Format: Nama Bank — Nomor Rekening — Nama Pemilik" },
      { key: "bank_account_2", label: "Rekening 2", type: "text", required: false },
    ],
    thumbnail_url: "/images/templates/minimalist-elegance.png",
    demo_url: "/demo/minimalist-elegance",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "tpl-002",
    name: "Javanese Royal",
    category: "Traditional",
    slug: "javanese-royal",
    description:
      "Sentuhan tradisional Jawa yang anggun dengan motif batik halus dan ornamen emas. Cocok untuk pernikahan adat yang elegan.",
    price: 149000,
    is_active: true,
    field_schema: [],
    thumbnail_url: "/images/templates/javanese-royal.png",
    demo_url: "/demo/javanese-royal",
    created_at: "2026-01-15T00:00:00Z",
  },
  {
    id: "tpl-003",
    name: "Garden Romance",
    category: "Romantic",
    slug: "garden-romance",
    description:
      "Tema taman romantis dengan ilustrasi bunga watercolor dan nuansa pastel yang lembut. Sempurna untuk pasangan yang menyukai keindahan alam.",
    price: 199000,
    is_active: true,
    field_schema: [],
    thumbnail_url: "/images/templates/garden-romance.png",
    demo_url: "/demo/garden-romance",
    created_at: "2026-02-01T00:00:00Z",
  },
  {
    id: "tpl-004",
    name: "Modern Luxe",
    category: "Minimalist",
    slug: "modern-luxe",
    description:
      "Desain ultra-modern dengan aksen gold dan layout yang dramatis. Foto full-bleed dengan tipografi bold untuk pasangan yang berani tampil beda.",
    price: 119000,
    is_active: true,
    field_schema: [],
    thumbnail_url: "/images/templates/modern-luxe.png",
    demo_url: "/demo/modern-luxe",
    created_at: "2026-02-15T00:00:00Z",
  },
  {
    id: "tpl-005",
    name: "Rustic Charm",
    category: "Romantic",
    slug: "rustic-charm",
    description:
      "Nuansa rustic dengan tekstur kayu, tanaman hijau, dan cahaya hangat. Ideal untuk outdoor wedding atau intimate garden party.",
    price: 149000,
    is_active: true,
    field_schema: [],
    thumbnail_url: "/images/templates/rustic-charm.png",
    demo_url: "/demo/rustic-charm",
    created_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "tpl-006",
    name: "Islamic Grace",
    category: "Traditional",
    slug: "islamic-grace",
    description:
      "Desain Islami yang anggun dengan kaligrafi bismillah, ornamen geometris, dan warna hijau sage yang menenangkan.",
    price: 199000,
    is_active: true,
    field_schema: [],
    thumbnail_url: "/images/templates/islamic-grace.png",
    demo_url: "/demo/islamic-grace",
    created_at: "2026-03-15T00:00:00Z",
  },
];

// ---- Mock RSVP Responses ----
export const mockRSVPResponses: RSVPResponse[] = [
  {
    id: "rsvp-001",
    order_id: "ord-001",
    guest_name: "Pak Rudi",
    attendance: "hadir",
    guest_count: 2,
    message: "Selamat untuk kalian berdua! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin 🤍",
    created_at: "2026-05-01T10:00:00Z",
  },
  {
    id: "rsvp-002",
    order_id: "ord-001",
    guest_name: "Bu Sari",
    attendance: "hadir",
    guest_count: 3,
    message: "Barakallah! Semoga pernikahannya diberkahi Allah SWT. InsyaAllah hadir ya!",
    created_at: "2026-05-01T11:30:00Z",
  },
  {
    id: "rsvp-003",
    order_id: "ord-001",
    guest_name: "Tante Lina",
    attendance: "belum_pasti",
    guest_count: 1,
    message: "Selamat ya nak! Doakan Tante bisa hadir ya 🙏",
    created_at: "2026-05-02T09:00:00Z",
  },
];

// ---- Pricing ----
export const INVITATION_PRICE = 175000;

export const PRICE_FEATURES = [
  "Undangan digital premium",
  "Link personal untuk setiap tamu",
  "RSVP & ucapan online",
  "Galeri foto (maks. 10 foto)",
  "Musik latar",
  "Countdown timer",
  "Google Calendar integration",
  "2x revisi gratis",
  "Aktif 12 bulan",
];

// ---- Format Helpers ----
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
