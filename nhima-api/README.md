# NHIMA API — TypeScript + Express + Drizzle ORM + Neon PostgreSQL

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in your DATABASE_URL, JWT secrets etc.
```

### 3. Push schema to Neon (creates all tables)
```bash
npm run db:push
```

### 4. Start development server
```bash
npm run dev
```

---

## Database commands

| Command | Description |
|---|---|
| `npm run db:push` | Push schema directly to Neon (fastest for dev) |
| `npm run db:generate` | Generate SQL migration files |
| `npm run db:migrate` | Run generated migrations |
| `npm run db:studio` | Open Drizzle Studio (visual DB browser) |

---

## Auth Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register any role |
| POST | `/api/auth/login` | Public | Login (pass `role` in body) |
| POST | `/api/auth/refresh` | Public | Rotate refresh token |
| POST | `/api/auth/logout` | Bearer | Revoke refresh token |
| GET | `/api/auth/me` | Bearer | Current user profile |
| PUT | `/api/auth/change-password` | Bearer | Change password |

### Login body example
```json
{
  "email": "admin@nhima.gov.zm",
  "password": "Admin@1234",
  "role": "ADMIN"
}
```

---

## Project Structure

```
src/
├── db/
│   ├── schema.ts          ← All Drizzle table definitions
│   └── index.ts           ← Neon + Drizzle connection
├── controllers/
│   └── auth.controller.ts
├── middleware/
│   ├── auth.middleware.ts     ← authenticate, authorize
│   └── validate.middleware.ts ← express-validator rules
├── routes/
│   └── auth.routes.ts
├── utils/
│   ├── jwt.ts
│   ├── response.ts
│   └── nhimaId.ts
├── types/
│   └── index.ts           ← TokenPayload, AuthRequest, UserRole
├── app.ts
└── server.ts
```

## Protecting routes

```ts
import { authenticate, authorize } from '../middleware/auth.middleware'

// Any logged-in user
router.get('/profile', authenticate, controller.getProfile)

// Admin only
router.get('/users', authenticate, authorize('ADMIN'), controller.listUsers)

// Admin or Agent
router.post('/members', authenticate, authorize('ADMIN', 'AGENT'), controller.create)
```
