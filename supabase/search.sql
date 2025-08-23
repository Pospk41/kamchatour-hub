-- Tours FTS setup (run in Supabase SQL editor)

-- Base tables are assumed:
-- tours(id uuid primary key, title text, summary text, tags text[], duration_days int, base_price int, rating numeric, next_date date, seats_left int)

create extension if not exists pg_trgm;

create or replace view public.tours_search as
select
  t.id,
  t.title,
  t.summary,
  t.tags,
  t.duration_days,
  t.base_price,
  t.rating,
  t.next_date,
  t.seats_left,
  setweight(to_tsvector('russian', coalesce(t.title,'')), 'A') ||
  setweight(to_tsvector('russian', coalesce(t.summary,'')), 'B') ||
  setweight(to_tsvector('russian', array_to_string(coalesce(t.tags,'{}'::text[]),' ')), 'C') as tsv
from public.tours t;

create index if not exists tours_search_tsv_idx on public.tours_search using gin(tsv);
create index if not exists tours_title_trgm_idx on public.tours using gin (title gin_trgm_ops);

-- RLS: make a limited public view for anonymous
-- grant select on public.tours_search to anon, authenticated;