# Payment Checkout — Mobile

React Native app implementing the 7-step credit card checkout flow, built with **hexagonal architecture** (ports & adapters), **Redux** (Flux) for state management, and **encrypted state persistence**.

## Stack

- **React Native 0.86** (community CLI, TypeScript)
- **Redux Toolkit** + **redux-persist** for state (Flux architecture)
- **MMKV** with **AES-256 encryption** as the persistence backend (transaction data is never stored in plain text)
- **React Navigation** (native stack) for the screen flow
- **Axios** for the backend HTTP gateway
- **Jest** + **@testing-library/react-native** for testing

## Architecture (hexagonal)

```
src/
├── domain/            # Pure business logic — no framework dependencies
│   ├── models/        # Types (Product, Transaction, CardData…)
│   ├── ports/         # Interfaces (IProductGateway, IPaymentGateway)
│   ├── rules/         # card.ts (Luhn, brand detection, validation), stock.ts
│   └── format/        # money.ts, date.ts
├── application/       # Use cases and state (Redux)
│   ├── store/         # configureStore, slices (cart, checkout, history, products)
│   └── usecases/      # loadProducts, processPayment (thunks with injected gateways)
├── infrastructure/    # Adapters (implement the domain ports)
│   ├── http/          # HttpProductGateway, HttpPaymentGateway
│   └── storage/       # Encrypted MMKV storage for redux-persist
└── presentation/      # UI (screens, components, navigation, theme)
```

Gateways are injected into the thunks via Redux's `extraArgument`, so the application layer depends only on domain interfaces — never on axios or MMKV directly.

## Screen flow (7 steps)

1. **Splash** — animated brand intro
2. **Products** — catalog loaded from the backend (pull-to-refresh, skeleton loaders)
3. **Product detail** — image, stock, quantity selector, live total
4. **Checkout** — order summary + customer email → "Pay with credit card"
5. **Credit card form** (backdrop) — live validation, VISA/MasterCard logo detection
6. **Payment summary** (backdrop) — confirm and pay
7. **Result** — approved / declined / error status + transaction details

Plus a **Purchase history** screen (encrypted, persisted across restarts).

## Requirements

- Node.js 22+
- JDK 21
- Android SDK + an emulator or device
- The **backend running** (see the root README). The app targets `http://10.0.2.2:3001` on Android (host's `localhost` from the emulator).

## Setup & run

```bash
cd mobile
npm install

# Terminal 1 — Metro
npm start

# Terminal 2 — build & run on Android
npm run android
```

> The Android emulator reaches the host machine at `10.0.2.2`. Make sure the backend is up on port `3001` before paying.

## Install the prebuilt APK

A signed release APK (universal, ~67 MB) is available at **[`mobile/artifacts/app-release.apk`](artifacts/app-release.apk)**.

```bash
# with an emulator/device connected
adb install mobile/artifacts/app-release.apk
```

> The release build ships a `network_security_config.xml` that permits cleartext (HTTP) traffic **only** to the local development hosts (`10.0.2.2`, `localhost`, `127.0.0.1`) so the app can reach the local backend; every other domain still requires HTTPS. Start the backend before opening the app.

## Tests

```bash
cd mobile
npm test              # run the suite
npm test -- --coverage
```

The domain, application and infrastructure layers are unit-tested in isolation (gateways and MMKV are mocked); components and screens are tested with `@testing-library/react-native` and a test Redux store.

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

> Coverage collection excludes only wiring with no logic (theme, navigation, composition roots, barrels and the axios base client).
