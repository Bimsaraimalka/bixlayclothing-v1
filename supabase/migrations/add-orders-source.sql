-- Where the order came from (e.g. Facebook, Instagram, WhatsApp, Phone call, Other)
alter table public.orders add column if not exists order_source text;
alter table public.orders add column if not exists order_source_other text;
