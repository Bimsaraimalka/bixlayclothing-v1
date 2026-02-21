-- Add promo_code to orders if missing (stores code used at checkout)
alter table public.orders add column if not exists promo_code text;
