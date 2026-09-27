# Campus Connect

Campus Connect is a platform for communication and collaboration between students, professors, and administrators. It covers authentication with role-based access, courses and enrollment, assignments, submissions with grading, and notifications.

This repository contains two packages:

| Package | Stack | Docs |
|---------|-------|------|
| [`campusconnect-api/`](campusconnect-api/) | Node.js, Express, MongoDB (Mongoose), JWT, Jest | [API README](campusconnect-api/README.md), [`openapi.yaml`](campusconnect-api/openapi.yaml) |
| [`campusconnect-frontend/`](campusconnect-frontend/) | Next.js 14, React 18, TypeScript, Tailwind CSS | [Frontend README](campusconnect-frontend/README.md) |

## Quick start

```bash
git clone https://github.com/pranjulya/campus-connect.git
cd campus-connect

# Backend
cd campusconnect-api
cp .env.example .env   # set MONGO_URI and JWT_SECRET
npm install

# Frontend
cd ../campusconnect-frontend
cp .env.example .env.local   # NEXT_PUBLIC_API_BASE_URL defaults to http://localhost:3000/api/v1
npm install
npm run dev
```

See each package README for how to run and test it.

## More documentation

- [PROJECT.md](PROJECT.md): project goals and scope
- [FRONTENDANALYSIS.md](FRONTENDANALYSIS.md): frontend design notes
- [docs/frontend-backend-integration.md](docs/frontend-backend-integration.md): how the frontend and API work together locally

## License

MIT. See [LICENSE](LICENSE).
