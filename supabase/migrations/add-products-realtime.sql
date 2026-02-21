-- Enable Supabase Realtime for the products table so price changes
-- propagate to the customer view without refresh.
-- Safe to run multiple times: only adds if not already in publication.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'products'
  ) then
    alter publication supabase_realtime add table public.products;
  end if;
end $$;
