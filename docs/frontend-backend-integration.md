# Frontend ↔ Backend Integration

This document explains how the Next.js frontend and the Express backend work together inside the Campus Connect monorepo.

## Repository Layout

```
/
├── campusconnect-api/          # Node/Express backend
├── campusconnect-frontend/     # Next.js 14 frontend
├── docs/                       # Shared documentation
└── FRONTENDANALYSIS.md         # Design notes that guided the UI build-out
```

## Local Development Workflow

1. **Install dependencies**
   ```bash
   cd campusconnect-api && npm install
   cd ../campusconnect-frontend && npm install
   ```

2. **Environment Variables**
   - Backend: configure `campusconnect-api/.env` from `.env.example` (`MONGO_URI` is required).
   - Frontend: copy `campusconnect-frontend/.env.example` to `.env.local`. Set `NEXT_PUBLIC_API_URL` to the backend base including the version prefix (e.g. `http://localhost:3000/api/v1`). The code reads this name; older docs that mentioned `NEXT_PUBLIC_API_BASE_URL` were wrong.

3. **Run the services**
   - API: `npm run dev` from `campusconnect-api/` (listens on port `3000` by default).
   - Frontend: `npm run dev` from `campusconnect-frontend/` (Next.js typically uses `3001` if `3000` is taken)

4. **Cross-Origin Requests**
   - Feature hooks under `campusconnect-frontend/src/hooks/` use the shared Axios client in `src/lib/api/client.ts`, whose `baseURL` comes from `NEXT_PUBLIC_API_URL` and which sends `Authorization: Bearer <token>` from the Zustand auth store.
   - The API `protect` middleware accepts that Bearer header (and still accepts the legacy `x-auth-token` header for older clients).
   - If additional CORS configuration is required, update the Express middleware in `campusconnect-api/src/app.js`.

## Shared Contracts

- REST endpoints are defined in `campusconnect-api/openapi.yaml`. Import this file into API exploration tools to stub frontend data fetching. The file covers the core auth/courses/assignments/submissions/notifications paths; a few live routes (for example enroll, some assignment CRUD variants, `/users/me`, and analytics) are not fully reflected there yet.
- Frontend code should reference DTO types derived from this schema (planned future automation).

## Next Steps

- Add component-level tests with React Testing Library.
- Keep OpenAPI in sync with the live routes listed in the API README.

Auth state (Zustand), dashboard/courses/assignments routes, and the notification/profile pages are already in the tree under `campusconnect-frontend/src/`.

This structure keeps the two applications decoupled while making it easy to run them together during development and deployment.
