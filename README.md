# Crypto Tracker Backend

This project is a backend for a cryptocurrency tracker.
This backend server is built with **Node.js**, **Express**, and **MongoDB**.
It supports authentication, coin data operations, and user management.
Data is fetched from the [CoinGecko API](https://www.coingecko.com/en/api).

---

## 🔧 Features

- 🔐 User authentication via JWT (stored in HttpOnly cookies)
- 📈 Fetch live coin prices and historical data from CoinGecko
- ⭐ Maintain a personal watchlist (single document per user)
- 📊 Swagger‑based documentation (OpenAPI 3)

---

## ⚙️ Installation

```bash
git clone <your-repo-url>
cd crypto
npm install
```

---

## 🗂 Project Structure

```
.
├── config/                 # getEnvVar helper (dotenv required only here)
├── repositories/           # Data‑access (Mongoose only)
│   ├── userRepository.js
│   └── watchlistRepository.js
├── services/               # Business logic (hash, JWT, rules)
│   ├── authService.js
│   ├── userService.js
│   └── coinService.js
├── controllers/            # HTTP layer (req / res)
├── middleware/             # auth, validation, rate‑limit, etc.
├── models/                 # Mongoose schemas
└── docs/openapi.yaml       # Swagger spec
```

Repositories expose _plain_ async functions (`findByEmail`, `createUser`, …) – no business rules.  
Services orchestrate those repositories and contain hashing / JWT / validation.  
Controllers remain thin and deal only with HTTP.

---

### Environment

Create a `.env` in the root directory:

```env
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/CryptoRates
PORT=8080
CORS_WHITELIST=http://localhost:3000
JWT_SECRET=your_jwt_secret
COINGECKO_API_URL=https://api.coingecko.com/api/v3
```

All environment variables are loaded **once** in `config/index.js`

```js
require('dotenv').config();

function getEnvVar(key, def) {
  const val = process.env[key];
  if (val !== undefined) return key === 'PORT' ? Number(val) : val;
  if (def !== undefined) return def;
  throw new Error(`Missing env var: ${key}`);
}

module.exports = { getEnvVar };
```

Every file now imports this helper instead of using process.env directly:

const { getEnvVar } = require('./config');
const PORT = getEnvVar('PORT', 8080);
const MONGODB_URI = getEnvVar('MONGODB_URI');

---

### Running

```bash
npm install
npm run dev     # nodemon (development)
npm start       # production
npm run docs    # Swagger UI on http://localhost:9000
```

---

## 🔐 Authentication

All protected routes rely on a JWT set as an HttpOnly cookie.  
If you call the API from a browser, ensure `withCredentials: true` is set.

---

## 📡 Core End‑Points

| Method | Route                    | Description              |
| ------ | ------------------------ | ------------------------ |
| POST   | `/auth/signup`           | Register a user          |
| POST   | `/auth/login`            | Log in (sets JWT cookie) |
| GET    | `/coingecko/cryptos`     | List coins               |
| GET    | `/coingecko/cryptos/:id` | Coin details             |
| GET    | `/coingecko/history/:id` | Historical chart         |
| GET    | `/users/watchlist`       | Get watchlist            |
| POST   | `/users/watchlist`       | Add coin to watchlist    |
| DELETE | `/users/me`              | Delete own account       |
| DELETE | `/admin/users/:id`       | Delete any user (admin)  |

---

## 🧾 Data Models

### User

```js
{
  email: String,
  password: String /* hashed */
}
```

### Watchlist

Each user owns exactly one document:

```js
{
  userId: ObjectId,
  coins: [
    { id, symbol, name }
  ]
}
```

### Coin (schema only)

```js
{
  id: String,  // unique CoinGecko id
  symbol: String,
  name: String
}
```

---

## 🛡 Security Features

This project includes essential security middlewares to harden the Express server:

### Helmet

Helmet is enabled globally to secure HTTP headers and mitigate common web vulnerabilities like:

- Cross‑Site Scripting (XSS)
- Clickjacking
- MIME sniffing

### Rate Limiting

`express-rate-limit` restricts each IP address to 100 requests every 15 minutes.  
Excessive traffic receives **HTTP 429 Too Many Requests**.

### Compression

`compression` middleware gzips responses larger than **100 KB**, speeding up payload delivery.

## 🛠 Architecture Notes

### Structured Logging

The project uses **Winston** with daily‑rotating log files (`/logs`). During development, logs are also output to the console via **Morgan**.

### Input Validation

All incoming payloads and query parameters are validated with **express‑validator**. Validation errors are collected by `middleware/validate.js` and returned as `HTTP 400` with details.

### API Documentation

An OpenAPI 3 specification lives at `docs/openapi.yaml`. Run `npm run docs` to view an interactive Swagger UI.

### 🗂 Postman & Swagger

- **Postman collection** - `CryptoRates.postman.collection.json`
  Set base_url = http://localhost:8080, and after login let the browser save the JWT cookie.
- **Swagger UI** – `npm run docs` → <http://localhost:9000>.

---
