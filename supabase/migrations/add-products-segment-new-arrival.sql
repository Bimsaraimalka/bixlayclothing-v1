-- Add segment (Men / Women / Unisex) and new_arrival flag to products
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products' and column_name = 'segment'
  ) then
    alter table public.products add column segment text not null default 'Unisex' check (segment in ('Men', 'Women', 'Unisex'));
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products' and column_name = 'new_arrival'
  ) then
    alter table public.products add column new_arrival boolean not null default false;
  end if;
end $$;
