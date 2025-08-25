import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type EcoChallenge = {
  id: string;
  title: string;
  points: number;
  category?: string;
};

export type EcoBoost = {
  id: string;
  title: string;
  multiplier: number; // e.g., 1.2x
  expiresAt?: number;
};

export type EcoHistoryItem = {
  id: string;
  ts: number;
  source: 'challenge' | 'tip' | 'boost';
  title: string;
  delta: number; // points added (after multiplier)
};

export type EcoState = {
  points: number;
  activeBoost?: EcoBoost | null;
  history: EcoHistoryItem[];
  addPoints: (delta: number, meta: { title: string; source: EcoHistoryItem['source'] }) => void;
  setBoost: (boost: EcoBoost | null) => void;
  clear: () => void;
};

export const useEcoStore = create<EcoState>()(
  persist(
    (set, get) => ({
      points: 0,
      activeBoost: null,
      history: [],
      addPoints: (delta, meta) =>
        set((state) => {
          const boost = state.activeBoost;
          const now = Date.now();
          const isBoostActive = !!boost && (!boost.expiresAt || boost.expiresAt > now);
          const multiplier = isBoostActive ? boost!.multiplier : 1;
          const applied = Math.round(delta * multiplier);
          const item: EcoHistoryItem = {
            id: `${now}-${Math.random().toString(16).slice(2)}`,
            ts: now,
            source: meta.source,
            title: meta.title,
            delta: applied,
          };
          return {
            points: state.points + applied,
            history: [item, ...state.history].slice(0, 200),
          };
        }),
      setBoost: (boost) => set({ activeBoost: boost }),
      clear: () => set({ points: 0, activeBoost: null, history: [] }),
    }),
    {
      name: 'eco-store-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ points: s.points, activeBoost: s.activeBoost, history: s.history }),
    }
  )
);