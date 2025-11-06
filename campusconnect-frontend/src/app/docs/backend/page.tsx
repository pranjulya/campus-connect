import Link from "next/link";

const steps = [
  {
    title: "Install dependencies",
    body: "Run `npm install` inside both the campusconnect-api and campusconnect-frontend folders to install backend and frontend packages."
  },
  {
    title: "Start the API server",
    body: "From `campusconnect-api`, run `npm run dev` (or `npm start`) to boot the Express server on port 3000."
  },
  {
    title: "Configure the frontend",
    body: "Copy `.env.example` to `.env.local` in `campusconnect-frontend` and set `NEXT_PUBLIC_API_BASE_URL` to `http://localhost:3000/api/v1`."
  },
  {
    title: "Launch the Next.js app",
    body: "Run `npm run dev` from `campusconnect-frontend`. Requests made with the shared API client automatically include the configured base URL and auth headers."
  }
];

export default function BackendDocsPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Integration Guide</p>
        <h1 className="text-4xl font-semibold text-slate-100">Connect the frontend to the Campus Connect API</h1>
        <p className="text-slate-300">
          The Campus Connect frontend is configured to talk to the existing Express API. Follow these steps to run both projects locally
          and share authentication state between them.
        </p>
      </div>
      <ol className="space-y-6">
        {steps.map((step) => (
          <li key={step.title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
            <h2 className="text-xl font-semibold text-white">{step.title}</h2>
            <p className="mt-2 text-slate-300">{step.body}</p>
          </li>
        ))}
      </ol>
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-400">
        <span>Need to inspect the API contract?</span>
        <Link className="text-slate-200 underline hover:text-white" href="/docs/openapi">
          View OpenAPI reference
        </Link>
      </footer>
    </main>
  );
}
