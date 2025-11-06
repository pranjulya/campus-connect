import Link from "next/link";

export default function OpenAPIDocsPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-16">
      <h1 className="text-4xl font-semibold text-white">Backend OpenAPI reference</h1>
      <p className="text-slate-300">
        The full REST contract for Campus Connect lives in the backend repository at
        <code className="mx-2 rounded bg-slate-900 px-2 py-1 text-slate-100">campusconnect-api/openapi.yaml</code>. Import the file into
        tools like Stoplight Studio, Swagger UI, or Postman to explore endpoints and sample payloads.
      </p>
      <ul className="list-disc space-y-2 pl-6 text-slate-300">
        <li>Authentication endpoints: <code className="rounded bg-slate-900 px-2 py-0.5">/api/v1/auth/login</code>, <code className="rounded bg-slate-900 px-2 py-0.5">/api/v1/auth/register</code></li>
        <li>Course management endpoints: <code className="rounded bg-slate-900 px-2 py-0.5">/api/v1/courses</code>, <code className="rounded bg-slate-900 px-2 py-0.5">/api/v1/courses/:id</code></li>
        <li>Assignment endpoints nested under courses: <code className="rounded bg-slate-900 px-2 py-0.5">/api/v1/courses/:courseId/assignments</code></li>
      </ul>
      <p className="text-slate-400">
        To keep the docs in sync as the API evolves, run backend tests and regenerate the schema whenever new routes are added.
      </p>
      <Link
        href="/docs/backend"
        className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-white/40 hover:text-white"
      >
        ← Back to integration guide
      </Link>
    </main>
  );
}
