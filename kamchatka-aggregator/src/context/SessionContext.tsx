import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Role, User } from '@/types';

const SESSION_KEY = 'fin:session';

type SessionContextType = {
	user: User | null;
	signIn: (payload: Omit<User, 'id'>) => Promise<void>;
	signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const raw = await AsyncStorage.getItem(SESSION_KEY);
				if (raw) setUser(JSON.parse(raw));
			} catch {}
		})();
	}, []);

	const signIn = async (payload: Omit<User, 'id'>) => {
		const u: User = { id: Date.now().toString(), ...payload };
		setUser(u);
		await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(u));
	};

	const signOut = async () => {
		setUser(null);
		await AsyncStorage.removeItem(SESSION_KEY);
	};

	return (
		<SessionContext.Provider value={{ user, signIn, signOut }}>
			{children}
		</SessionContext.Provider>
	);
}

export function useSession() {
	const ctx = useContext(SessionContext);
	if (!ctx) throw new Error('useSession must be used within SessionProvider');
	return ctx;
}