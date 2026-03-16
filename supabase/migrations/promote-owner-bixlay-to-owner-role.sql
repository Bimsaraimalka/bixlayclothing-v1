-- Promote owner@bixlay.com to owner role (fixes "admin" with no access to Settings).
-- Run this in Supabase SQL Editor if that account was created with role 'admin'.
update public.admin_profiles
set role = 'owner'
where email = 'owner@bixlay.com';
