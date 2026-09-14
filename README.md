# Task 02 — E-Commerce Checkout & Payment System (Backend)

Storefront backend built with **Node.js/Express**, **MySQL**, and **Prisma**.
Independent from the Task 01 backend, with its own database and its own
port (4001) so the two can run and deploy separately.

## Tech Stack
- Node.js + Express
- MySQL
- Prisma ORM

## Setup

1. Create a MySQL database, e.g. `techloom_ecommerce`.
2. Set `.env`:
   ```
   DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/techloom_ecommerce"
   PORT=4001
   ```
3. Install & generate:
   ```
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Run:
   ```
   npm run dev
   ```

`customerId` is a client-generated identifier (e.g. a UUID the frontend
creates once and stores in localStorage) — there's no login system required
by the brief, but it's enough to key a persistent cart and order history per
shopper across visits.

## How to test each feature

### Product discovery (search & filter)
- `POST /products` — `{ "name": "T-Shirt", "category": "Apparel", "price": 15, "stock": 30 }`
- `GET /products?search=shirt&category=Apparel&minPrice=10&maxPrice=50&inStock=true`
- `GET /products/:id` — full details for one product

### Cart management
- `GET /cart/:customerId` — creates the cart on first call
- `POST /cart/:customerId/items` — `{ "productId": 1, "quantity": 2 }`
- `PUT /cart/:customerId/items/:productId` — `{ "quantity": 3 }`
- `DELETE /cart/:customerId/items/:productId`

### Checkout / stock reservation
- `POST /orders/checkout` — `{ "customerId": "guest-abc", "idempotencyKey": "checkout-1" }`
  - Reserves stock atomically per cart line (same conditional-update /
    transaction pattern as Task 01 — verified concurrency-safe under
    simultaneous requests on limited stock).
  - Clears the cart once the order is created.
  - Re-sending the same `idempotencyKey` returns the existing order (no
    duplicate order for one checkout session).

### Mock payment gateway
- `POST /payments/:orderId` — `{ "attemptKey": "pay-1", "forceOutcome": "SUCCESS" }`
  (`forceOutcome` optional: `SUCCESS` / `FAILURE` / `TIMEOUT`, otherwise random)
  - Success → `PAID`. Failure → stock released, `FAILED`. Timeout → stock
    released, `EXPIRED`.
  - Re-using an `attemptKey` returns the original result — no duplicate
    charge/order for one checkout session.

### Refunds & cancellation
- `POST /orders/:id/cancel` — cancels a `PENDING`/`RESERVED` order pre-payment,
  restores stock.
- `POST /orders/:id/refund` — reverses a `PAID` order: restores stock, sets
  status `REFUNDED`, stamps `refundedAt`.

### Order history
- `GET /orders/customer/:customerId` — every order for that shopper with
  current and past status.
- `GET /orders/:id` — single order with items and payment attempt history.

## Order status model
`PENDING → RESERVED → PAID → REFUNDED` (post-purchase reversal)
`RESERVED → CANCELLED` (manual, pre-payment)
`RESERVED → EXPIRED` (timeout / 5-min sweep)
`RESERVED → FAILED` (payment failure)

## Frontend

`/frontend` is a React + Vite + Tailwind storefront: editorial catalog grid
with search/category filtering, a cart view, checkout with a simulated
payment step, and an order history page with cancel/refund actions.

```
cd frontend
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in `frontend/.env` to point at the backend
(defaults to `http://localhost:4001`). The shopper's `customerId` is
generated client-side on first visit and stored in `localStorage`, so cart
and order history persist across sessions without a login system.

Flow: browse/search/filter → add to cart → cart view with quantity editing
→ "Reserve & checkout" (reserves stock) → simulate a successful or failed
payment → check status/history under "Orders", including refund on a paid
order.

## Deployment
Deploy `/backend` as a separate Node web service (Render/Railway/Fly.io)
from Task 01, with its own managed MySQL database and `DATABASE_URL`.
Deploy `/frontend` to Vercel/Netlify with `VITE_API_BASE_URL` pointing at
the deployed backend URL.

**Backend live URL:** _add after deployment_
**Frontend live URL:** _add after deployment_
