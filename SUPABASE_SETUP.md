# Supabase setup (Bixlay admin + storefront)

Admin products/orders and the storefront catalog use Supabase. Follow these steps so everything works.

**→ Step-by-step admin setup:** see **[docs/ADMIN_SUPABASE_SETUP.md](docs/ADMIN_SUPABASE_SETUP.md)**.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In **Project Settings → API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Environment variables

Create `.env.local` in the project root (see `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Restart the dev server after changing env vars.

## 3. Run the database migration

1. In the Supabase dashboard, open **SQL Editor**.
2. Copy the contents of `supabase/migrations/20250220000000_products_orders.sql`.
3. Run the script. This creates `products` and `orders` tables and RLS policies so the app can read/write with the anon key.

## 4. What uses Supabase

- **Admin** (Dashboard, Products, Orders): loads and updates products and orders in Supabase.
- **Checkout**: new orders are inserted into `orders`.
- **Storefront** (Shop, product detail, related products): products are loaded from `products`.

After setup, add products in **Admin → Products**; they will appear on the main site and in checkout flow.

## 5. Keep Supabase free tier active (optional)

On the free plan, Supabase can pause projects after a period of no traffic. A server cron pings your project so it stays active.

- **Vercel:** The repo includes `vercel.json` with a cron that calls `/api/cron` every 6 hours. In Vercel → Project → Settings → Environment Variables, add `CRON_SECRET` (any random string). Vercel Cron will send it in the `Authorization: Bearer <CRON_SECRET>` header; the route rejects requests without it.
- **Other hosts:** Use a cron service (e.g. cron-job.org, Upstash QStash) to GET `https://your-domain.com/api/cron` with header `Authorization: Bearer YOUR_CRON_SECRET` on a schedule (e.g. every 6–24 hours). Set the same `CRON_SECRET` in your app env so the route can validate the request.
