export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

export function detectSeason(date = new Date()): Season {
	const m = date.getMonth();
	if (m === 11 || m <= 1) return 'winter';
	if (m >= 2 && m <= 4) return 'spring';
	if (m >= 5 && m <= 7) return 'summer';
	return 'autumn';
}