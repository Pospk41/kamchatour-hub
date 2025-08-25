export function getSbpToken(): string | undefined {
  // Expo web & native use EXPO_PUBLIC_* at runtime
  // Avoid throwing to keep app resilient when env is missing
  // Read from process.env for web/static export
  // @ts-ignore - process.env provided by bundler
  const token = process.env.EXPO_PUBLIC_SBP_TOKEN as string | undefined;
  return token;
}

export type SbpInitResult = { ok: boolean; deeplink?: string; qr?: string; error?: string };

export async function initiateSbpPayment(params: { amount: number; orderId: string; description?: string }): Promise<SbpInitResult> {
  const token = getSbpToken();
  if (!token) return { ok: false, error: 'SBP token missing' };
  // Mock: return a placeholder deeplink. Real integration goes via PSP API.
  const deeplink = `sbp://pay?sum=${encodeURIComponent(String(params.amount))}&order=${encodeURIComponent(params.orderId)}`;
  return { ok: true, deeplink };
}

