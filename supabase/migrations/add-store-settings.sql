-- Store-wide settings for shipping and tax (single row)
create table if not exists public.store_settings (
  id int primary key default 1 check (id = 1),
  default_shipping numeric not null default 399 check (default_shipping >= 0),
  free_shipping_threshold numeric not null default 5000 check (free_shipping_threshold >= 0),
  tax_enabled boolean not null default true,
  tax_rate numeric not null default 0.1 check (tax_rate >= 0 and tax_rate <= 1),
  updated_at timestamptz not null default now()
);

alter table public.store_settings enable row level security;
create policy "Allow anon read store_settings"
  on public.store_settings for select to anon using (true);
create policy "Allow anon update store_settings"
  on public.store_settings for update to anon using (true) with check (true);

-- Seed single row
insert into public.store_settings (id, default_shipping, free_shipping_threshold, tax_enabled, tax_rate)
values (1, 399, 5000, true, 0.1)
on conflict (id) do nothing;
