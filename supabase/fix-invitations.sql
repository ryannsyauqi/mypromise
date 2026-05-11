-- =============================================
-- Create Invitations Table
-- Run this in Supabase SQL Editor if you see "Dashboard Tidak Ditemukan"
-- =============================================

CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  template_id UUID REFERENCES templates(id),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Add RLS Policy (Allow public read by order_id for now to support the "No Auth" model)
CREATE POLICY "Public read invitations by order_id" 
  ON invitations FOR SELECT 
  USING (true);

-- Add update policy (simplified for now)
CREATE POLICY "Public update invitations" 
  ON invitations FOR UPDATE 
  USING (true);

-- Auto-update updated_at
CREATE TRIGGER invitations_updated_at
  BEFORE UPDATE ON invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
