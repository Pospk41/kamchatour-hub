import AsyncStorage from '@react-native-async-storage/async-storage';
import { Boost } from '../types/rewards';

const KEY = 'rewards:boosts';

export async function listBoosts(): Promise<Boost[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as Boost[]; } catch { return []; }
}

export async function saveBoosts(boosts: Boost[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(boosts));
}

export async function addBoost(boost: Boost): Promise<void> {
  const current = await listBoosts();
  await saveBoosts([boost, ...current]);
}

export function isBoostActive(boost: Boost, now = Date.now()): boolean {
  const fromOk = !boost.activeFrom || now >= boost.activeFrom;
  const toOk = !boost.activeTo || now <= boost.activeTo;
  return fromOk && toOk;
}

export function computeMultiplier(boosts: Boost[], ctx: {
  category?: string;
  amount?: number;
  paymentMethod?: string;
  partnerId?: string;
  now?: number;
}): number {
  const now = ctx.now ?? Date.now();
  let mult = 1;
  for (const b of boosts) {
    if (!isBoostActive(b, now)) continue;
    if (b.categories && ctx.category && !b.categories.includes(ctx.category)) continue;
    if (typeof b.minAmount === 'number' && (ctx.amount ?? 0) < b.minAmount) continue;
    if (b.paymentMethods && ctx.paymentMethod && !b.paymentMethods.includes(ctx.paymentMethod)) continue;
    if (b.partnerId && ctx.partnerId && b.partnerId !== ctx.partnerId) continue;
    if (typeof b.multiplier === 'number') mult *= b.multiplier;
  }
  return mult;
}