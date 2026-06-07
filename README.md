# ShopKit / Maksuz E-commerce Platform

A modern e-commerce SaaS platform for small and medium businesses in Bosnia and Herzegovina.

The repository contains two applications:

- **`maksuz-server`** — Express.js + TypeScript REST API (MongoDB)
- **`maksuz-web`** — Next.js 15 frontend (storefront + admin panel)

## Live Deployment

- **Storefront:** https://maksuz-web-b9f8eac5e948.herokuapp.com/
- **API:** https://maksuz-server-68bc30ba8ab2.herokuapp.com/

Demo admin login is documented in [`docs/PROJECT_DOCUMENTATION.md`](docs/PROJECT_DOCUMENTATION.md).

## Tech Stack

### Backend (`maksuz-server`)
- **Runtime:** Node.js 22 + TypeScript
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (access + refresh tokens), Google OAuth
- **Validation:** Zod
- **Storage:** Google Cloud Storage (product images)
- **Email:** Nodemailer (SMTP)
- **Architecture:** MVCS (Model–View–Controller–Service)
- **Tests:** Jest + ts-jest + mongodb-memory-server

### Frontend (`maksuz-web`)
- **Framework:** Next.js 15 (App Router)
- **UI:** React 19 + Tailwind CSS + Shadcn/ui
- **State/Data:** TanStack React Query + React Context
- **Auth:** NextAuth (Google) + JWT
- **Forms:** React Hook Form + Zod

## Getting Started

Both apps use **Yarn** and have their own `.env` (see each app for the required variables).

### Backend
```bash
cd maksuz-server
yarn install
# create .env with MONGODB_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET,
# GCS_*, SMTP_*, GOOGLE_CLIENT_ID/SECRET, etc.
yarn dev            # nodemon + ts-node (default http://localhost:5000)
```

### Frontend
```bash
cd maksuz-web
yarn install
# create .env with NEXT_PUBLIC_API_URL, NEXTAUTH_*, GOOGLE_CLIENT_ID/SECRET, etc.
yarn dev            # Next.js dev server on http://localhost:3000
```

## Testing

```bash
cd maksuz-server
yarn test           # Jest — 17 tests across 4 suites
```

Service tests run against an in-memory MongoDB (`mongodb-memory-server`), so they
exercise the real Mongoose driver. See [`maksuz-server/tests/`](maksuz-server/tests/).

## Build & Deploy

Each app is deployed as its own Heroku app, built from its subfolder.

```bash
cd maksuz-server && yarn build   # tsc -> dist/
cd maksuz-web    && yarn build   # next build
```

The backend runs `node dist/app.js` (Procfile) and the frontend runs
`next start -p $PORT`; both read configuration from environment variables.

## Selected API Endpoints

- `GET  /api/health` — Health check
- `POST /api/auth/register` — User registration
- `POST /api/auth/login` — User login
- `GET  /api/products` — List products
- `POST /api/products` — Create product (admin)
- `GET  /api/categories` — List categories
- `POST /api/orders` — Create order (registered)
- `POST /api/orders/guest` — Create order (guest checkout)

## Project Structure

```
ecommerce-platform/
├── maksuz-server/         # Express.js + TypeScript backend
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── views/
│   │   ├── utils/
│   │   ├── types/
│   │   └── app.ts
│   ├── scripts/           # seed / maintenance scripts
│   └── tests/             # Jest test suite
├── maksuz-web/            # Next.js 15 frontend
│   └── src/
│       ├── app/           # App Router pages (shop, admin, auth)
│       ├── components/
│       ├── hooks/
│       ├── contexts/
│       ├── config/
│       ├── models/
│       └── lib/
└── docs/                  # Documentation, ER diagram, screenshots
    ├── PROJECT_DOCUMENTATION.md
    ├── PROJECT_DOCUMENTATION.pdf
    ├── ER-diagram.(dbml|png|svg)
    └── screenshots/
```

## Documentation

Full project documentation (architecture, design patterns, coding standards,
tests, deployment, screenshots) is in
[`docs/PROJECT_DOCUMENTATION.md`](docs/PROJECT_DOCUMENTATION.md)
(PDF: [`docs/PROJECT_DOCUMENTATION.pdf`](docs/PROJECT_DOCUMENTATION.pdf)).
