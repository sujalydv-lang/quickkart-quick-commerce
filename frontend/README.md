# QuickKart — Frontend

Blinkit-style quick-commerce web app for India. Angular 17+, TypeScript,
Reactive Forms, HttpClient, routing and auth guards. Part of the L&T EduTech
project **“Use case Diagram in UX Process”** (course: Web design and development).

## Run

```bash
npm install
npm start          # ng serve — http://localhost:4200
npm run build      # production build into dist/quickkart-frontend
```

The backend (Spring Boot) is expected at `http://localhost:8080/api`
(see `src/app/services/api.service.ts` — `baseUrl`).

## NOTE — mock fallback: the UI works without the backend

If the backend is unreachable, the data services fall back to local mock
data in `src/app/mock-data.ts`, so the app works standalone for the demo:

- `ApiService.getWithFallback()` returns the mock list on any HTTP error
  (products, categories, customers, orders).
- `OrderService.createOrder()` / `updateOrderStatus()` create/update a
  mock order locally (id 9000+) when the POST/PUT fails.
- `CustomersComponent` adds/edits/deletes locally when the backend call fails.
- `AuthService` checks the two demo accounts locally (no server login yet).

Mock catalogue (same as the backend seed data): Amul Toned Milk 1L ₹56,
Aashirvaad Atta 5kg ₹289, Onion 1kg ₹38, Banana ₹48, Lays ₹20,
Coca-Cola ₹40, and more — see `src/app/mock-data.ts`.

## Demo credentials

| Role | Email | Password | Lands on |
| --- | --- | --- | --- |
| Admin | `admin@blinkit.in` | `admin123` | Dashboard |
| Customer | `customer@blinkit.in` | `customer123` | Products |

## Routes

| Route | Guard | Page |
| --- | --- | --- |
| `/login` | — | Sign in (demo credentials shown) |
| `/dashboard` | logged in | Counts, recent orders, top 5 products, monthly chart |
| `/products` | logged in | Grid, category filter, search, add to cart, 10/page |
| `/cart` | logged in | Cart (qty 1–20), checkout, order confirmation with order id |
| `/orders` | logged in | Search by id/customer/date, status filter, status update, 10/page |
| `/customers` | admin only | Search, add/edit form (phone/email validation), 10/page |
| `` (empty) | — | Redirects to `/dashboard` |

## Structure

```
src/
  main.ts                  bootstrapApplication + provideRouter + provideHttpClient
  index.html               title “QuickKart — Groceries in 10 minutes”
  styles.css               Blinkit theme: green #0C831F, yellow #F7CB15
  app/
    models.ts              Category, Product, Customer, Order, OrderItem, User
    mock-data.ts           fallback seed data (see NOTE above)
    app.component.*        navbar “QuickKart — Groceries in 10 minutes”, logout
    app.routes.ts          routes + guards
    guards/auth.guard.ts   authGuard (login) + adminGuard (customers page)
    services/
      api.service.ts       HttpClient wrapper, baseUrl, search/pagination params
      auth.service.ts      login/logout, role in localStorage, isAdmin
      product.service.ts   category.service.ts  customer.service.ts
      order.service.ts     cart.service.ts (add/remove, qty 1–20, total)
    components/
      login/ dashboard/ products/ cart/ orders/ customers/
      (each: .ts + .html + .css, standalone)
```

## API used

`GET/POST/PUT/DELETE /api/categories`, `/api/products`, `/api/customers`,
`/api/orders`. Order status: `PLACED / CONFIRMED / PACKED /
OUT_FOR_DELIVERY / DELIVERED / CANCELLED`. Product fields: `id, name,
description, price, stockQuantity, unit, imageUrl, categoryId, active`.
