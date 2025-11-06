# Campus Connect Frontend

This package houses the Next.js 14 frontend for Campus Connect. It is designed to pair with the existing Express API in `campusconnect-api` and follows the architecture described in `FRONTENDANALYSIS.md`.

## Stack

- [Next.js 14](https://nextjs.org/) with the App Router
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui primitives](https://ui.shadcn.com/) ready (install via `pnpm dlx shadcn-ui@latest init` when components are needed)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand) (for forthcoming auth state)
- [Axios](https://axios-http.com/) with an interceptor-friendly API client

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

   Adjust values as needed. By default the app expects the backend to run on `http://localhost:3000/api/v1`.

3. **Run both servers**

   ```bash
   # Backend
   cd campusconnect-api
   npm run dev

   # Frontend (in a second terminal)
   cd campusconnect-frontend
   npm run dev
   ```

   The Next.js app runs on `http://localhost:3001` by default (Next chooses a free port if 3000 is taken by the API).

## Shared API Client

Use the Axios instance exported from `src/lib/api/client.ts` to issue requests. It automatically:

- Reads `NEXT_PUBLIC_API_BASE_URL`
- Applies the `x-auth-token` header when a token accessor is provided
- Keeps configuration isolated from feature components

Example usage:

```tsx
import { apiClient } from "@/lib/api/client";

export async function fetchCourses() {
  const { data } = await apiClient.get("/courses");
  return data;
}
```

Wrap pages that need TanStack Query in the provided `<QueryProvider />` (already included in the root layout). When authentication persistence lands, update `createApiClient` with a token getter sourced from Zustand or cookies.

## Project Structure

```
campusconnect-frontend/
├── src/
│   ├── app/
│   │   ├── docs/            # Living documentation for backend integration
│   │   ├── providers/       # React context wrappers (React Query, theme)
│   │   └── page.tsx         # Landing page placeholder
│   ├── lib/
│   │   ├── api/             # Axios clients
│   │   └── queryClient.ts   # Shared QueryClient instance
│   └── app/globals.css      # Tailwind entrypoint
├── .env.example             # Frontend environment defaults
├── package.json
└── tailwind.config.ts
```

This skeleton keeps implementation details modular while making it clear how data flows from the backend into the frontend dashboard and future pages.
