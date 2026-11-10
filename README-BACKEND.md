# StreamVault backend setup
1. Open a terminal in `stream-vault/backend`.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and replace the MongoDB URI with your own Atlas connection string. Never share or commit `.env`.
4. In MongoDB Atlas, create a database user and allow your current IP address in Network Access.
5. Run `npm run dev`.
6. Test `http://localhost:5000/api/health`.

Endpoints: `GET /api/health`, `GET /api/series`, `GET /api/series?search=title`, `GET /api/series?genre=Drama`, `GET /api/series/:slug`.
Only published series and episodes are returned. Admin write routes and authenticated video playback will be added later. Only distribute content you have the rights to stream.


## Bunny Stream
See the root `README.md` section "Bunny Stream video integration" for credentials, setup, upload, processing and playback instructions.
