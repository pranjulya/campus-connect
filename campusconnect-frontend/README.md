# Campus Connect Frontend

Next.js 14 frontend for Campus Connect. It pairs with the Express API in `campusconnect-api/`.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) primitives under `src/components/ui/` (add more with `npx shadcn@latest init` / `npx shadcn@latest add …`; the rest of this package uses npm)
- Axios, TanStack Query, Zustand, react-hook-form, Zod, Radix UI helpers, class-variance-authority, clsx, tailwind-merge, next-themes (declared in `package.json`)

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

   The app reads `NEXT_PUBLIC_API_URL` (see `.env.example`). Set it to the API base including the version prefix, e.g. `http://localhost:3000/api/v1` (this is also the fallback used by `src/lib/api/client.ts` when the variable is unset).

3. **Run both servers**

   ```bash
   # Backend (from campusconnect-api/)
   npm run dev

   # Frontend (second terminal, from campusconnect-frontend/)
   npm run dev
   ```

   The Next.js app runs on `http://localhost:3001` by default (Next picks another port if 3000 is taken by the API).

## API client

`src/lib/api/client.ts` is the shared Axios instance. Its `baseURL` is `process.env.NEXT_PUBLIC_API_URL` (default `http://localhost:3000/api/v1`) and it attaches `Authorization: Bearer <token>` from the Zustand auth store (`src/store/auth.ts`). Feature hooks under `src/hooks/` import this client.

The Zustand store also mirrors the token into a `cc_token` cookie so Edge middleware (`src/middleware.ts`) can redirect unauthenticated users to `/login`. The cookie is only a routing hint — the API still verifies the JWT on every request. Prefer this over trying to read the Zustand store from middleware (Edge cannot see client state).

Example:

```tsx
import client from "@/lib/api/client";

export async function fetchCourses() {
  const { data } = await client.get("/courses");
  return data;
}
```

Pages that need TanStack Query sit under the `<QueryProvider />` wired in the root layout.

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
