-- =====================================================
-- PROFILES TABLE
-- =====================================================
-- Extends Supabase Auth with custom user profile data
-- Linked 1:1 with auth.users table

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Index on phone_number for fast OTP-based authentication lookups
CREATE INDEX idx_profiles_phone_number ON profiles(phone_number);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger that fires before UPDATE on profiles table
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE profiles IS 'User profile data extending Supabase Auth';
COMMENT ON COLUMN profiles.id IS 'References auth.users.id, CASCADE deletes profile when user is deleted';
COMMENT ON COLUMN profiles.phone_number IS 'Unique phone number for OTP authentication';
COMMENT ON INDEX idx_profiles_phone_number IS 'Optimizes phone-based user lookups for authentication';
