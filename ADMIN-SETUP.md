# StreamVault admin dashboard setup

This ZIP includes the frontend, backend, MongoDB models and authenticated admin dashboard.

1. Extract this ZIP into a **new** folder. Do not overwrite your existing .env without copying it first.
2. In `backend`, run `npm install`. Copy your previous working `backend/.env` into the new `backend` directory, and add `JWT_SECRET=` followed by a randomly generated secret (32+ random bytes). Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
3. In `backend`, run `npm run create-admin` once, and provide your admin email and a password of at least 12 characters. Password is hashed in MongoDB. Avoid using an existing user's credentials.
4. Run `npm run dev` in backend. It should serve http://localhost:5000/api/health.
5. In a separate terminal in `frontend`, run `npm install`, then `npm run dev`.
6. Open http://localhost:5173/admin and sign in. Add a series, set Published, save it, then refresh the public homepage.
7. Manage episodes using the Episodes button. Video asset IDs are metadata only; **streaming playback and uploads are not yet implemented**.

The homepage currently shows demo titles if MongoDB has no published series. Publishing your first title switches it to database content. Do not use demo posters for commercial distribution without rights.

Security: This is a development starter. Production deployment needs HTTPS, CSRF/cookie strategy if moving from sessionStorage, media access authorization, strict content validation, URL safety controls, monitoring, audit logs and an adult age-assurance solution appropriate to local law. The existing 18+ checkbox is only a self-declaration, not verified age assurance. Use only licensed content featuring adults.
