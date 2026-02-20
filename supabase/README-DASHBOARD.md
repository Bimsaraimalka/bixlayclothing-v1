# Create products & orders tables for the admin dashboard

The admin dashboard (and storefront) need **`products`** and **`orders`** tables in Supabase.

## Steps

1. Open **[Supabase Dashboard](https://supabase.com/dashboard)** and select your project.
2. In the left sidebar click **SQL Editor**.
3. Click **+ New query**.
4. Open the file **`setup-dashboard-tables.sql`** in this folder and copy its **entire** contents.
5. Paste into the SQL Editor and click **Run** (or press Ctrl/Cmd + Enter).

You should see **Success. No rows returned.**

5. In the left sidebar open **Table Editor**. You should see:
   - **products** – id, name, category, price, stock, status, colors, sizes, created_at
   - **orders** – id, customer, email, amount, status, date, created_at

6. In your app, open **http://localhost:3000/admin** and sign in. The dashboard should load. Add products from **Admin → Products**.

## Optional: add sample products

In Supabase **SQL Editor**, run this once to insert a few sample products:

```sql
insert into public.products (name, category, price, stock, status, colors, sizes)
values
  ('Classic T-Shirt', 'Shirts', 30, 150, 'Active', '["Black","White","Navy"]'::jsonb, '["XS","S","M","L","XL"]'::jsonb),
  ('Denim Jeans', 'Pants', 80, 45, 'Active', '["Dark Blue","Light Blue"]'::jsonb, '["28","30","32","34","36"]'::jsonb),
  ('Summer Dress', 'Dresses', 50, 28, 'Active', '["Pink","Yellow","Blue"]'::jsonb, '["S","M","L"]'::jsonb);
```

Or add products from your app: **Admin → Products → Add Product**.
