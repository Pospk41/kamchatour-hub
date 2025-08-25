#!/usr/bin/env node
/*
  Scaffold generator for kamchatka-safe-tour structure.
  - Creates directories and minimal placeholder files.
  - Does not overwrite existing files.
*/
const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

function ensureDirectory(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);
  fs.mkdirSync(absolutePath, { recursive: true });
}

function writeFileIfMissing(relativePath, content) {
  const absolutePath = path.join(projectRoot, relativePath);
  if (fs.existsSync(absolutePath)) return;
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content, 'utf8');
}

function createDirectories() {
  const directories = [
    'assets/fonts',
    'assets/icons',
    'assets/images',
    'assets/images/paratunka',
    'assets/images/volcanoes',
    'assets/images/bears',
    'assets/translations',
    'assets/cultural_db',
    'lib',
    'components/ui',
    'components/auth',
    'components/kamchatka',
    'components/safety',
    'components/communication',
    'components/culture',
    'components/eco',
    'components/weather',
    'components/ar',
    'components/booking',
    'components/marketplace',
    'components/itinerary',
    'contexts',
    'hooks',
    'navigation',
    'screens/auth',
    'screens/main',
    'screens/activities',
    'screens/onboarding',
    'screens/shelters',
    'screens/training',
    'screens/checklists',
    'screens/eco',
    'screens/culture',
    'screens/marketplace',
    'screens/booking',
    'screens/agent',
    'screens/itinerary',
    'services',
    'types',
    'utils',
    'features/ecoRating',
    'features/carbonOffset',
    'features/indigenousEcology',
    'features/wildlife',
    'features/dynamicPackaging',
    'features/commissionSystem',
    'features/smartRouting',
    'scripts/data-import',
    'scripts/ai-training',
  ];
  directories.forEach(ensureDirectory);
}

function createFiles() {
  // Root
  writeFileIfMissing('.env', '# Environment placeholders\n');

  // Assets JSON
  writeFileIfMissing('assets/cultural_db/masters.json', '[]\n');
  writeFileIfMissing('assets/cultural_db/events.json', '[]\n');

  // lib
  writeFileIfMissing(
    'lib/supabase.ts',
    "export function initSupabase() { return null; }\n"
  );
  writeFileIfMissing(
    'lib/auth.ts',
    "export function signIn() { return Promise.resolve(null); }\nexport function signOut() { return Promise.resolve(null); }\n"
  );
  writeFileIfMissing(
    'lib/location.ts',
    "export async function getCurrentLocation() { return null; }\n"
  );
  writeFileIfMissing(
    'lib/emergency.ts',
    "export function sendSOS(payload?: unknown) { return Promise.resolve({ ok: true, payload }); }\n"
  );
  writeFileIfMissing(
    'lib/bear-detector.ts',
    "export type BearDetection = { hasBear: boolean; confidence: number };\nexport async function detectBears(_input: unknown): Promise<BearDetection> { return { hasBear: false, confidence: 0 }; }\n"
  );
  writeFileIfMissing(
    'lib/offlineManager.ts',
    "export function isOffline() { return false; }\nexport function syncQueue() { return Promise.resolve(true); }\n"
  );
  writeFileIfMissing(
    'lib/weatherIntegration.ts',
    "export async function fetchWeather(_coords: unknown) { return null; }\n"
  );
  writeFileIfMissing(
    'lib/ecoCalculator.ts',
    "export function calculateEcoScore(_data: unknown) { return 0; }\n"
  );

  // components/ui
  writeFileIfMissing(
    'components/ui/Button.tsx',
    "export function Button(): null { return null; }\n"
  );
  writeFileIfMissing(
    'components/ui/Input.tsx',
    "export function Input(): null { return null; }\n"
  );
  writeFileIfMissing(
    'components/ui/SOSButton.tsx',
    "export function SOSButton(): null { return null; }\n"
  );

  // components/culture
  writeFileIfMissing(
    'components/culture/CraftMasterCard.tsx',
    "export function CraftMasterCard(): null { return null; }\n"
  );
  writeFileIfMissing(
    'components/culture/EventCard.tsx',
    "export function EventCard(): null { return null; }\n"
  );
  writeFileIfMissing(
    'components/culture/SouvenirARViewer.tsx',
    "export function SouvenirARViewer(): null { return null; }\n"
  );

  // contexts
  const contextTemplate = (name) => `import { createContext, useContext, PropsWithChildren } from 'react';\n\nexport type ${name}Value = unknown;\n\nconst ${name}Ctx = createContext<${name}Value>(null as unknown as ${name}Value);\n\nexport function ${name}Provider({ children }: PropsWithChildren<{}>) {\n  return <${name}Ctx.Provider value={null as unknown as ${name}Value}>{children}</${name}Ctx.Provider>;\n}\n\nexport function use${name}(): ${name}Value {\n  return useContext(${name}Ctx);\n}\n`;
  writeFileIfMissing('contexts/AuthContext.tsx', contextTemplate('Auth'));
  writeFileIfMissing('contexts/LocationContext.tsx', contextTemplate('Location'));
  writeFileIfMissing('contexts/EmergencyContext.tsx', contextTemplate('Emergency'));
  writeFileIfMissing('contexts/BookingContext.tsx', contextTemplate('Booking'));

  // hooks
  writeFileIfMissing(
    'hooks/useAuth.ts',
    "export function useAuth() { return { isAuthenticated: false }; }\n"
  );
  writeFileIfMissing(
    'hooks/useLocation.ts',
    "export function useLocation() { return { coords: null }; }\n"
  );
  writeFileIfMissing(
    'hooks/useBearAlert.ts',
    "export function useBearAlert() { return { alert: null }; }\n"
  );

  // navigation
  writeFileIfMissing(
    'navigation/AuthNavigator.tsx',
    "export function AuthNavigator(): null { return null; }\n"
  );
  writeFileIfMissing(
    'navigation/MainNavigator.tsx',
    "export function MainNavigator(): null { return null; }\n"
  );
  writeFileIfMissing(
    'navigation/EmergencyNavigator.tsx',
    "export function EmergencyNavigator(): null { return null; }\n"
  );

  // screens/culture
  writeFileIfMissing(
    'screens/culture/CraftVillagesMap.tsx',
    "export default function CraftVillagesMap(): null { return null; }\n"
  );
  writeFileIfMissing(
    'screens/culture/EventCalendarScreen.tsx',
    "export default function EventCalendarScreen(): null { return null; }\n"
  );
  writeFileIfMissing(
    'screens/culture/MasterClassScreen.tsx',
    "export default function MasterClassScreen(): null { return null; }\n"
  );
  writeFileIfMissing(
    'screens/culture/SouvenirMarket.tsx',
    "export default function SouvenirMarket(): null { return null; }\n"
  );

  // services
  writeFileIfMissing('services/api.ts', "export async function apiRequest(_p: unknown) { return null; }\n");
  writeFileIfMissing('services/authService.ts', "export async function authService() { return null; }\n");
  writeFileIfMissing('services/mapService.ts', "export async function mapService() { return null; }\n");
  writeFileIfMissing('services/emergencyService.ts', "export async function emergencyService() { return null; }\n");
  writeFileIfMissing('services/tourService.ts', "export async function tourService() { return null; }\n");
  writeFileIfMissing('services/craftService.ts', "export async function craftService() { return null; }\n");
  writeFileIfMissing('services/eventService.ts', "export async function eventService() { return null; }\n");
  writeFileIfMissing('services/masterClassService.ts', "export async function masterClassService() { return null; }\n");
  writeFileIfMissing('services/souvenirService.ts', "export async function souvenirService() { return null; }\n");

  // types
  writeFileIfMissing('types/user.d.ts', "export type User = { id: string; email?: string };\n");
  writeFileIfMissing('types/activity.d.ts', "export type Activity = { id: string; name: string };\n");
  writeFileIfMissing('types/auth.d.ts', "export type AuthToken = { accessToken: string; refreshToken?: string };\n");
  writeFileIfMissing('types/emergency.d.ts', "export type EmergencyEvent = { id: string; level: 'info' | 'warn' | 'critical' };\n");
  writeFileIfMissing('types/craft.d.ts', "export type CraftMaster = { id: string; name: string; village?: string };\n");
  writeFileIfMissing('types/event.d.ts', "export type CulturalEvent = { id: string; title: string; date?: string };\n");

  // utils
  writeFileIfMissing('utils/constants.ts', "export const APP_NAME = 'kamchatka-safe-tour';\n");
  writeFileIfMissing('utils/helpers.ts', "export function noop() { /* no-op */ }\n");
  writeFileIfMissing('utils/seasonDetector.ts', "export function detectSeason(_date: Date): 'winter' | 'spring' | 'summer' | 'autumn' { return 'summer'; }\n");
}

function main() {
  createDirectories();
  createFiles();
  process.stdout.write('Scaffold complete\n');
}

main();

