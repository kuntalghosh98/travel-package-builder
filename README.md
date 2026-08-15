# Travel Package Builder MVP v2

This version removes the Vite 8 / Rolldown dependency that caused the Windows native-binding error.

## Requirements

- Node.js 18+ (Node 20 LTS recommended)
- npm

## Run

```powershell
npm install
npm run dev
```

Then open the URL printed by Vite.

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
