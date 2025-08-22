# Project Setup

## Requirements
- Node.js 20+
- npm 10+
- Expo CLI (via npx)

## 1) Install deps
```
npm ci
```

## 2) Env vars
Create `.env` from `.env.example`:
```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```
Server-side only (do NOT use in app):
```
DATABASE_URL=postgresql://...:6543/postgres?pgbouncer=true&sslmode=require
DIRECT_URL=postgresql://...:5432/postgres?sslmode=require
```

## 3) Run dev
```
npx expo start
```

## 4) Web export
```
npm run build
# output in dist/
```

## 5) EAS
- Set `owner` and `extra.eas.projectId` in `app.json` (already set)
- Login: `EXPO_TOKEN=... eas whoami`
- Build dev client:
```
eas build -p android --profile development
```

## 6) Vercel deploy
- Set repo secrets: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `VERCEL_TOKEN`, `EXPO_TOKEN` (optional)
- Run workflow `Vercel Deploy` (manual) or locally: `npx vercel --prod dist`.