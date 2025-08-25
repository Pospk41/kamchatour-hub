import operators from '../assets/cultural_db/operators.json';

export type Operator = {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  badges?: string[];
  contact?: { site?: string; phone?: string };
};

export async function listOperators(): Promise<Operator[]> {
  return operators as unknown as Operator[];
}

export async function getOperatorById(id: string): Promise<Operator | undefined> {
  const data = operators as unknown as Operator[];
  return data.find((o) => o.id === id);
}

export async function findOperatorByName(name: string): Promise<Operator | undefined> {
  const data = operators as unknown as Operator[];
  const nm = name.trim().toLowerCase();
  return data.find((o) => o.name.toLowerCase() === nm);
}

