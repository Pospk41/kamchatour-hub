import data from '../assets/cultural_db/marketplace.json';

export type MarketplaceItem = {
  id: string;
  title: string;
  price: number;
  currency: string;
  durationHours: number;
  rating: number;
  category: string;
  provider: string;
  short: string;
  images: string[];
  slots: number;
};

export async function listMarketplaceItems(): Promise<MarketplaceItem[]> {
  return data as MarketplaceItem[];
}

export async function getMarketplaceItem(id: string): Promise<MarketplaceItem | undefined> {
  const items = (data as MarketplaceItem[]) || [];
  return items.find((i) => i.id === id);
}