-- Per-product shipping cost override (null = use store default)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products' and column_name = 'shipping_cost'
  ) then
    alter table public.products add column shipping_cost numeric check (shipping_cost is null or shipping_cost >= 0);
  end if;
end $$;
