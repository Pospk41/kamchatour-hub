import { ALL_ACTIVITIES, MOCK_ADS } from '@/constants/data';
import { listTours, saveTours, listAds, saveAds } from './dataService';
import { Tour } from '@/types';

export async function seedIfEmpty() {
	const tours = await listTours();
	if (!tours || tours.length === 0) {
		const seeded: Tour[] = ALL_ACTIVITIES.map((a, idx) => ({
			id: (idx + 1).toString(),
			title: a.title,
			tag: a.tag,
			location: a.location,
			price: a.price,
			rating: a.rating,
			reviews: a.reviews,
			duration: a.duration,
			difficulty: a.difficulty,
			included: a.included,
			description: a.description,
			images: [a.image],
			spotsLeft: a.spotsLeft,
			cancellation: a.cancellation,
		}));
		await saveTours(seeded);
	}
	const ads = await listAds();
	if (!ads || ads.length === 0) {
		await saveAds(MOCK_ADS as any);
	}
}