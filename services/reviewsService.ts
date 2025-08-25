import reviews from '../assets/cultural_db/reviews.json';

export type Review = {
  id: string;
  tourId: string;
  user: string;
  rating: number;
  text: string;
  photos: string[];
};

export async function listReviewsByTour(tourId: string): Promise<Review[]> {
  const data = reviews as unknown as Review[];
  return data.filter((r) => r.tourId === tourId);
}

