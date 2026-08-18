# Travel Package Builder MVP v2

This version removes the Vite 8 / Rolldown dependency that caused the Windows native-binding error.

## Requirements

- Node.js 18+ (Node 20 LTS recommended)
- npm

## Run

```powershell
npm install
npm run api    # in another terminal — starts Node backend on :3001
npm run dev
```

Then open the URL printed by Vite.

## API environment

The frontend picks the backend URL from env files — no code changes when switching dev vs production.

| File | Purpose |
|------|---------|
| `.env.development` | Local dev — uses `/api` (Vite proxy → `localhost:3001`) |
| `.env.production` | Production build — set `VITE_API_URL` to your live API |
| `.env.local` | Optional overrides (gitignored) |

Example production value:

```
VITE_API_URL=https://travel-package-builder-node.onrender.com/api
```

### Deploy to Vercel

1. Import the `travel-package-builder` repo on Vercel
2. Add this **Environment Variable** (Production):

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://travel-package-builder-node.onrender.com/api` |

3. Deploy

4. Then on **Render** (backend), set CORS to your Vercel URL:

| Key | Value |
|-----|-------|
| `CLIENT_ORIGIN` | `https://your-app.vercel.app` |
| `FRONTEND_URL` | `https://your-app.vercel.app` |
| `BASE_URL` | `https://travel-package-builder-node.onrender.com` |

Replace `your-app.vercel.app` with your actual Vercel domain after the first deploy.

On Vercel/Netlify, you can set `VITE_API_URL` in the dashboard instead of editing `.env.production`.

## If you are replacing the old MVP

From the project folder:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

Replace the old project files with this ZIP, then:

```powershell
npm install
npm run dev
```

## Included

- React + stable Vite 6
- No Rolldown
- General package editor
- Cover editor
- Journey editor
- Hotel option builder
- Day-by-day itinerary builder
- Included/excluded lists
- Pricing view
- Fine print
- Live customer preview
- LocalStorage autosave
- Reset sample
- Browser print/export workflow

The initial data is based on the supplied Odisha package structure.
