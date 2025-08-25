import { create } from 'zustand';
import type { MarketplaceItem } from '../services/marketplaceService';

export type CartItem = { item: MarketplaceItem; qty: number };

export type CartState = {
  items: CartItem[];
  add: (item: MarketplaceItem, qty?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  add: (item, qty = 1) =>
    set((state) => {
      const existing = state.items.find((i) => i.item.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.item.id === item.id ? { ...i, qty: i.qty + qty } : i
          ),
        };
      }
      return { items: [...state.items, { item, qty }] };
    }),
  remove: (id) => set((state) => ({ items: state.items.filter((i) => i.item.id !== id) })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((sum, ci) => sum + ci.item.price * ci.qty, 0),
}));