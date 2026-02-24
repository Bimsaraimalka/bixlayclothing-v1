-- Site contact phone: value and visibility (owner configurable in Admin → Settings)
alter table public.store_settings
  add column if not exists contact_phone text,
  add column if not exists contact_phone_visible boolean not null default false;

comment on column public.store_settings.contact_phone is 'Site contact phone number (e.g. +94760272240). Shown on contact page and checkout success when contact_phone_visible is true.';
comment on column public.store_settings.contact_phone_visible is 'When true, show contact_phone on the storefront (contact page, checkout success).';
