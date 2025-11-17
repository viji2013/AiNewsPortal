-- Make a user an admin
-- Replace 'YOUR_EMAIL_HERE' with your actual email address

-- Option 1: Make admin by email
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'YOUR_EMAIL_HERE'
);

-- Option 2: Make the first user admin (if you only have one account)
-- Uncomment the line below if you want to use this option instead
-- UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users ORDER BY created_at LIMIT 1);

-- Verify the change
SELECT 
  u.email,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.role = 'admin';
