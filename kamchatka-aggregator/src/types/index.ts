export type Role = 'tourist' | 'operator' | 'guide' | 'transfer';

export interface User {
	id: string;
	email: string;
	name: string;
	phone?: string;
	role: Role;
}

export interface Tour {
	id: string;
	title: string;
	tag: string;
	location: string;
	price: number;
	rating?: number;
	reviews?: number;
	duration?: string;
	difficulty?: string;
	included?: string[];
	description?: string;
	images?: string[];
	spotsLeft?: number;
	cancellation?: string;
}

export interface Booking {
	id: string;
	tourId: string;
	userId: string;
	people: number;
	date: string;
	status: 'pending' | 'confirmed' | 'cancelled';
	priceTotal: number;
}

export interface TransferRequest {
	id: string;
	userId: string;
	from: string;
	to: string;
	date: string;
	people: number;
	status: 'requested' | 'assigned' | 'completed' | 'cancelled';
}