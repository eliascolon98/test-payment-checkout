# Payment Checkout

Full-stack credit card payment checkout:

- **[`backend/`](backend/README.md)** — NestJS + TypeScript API with hexagonal architecture. Product catalog, payment processing against the provider sandbox, transaction status tracking, stock management and delivery assignment. Unit tested with Jest (>80% coverage). See the [backend README](backend/README.md) for setup, running and test instructions.
- **`mobile/`** — React Native app with the 7-step checkout flow (splash, product catalog, product selection, checkout, credit card form, payment summary and final status). _In progress._

## Quick start

```bash
cd backend
npm install
cp .env.example .env   # fill in the sandbox keys
docker compose up -d
npm run start:dev      # API on http://localhost:3001 — Swagger at /api/docs
```
