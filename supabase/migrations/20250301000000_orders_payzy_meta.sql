-- Store numeric amount and freight for Payzy callback verification (signature uses these values).
alter table public.orders
  add column if not exists payzy_amount numeric,
  add column if not exists payzy_freight numeric;
