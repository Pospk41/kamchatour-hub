export type Coordinates = { latitude: number; longitude: number };

export async function getCurrentLocation(): Promise<Coordinates> {
	return { latitude: 53.045, longitude: 158.650 };
}