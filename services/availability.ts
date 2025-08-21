import { Occurrence, OccurrenceSchema, SchedulePattern, SchedulePatternSchema } from '../types/tours';

let memoryPatterns: Record<string, SchedulePattern[]> = {};
let memoryOccurrences: Record<string, Occurrence[]> = {};

export async function addSchedulePattern(tourId: string, pattern: SchedulePattern): Promise<SchedulePattern> {
	const parsed = SchedulePatternSchema.parse(pattern);
	memoryPatterns[tourId] = [...(memoryPatterns[tourId] ?? []), parsed];
	return parsed;
}

export async function listSchedulePatterns(tourId: string): Promise<SchedulePattern[]> {
	return memoryPatterns[tourId] ?? [];
}

export async function setOccurrences(tourId: string, occurrences: Occurrence[]): Promise<Occurrence[]> {
	const parsed = occurrences.map(o => OccurrenceSchema.parse(o));
	memoryOccurrences[tourId] = parsed;
	return parsed;
}

export async function listOccurrences(tourId: string): Promise<Occurrence[]> {
	return memoryOccurrences[tourId] ?? [];
}

