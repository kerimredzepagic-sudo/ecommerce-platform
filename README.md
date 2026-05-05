# ShopKit E-commerce Platform

A modern e-commerce SaaS platform for small and medium businesses in Bosnia and Herzegovina.

## Tech Stack

### Backend (`/server`)
- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (access + refresh tokens)
- **Validation:** Zod
- **Architecture:** MVCS (Model-View-Controller-Service)

### Frontend (`/client`)
- **Framework:** Next.js 15 (App Router)
- **UI:** React 19 + Tailwind CSS + Shadcn/ui
- **State:** TanStack React Query + React Context
- **Forms:** React Hook Form + Zod

## Getting Started

### Backend
```bash
cd server
npm install
cp .env.example .env   # Configure your environment
npm run dev            # Starts on http://localhost:5000
```

### Frontend
```bash
cd client
npm install --legacy-peer-deps
npm run dev            # Starts on http://localhost:3000
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - List products
- `POST /api/products` - Create product (admin)
- `GET /api/categories` - List categories
- `POST /api/orders` - Create order

## Project Structure

```
shopkit-ecommerce/
├── server/          # Express.js backend
│   └── src/
│       ├── config/
│       ├── models/
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       ├── middleware/
│       ├── validators/
│       ├── views/
│       └── utils/
├── client/          # Next.js frontend
│   └── src/
│       ├── app/
│       ├── components/
│       ├── hooks/
│       ├── contexts/
│       └── lib/
└── docs/            # Documentation & ER diagram
```
