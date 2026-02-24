# Delete admin users and recreate owner (owner@bixlay.com)

Use this when you need to remove admin/owner users and set **owner@bixlay.com** as the only owner with full access.

---

## 1. Delete admin users

Admin users exist in two places:

- **Supabase Auth** (Authentication → Users)
- **`admin_profiles`** table (links `user_id` to role)

### Option A: Remove admin access only (user can still sign in as customer)

In Supabase Dashboard → **SQL Editor**, run:

```sql
-- Remove from admin_profiles (they lose admin access; Auth user stays)
DELETE FROM public.admin_profiles
WHERE email = 'someone@example.com';
```

Replace `someone@example.com` with the email to remove. To remove **all** admins except the one you’ll recreate:

```sql
DELETE FROM public.admin_profiles;
```

### Option B: Delete the user completely (Auth + admin_profiles)

1. In Supabase Dashboard go to **Authentication** → **Users**.
2. Find the user by email and open them.
3. Click **Delete user** (or use the three-dots menu).
4. Then remove their row from `admin_profiles` in **SQL Editor**:

   ```sql
   DELETE FROM public.admin_profiles
   WHERE email = 'someone@example.com';
   ```

If you deleted **all** users from Auth, you can skip the `admin_profiles` delete (there will be no matching rows).

---

## 2. Recreate owner as owner@bixlay.com

### Prerequisites

- **`.env.local`** must have:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (from Supabase → Project Settings → API → service_role)
- Migration **`supabase/migrations/20250223000000_admin_profiles.sql`** has been applied (table `admin_profiles` exists).

### Run the script

From the **project root**:

```bash
ADMIN_EMAIL=owner@bixlay.com ADMIN_PASSWORD=YourSecurePassword node scripts/create-owner.js
```

- Replace `YourSecurePassword` with a password (min 6 characters).
- If **owner@bixlay.com** already exists in Supabase Auth, the script will **promote** them to owner (upsert `admin_profiles` with `role = 'owner'`).
- If they don’t exist, the script creates the user in Auth and adds an owner row in `admin_profiles`.

### Sign in

1. Open **/admin/login**.
2. Email: **owner@bixlay.com**
3. Password: the one you set in `ADMIN_PASSWORD`.

---

## 3. Using only SQL (no script)

If you prefer not to run the script:

### Create the user in Supabase Auth

1. **Authentication** → **Users** → **Add user** → **Create new user**.
2. Email: **owner@bixlay.com**
3. Password: choose a secure password.
4. Confirm the user (e.g. set “Auto Confirm User” or confirm via email if required).

### Add them as owner in the database

In **SQL Editor** run (replace `USER_UUID` with the new user’s UUID from Authentication → Users):

```sql
INSERT INTO public.admin_profiles (user_id, email, role)
VALUES ('USER_UUID', 'owner@bixlay.com', 'owner')
ON CONFLICT (user_id) DO UPDATE SET role = 'owner', email = 'owner@bixlay.com';
```

Example:

```sql
INSERT INTO public.admin_profiles (user_id, email, role)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'owner@bixlay.com', 'owner')
ON CONFLICT (user_id) DO UPDATE SET role = 'owner', email = 'owner@bixlay.com';
```

Then sign in at **/admin/login** with **owner@bixlay.com** and the password you set.

---

## Summary

| Goal | Action |
|------|--------|
| Remove one admin | `DELETE FROM admin_profiles WHERE email = '...';` or delete user in Auth then delete from `admin_profiles`. |
| Remove all admins | `DELETE FROM admin_profiles;` and optionally delete users in Auth. |
| Create/promote owner@bixlay.com | `ADMIN_EMAIL=owner@bixlay.com ADMIN_PASSWORD=xxx node scripts/create-owner.js` |
| Same using only SQL | Create user in Auth, then `INSERT INTO admin_profiles ... ON CONFLICT DO UPDATE ...` with `role = 'owner'`. |

After this, **owner@bixlay.com** has full access (Settings, Team, Customers, Products, Orders, etc.).
