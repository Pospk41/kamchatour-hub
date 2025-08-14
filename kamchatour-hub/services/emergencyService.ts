import { SosPayload } from '@lib/emergency';
import { apiPost } from './api';

export async function sendEmergency(payload: SosPayload): Promise<{ ok: boolean }> {
	return apiPost('/emergency/sos', payload);
}