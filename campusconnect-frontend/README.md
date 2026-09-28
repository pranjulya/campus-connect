# Campus Connect Frontend

Next.js 14 frontend for Campus Connect. It pairs with the Express API in `campusconnect-api/`.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) primitives under `src/components/ui/` (add more with `npx shadcn@latest init` / `npx shadcn@latest add …`; the rest of this package uses npm)
- Code also imports Axios, TanStack Query, Zustand, react-hook-form, Zod, and Radix UI helpers — these are used in `src/` but are not yet listed in `package.json` (install them before a clean `npm install` will run)

## Getting Started

1. **Install dependencies**

   ```bash
   cd campusconnect-api
   npm install
   cd ../campusconnect-frontend
   npm install
   ```

2. **Copy environment variables**

   ```bash
   cp .env.example .env.local
   ```

   The app reads `NEXT_PUBLIC_API_URL` (see `.env.example`). Set it to the API base including the version prefix, e.g. `http://localhost:3000/api/v1`. Hook fallbacks that omit this variable still point at a legacy `http://localhost:5000/api` default — always set the env var for local work.

3. **Run both servers**

   ```bash
   # Backend (from campusconnect-api/)
   npm run dev

   # Frontend (second terminal, from campusconnect-frontend/)
   npm run dev
   ```

   The Next.js app runs on `http://localhost:3001` by default (Next picks another port if 3000 is taken by the API).

### Known issue: backend start scripts

`npm start` / `npm run dev` inside `campusconnect-api/` currently point at `campusconnect-api/src/server.js` (a path that only makes sense from the monorepo root) and the package has no `"type": "module"`. Until those script/package fixes land, starting the API from the package directory fails. See the root README for status.

## API client

`src/lib/api/client.ts` default-exports a bare Axios instance whose `baseURL` is `process.env.NEXT_PUBLIC_API_URL`. Most feature hooks under `src/hooks/` create their own Axios instance the same way and attach `Authorization: Bearer <token>` from the Zustand auth store (`src/store/auth.ts`).

Note: the API auth middleware currently reads the `x-auth-token` header, not `Authorization`. Token header alignment is a known code mismatch — do not assume the shared client adds `x-auth-token` today.

Example (matches the default export):

```tsx
import client from "@/lib/api/client";

export async function fetchCourses() {
  const { data } = await client.get("/courses");
  return data;
}
```

Pages that need TanStack Query should sit under the `<QueryProvider />` already wired in the root layout.

## Project Structure

```
campusconnect-frontend/
├── src/
│   ├── app/
│   │   ├── courses/         # list, create, detail, edit, assignments
│   │   ├── dashboard/
│   │   ├── login/ / register/
│   │   ├── notifications/
│   │   ├── profile/
│   │   ├── docs/            # living backend / OpenAPI docs pages
│   │   ├── providers/       # React Query, theme
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/          # forms, layout, shadcn ui/*
│   ├── hooks/               # per-resource data hooks (Axios + TanStack Query)
│   ├── store/               # Zustand auth store
│   ├── lib/
│   │   ├── api/client.ts    # shared Axios instance
│   │   ├── queryClient.ts
│   │   └── utils.ts
│   └── middleware.ts
├── .env.example
├── package.json
└── tailwind.config.ts
```
