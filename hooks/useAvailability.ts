import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addSchedulePattern, listOccurrences, listSchedulePatterns, setOccurrences } from '../services/availability';
import { Occurrence, SchedulePattern } from '../types/tours';

export function useSchedulePatterns(tourId: string) {
	return useQuery<SchedulePattern[]>({ queryKey: ['patterns', tourId], queryFn: () => listSchedulePatterns(tourId) });
}

export function useOccurrences(tourId: string) {
	return useQuery<Occurrence[]>({ queryKey: ['occurrences', tourId], queryFn: () => listOccurrences(tourId) });
}

export function useAddSchedulePattern(tourId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (pattern: SchedulePattern) => addSchedulePattern(tourId, pattern),
		onSuccess: () => qc.invalidateQueries({ queryKey: ['patterns', tourId] }),
	});
}

export function useSetOccurrences(tourId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (items: Occurrence[]) => setOccurrences(tourId, items),
		onSuccess: () => qc.invalidateQueries({ queryKey: ['occurrences', tourId] }),
	});
}

