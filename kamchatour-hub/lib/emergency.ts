import { Coordinates } from './location';

export type SosPayload = { coordinates: Coordinates; note?: string };

export async function sendSos(payload: SosPayload): Promise<{ ok: boolean }> {
	return { ok: true };
}