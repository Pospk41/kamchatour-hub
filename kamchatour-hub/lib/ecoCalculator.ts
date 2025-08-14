export function calculateEcoScore(params: { transport: 'car'|'bus'|'foot'; distanceKm: number }): number {
	const factor = params.transport === 'car' ? 1.5 : params.transport === 'bus' ? 1.0 : 0.1;
	return Math.max(0, 100 - factor * params.distanceKm);
}