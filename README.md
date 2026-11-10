# QuickKart — Blinkit-style Quick Commerce Web App

**Project:** Use case Diagram in UX Process  
**Course:** Web design and development (L&T EduTech) · Module: UX Design Process · Group 25  
**Deadline:** 17 Nov 2026, 11:59 PM · **Marks:** 40

A Blinkit-style quick-commerce web application for India: customers browse
groceries, add to cart, place an order, pay (UPI / Card / Cash on Delivery)
and get delivery in about 10 minutes, then give feedback. Admin / Store
Manager manages products, categories, orders and customers; a Delivery
Partner fulfils and updates deliveries.

> Adapted from the brief's Restaurant Table Reservation example, as
> instructed: same structure, counts and rules, applied to quick commerce
> instead of a restaurant.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Angular 17+, TypeScript, Reactive Forms, HttpClient, Routing, Auth Guard |
| Backend | Spring Boot 3.3.5, Java 17+, Maven, Spring Data JPA, Bean Validation |
| Database | MySQL 8 — 5 normalised tables, PK/FK, UNIQUE + CHECK constraints |
| API | JSON over REST — 16 endpoints |
| Testing | JUnit 5 + Mockito (backend), Postman collection, demo logic tests |

## Project structure

```
blinkit-quick-commerce-project/
├── README.md                          ← this file
├── Blinkit_Quick_Commerce_Project_Report.pdf
├── database.sql                       ← MySQL schema + sample data
├── postman_collection.json            ← 16 endpoints, {{baseUrl}}=http://localhost:8080
├── source-code.zip                    ← backend + frontend + database.sql + README + Postman
├── backend/                           ← Spring Boot (Maven)
│   ├── pom.xml
│   └── src/main/java/com/blinkit/quickcommerce/
│       ├── entity/        ProductCategory, Product, Customer, Order, OrderItem (+ enums)
│       ├── repository/    JpaRepository × 5
│       ├── service/       Category/Product/Customer/OrderService (@Transactional)
│       ├── controller/    4 controllers, 16 endpoints
│       ├── dto/           request DTOs with Bean Validation
│       └── exception/     ApiException, ErrorResponse, GlobalExceptionHandler
├── frontend/                          ← Angular 17 (see frontend/README.md)
│   └── src/app/  components (login, dashboard, products, cart, orders, customers),
│                  services, guards, models, mock-data (fallback when backend is down)
├── demo/                              ← runnable standalone demo, no install needed
│   ├── index.html         open in any browser — same screens/data as the Angular app
│   └── api-database.html  16 endpoints + 5 database tables overview
├── diagrams/                          ← PNG + PDF: use-case, ER, UML class, app-flow, login-flow
└── screenshots/                       ← 8 real screenshots of the working demo
```

## The 5 entities / tables

| Table | Key fields |
|---|---|
| `product_categories` | category_id PK, name UNIQUE, description, image_url, active |
| `products` | product_id PK, category_id FK, name, price > 0, stock_quantity ≥ 0, unit, image_url |
| `customers` | customer_id PK, name, email UNIQUE, phone UNIQUE, address, city, pincode |
| `orders` | order_id PK, customer_id FK, order_date, delivery_slot, status, total_amount, payment_method |
| `order_items` | order_item_id PK, order_id FK, product_id FK, quantity CHECK 1–20, price_at_order |

**Business rules enforced:** no duplicate product name in the same category;
no duplicate customer phone/email; order quantity 1–20 and never more than
stock (no overselling — stock is decremented on order and restored on
cancel); cannot delete a category with products, a product in an active
order, or a customer with an active order.

## The 16 REST endpoints

```
GET    /api/categories        POST   /api/categories
PUT    /api/categories/{id}   DELETE /api/categories/{id}
GET    /api/products          POST   /api/products
PUT    /api/products/{id}     DELETE /api/products/{id}
GET    /api/customers         POST   /api/customers
PUT    /api/customers/{id}    DELETE /api/customers/{id}
GET    /api/orders            POST   /api/orders
PUT    /api/orders/{id}       DELETE /api/orders/{id}
```
List endpoints support `?search=`, `?page=` / `?size=` (default 10) and
`?status=` for orders, `?categoryId=` for products.

## Screens (6, role-based)

Dashboard (counts, recent orders, monthly orders, top 5 products) ·
Products (category filter, search, stock badges) · Orders (search/filter by
status, status update) · Customers (admin only) · Login (empty-field and
wrong-credential errors, role-based redirect) · Cart / Checkout (place order,
payment, confirmation). Every list has search, filter and pagination
(10–20 per page).

**Demo accounts (demo + frontend mock mode):**
admin@quickkart.in / admin123 · customer@quickkart.in / customer123

## How to run

### 1. Database (MySQL 8)
```sql
mysql -u root -p < database.sql
-- creates quickcommerce_db, 5 tables, sample data:
-- 5 categories, 18 products, 5 customers, 5 orders, 11 order items
```

### 2. Backend
```bash
cd backend
# edit src/main/resources/application.properties if your MySQL user/password
# is not root / root
mvn spring-boot:run
# API at http://localhost:8080/api
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
# app at http://localhost:4200
```
Without the backend running, the frontend falls back to built-in mock data
(see `frontend/README.md`).

### 4. Demo (no install at all)
Open `demo/index.html` in any browser. It mirrors the Angular screens with
the same data — Dashboard, Products, Orders, Customers, Login, Checkout.

### 5. Postman
Import `postman_collection.json` into Postman, set `{{baseUrl}}` to
`http://localhost:8080`, run the 16 requests in order.

### 6. Tests
```bash
cd backend && mvn test   # 6 JUnit/Mockito tests for OrderService
```
Demo logic checks (cart total, quantity 1–20, stock check, order total)
were run in Node during development — see the report, section "Testing".

## How to submit (for Sujal — not done by Muse)

The L&T EduTech upload accepts JPEG, PNG, PDF, MP4, MOV, XLS, XLSX, CSV
(max 150 MB) — it does **not** list ZIP and has no GitHub-link field.
So submit the **report PDF**
(`Blinkit_Quick_Commerce_Project_Report.pdf`) as the main file. If the
marker asks for code, put the code on GitHub and paste the repository link
into the report / submission comment, or attach `source-code.zip` if the
portal accepts it — the ZIP in this folder contains the complete source.

## Honest build notes

- The Spring Boot code and the Angular code were **not compiled in the
  build environment** (no JDK/Maven install there, and the Angular build
  needs a large `npm install`). Both were written complete and
  cross-checked by review (matching imports, annotations, signatures,
  template bindings; JSON configs parse). Run `mvn test` and `npm start`
  on a machine with JDK 17+ / Node 20+ before presenting, and fix any
  toolchain differences if they appear.
- `backend/src/main/resources/data.sql` seeds an **empty** database on first
  run; on a restart against an already-seeded DB set
  `spring.sql.init.mode=never` (or drop/recreate the database).
- Change the placeholder MySQL credentials in `application.properties`
  (`root` / `root`) to your own before running.
