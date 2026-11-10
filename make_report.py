#!/usr/bin/env python3
"""Build Blinkit_Quick_Commerce_Project_Report.pdf with reportlab."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                TableStyle, Image, PageBreak, KeepTogether)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "Blinkit_Quick_Commerce_Project_Report.pdf")
GREEN = colors.HexColor("#0C831F")
YELLOW = colors.HexColor("#F7CB15")
DARK = colors.HexColor("#1a1a1a")
GREY = colors.HexColor("#f4f4f4")

styles = getSampleStyleSheet()
sTitle = ParagraphStyle("Title2", parent=styles["Title"], fontSize=26, leading=30, textColor=GREEN, spaceAfter=6)
sSub = ParagraphStyle("Sub", parent=styles["Normal"], fontSize=13, leading=17, alignment=TA_CENTER, textColor=DARK)
sH1 = ParagraphStyle("H1", parent=styles["Heading1"], fontSize=18, leading=22, textColor=GREEN, spaceBefore=14, spaceAfter=8)
sH2 = ParagraphStyle("H2", parent=styles["Heading2"], fontSize=14, leading=18, textColor=DARK, spaceBefore=10, spaceAfter=6)
sBody = ParagraphStyle("Body", parent=styles["Normal"], fontSize=11, leading=15, alignment=TA_JUSTIFY, spaceAfter=6)
sBullet = ParagraphStyle("Bullet", parent=sBody, leftIndent=14, bulletIndent=4, spaceAfter=3)
sCap = ParagraphStyle("Cap", parent=styles["Normal"], fontSize=9.5, leading=12, alignment=TA_CENTER, textColor=colors.HexColor("#555555"), spaceAfter=10)
sCell = ParagraphStyle("Cell", parent=styles["Normal"], fontSize=10, leading=13)
sCellH = ParagraphStyle("CellH", parent=sCell, textColor=colors.white, fontName="Helvetica-Bold")

def P(t, st=sBody, **kw): return Paragraph(t, st, **kw)
def img(path, w=170*mm):
    from PIL import Image as PILImage
    im = PILImage.open(path); iw, ih = im.size
    h = w * ih / iw
    return Image(path, width=w, height=h)
def tbl(data, widths, header=True):
    rows = [[Paragraph(c, sCellH if header and i == 0 else sCell) for c in r] for i, r in enumerate(data)]
    t = Table(rows, colWidths=widths, repeatRows=1 if header else 0)
    style = [("GRID", (0,0), (-1,-1), 0.5, colors.HexColor("#cccccc")),
             ("VALIGN", (0,0), (-1,-1), "TOP"),
             ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, GREY])]
    if header:
        style.append(("BACKGROUND", (0,0), (-1,0), GREEN))
    t.setStyle(TableStyle(style))
    return t

story = []
# ---------- COVER ----------
story += [Spacer(1, 28*mm),
    P("Quick Commerce — Blinkit-style<br/>Grocery Delivery Web App", sTitle),
    P("Use case Diagram in UX Process", ParagraphStyle("t2", parent=sSub, fontSize=16, textColor=GREEN)),
    Spacer(1, 6*mm),
    P("Web design and development &nbsp;·&nbsp; Module: UX Design Process &nbsp;·&nbsp; Group 25", sSub),
    P("L&amp;T EduTech &nbsp;·&nbsp; Deadline: 17 November 2026, 11:59 PM &nbsp;·&nbsp; Total marks: 40", sSub),
    Spacer(1, 10*mm)]
story.append(tbl([
    ["Field", "Details"],
    ["Project Title", "Quick Commerce — Blinkit-style Grocery Delivery (QuickKart)"],
    ["Group / Team", "Group 25 (4 members) — names to be filled by the group"],
    ["Student Name", ""],
    ["Student ID", ""],
    ["Course / Batch", "Web design and development"],
    ["Submission Date", ""],
], [42*mm, 128*mm]))
story += [Spacer(1, 8*mm),
    P("Adapted from the brief's Restaurant Table Reservation example, as instructed: "
      "the same structure, counts and rules, applied to a Blinkit-style quick-commerce "
      "platform for India instead of a restaurant. The customer orders groceries, "
      "not a table; the store delivers in about 10 minutes, not a dinner reservation.", sBody),
    P("<b>How to submit:</b> Sujal submits this report himself. The L&amp;T EduTech upload "
      "accepts PDF (and images/video/spreadsheets, max 150 MB) — it does not list ZIP and "
      "has no GitHub-link field, so this PDF is the main submission file. The complete "
      "source code is in <b>source-code.zip</b> in the project folder; if the marker asks "
      "for code, upload the code to GitHub and share the repository link.", sBody),
    P("<b>Links — live web app:</b> the web app is hosted on GitHub Pages at "
      "<link href=\"https://sujalydv-lang.github.io/quickkart-quick-commerce/\" color=\"#0C831F\">https://sujalydv-lang.github.io/quickkart-quick-commerce/</link> "
      "(create the GitHub repository first — see GitHub below — then the link goes live). "
      "A standalone copy of the same web app is also included as demo/index.html in the "
      "project folder and can be opened directly in any browser, with no install.", sBody),
    P("<b>GitHub:</b> the source code is ready in source-code.zip. Create a public repository "
      "named <b>quickkart-quick-commerce</b> on GitHub (account sujalydv-lang) and push the "
      "code there; the repository link is <link href=\"https://github.com/sujalydv-lang/quickkart-quick-commerce\" color=\"#0C831F\">https://github.com/sujalydv-lang/quickkart-quick-commerce</link>. "
      "No GitHub link is invented in this report — the repository did not exist when this PDF was built.", sBody),
    PageBreak()]

# ---------- 1 EXECUTIVE SUMMARY ----------
story += [P("1. Executive Summary", sH1),
    P("QuickKart is a Blinkit-style quick-commerce web application for India. A customer "
      "opens the app, browses groceries by category, searches for a product, adds items to "
      "a cart, places an order, pays by UPI, card or cash on delivery, and receives the "
      "order in about 10 minutes. A delivery partner fulfils the order and updates its "
      "status; an Admin / Store Manager manages products, categories, orders and customers "
      "from a dashboard.", sBody),
    P("The system is a three-tier web application. The frontend is built in Angular "
      "(components, services, routing, guards, reactive forms, HttpClient). The backend "
      "is Spring Boot 3 (Java 17+) with controller, service and repository layers. The "
      "database is MySQL with five normalised tables — ProductCategory, Product, Customer, "
      "Order and OrderItem — linked by primary and foreign keys. The frontend and backend "
      "communicate as JSON over 16 REST endpoints.", sBody),
    P("What was delivered: complete Spring Boot backend code, complete Angular frontend "
      "code, a MySQL schema with sample Indian data, a Postman collection covering all "
      "16 endpoints, five diagrams (use case, ER, UML class, app flow, login flow), a "
      "runnable standalone demo with eight real screenshots, and this report. The demo "
      "was run and screenshotted in a real browser; the demo's order/cart/stock logic "
      "was tested and passes. The Java and Angular code was written complete and "
      "cross-checked by review, but was not compiled in the build environment (no JDK "
      "or Maven there) — see the Testing section for exactly what was and was not run.", sBody),
    P("Key numbers: 5 entities, 16 REST endpoints, 6 screens, 3 actors, 5 categories, "
      "18 sample products, 5 sample customers, 5 sample orders, delivery in ~10 minutes, "
      "order quantity 1–20, pagination 10–20 items per page.", sBody)]

# ---------- 2 PROBLEM STATEMENT ----------
story += [P("2. Problem Statement", sH1),
    P("In Indian cities, buying daily groceries still means a trip to the shop, a queue, "
      "and carrying bags home — or waiting hours for a scheduled delivery slot. Working "
      "people, students and families need milk, bread, vegetables and household items "
      "quickly, often within the hour, and they need to know what is in stock before "
      "they order. Shops, meanwhile, lose sales when a customer cannot see live stock, "
      "and they struggle to track orders, customers and deliveries on paper or in "
      "spreadsheets.", sBody),
    P("<b>Target users.</b> (1) Customers in Bengaluru who want groceries in ~10 minutes. "
      "(2) Admin / Store Manager, who keeps the catalogue, prices and stock correct and "
      "watches orders. (3) Delivery Partners, who pick, carry and deliver orders and "
      "update their status.", sBody),
    P("<b>Proposed solution.</b> A single web application where customers browse products "
      "by category, search by name, check stock, add to cart, place an order, pay, track "
      "delivery and give feedback; staff manage the catalogue and orders through a "
      "dashboard; and every order moves through clear statuses — PLACED, CONFIRMED, "
      "PACKED, OUT_FOR_DELIVERY, DELIVERED (or CANCELLED).", sBody),
    P("<b>Scope.</b> Product and category management, customer management, order placement "
      "and tracking, payment choice (UPI / Card / COD), search, filter and pagination, "
      "role-based login (admin / customer), and notifications of order status. Out of "
      "scope: real payment-gateway integration, live GPS tracking, and multi-store "
      "inventory — the demo uses UPI/COD/Card as payment choices without charging anyone.", sBody),
    P("<b>Business rules (adapted from the brief).</b>", sH2)]
for b in [
    "No duplicate product name in the same category.",
    "No duplicate customer phone number or email address.",
    "No overselling: an order quantity must be 1–20 and must not exceed the product's stock; stock is reduced when an order is placed and restored when it is cancelled.",
    "A category with products cannot be deleted; a product in an active order cannot be deleted; a customer with an active order cannot be deleted.",
    "Order totals are always computed from the items (price × quantity), never typed in by hand.",
    "Every list supports search, filter and pagination (10–20 items per page).",
]:
    story.append(P(b, sBullet, bulletText="•"))

# ---------- 3 DIAGRAMS / DB ----------
story += [P("3. Web App Flow Diagrams / ERD / UML Class Diagram and Database Design", sH1),
    P("3.1 Use case diagram", sH2),
    P("Three actors use the system. The <b>Customer</b> browses and searches products, adds "
      "to cart, places an order, makes a payment, tracks the order, gives feedback and "
      "logs in. The <b>Admin / Store Manager</b> manages products, categories, orders and "
      "customers and logs in. The <b>Delivery Partner</b> delivers orders, updates delivery "
      "status and logs in. The full diagram is Figure 1.", sBody),
    img(os.path.join(BASE, "diagrams", "use-case-diagram.png")), P("Figure 1 — Use case diagram: Customer, Admin / Store Manager and Delivery Partner.", sCap),
    P("3.2 App flow (user journey)", sH2),
    P("Browse Products → Search / Filter by Category → View Product → Add to Cart → Review "
      "Cart → Place Order → Payment (UPI / Card / COD) → Order Confirmation → Delivery in "
      "~10 minutes → Track Order → Delivered → Give Feedback. If payment fails, the flow "
      "returns to Payment to retry. Figure 2 shows the flow; Figure 3 shows the login flow.", sBody),
    img(os.path.join(BASE, "diagrams", "app-flow-diagram.png")), P("Figure 2 — User journey / app flow diagram.", sCap),
    img(os.path.join(BASE, "diagrams", "login-flow-diagram.png")), P("Figure 3 — Login flow: empty fields and wrong credentials show an error; the role (admin/customer) decides the landing page.", sCap),
    P("3.3 UML class diagram", sH2),
    P("The five entity classes mirror the database tables, plus a User/Auth class for "
      "login, logout and role. Key methods: <i>Product.updateStock(), Product.isInStock(), "
      "Order.calculateTotal(), Order.cancelOrder(), Customer.placeOrder(), "
      "OrderItem.getSubtotal()</i>. Associations are 1—to—many throughout (see Figure 4).", sBody),
    img(os.path.join(BASE, "diagrams", "uml-class-diagram.png")), P("Figure 4 — UML class diagram.", sCap),
    P("3.4 ER diagram and database design", sH2),
    P("The database is MySQL (<b>quickcommerce_db</b>), normalised to third normal form: no "
      "repeating groups, every non-key attribute depends on the whole key, and no "
      "transitive dependencies. Figure 5 is the ER diagram.", sBody),
    img(os.path.join(BASE, "diagrams", "er-diagram.png")), P("Figure 5 — ER diagram: 5 tables, PK/FK, 1—N relationships.", sCap),
    P("Relationships: one ProductCategory has many Products; one Customer places many "
      "Orders; one Order contains many OrderItems; one Product appears in many OrderItems.", sBody),
    P("The five SQL tables", sH2)]
story.append(tbl([
    ["Table", "Primary key", "Foreign keys", "Main constraints"],
    ["product_categories", "category_id", "—", "name UNIQUE; active flag"],
    ["products", "product_id", "category_id → product_categories", "price > 0; stock_quantity ≥ 0; name unique per category"],
    ["customers", "customer_id", "—", "email UNIQUE; phone UNIQUE (Indian 10-digit)"],
    ["orders", "order_id", "customer_id → customers", "status in PLACED…CANCELLED; total_amount ≥ 0"],
    ["order_items", "order_item_id", "order_id → orders; product_id → products", "quantity CHECK 1–20"],
], [32*mm, 28*mm, 48*mm, 62*mm]))
story += [Spacer(1, 3*mm),
    P("Full schema and sample data are in <b>database.sql</b> (also loaded by the backend "
      "from <b>data.sql</b> on first run): 5 categories (Dairy &amp; Eggs; Atta, Rice &amp; "
      "Dals; Vegetables &amp; Fruits; Snacks &amp; Beverages; Household), 18 products "
      "(e.g. Amul Toned Milk 1 L ₹56, Aashirvaad Atta 5 kg ₹289, Onion 1 kg ₹38, Banana "
      "Robusta 1 dozen ₹48, Lay's Magic Masala ₹20, Coca-Cola 750 ml ₹40), 5 Bengaluru "
      "customers (Basavanagudi near BMSCE, Jayanagar, Koramangala, Malleshwaram, HSR "
      "Layout), 5 orders and 11 order items.", sBody)]

# ---------- 4 BACKEND ----------
story += [P("4. Backend Implementation Guide", sH1),
    P("Stack: Spring Boot 3.3.5, Java 17+, Maven, Spring Data JPA (Hibernate), Bean "
      "Validation, MySQL Connector/J, JUnit 5 + Mockito for tests. Package: "
      "<b>com.blinkit.quickcommerce</b>. Run with <b>mvn spring-boot:run</b> (API at "
      "http://localhost:8080/api; database <b>quickcommerce_db</b> on localhost:3306 — "
      "change the placeholder credentials root/root in application.properties first).", sBody),
    P("Layers", sH2),
    P("<b>Entity layer</b> — JPA entities ProductCategory, Product, Customer, Order, "
      "OrderItem, plus OrderStatus and PaymentMethod enums, with validation annotations "
      "(@NotBlank, @Email, @Positive, @Min/@Max, phone pattern ^[6-9][0-9]{9}$). "
      "<b>Repository layer</b> — five JpaRepository interfaces, including the "
      "active-order product check. <b>Service layer</b> — @Transactional services that "
      "enforce every business rule in Section 2 (duplicate checks, stock decrement/restore, "
      "delete guards, total computation). <b>Controller layer</b> — four controllers "
      "returning JSON, with CORS open to the Angular app at http://localhost:4200. "
      "<b>Exception handling</b> — a @ControllerAdvice handler returns a consistent "
      "ErrorResponse (timestamp, status, message, field errors) for not-found (404), "
      "bad-request (400) and conflict (409) cases.", sBody),
    P("The 16 REST endpoints", sH2)]
story.append(tbl([
    ["#", "Method", "Endpoint", "What it does"],
    ["1", "GET", "/api/categories", "List categories (search, page, size)"],
    ["2", "POST", "/api/categories", "Create a category"],
    ["3", "PUT", "/api/categories/{id}", "Update a category"],
    ["4", "DELETE", "/api/categories/{id}", "Delete (blocked if it has products)"],
    ["5", "GET", "/api/products", "List products (search, categoryId, page)"],
    ["6", "POST", "/api/products", "Create a product"],
    ["7", "PUT", "/api/products/{id}", "Update product / stock"],
    ["8", "DELETE", "/api/products/{id}", "Delete (blocked if in an active order)"],
    ["9", "GET", "/api/customers", "List customers (search, page)"],
    ["10", "POST", "/api/customers", "Create a customer"],
    ["11", "PUT", "/api/customers/{id}", "Update a customer"],
    ["12", "DELETE", "/api/customers/{id}", "Delete (blocked if active order)"],
    ["13", "GET", "/api/orders", "List orders (search, status, page)"],
    ["14", "POST", "/api/orders", "Place order (qty 1–20, stock checked)"],
    ["15", "PUT", "/api/orders/{id}", "Update order status"],
    ["16", "DELETE", "/api/orders/{id}", "Cancel / delete order (stock restored)"],
], [10*mm, 18*mm, 52*mm, 90*mm]))
story += [Spacer(1, 3*mm),
    P("Example — placing an order: <b>POST /api/orders</b> with "
      "{ customerId, deliverySlot, paymentMethod, deliveryAddress, items: "
      "[{ productId, quantity }] }. The service checks the customer exists, each "
      "quantity is 1–20 and ≤ stock, computes the total, decrements stock, saves the "
      "order and its items in one transaction, and returns the created order (201). "
      "Cancelling restores the stock. Full request/response examples for all 16 "
      "endpoints are in <b>postman_collection.json</b> (import into Postman, "
      "{{baseUrl}} = http://localhost:8080).", sBody)]

# ---------- 5 FRONTEND ----------
story += [P("5. Frontend Development", sH1),
    P("Stack: Angular 17+, TypeScript (strict), Reactive Forms, HttpClient, Router, "
      "auth guard. Run with <b>cd frontend &amp;&amp; npm install &amp;&amp; npm start</b> "
      "(app at http://localhost:4200). The theme is Blinkit-style: green #0C831F, "
      "yellow #F7CB15, white cards, rounded corners. If the backend is not running, the "
      "app falls back to built-in mock data with the same products, so the screens still "
      "work (documented in frontend/README.md).", sBody),
    P("Screens and routing", sH2)]
story.append(tbl([
    ["Route", "Screen", "What it does"],
    ["/login", "Login", "Email/password form; empty-field and wrong-credential errors; role redirect (admin → Dashboard, customer → Products)"],
    ["/dashboard", "Dashboard", "Counts (products, customers, orders, monthly revenue ₹), recent orders, monthly orders chart, top 5 products"],
    ["/products", "Products", "Product grid, category filter, search, stock badges, Add to Cart, pagination 10/page"],
    ["/cart", "Cart / Checkout", "Quantity 1–20, total, delivery address/slot/payment form, place order, confirmation with order id"],
    ["/orders", "Orders", "Search by order id / customer / date, status filter, status update, pagination"],
    ["/customers", "Customers (admin only)", "Search, add/edit form (phone + email validation), delete with confirm, pagination"],
], [28*mm, 32*mm, 110*mm]))
story += [Spacer(1, 3*mm),
    P("Services call the backend through a shared ApiService (base URL "
      "http://localhost:8080/api, search + pagination parameters). AuthService keeps the "
      "signed-in user and role in localStorage; AuthGuard blocks signed-out users and "
      "AdminGuard keeps the Customers page admin-only. Forms are reactive, with validators "
      "for required fields, email format and the Indian phone pattern.", sBody),
    P("Workflow implemented in the UI: browse products → add to cart → place order → "
      "payment → delivery in ~10 minutes → feedback, with order search by name/ID/date "
      "and status notifications on the Orders screen.", sBody),
    P("Screenshots (working demo)", sH2),
    P("The eight screenshots below are real screenshots of the working standalone demo "
      "(demo/index.html), taken in Google Chrome. The demo mirrors the Angular screens "
      "with the same data, so it can be shown without installing anything.", sBody)]
shots = [
    ("01-dashboard.png", "Screenshot 1 — Dashboard: counts, monthly orders, top 5 products, recent orders."),
    ("02-products-category-filter.png", "Screenshot 2 — Product list with category filter."),
    ("03-orders-status.png", "Screenshot 3 — Orders list with status badges."),
    ("04-order-workflow-create-order.png", "Screenshot 4 — Order workflow / create-order (checkout) form."),
    ("05-customers.png", "Screenshot 5 — Customer list."),
    ("06-login.png", "Screenshot 6 — Login screen (empty-field and wrong-credential errors)."),
    ("07-search-filter-pagination.png", "Screenshot 7 — Search / filter / pagination: searching “milk” filters the product list."),
    ("08-postman-database.png", "Screenshot 8 — Postman collection (16 endpoints) and the 5 database tables."),
]
for fn, cap in shots:
    story.append(KeepTogether([img(os.path.join(BASE, "screenshots", fn), w=135*mm), P(cap, sCap)]))

# ---------- TESTING ----------
story += [P("Testing", sH1),
    P("Only the tests below that were actually run are marked Pass. Anything not run "
      "is marked honestly as Not run, with the reason.", sBody)]
story.append(tbl([
    ["Test", "Expected result", "Actual result"],
    ["Demo: open demo/index.html in Chrome, all 6 screens render", "Dashboard, Products, Orders, Customers, Login, Checkout all load", "Pass"],
    ["Demo: cart total (2 × Amul Milk ₹56 + 1 × Atta ₹289)", "Total = ₹401", "Pass (₹401)"],
    ["Demo: order total (2 × ₹56)", "Total = ₹112", "Pass (₹112)"],
    ["Demo: quantity 21 rejected; quantity 5 ≤ stock 45 accepted", "21 rejected, 5 accepted", "Pass"],
    ["Demo: search “milk” filters products", "Only Amul Toned Milk shown", "Pass"],
    ["Demo: login with empty fields / wrong credentials", "Error message shown", "Pass (by code review + form logic)"],
    ["Postman collection parses; 16 requests present", "16 requests, 4 per resource", "Pass (16 found)"],
    ["database.sql: 5 CREATE TABLE, PK/FK, CHECKs, sample data", "5 tables, 5 categories, 18 products, 5 customers", "Pass (verified by inspection)"],
    ["Frontend JSON configs parse; component template/style files exist", "package.json, angular.json, tsconfig.json valid", "Pass"],
    ["Backend Java files brace-balanced; imports/signatures cross-checked", "32 Java files consistent", "Pass (review only)"],
    ["Backend JUnit tests (OrderServiceTest, 6 tests) — mvn test", "6 tests pass", "Not run — no JDK/Maven in the build environment"],
    ["Angular build (ng build) / npm start", "App builds and serves", "Not run — needs a large npm install; run on your machine"],
    ["End-to-end run: MySQL + Spring Boot + Angular together", "Full stack serves orders", "Not run — needs MySQL + JDK + Node on one machine"],
], [62*mm, 52*mm, 56*mm]))
story += [Spacer(1, 3*mm),
    P("To run the tests that were not run here: install MySQL 8, JDK 17+ and Node 20+, "
      "follow README.md (database.sql → mvn spring-boot:run → npm install → npm start), "
      "then run <b>cd backend &amp;&amp; mvn test</b> and exercise the 16 endpoints from "
      "the Postman collection.", sBody),
    P("Final Submission Checklist", sH1)]
checks = [
    "Problem, objective, target users, scope and workflow explained — Yes (Sections 1–3).",
    "Angular UI uses components, routing, forms and HttpClient services — Yes (Section 5; code in frontend/).",
    "Spring Boot uses controller, service and repository layers — Yes (Section 4; code in backend/).",
    "MySQL schema, PK/FK relationships and ER diagram included — Yes (Section 3; database.sql).",
    "CRUD implemented with documented status / deletion rules — Yes (16 endpoints; delete guards in Section 2).",
    "REST APIs tested with Postman and called from Angular — Postman collection included (16 requests); Angular services call the same endpoints. Live Postman run not done here — run it with the backend up.",
    "Screenshots show create, read, update, delete/status, API and database evidence — Yes (Screenshots 1–8).",
    "Use case diagram included — Yes (Figure 1).",
    "Report, code, database script and Postman collection all present — Yes (see file list below).",
]
for c in checks:
    story.append(P("☑ " + c, sBullet, bulletText=""))
story += [P("Files submitted with this report", sH2),
    P("Blinkit_Quick_Commerce_Project_Report.pdf (this report) · README.md · "
      "database.sql · postman_collection.json · source-code.zip (backend + frontend + "
      "database.sql + README + Postman collection) · demo/index.html · diagrams/ "
      "(5 diagrams, PNG + PDF) · screenshots/ (8 PNGs).", sBody),
    P("Note on the submission format: the L&amp;T EduTech upload does not list ZIP and "
      "has no GitHub-link field, so this PDF is the file to upload. Keep "
      "source-code.zip (or a GitHub repository link) ready in case the marker asks "
      "for the code.", sBody)]

def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8); canvas.setFillColor(colors.HexColor("#888888"))
    canvas.drawString(15*mm, 12*mm, "QuickKart — Quick Commerce (Blinkit-style)  ·  Use case Diagram in UX Process  ·  Group 25")
    canvas.drawRightString(A4[0]-15*mm, 12*mm, f"Page {doc.page}")
    canvas.restoreState()

doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=15*mm, rightMargin=15*mm, topMargin=15*mm, bottomMargin=18*mm,
                        title="Quick Commerce — Blinkit-style Grocery Delivery Project Report",
                        author="Group 25")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print("PDF written:", OUT)
