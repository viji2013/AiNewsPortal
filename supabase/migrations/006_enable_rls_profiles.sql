-- =====================================================
-- ROW-LEVEL SECURITY: PROFILES TABLE
-- =====================================================
-- Ensures users can only access and modify their own profile data
-- No DELETE policy - prevents profile deletion

-- Enable Row-Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SELECT POLICY
-- =====================================================
-- Users can view their own profile
CREATE POLICY profiles_select_own 
  ON profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- =====================================================
-- UPDATE POLICY
-- =====================================================
-- Users can update their own profile
CREATE POLICY profiles_update_own 
  ON profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON POLICY profiles_select_own ON profiles IS 'Users can SELECT only their own profile data';
COMMENT ON POLICY profiles_update_own ON profiles IS 'Users can UPDATE only their own profile data';
