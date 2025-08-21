import { z } from 'zod';

export const CraftMasterSchema = z.object({
	id: z.string(),
	title: z.string(),
	master: z.string(),
	village: z.string(),
	duration: z.string(),
	price: z.number(),
	image: z.string(),
});

export type CraftMaster = z.infer<typeof CraftMasterSchema>;

export const CulturalEventSchema = z.object({
	id: z.string(),
	title: z.string(),
	date: z.string(),
	location: z.string(),
	type: z.string(),
	image: z.string(),
});

export type CulturalEvent = z.infer<typeof CulturalEventSchema>;

// Simulated service returning typed data (later replace with API or local DB)
export async function fetchCraftMasters(): Promise<CraftMaster[]> {
	const raw = [
		{ id: '1', title: 'Резьба по кости', master: 'Алексей Петров', village: 'Усть-Камчатск', duration: '2 часа', price: 1500, image: '🦴' },
		{ id: '2', title: 'Плетение из бересты', master: 'Мария Сидорова', village: 'Елизово', duration: '3 часа', price: 2000, image: '🌿' },
		{ id: '3', title: 'Изготовление амулетов', master: 'Виктор Козлов', village: 'Петропавловск-Камчатский', duration: '1.5 часа', price: 1200, image: '🔮' },
	];
	return z.array(CraftMasterSchema).parse(raw);
}

export async function fetchCulturalEvents(): Promise<CulturalEvent[]> {
	const raw = [
		{ id: '1', title: 'Фестиваль коренных народов', date: '15-17 августа', location: 'Петропавловск-Камчатский', type: 'Фестиваль', image: '🎭' },
		{ id: '2', title: 'День рыбака', date: '12 июля', location: 'Усть-Камчатск', type: 'Праздник', image: '🐟' },
		{ id: '3', title: 'Выставка камчатских ремесел', date: '20-25 сентября', location: 'Елизово', type: 'Выставка', image: '🎨' },
	];
	return z.array(CulturalEventSchema).parse(raw);
}

