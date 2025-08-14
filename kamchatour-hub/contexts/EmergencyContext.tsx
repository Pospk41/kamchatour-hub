import React from 'react';
import { sendSos } from '@lib/emergency';
import { useLocationContext } from './LocationContext';

type EmergencyContextValue = {
	send: (note?: string) => Promise<void>;
};

const EmergencyContext = React.createContext<EmergencyContextValue | undefined>(undefined);

export function EmergencyProvider({ children }: any) {
	const { coordinates } = useLocationContext();

	async function send(note?: string) {
		if (!coordinates) return;
		await sendSos({ coordinates, note });
	}

	return (
		<EmergencyContext.Provider value={{ send }}>
			{children}
		</EmergencyContext.Provider>
	);
}

export function useEmergencyContext() {
	const ctx = React.useContext(EmergencyContext);
	if (!ctx) throw new Error('EmergencyContext not found');
	return ctx;
}