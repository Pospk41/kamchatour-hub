import type { Coordinates } from '../lib/location';

export type EmergencyContact = {
	id: string;
	name: string;
	phone: string;
};

export type EmergencyReport = {
	id: string;
	coordinates: Coordinates;
	note?: string;
	createdAt: string;
};