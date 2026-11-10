-- ============================================================
-- Blinkit-style Quick Commerce — MySQL schema + sample data
-- Project: "Use case Diagram in UX Process" (L&T EduTech)
-- Database: quickcommerce_db
-- Run once:  mysql -u root -p < database.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS quickcommerce_db
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quickcommerce_db;

-- ---------------- product_categories ----------------
CREATE TABLE IF NOT EXISTS product_categories (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    image_url   VARCHAR(500),
    active      TINYINT(1)   NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uk_category_name (name)
) ENGINE = InnoDB;

-- ---------------- products ----------------
CREATE TABLE IF NOT EXISTS products (
    id             BIGINT         NOT NULL AUTO_INCREMENT,
    name           VARCHAR(150)   NOT NULL,
    description    VARCHAR(1000),
    price          DECIMAL(10, 2) NOT NULL,
    stock_quantity INT            NOT NULL,
    unit           VARCHAR(50)    NOT NULL,
    image_url      VARCHAR(500),
    category_id    BIGINT         NOT NULL,
    active         TINYINT(1)     NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uk_product_name_category (name, category_id),
    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id) REFERENCES product_categories (id),
    CONSTRAINT chk_product_price CHECK (price > 0),
    CONSTRAINT chk_product_stock CHECK (stock_quantity >= 0),
    INDEX idx_product_category_id (category_id),
    INDEX idx_product_name (name)
) ENGINE = InnoDB;

-- ---------------- customers ----------------
CREATE TABLE IF NOT EXISTS customers (
    id      BIGINT       NOT NULL AUTO_INCREMENT,
    name    VARCHAR(100) NOT NULL,
    email   VARCHAR(150) NOT NULL,
    phone   VARCHAR(10)  NOT NULL,
    address VARCHAR(500),
    city    VARCHAR(100) NOT NULL DEFAULT 'Bengaluru',
    pincode VARCHAR(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_customer_email (email),
    UNIQUE KEY uk_customer_phone (phone),
    CONSTRAINT chk_customer_phone CHECK (phone REGEXP '^[6-9][0-9]{9}$'),
    CONSTRAINT chk_customer_pincode CHECK (pincode IS NULL OR pincode REGEXP '^[0-9]{6}$'),
    INDEX idx_customer_name (name)
) ENGINE = InnoDB;

-- ---------------- orders ----------------
CREATE TABLE IF NOT EXISTS orders (
    id               BIGINT         NOT NULL AUTO_INCREMENT,
    customer_id      BIGINT         NOT NULL,
    order_date       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    delivery_slot    VARCHAR(100),
    status           ENUM('PLACED', 'CONFIRMED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')
                                    NOT NULL DEFAULT 'PLACED',
    total_amount     DECIMAL(10, 2) NOT NULL,
    payment_method   ENUM('UPI', 'COD', 'CARD') NOT NULL DEFAULT 'UPI',
    delivery_address VARCHAR(500),
    PRIMARY KEY (id),
    CONSTRAINT fk_order_customer
        FOREIGN KEY (customer_id) REFERENCES customers (id),
    CONSTRAINT chk_order_total CHECK (total_amount >= 0),
    INDEX idx_order_customer_id (customer_id),
    INDEX idx_order_status (status)
) ENGINE = InnoDB;

-- ---------------- order_items ----------------
CREATE TABLE IF NOT EXISTS order_items (
    id             BIGINT         NOT NULL AUTO_INCREMENT,
    order_id       BIGINT         NOT NULL,
    product_id     BIGINT         NOT NULL,
    quantity       INT            NOT NULL,
    price_at_order DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_order_item_order
        FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_order_item_product
        FOREIGN KEY (product_id) REFERENCES products (id),
    CONSTRAINT chk_order_item_quantity CHECK (quantity >= 1 AND quantity <= 20),
    CONSTRAINT chk_order_item_price CHECK (price_at_order > 0),
    INDEX idx_order_item_order_id (order_id),
    INDEX idx_order_item_product_id (product_id)
) ENGINE = InnoDB;

-- ============================================================
-- Sample data (same as backend/src/main/resources/data.sql)
-- ============================================================

INSERT INTO product_categories (id, name, description, image_url, active) VALUES
(1, 'Dairy & Eggs', 'Milk, curd, paneer, butter and eggs, delivered fresh', 'https://example.com/images/dairy.jpg', 1),
(2, 'Atta Rice & Dals', 'Atta, rice, dals, salt and other kitchen staples', 'https://example.com/images/atta-rice.jpg', 1),
(3, 'Vegetables & Fruits', 'Fresh vegetables and fruits, sourced daily', 'https://example.com/images/vegetables.jpg', 1),
(4, 'Snacks & Beverages', 'Chips, biscuits, cold drinks and juices', 'https://example.com/images/snacks.jpg', 1),
(5, 'Household', 'Cleaning, laundry and other household essentials', 'https://example.com/images/household.jpg', 1);

INSERT INTO products (id, name, description, price, stock_quantity, unit, image_url, category_id, active) VALUES
(1, 'Amul Toned Milk', 'Amul Toned Milk, pasteurised, 1 litre pouch', 56.00, 120, '1 L', 'https://example.com/images/amul-milk.jpg', 1, 1),
(2, 'Amul Curd', 'Amul Masti Dahi, fresh and creamy', 32.00, 150, '400 g', 'https://example.com/images/amul-curd.jpg', 1, 1),
(3, 'Amul Gold Milk', 'Amul Gold Full Cream Milk', 33.00, 100, '500 ml', 'https://example.com/images/amul-gold.jpg', 1, 1),
(4, 'Amul Paneer', 'Amul Fresh Paneer block', 95.00, 60, '200 g', 'https://example.com/images/amul-paneer.jpg', 1, 1),
(5, 'Amul Butter', 'Amul Salted Butter', 58.00, 80, '100 g', 'https://example.com/images/amul-butter.jpg', 1, 1),
(6, 'Aashirvaad Atta', 'Aashirvaad Shudh Chakki Atta, whole wheat', 289.00, 50, '5 kg', 'https://example.com/images/aashirvaad-atta.jpg', 2, 1),
(7, 'India Gate Basmati Rice', 'India Gate Basmati Rice, long grain', 145.00, 70, '1 kg', 'https://example.com/images/india-gate-rice.jpg', 2, 1),
(8, 'Toor Dal', 'Unpolished Toor / Arhar Dal', 168.00, 60, '1 kg', 'https://example.com/images/toor-dal.jpg', 2, 1),
(9, 'Tata Salt', 'Tata Salt, iodised', 28.00, 200, '1 kg', 'https://example.com/images/tata-salt.jpg', 2, 1),
(10, 'Onion', 'Fresh Onion', 38.00, 180, '1 kg', 'https://example.com/images/onion.jpg', 3, 1),
(11, 'Tomato', 'Fresh Tomato, desi', 32.00, 160, '1 kg', 'https://example.com/images/tomato.jpg', 3, 1),
(12, 'Banana Robusta', 'Banana Robusta, ripened naturally', 48.00, 90, '1 dozen', 'https://example.com/images/banana.jpg', 3, 1),
(13, 'Potato', 'Fresh Potato', 34.00, 200, '1 kg', 'https://example.com/images/potato.jpg', 3, 1),
(14, 'Lays Magic Masala', 'Lays Potato Chips, Magic Masala flavour', 20.00, 300, '52 g', 'https://example.com/images/lays.jpg', 4, 1),
(15, 'Coca-Cola', 'Coca-Cola Soft Drink, chilled', 40.00, 150, '750 ml', 'https://example.com/images/coca-cola.jpg', 4, 1),
(16, 'Britannia Good Day', 'Britannia Good Day Butter Cookies', 35.00, 120, '200 g', 'https://example.com/images/good-day.jpg', 4, 1),
(17, 'Surf Excel Easy Wash', 'Surf Excel Easy Wash Detergent Powder', 118.00, 80, '1 kg', 'https://example.com/images/surf-excel.jpg', 5, 1),
(18, 'Vim Dishwash Bar', 'Vim Dishwash Bar, lemon', 32.00, 140, '200 g', 'https://example.com/images/vim-bar.jpg', 5, 1);

INSERT INTO customers (id, name, email, phone, address, city, pincode) VALUES
(1, 'Arjun Rao', 'arjun.rao@gmail.com', '9845012345', '12, Bull Temple Road, Basavanagudi, near BMSCE', 'Bengaluru', '560004'),
(2, 'Priya Sharma', 'priya.sharma@gmail.com', '9886012346', '45, 27th Cross, Jayanagar 4th Block', 'Bengaluru', '560011'),
(3, 'Rahul Verma', 'rahul.verma@gmail.com', '9901012347', '78, 80 Feet Road, Koramangala 5th Block', 'Bengaluru', '560095'),
(4, 'Sneha Iyer', 'sneha.iyer@gmail.com', '9739012348', '9, 8th Main, Malleshwaram', 'Bengaluru', '560003'),
(5, 'Vikram Shetty', 'vikram.shetty@gmail.com', '9945012349', '22, 27th Main, HSR Layout Sector 2', 'Bengaluru', '560102');

INSERT INTO orders (id, customer_id, order_date, delivery_slot, status, total_amount, payment_method, delivery_address) VALUES
(1, 1, '2026-11-10 10:00:00', 'Today, 6 PM - 7 PM', 'PLACED', 160.00, 'UPI', '12, Bull Temple Road, Basavanagudi, near BMSCE'),
(2, 2, '2026-11-10 11:30:00', 'Today, 7 PM - 8 PM', 'CONFIRMED', 457.00, 'CARD', '45, 27th Cross, Jayanagar 4th Block'),
(3, 3, '2026-11-09 18:00:00', 'Tomorrow, 8 AM - 9 AM', 'PACKED', 174.00, 'COD', '78, 80 Feet Road, Koramangala 5th Block'),
(4, 4, '2026-11-09 19:15:00', 'Today, 8 PM - 9 PM', 'OUT_FOR_DELIVERY', 160.00, 'UPI', '9, 8th Main, Malleshwaram'),
(5, 5, '2026-11-08 09:45:00', 'Today, 10 AM - 11 AM', 'DELIVERED', 354.00, 'UPI', '22, 27th Main, HSR Layout Sector 2');

INSERT INTO order_items (id, order_id, product_id, quantity, price_at_order) VALUES
(1, 1, 1, 2, 56.00),
(2, 1, 12, 1, 48.00),
(3, 2, 6, 1, 289.00),
(4, 2, 8, 1, 168.00),
(5, 3, 10, 2, 38.00),
(6, 3, 11, 2, 32.00),
(7, 3, 13, 1, 34.00),
(8, 4, 14, 4, 20.00),
(9, 4, 15, 2, 40.00),
(10, 5, 7, 2, 145.00),
(11, 5, 2, 2, 32.00);
