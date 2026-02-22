-- Optional product line for admin-created orders (one product per order)
alter table public.orders add column if not exists product_id text;
alter table public.orders add column if not exists product_name text;
alter table public.orders add column if not exists color text;
alter table public.orders add column if not exists size text;
alter table public.orders add column if not exists quantity int;
alter table public.orders add column if not exists unit_price numeric;
