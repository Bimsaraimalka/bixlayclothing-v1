-- Persist per-line shipping cost in cart (from product or store default at add time)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'cart_items' and column_name = 'shipping_cost'
  ) then
    alter table public.cart_items add column shipping_cost numeric check (shipping_cost is null or shipping_cost >= 0);
  end if;
end $$;
