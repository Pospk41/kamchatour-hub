export type BearDetection = { hasBear: boolean; confidence: number };
export async function detectBears(_input: unknown): Promise<BearDetection> { return { hasBear: false, confidence: 0 }; }
