## Palia Mini‑Wiki

This project is a mini‑wiki for the game Palia. It provides a quick reference to selected game features, lets users look up information about creatures, and register tradeable items in their inventory. It is a single repository with a React frontend and a Node/Express backend.

### Technologies Used

- Frontend
  - React 19, TypeScript, Vite
  - TanStack Router, TanStack Query
  - Bootstrap 5, Bootstrap Icons
  - Google OAuth (client library present)
- Backend
  - Node.js, Express 5, CORS, dotenv
  - MySQL (via mysql2) or Local JSON (via LowDB) depending on env
- General
  - ESLint setup for the client

### Repository Structure

- `client/` React + Vite app (served under base path `/palia/`)
- `server/` Node/Express API (mounted at `/palia`)
- `env/` Environment files (e.g., `.env.palia`) used by the backend

### Prerequisites

- Node.js 18+ and npm
- Optional: MySQL server if running with a real database

### Environment

The backend loads environment variables from `env/.env.palia` by default. You can also use the provided npm scripts to point to other env files.

Common variables:

- `FRONTEND_URL` Frontend origin for CORS (default `http://localhost:5173`)
- `DB_HOST` MySQL host (if set, backend uses MySQL pool)
- `DB_USER` MySQL user
- `DB_PASSWORD` MySQL password
- `DB_NAME` MySQL database name

If `DB_HOST` is not set, the backend falls back to a local JSON storage layer (LowDB) for development.

### Running Locally

Run backend (port 8080):

```bash
cd server
npm install
npm start
```

Run frontend (Vite dev server at 5173):

```bash
cd client
npm install
npm run dev
```

Notes:

- The API is mounted at `/palia` (e.g., `http://localhost:8080/palia`).
- The frontend is built with base path `/palia/` to align with the backend route prefix.
- By default, the backend allows CORS from `http://localhost:5173` unless overridden via `FRONTEND_URL`.

### Scripts

- `client/`
  - `npm run dev` Start Vite dev server
  - `npm run build` Type-check and build for production
  - `npm run preview` Preview production build
- `server/`
  - `npm start` Start API with default env load (`env/.env.palia`)
