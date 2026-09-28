# Campus Connect

Campus Connect is a platform for communication and collaboration between students, professors, and administrators. It covers authentication with role-based access, courses and enrollment, assignments, submissions with grading, and notifications.

This repository contains two packages:

| Package | Stack | Docs |
|---------|-------|------|
| [`campusconnect-api/`](campusconnect-api/) | Node.js, Express, MongoDB (Mongoose), JWT, Jest | [API README](campusconnect-api/README.md), [`openapi.yaml`](campusconnect-api/openapi.yaml) |
| [`campusconnect-frontend/`](campusconnect-frontend/) | Next.js 14, React 18, TypeScript, Tailwind CSS | [Frontend README](campusconnect-frontend/README.md) |

## Prerequisites

- **Node.js** 18 or newer (20 LTS recommended)
- **MongoDB** running locally, or a MongoDB Atlas connection string
- npm (comes with Node)

## Quick start

```bash
git clone https://github.com/pranjulya/campus-connect.git
cd campus-connect

# Backend
cd campusconnect-api
cp .env.example .env   # set MONGO_URI (required) and JWT_SECRET
npm install
npm run dev            # API listens on PORT from .env (default 3000)

# Frontend (second terminal)
cd ../campusconnect-frontend
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
npm install
npm run dev
```

`MONGO_URI` is mandatory — the API will not start without it.

### Known issue: backend start scripts

Inside `campusconnect-api/`, `npm start` / `npm run dev` currently invoke `node campusconnect-api/src/server.js` (a monorepo-root path) and the package lacks `"type": "module"`. Until those package fixes land, the documented start commands fail when run from the API directory. Track that as a code fix; the docs above describe the intended workflow.

See each package README for tests and endpoint details.

## More documentation

- [PROJECT.md](PROJECT.md): project goals and scope
- [FRONTENDANALYSIS.md](FRONTENDANALYSIS.md): frontend design notes
- [docs/frontend-backend-integration.md](docs/frontend-backend-integration.md): how the frontend and API work together locally

## License

MIT. See [LICENSE](LICENSE).
