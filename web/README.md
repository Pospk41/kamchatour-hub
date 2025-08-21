# Kamchatka Web (Next.js)

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`

## Deploy (Vercel)
1. Push repo to GitHub
2. Import repo on Vercel
3. Set Root Directory to `web/`
4. Framework Preset: Next.js
5. Env vars: (shared with mobile as needed)
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - MAP_TILES_API_KEY (если используется)
6. Deploy

Monorepo note: если корень репозитория содержит другой lockfile, добавьте в `web/next.config.js`:
```js
/ /** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { turbpck: { root: __dirname } },
};
module.exports = nextConfig;
```
