import { z } from 'zod';
import { Tour, TourSchema } from '../types/tours';

let memoryTours: Record<string, Tour> = {};

export async function listToursByOperator(operatorId: string): Promise<Tour[]> {
	return Object.values(memoryTours).filter(t => t.operatorId === operatorId);
}

export async function createTourDraft(input: Omit<Tour, 'id'|'createdAt'|'updatedAt'|'slug'|'status'> & Partial<Pick<Tour,'status'|'slug'>>): Promise<Tour> {
	const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
	const base: Tour = TourSchema.parse({
		id,
		status: 'draft',
		slug: input.slug ?? id,
		createdAt: Date.now(),
		updatedAt: Date.now(),
		...input,
	});
	memoryTours[id] = base;
	return base;
}

export async function updateTour(tourId: string, patch: Partial<Tour>): Promise<Tour> {
	const existing = memoryTours[tourId];
	if (!existing) throw new Error('Tour not found');
	const updated = TourSchema.parse({ ...existing, ...patch, updatedAt: Date.now() });
	memoryTours[tourId] = updated;
	return updated;
}

export async function getTour(tourId: string): Promise<Tour | null> {
	return memoryTours[tourId] ?? null;
}

export async function publishTour(tourId: string): Promise<Tour> {
	return updateTour(tourId, { status: 'published' });
}

