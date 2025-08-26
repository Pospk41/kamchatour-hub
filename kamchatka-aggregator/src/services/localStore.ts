import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'fin:';

export async function saveObject<T>(key: string, value: T): Promise<void> {
	await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export async function getObject<T>(key: string, fallback: T): Promise<T> {
	const raw = await AsyncStorage.getItem(PREFIX + key);
	if (!raw) return fallback;
	try {
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
}

export async function pushToArray<T>(key: string, item: T): Promise<void> {
	const arr = await getObject<T[]>(key, []);
	arr.unshift(item);
	await saveObject(key, arr);
}

export async function clearKey(key: string): Promise<void> {
	await AsyncStorage.removeItem(PREFIX + key);
}