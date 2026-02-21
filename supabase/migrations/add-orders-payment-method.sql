-- Store payment method chosen at checkout
alter table public.orders add column if not exists payment_method text;
