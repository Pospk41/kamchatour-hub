export type WeatherNow = { temperatureC: number; condition: string };

export async function getCurrentWeather(_lat: number, _lng: number): Promise<WeatherNow> {
	return { temperatureC: 5, condition: 'Cloudy' };
}