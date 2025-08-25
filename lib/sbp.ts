export function getSbpToken(): string | undefined {
  // Expo web & native use EXPO_PUBLIC_* at runtime
  // Avoid throwing to keep app resilient when env is missing
  // Read from process.env for web/static export
  // @ts-ignore - process.env provided by bundler
  const token = process.env.EXPO_PUBLIC_SBP_TOKEN as string | undefined;
  return token;
}

