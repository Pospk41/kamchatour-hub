import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTourDraft, getTour, listToursByOperator, publishTour, updateTour } from '../services/tours';
import { Tour } from '../types/tours';

export function useOperatorTours(operatorId: string) {
	return useQuery<Tour[]>({ queryKey: ['tours', operatorId], queryFn: () => listToursByOperator(operatorId) });
}

export function useTour(tourId: string) {
	return useQuery<Tour | null>({ queryKey: ['tour', tourId], queryFn: () => getTour(tourId) });
}

export function useCreateTour(operatorId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: Omit<Tour, 'id'|'createdAt'|'updatedAt'|'slug'|'status'|'operatorId'> & Partial<Pick<Tour,'status'|'slug'>>) => createTourDraft({ ...input, operatorId }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ['tours', operatorId] }),
	});
}

export function useUpdateTour() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ tourId, patch }: { tourId: string; patch: Partial<Tour> }) => updateTour(tourId, patch),
		onSuccess: (data) => {
			qc.invalidateQueries({ queryKey: ['tour', data.id] });
			qc.invalidateQueries({ queryKey: ['tours', data.operatorId] });
		},
	});
}

export function usePublishTour() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (tourId: string) => publishTour(tourId),
		onSuccess: (data) => {
			qc.invalidateQueries({ queryKey: ['tour', data.id] });
			qc.invalidateQueries({ queryKey: ['tours', data.operatorId] });
		},
	});
}

