import { saveObject, getObject, pushToArray } from './localStore';
import { Tour, Booking } from '@/types';

const KEYS = {
	TOURS: 'tours',
	BOOKINGS: 'bookings',
	ADS: 'ads',
};

export async function listTours(): Promise<Tour[]> {
	return getObject<Tour[]>(KEYS.TOURS, []);
}

export async function saveTours(tours: Tour[]): Promise<void> {
	await saveObject(KEYS.TOURS, tours);
}

export async function createBooking(b: Booking): Promise<void> {
	await pushToArray(KEYS.BOOKINGS, b);
}

export async function listBookings(userId?: string): Promise<Booking[]> {
	const all = await getObject<Booking[]>(KEYS.BOOKINGS, []);
	return userId ? all.filter((b) => b.userId === userId) : all;
}

export type Ad = {
	id: string;
	title: string;
	description: string;
	category: string;
	date: string;
	source: string;
	url?: string;
	isFavorite?: boolean;
	price?: string;
	contact?: string;
};

export async function listAds(): Promise<Ad[]> {
	return getObject<Ad[]>(KEYS.ADS, []);
}

export async function saveAds(ads: Ad[]): Promise<void> {
	await saveObject(KEYS.ADS, ads);
}