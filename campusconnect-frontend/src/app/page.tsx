import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <span className="rounded-full bg-slate-800/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
        Campus Connect
      </span>
      <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
        Frontend workspace is ready to connect with the Campus Connect API.
      </h1>
      <p className="max-w-2xl text-lg text-slate-300">
        Start building the student dashboard, course experiences, and more using Next.js 14, Tailwind CSS, React Query, and
        Zustand. API calls can be issued through the shared Axios client configured under <code className="rounded bg-slate-900 px-1">src/lib/api</code>.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <Link
          href="https://nextjs.org/docs"
          className="rounded-full border border-white/10 px-5 py-2 font-medium text-slate-100 transition hover:border-white/40 hover:text-white"
        >
          Next.js Docs
        </Link>
        <Link
          href="/docs/backend"
          className="rounded-full border border-white/10 px-5 py-2 font-medium text-slate-100 transition hover:border-white/40 hover:text-white"
        >
          API Integration Guide
        </Link>
      </div>
    </main>
  );
}
