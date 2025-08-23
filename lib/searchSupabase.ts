import { supabase, isSupabaseConfigured } from './supabase';
import { searchTours, SearchParams } from './search';
import { Tour } from './tours';

export async function searchToursSupabase(params: SearchParams): Promise<Tour[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return searchTours(params);
  }

  const query = supabase
    .from('tours_search')
    .select('id,title,summary,tags,duration_days,base_price,rating,next_date,seats_left')
    .limit(50);

  if (params.q) {
    query.textSearch('tsv', params.q, { type: 'websearch' });
  }
  if (params.min_days) query.gte('duration_days', params.min_days);
  if (params.max_days) query.lte('duration_days', params.max_days);
  if (params.min_price) query.gte('base_price', params.min_price);
  if (params.max_price) query.lte('base_price', params.max_price);

  switch (params.sort) {
    case 'date':
      query.order('next_date', { ascending: true, nullsFirst: false });
      break;
    case 'price':
      query.order('base_price', { ascending: true });
      break;
    case 'rating':
      query.order('rating', { ascending: false });
      break;
    default:
      // по релевантности Postgres вернёт сам, можно дополнительно по дате
      query.order('next_date', { ascending: true, nullsFirst: true });
  }

  const { data, error } = await query;
  if (error || !data) {
    return searchTours(params);
  }

  return data.map((row: any) => ({
    id: row.id,
    title: row.title,
    summary: row.summary,
    durationDays: row.duration_days,
    priceFrom: row.base_price,
    difficulty: 'medium',
    tags: row.tags || [],
    nextDate: row.next_date || undefined,
    seatsLeft: row.seats_left || undefined,
    rating: row.rating || undefined,
  }));
}