export type TourDifficulty = 'easy' | 'medium' | 'hard';
export type ActivityTag = 'trek' | 'photo' | 'wildlife' | 'volcano' | 'sea' | 'culture';

export interface Tour {
  id: string;
  title: string;
  summary: string;
  durationDays: number;
  priceFrom: number;
  difficulty: TourDifficulty;
  tags: ActivityTag[];
  nextDate?: string;
  seatsLeft?: number;
  rating?: number;
  cover?: string;
}

export const mockTours: Tour[] = [
  {
    id: 't1',
    title: 'Авачинский вулкан: восхождение',
    summary: 'Классический маршрут на вершину Авачи',
    durationDays: 1,
    priceFrom: 12000,
    difficulty: 'medium',
    tags: ['trek', 'volcano'],
    nextDate: '2025-07-12',
    seatsLeft: 6,
    rating: 4.8,
  },
  {
    id: 't2',
    title: 'Бухта Русская: морская прогулка',
    summary: 'Орланы, сивучи и дельфины',
    durationDays: 1,
    priceFrom: 18000,
    difficulty: 'easy',
    tags: ['sea', 'photo', 'wildlife'],
    nextDate: '2025-08-05',
    seatsLeft: 12,
    rating: 4.7,
  },
  {
    id: 't3',
    title: 'Долина гейзеров и Узон',
    summary: 'Вертолетный тур: геотермальные чудеса',
    durationDays: 1,
    priceFrom: 95000,
    difficulty: 'easy',
    tags: ['photo', 'volcano'],
    nextDate: '2025-07-25',
    seatsLeft: 3,
    rating: 4.9,
  },
];