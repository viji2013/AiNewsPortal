-- =====================================================
-- FIX: ADD INSERT POLICY FOR PROFILES
-- =====================================================
-- Allows users to create their own profile during OAuth signup

-- Add INSERT policy so users can create their own profile
CREATE POLICY profiles_insert_own 
  ON profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON POLICY profiles_insert_own ON profiles IS 'Users can INSERT their own profile data during signup';
