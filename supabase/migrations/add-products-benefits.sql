-- Add products.benefits if missing (product detail page policy highlights from DB)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products' and column_name = 'benefits'
  ) then
    alter table public.products add column benefits jsonb not null default '[]'::jsonb;
  end if;
end $$;
