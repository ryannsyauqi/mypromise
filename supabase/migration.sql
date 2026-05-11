-- =============================================
-- MyPromise Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. Templates
-- =============================================
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 175000,
  is_active BOOLEAN NOT NULL DEFAULT true,
  field_schema JSONB NOT NULL DEFAULT '[]'::jsonb,
  thumbnail_url TEXT,
  demo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 2. Orders
-- =============================================
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE order_status AS ENUM (
  'awaiting_content', 'content_received', 'in_progress',
  'preview_sent', 'approved', 'live', 'delivered'
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  template_id UUID NOT NULL REFERENCES templates(id),
  amount INTEGER NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  order_status order_status NOT NULL DEFAULT 'awaiting_content',
  inv_slug TEXT UNIQUE,
  preview_url TEXT,
  is_live BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  revision_count INTEGER NOT NULL DEFAULT 0,
  midtrans_order_id TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 3. Order Content
-- =============================================
CREATE TABLE order_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  field_key TEXT NOT NULL,
  field_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_content_order_id ON order_content(order_id);

-- =============================================
-- 3b. Invitations
-- =============================================
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  template_id UUID REFERENCES templates(id),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invitations_order_id ON invitations(order_id);

CREATE TRIGGER invitations_updated_at
  BEFORE UPDATE ON invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 4. Guests
-- =============================================
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url_param TEXT NOT NULL,
  full_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_guests_order_id ON guests(order_id);

-- =============================================
-- 5. Order Files
-- =============================================
CREATE TYPE file_type AS ENUM (
  'photo_hero', 'photo_groom', 'photo_bride', 'photo_secondary',
  'photo_closing', 'gallery', 'music', 'guest_list', 'other'
);

CREATE TABLE order_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  file_type file_type NOT NULL,
  file_url TEXT NOT NULL,
  original_name TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_files_order_id ON order_files(order_id);

-- =============================================
-- 6. RSVP Responses
-- =============================================
CREATE TYPE attendance_status AS ENUM ('hadir', 'tidak_hadir', 'belum_pasti');

CREATE TABLE rsvp_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  attendance attendance_status NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rsvp_order_id ON rsvp_responses(order_id);

-- =============================================
-- Reserved slugs check function
-- =============================================
CREATE OR REPLACE FUNCTION check_reserved_slug()
RETURNS TRIGGER AS $$
DECLARE
  reserved_words TEXT[] := ARRAY[
    'templates', 'order', 'admin', 'login', 'api',
    'demo', 'about', 'pricing'
  ];
BEGIN
  IF NEW.inv_slug = ANY(reserved_words) THEN
    RAISE EXCEPTION 'Slug "%" is a reserved word', NEW.inv_slug;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_slug_reserved
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW
  WHEN (NEW.inv_slug IS NOT NULL)
  EXECUTE FUNCTION check_reserved_slug();

-- =============================================
-- Row Level Security (RLS)
-- =============================================
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

-- Public read for templates
CREATE POLICY "Templates are viewable by everyone"
  ON templates FOR SELECT USING (true);

-- Public read for live orders (invitation pages)
CREATE POLICY "Live orders are viewable"
  ON orders FOR SELECT USING (is_live = true);

-- Public read for content of live orders
CREATE POLICY "Content of live orders is viewable"
  ON order_content FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_content.order_id AND orders.is_live = true
  ));

-- Public access for invitations via UUID (No Auth model)
CREATE POLICY "Public access to invitations"
  ON invitations FOR SELECT USING (true);

CREATE POLICY "Public update to invitations"
  ON invitations FOR UPDATE USING (true);

CREATE POLICY "Public insert to invitations"
  ON invitations FOR INSERT WITH CHECK (true);

-- Public read for guests of live orders
CREATE POLICY "Guests of live orders are viewable"
  ON guests FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = guests.order_id AND orders.is_live = true
  ));

-- Public read for files of live orders
CREATE POLICY "Files of live orders are viewable"
  ON order_files FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_files.order_id AND orders.is_live = true
  ));

-- RSVP: anyone can insert, public read for live orders
CREATE POLICY "Anyone can submit RSVP"
  ON rsvp_responses FOR INSERT WITH CHECK (true);

CREATE POLICY "RSVP responses are viewable for live orders"
  ON rsvp_responses FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = rsvp_responses.order_id AND orders.is_live = true
  ));

-- Admin full access (service role bypasses RLS)
-- No additional policies needed for admin — use service_role key
