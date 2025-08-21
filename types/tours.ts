import { z } from 'zod';

export const DifficultySchema = z.enum(['easy', 'moderate', 'hard']);

export const WaypointSchema = z.object({
	lat: z.number().min(-90).max(90),
	lng: z.number().min(-180).max(180),
	title: z.string().min(1),
	body: z.string().optional(),
	photoUrl: z.string().url().optional(),
});

export const TourSchema = z.object({
	id: z.string(),
	operatorId: z.string(),
	slug: z.string(),
	status: z.enum(['draft', 'review', 'published', 'archived']),
	title: z.string().min(3),
	subtitle: z.string().optional(),
	description: z.string().min(10),
	highlights: z.array(z.string()).default([]),
	includes: z.array(z.string()).default([]),
	excludes: z.array(z.string()).default([]),
	equipment: z.array(z.string()).default([]),
	safety: z.string().optional(),
	ecoNotes: z.string().optional(),
	startPoint: z.object({ lat: z.number(), lng: z.number(), address: z.string().optional() }),
	routePolyline: z.string().optional(),
	waypoints: z.array(WaypointSchema).default([]),
	durationHours: z.number().int().positive().optional(),
	durationDays: z.number().int().positive().optional(),
	difficulty: DifficultySchema,
	minGroup: z.number().int().nonnegative().default(1),
	maxGroup: z.number().int().positive(),
	minAge: z.number().int().nonnegative().default(0),
	languages: z.array(z.string()).default(['ru']),
	basePrice: z.number().nonnegative(),
	currency: z.string().default('RUB'),
	depositPct: z.number().min(0).max(100).default(0),
	cancellationPolicy: z.enum(['flexible', 'standard', 'strict']).default('standard'),
	bookingCutoffHours: z.number().int().min(0).max(168).default(24),
	minParticipants: z.number().int().min(1).default(1),
	coverUrl: z.string().url().optional(),
	galleryUrls: z.array(z.string().url()).default([]),
	videoUrl: z.string().url().optional(),
	categories: z.array(z.string()).default([]),
	tags: z.array(z.string()).default([]),
	createdAt: z.number().default(() => Date.now()),
	updatedAt: z.number().default(() => Date.now()),
});

export type Tour = z.infer<typeof TourSchema>;

export const SchedulePatternSchema = z.object({
	id: z.string(),
	tourId: z.string(),
	type: z.enum(['rrule', 'list']),
	rrule: z.string().optional(),
	dates: z.array(z.string()).optional(),
	localStartTime: z.string(),
	timezone: z.string().default('Asia/Kamchatka'),
	startDate: z.string(),
	endDate: z.string(),
	capacity: z.number().int().positive(),
	priceOverride: z.number().nonnegative().optional(),
	cutoffHours: z.number().int().min(0).max(168).optional(),
	minParticipants: z.number().int().min(1).optional(),
	blackoutDates: z.array(z.string()).default([]),
	exceptions: z.array(z.string()).default([]),
});

export type SchedulePattern = z.infer<typeof SchedulePatternSchema>;

export const OccurrenceSchema = z.object({
	id: z.string(),
	tourId: z.string(),
	startDateTime: z.string(),
	capacityTotal: z.number().int().positive(),
	capacityAvailable: z.number().int().nonnegative(),
	price: z.number().nonnegative(),
	status: z.enum(['available', 'low', 'sold_out', 'closed', 'cancelled']).default('available'),
	notes: z.string().optional(),
	guideId: z.string().optional(),
});

export type Occurrence = z.infer<typeof OccurrenceSchema>;

