# Payment Checkout

Full-stack credit card payment checkout:

- **`backend/`** — NestJS + TypeScript API with hexagonal architecture (ports & adapters). Product catalog, payment processing against the provider sandbox, transaction status tracking, stock management and delivery assignment.
- **`mobile/`** — React Native app with the 7-step checkout flow (splash, product catalog, product selection, checkout, credit card form, payment summary and final status), hexagonal architecture, Redux (Flux) with AES-256 encrypted persistence, and a purchase history screen.

## Backend

### Requirements

- Node.js 22+
- Docker (for PostgreSQL)

### Setup & run

```bash
cd backend
npm install
cp .env.example .env   # fill in the sandbox API keys
docker compose up -d   # PostgreSQL on port 5433
npm run start:dev      # API on http://localhost:3000
```

Products are seeded automatically on first boot. Interactive API docs (Swagger): **`http://localhost:3000/api/docs`**

Fully containerized alternative (production Dockerfile):

```bash
docker compose --profile full up -d --build
```

### API

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/products` | Product catalog with current stock |
| `POST` | `/transactions` | Create a card payment (creates PENDING, calls the provider, assigns product and updates stock on approval) |
| `GET` | `/transactions/:id` | Transaction status; refreshes against the provider while `PENDING` |

### Payment flow

1. Validates the product and its stock.
2. Creates an internal transaction in `PENDING` with a unique reference.
3. Tokenizes the card and requests the payment to the provider (SHA-256 integrity signature + fresh acceptance token).
4. On provider failure the transaction is rolled back and a `502` is returned.
5. On approval (immediately or via polling `GET /transactions/:id`) the product is assigned to the customer (`deliveryStatus: ASSIGNED`) and the stock is decreased.

## Backend tests

Unit tests with Jest. All external boundaries (payment provider, database, config) are mocked — no network or database needed.

```bash
cd backend
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

## Mobile app

React Native app (community CLI, TypeScript) with hexagonal architecture, Redux Toolkit (Flux) and encrypted state persistence via MMKV (AES-256). Full setup, architecture and the 7-step flow are documented in **[`mobile/README.md`](mobile/README.md)**.

### Setup & run

```bash
cd mobile
npm install
npm start            # Terminal 1: Metro
npm run android      # Terminal 2: build & run (backend must be running on port 3000)
```

The Android emulator reaches the backend at `http://10.0.2.2:3000`.

### Prebuilt APK

Download the signed release APK from the **[Releases page](https://github.com/eliascolon98/test-payment-checkout/releases/latest)** — install with `adb install app-release.apk`.

The release APK works out of the box against the **cloud backend on Railway** (`https://test-payment-checkout-production.up.railway.app`) — no local server needed. Development builds automatically target the local backend instead (via `__DEV__`).

### Cloud deployment

The backend is deployed on **Railway** using the existing `backend/Dockerfile` and a managed PostgreSQL instance:

- API: `https://test-payment-checkout-production.up.railway.app`
- Health: [`/health`](https://test-payment-checkout-production.up.railway.app/health) · Swagger: [`/api/docs`](https://test-payment-checkout-production.up.railway.app/api/docs)

## Mobile tests

Unit tests with Jest and `@testing-library/react-native`. Domain, application and infrastructure layers are tested in isolation (gateways and MMKV mocked); components and screens use a test Redux store.

```bash
cd mobile
npm test
npm test -- --coverage
```

### Results

```
Test Suites: 27 passed, 27 total
Tests:       73 passed, 73 total
```

| Metric | Coverage |
|---|---|
| Statements | **98.34%** |
| Branches | **93.37%** |
| Functions | **95.41%** |
| Lines | **98.27%** |
