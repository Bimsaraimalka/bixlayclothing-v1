-- Newsletter subscribers (storefront signup)
create table if not exists public.newsletter_subscribers (
  id bigint generated always as identity primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

-- Allow anyone to subscribe (insert). No auth required.
create policy "Allow anon insert newsletter_subscribers"
  on public.newsletter_subscribers for insert to anon with check (true);

-- Optional: allow service role / admin to read (e.g. export list). Anon cannot read.
create policy "Allow authenticated read newsletter_subscribers"
  on public.newsletter_subscribers for select to authenticated using (true);

comment on table public.newsletter_subscribers is 'Email signups from the Stay Updated / newsletter form on the storefront';
