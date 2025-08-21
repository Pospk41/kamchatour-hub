import { useQuery } from '@tanstack/react-query';
import { fetchCraftMasters, fetchCulturalEvents, CraftMaster, CulturalEvent } from '../services/culture';

export function useCraftMasters() {
	return useQuery<CraftMaster[]>({
		queryKey: ['culture', 'masters'],
		queryFn: fetchCraftMasters,
	});
}

export function useCulturalEvents() {
	return useQuery<CulturalEvent[]>({
		queryKey: ['culture', 'events'],
		queryFn: fetchCulturalEvents,
	});
}

