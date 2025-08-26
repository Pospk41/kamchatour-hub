import AsyncStorage from '@react-native-async-storage/async-storage';
import { EcoPointsBalance } from '../types/rewards';

const PREFIX = 'rewards:eco:';

export async function getEcoBalance(userId: string): Promise<EcoPointsBalance> {
  const raw = await AsyncStorage.getItem(PREFIX + userId);
  if (!raw) return { userId, points: 0, updatedAt: Date.now() };
  try { return JSON.parse(raw) as EcoPointsBalance; } catch { return { userId, points: 0, updatedAt: Date.now() }; }
}

export async function setEcoBalance(b: EcoPointsBalance): Promise<void> {
  await AsyncStorage.setItem(PREFIX + b.userId, JSON.stringify(b));
}

export async function addEcoPoints(userId: string, points: number): Promise<EcoPointsBalance> {
  const cur = await getEcoBalance(userId);
  const next: EcoPointsBalance = { userId, points: Math.max(0, cur.points + points), updatedAt: Date.now() };
  await setEcoBalance(next);
  return next;
}