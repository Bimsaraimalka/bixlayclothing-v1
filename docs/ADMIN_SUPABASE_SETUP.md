# How to set up admin on Supabase

The admin panel (Dashboard, Products, Orders) uses **Supabase** for data. Admin **login** uses a local check (email/password in code), not Supabase Auth. Follow these steps so admin works with your Supabase project.

---

## 1. Create a Supabase project (if you don’t have one)

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**, choose org, name, database password, region.
3. Wait for the project to be ready.

---

## 2. Get your project URL and anon key

1. In the Supabase dashboard, open your project.
2. Go to **Project Settings** (gear icon) → **API**.
3. Copy:
   - **Project URL** (e.g. `https://xxxxx.supabase.co`)
   - **Project API keys** → **anon** **public** (use the long JWT that starts with `eyJ...`, or the one labeled “anon key (legacy)”).

---

## 3. Add env vars in your app

In your project root, create or edit **`.env.local`**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Paste your **Project URL** and **anon public** key. Restart the dev server after saving.

---

## 4. Create the database tables (required for admin)

The admin needs **`products`** and **`orders`** tables in Supabase.

1. In the Supabase dashboard, open **SQL Editor**.
2. Click **New query**.
3. Copy the **entire** contents of this file from your repo:
   - **`supabase/migrations/20250220000000_products_orders.sql`**
4. Paste into the SQL Editor and click **Run** (or press Cmd/Ctrl + Enter).

You should see “Success. No rows returned.” That creates:

- **`public.products`** – id, name, category, price, stock, status, colors, sizes  
- **`public.orders`** – id, customer, email, amount, status, date  
- **Row Level Security (RLS)** policies so the app (using the anon key) can read/write these tables.

---

## 5. Log in to the admin

1. Start your app: `npm run dev`.
2. Open **http://localhost:3000/admin**.
3. You’ll be redirected to **http://localhost:3000/admin/login**.
4. Sign in with:
   - **Email:** `admin@bixlay.com`
   - **Password:** `admin123`

After login you’ll see the Dashboard; Products and Orders will load from Supabase.

---

## 5b. Create the storage bucket (for product images)

Product image uploads in Admin → Products need a **Storage bucket** in Supabase. If you see **"Bucket not found"** when uploading images, create the bucket:

1. In the Supabase dashboard, go to **Storage** → **New bucket**.
2. Set **Name** to exactly: **`library-images`**.
3. Turn **Public bucket** **ON**, then click **Create bucket**.
4. Add policies so the app can upload and read: in **Storage** → **Policies** (or SQL Editor), run:

```sql
create policy "Public read" on storage.objects for select to public using (bucket_id = 'library-images');
create policy "Anon upload" on storage.objects for insert to anon with check (bucket_id = 'library-images');
create policy "Anon delete" on storage.objects for delete to anon using (bucket_id = 'library-images');
```

Then try uploading a product image again.

---

## 6. What the admin uses in Supabase

| Feature            | Supabase usage                                          |
|--------------------|---------------------------------------------------------|
| Dashboard          | Reads `products` and `orders`                           |
| Products           | List, add, update, delete in `products`                  |
| Product images     | Upload/store files in Storage bucket `library-images`   |
| Orders             | List orders, update status in `orders`                  |
| Checkout (store)   | Inserts new rows into `orders`                          |

Admin **authentication** (who can open /admin) is **not** in Supabase; it’s the fixed email/password above. To use Supabase Auth for admin later, you’d add a separate “admin login” flow that checks a Supabase user or role.

---

## Optional: Create an admin user in Supabase Auth

To create a user in Supabase Auth (e.g. for future use or for API access):

1. In Supabase Dashboard → **Project Settings** → **API**, copy the **service_role** key (keep it secret).
2. Add to **`.env.local`** (do not commit):
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
3. From the project root run:
   ```bash
   npm run create-admin
   ```
   Or with a custom email/password:
   ```bash
   ADMIN_EMAIL=admin@bixlay.com ADMIN_PASSWORD=yourpassword node scripts/create-admin-user.js
   ```

This creates a user in Supabase Auth with `user_metadata: { role: 'admin' }`. The current `/admin` login still uses the built-in credentials; this script is for having an admin user in Supabase if you later switch admin to Supabase Auth.

---

## Troubleshooting

- **“Missing NEXT_PUBLIC_SUPABASE_URL or anon key”**  
  Add both to `.env.local` and restart the dev server.

- **“Failed to load data” / empty Products or Orders**  
  1. Run the migration SQL in the Supabase SQL Editor (step 4).  
  2. In Supabase **Table Editor**, confirm `products` and `orders` exist.  
  3. Check **Authentication → Policies** (or the SQL in the migration) so RLS allows `anon` to select/insert/update/delete on these tables.

- **Admin login not working**  
  Use exactly `admin@bixlay.com` and `admin123` (no extra spaces). If it still fails, check the browser console and that you’re on `http://localhost:3000/admin/login`.

- **"Bucket not found" (StorageApiError)** when uploading product images: create the Storage bucket **\`library-images\`** (Storage → New bucket, set Public ON) and add the policies in section **5b** above.
