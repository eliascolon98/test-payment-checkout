# Payment Checkout API

Backend API for a credit card payment checkout, built with **NestJS + TypeScript** following a **hexagonal architecture** (ports & adapters). It exposes a product catalog and processes card payments against the payment provider sandbox, tracking each transaction from `PENDING` to its final status and assigning the purchased product to the customer.

## Architecture

```
src/
├── domain/          # Framework-independent core
│   ├── model/       # Types, enums and domain exceptions
│   ├── interface/   # Ports (IPaymentGateway, IProductRepository, ...)
│   └── usecase/     # Business logic (plain classes, no NestJS)
├── adapter/
│   ├── in/http/     # Controllers (inbound adapters)
│   └── out/         # Postgres repositories + payment provider client (outbound adapters)
├── handler/         # Bridges controllers and use cases, shapes HTTP responses
├── model/           # DTOs and standard HTTP response model
├── common/          # Config validation, exception filter, logger
└── instance-domain.module.ts  # Wires ports to adapters via factory providers
```

**Payment flow** (`POST /transactions`):

1. Validates the product and its stock.
2. Creates an internal transaction in `PENDING` with a unique reference.
3. Tokenizes the card and requests the payment to the provider (with SHA-256 integrity signature and a fresh acceptance token).
4. On provider failure the transaction is rolled back and a `502` is returned.
5. On approval (immediately or via `GET /transactions/:id` polling) the product is assigned to the customer (`deliveryStatus: ASSIGNED`) and the stock is decreased.

## Requirements

- Node.js 22+
- Docker (for PostgreSQL)

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in the real values (see below)
```

`.env` variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string. With the provided compose: `postgresql://postgres:postgres@localhost:5433/payment_checkout` |
| `PAYMENT_API_URL` | Payment provider sandbox base URL |
| `PAYMENT_PUBLIC_KEY` | Provider public key (sandbox) |
| `PAYMENT_PRIVATE_KEY` | Provider private key (sandbox) |
| `PAYMENT_INTEGRITY_SECRET` | Secret used for the transaction integrity signature |
| `PAYMENT_EVENTS_KEY` | Provider events key (sandbox) |
| `PORT` | API port (default `3001`) |

The application validates all variables on startup (Joi) and will not boot with an incomplete environment.

## Running

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Start the API (watch mode)
npm run start:dev
```

The API runs on `http://localhost:3001`. Products are seeded automatically on first boot.

### Fully containerized (Dockerfile ready to use)

```bash
docker compose --profile full up -d --build
```

This builds the multi-stage production image and runs API + PostgreSQL together.

## API

Interactive documentation (Swagger): **`http://localhost:3001/api/docs`**

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/products` | Product catalog with current stock |
| `POST` | `/transactions` | Create a card payment (validated card data) |
| `GET` | `/transactions/:id` | Transaction status; refreshes against the provider while `PENDING` |

Example request:

```bash
curl -s -X POST localhost:3001/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "<uuid from GET /products>",
    "quantity": 1,
    "customerEmail": "customer@example.com",
    "card": {
      "number": "4242424242424242",
      "cvc": "123",
      "expMonth": "08",
      "expYear": "28",
      "cardHolder": "John Doe"
    }
  }'
```

## Tests

Unit tests with Jest. All external boundaries (HTTP provider, database, config) are mocked — no network or database needed to run them.

```bash
npm test           # run the suite
npm run test:cov   # run with coverage
```

### Results

```
Test Suites: 21 passed, 21 total
Tests:       72 passed, 72 total
```

| Metric | Coverage |
|---|---|
| Statements | **100%** |
| Branches | **82.39%** |
| Functions | **100%** |
| Lines | **100%** |

> Coverage excludes only wiring files with no logic (`*.module.ts`, `main.ts` and `index.ts` barrels). Remaining uncovered branches come from decorator metadata counted by istanbul.
