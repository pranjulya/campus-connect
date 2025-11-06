# Frontend ↔ Backend Integration

This document explains how the new Next.js frontend and the existing Express backend work together inside the Campus Connect monorepo.

## Repository Layout

```
/
├── campusconnect-api/          # Node/Express backend (existing)
├── campusconnect-frontend/     # Next.js 14 frontend (new)
├── docs/                       # Shared documentation
└── FRONTENDANALYSIS.md         # Design notes that guide the UI build-out
```

## Local Development Workflow

1. **Install dependencies**
   ```bash
   cd campusconnect-api && npm install
   cd ../campusconnect-frontend && npm install
   ```

2. **Environment Variables**
   - Backend: configure `campusconnect-api/.env` using the sample provided in `.env.example`.
   - Frontend: copy `campusconnect-frontend/.env.example` to `.env.local`. Set `NEXT_PUBLIC_API_BASE_URL` to the backend URL (e.g. `http://localhost:3000/api/v1`).

3. **Run the services**
   - API: `npm run dev` (listens on port `3000`)
   - Frontend: `npm run dev` (Next.js will pick another port, typically `3001`, if `3000` is taken)

4. **Cross-Origin Requests**
   - The Axios client in `src/lib/api/client.ts` automatically targets `NEXT_PUBLIC_API_BASE_URL` and attaches the `x-auth-token` header when a JWT is available.
   - If additional CORS configuration is required, update the Express middleware in `campusconnect-api/src/app.js`.

## Shared Contracts

- REST endpoints are defined in `campusconnect-api/openapi.yaml`. Import this file into API exploration tools to stub frontend data fetching.
- Frontend code should reference DTO types derived from this schema (planned future automation).

## Next Steps

- Implement authentication state with Zustand or cookies and provide the token getter to `createApiClient`.
- Scaffold feature routes under `src/app` (dashboard, courses, assignments) following the architecture sketched in `FRONTENDANALYSIS.md`.
- Add component-level tests with React Testing Library once UI implementation begins.

This structure keeps the two applications decoupled while making it easy to run them together during development and deployment.
