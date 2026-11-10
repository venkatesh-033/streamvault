# StreamVault frontend

## Requirements
- Node.js 20 or newer (Node.js 22 is fine)
- npm

## Run on Windows PowerShell
1. Extract the ZIP file.
2. Open the extracted `stream-vault` folder in VS Code.
3. Open the terminal and run:

```powershell
cd frontend
npm install
npm run dev
```

4. Open the local URL printed by Vite (usually http://localhost:5173).

**Important:** Run `npm install` inside the `frontend` folder, where `package.json` is located.

## Production build check
```powershell
npm run build
```

This is a frontend starter. The series catalogue currently uses sample data; backend, MongoDB, user accounts, and licensed video delivery will be connected in later phases.

## Frontend ↔ Backend integration

1. Start MongoDB-connected backend in `backend`: `npm run dev`.
2. In `frontend`, copy `.env.example` to `.env` (or create `.env`) and set `VITE_API_URL=http://localhost:5000/api`.
3. Install frontend dependencies: `npm install`.
4. Start frontend: `npm run dev`.
5. Add published series documents to MongoDB. The API is `GET /api/series`; detail endpoint is `GET /api/series/:slug`.

The homepage loads published series from the API. If the API is unavailable or the database has no published titles, it retains the local demo catalogue so the UI remains usable.


## Bunny Stream video integration

### Configure Bunny
1. Create a Bunny.net account and a Stream video library.
2. From the library, copy its Library ID and API key.
3. Enable Embed Token Authentication in the library's Security settings and copy its token authentication key.
4. In the Bunny library's allowed referrers / embed restrictions, allow your deployed website hostname. During local development, allow `localhost` if Bunny permits it.
5. Copy `backend/.env.example` to `backend/.env` (preserve your existing MongoDB URI, JWT secret and CLIENT_URL) and set:
   - `BUNNY_LIBRARY_ID`
   - `BUNNY_LIBRARY_API_KEY`
   - `BUNNY_TOKEN_AUTH_KEY`

Do not put Bunny API or token-authentication keys in the frontend environment.

### Install and run
In `backend`:
```powershell
npm install
npm run dev
```
In a second terminal, in `frontend`:
```powershell
npm install
npm run dev
```

### Upload an episode
1. Sign in at `/admin`.
2. Create and save a series, then open its Episodes panel.
3. Create an episode and publish it when appropriate.
4. Choose an MP4, MOV or WebM file beside that episode. The current starter uses in-memory upload and limits files to 200 MB.
5. Use **Refresh processing status** until the episode status is `ready`.
6. Open the series card on the homepage. The episode appears in its detail modal; choose Watch.

The backend stores Bunny's video GUID and processing state in MongoDB. Public playback is issued only for published episodes whose status is `ready`, using a short-lived signed Bunny embed URL. For paid or private catalogues, add your viewer authentication and entitlement checks to `backend/routes/playbackRoutes.js` before issuing playback URLs.

### Important production notes
- The current upload endpoint buffers the complete file in server memory and is intended for small local tests (up to 200 MB). Use direct-to-Bunny browser uploads with a server-generated upload authorization or a resumable upload workflow for larger files and production.
- Configure Bunny embed token authentication and allowed embed domains in the Bunny dashboard. A short-lived signed URL alone is not a substitute for domain restrictions or viewer entitlement checks.
- The status refresh button queries Bunny's video details API and marks an episode ready when `encodeProgress` reaches 100.
- Do not commit `.env` files or share API keys.
