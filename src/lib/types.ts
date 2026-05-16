/* ===========================
   MyPromise — Type Definitions
   =========================== */

// ---- Template Types ----
export interface FieldSchema {
  key: string;
  label: string;
  type: "text" | "textarea" | "date" | "time" | "url" | "file" | "multi_file" | "image" | "gallery" | "select" | "repeater";
  required?: boolean;
  hint?: string;
  placeholder?: string;
  accept?: string;
  max_mb?: number;
  max_files?: number;
  max_items?: number;
  options?: { label: string; value: string }[];
  fields?: Omit<FieldSchema, "fields" | "max_items">[];
}

export interface Template {
  id: string;
  name: string;
  category: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  is_active: boolean;
  field_schema: FieldSchema[];
  thumbnail_url: string;
  demo_url: string;
  created_at: string;
}

// ---- Order Types ----
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type OrderStatus =
  | "awaiting_content"
  | "content_received"
  | "in_progress"
  | "preview_sent"
  | "approved"
  | "live"
  | "delivered";

export interface Order {
  id: string;
  order_number: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  template_id: string;
  amount: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  inv_slug: string | null;
  preview_url: string | null;
  is_live: boolean;
  notes: string | null;
  revision_count: number;
  midtrans_order_id: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  template?: Template;
}

export interface OrderContent {
  id: string;
  order_id: string;
  field_key: string;
  field_value: string;
  created_at: string;
}

export interface Guest {
  id: string;
  order_id: string;
  name: string;
  url_param: string;
  full_url: string;
  created_at: string;
}

export type FileType =
  | "photo_hero"
  | "photo_groom"
  | "photo_bride"
  | "photo_secondary"
  | "photo_closing"
  | "gallery"
  | "music"
  | "guest_list"
  | "other";

export interface OrderFile {
  id: string;
  order_id: string;
  file_type: FileType;
  file_url: string;
  original_name: string;
  sort_order: number;
  created_at: string;
}

export type Attendance = "hadir" | "tidak_hadir" | "belum_pasti";

export interface RSVPResponse {
  id: string;
  order_id: string;
  guest_name: string;
  attendance: Attendance;
  guest_count: number;
  message: string;
  created_at: string;
}

// ---- UI Types ----
export interface NavItem {
  label: string;
  href: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}
