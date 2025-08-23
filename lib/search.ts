import { mockTours, Tour, TourDifficulty, ActivityTag } from './tours';

export interface SearchParams {
  q?: string;
  start_from?: string;
  start_to?: string;
  min_days?: number;
  max_days?: number;
  min_price?: number;
  max_price?: number;
  difficulty?: TourDifficulty[];
  activity?: ActivityTag[];
  sort?: 'relevance' | 'date' | 'price' | 'rating';
}

const norm = (s: string) => s.toLowerCase();

export function searchTours(params: SearchParams): Tour[] {
  let list = [...mockTours];

  if (params.q) {
    const q = norm(params.q);
    list = list.filter(t => norm(t.title + ' ' + t.summary + ' ' + t.tags.join(' ')).includes(q));
  }

  if (params.min_days) list = list.filter(t => t.durationDays >= params.min_days!);
  if (params.max_days) list = list.filter(t => t.durationDays <= params.max_days!);
  if (params.min_price) list = list.filter(t => t.priceFrom >= params.min_price!);
  if (params.max_price) list = list.filter(t => t.priceFrom <= params.max_price!);
  if (params.difficulty && params.difficulty.length) list = list.filter(t => params.difficulty!.includes(t.difficulty));
  if (params.activity && params.activity.length) list = list.filter(t => t.tags.some(tag => params.activity!.includes(tag)));

  switch (params.sort) {
    case 'date':
      list.sort((a, b) => (a.nextDate || '').localeCompare(b.nextDate || ''));
      break;
    case 'price':
      list.sort((a, b) => a.priceFrom - b.priceFrom);
      break;
    case 'rating':
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    default:
      // relevance: простая эвристика по совпадениям
      if (params.q) {
        const q = norm(params.q);
        list.sort((a, b) => Number(norm(b.title).includes(q)) - Number(norm(a.title).includes(q)));
      }
  }

  return list;
}