-- Add products.details if missing (run in Supabase SQL Editor)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products' and column_name = 'details'
  ) then
    alter table public.products add column details jsonb not null default '[]'::jsonb;
  end if;
end $$;
