-- Seed data for quickcommerce_db.
-- Runs once on an empty database (spring.sql.init.mode=always with
-- spring.jpa.defer-datasource-initialization=true). Prices are in INR (Rs).
-- Categories 1-5, products 1-18, customers 1-5, orders 1-5.

INSERT INTO product_categories (id, name, description, image_url, active) VALUES
(1, 'Dairy & Eggs', 'Milk, curd, paneer, butter and eggs, delivered fresh', 'https://example.com/images/dairy.jpg', true),
(2, 'Atta Rice & Dals', 'Atta, rice, dals, salt and other kitchen staples', 'https://example.com/images/atta-rice.jpg', true),
(3, 'Vegetables & Fruits', 'Fresh vegetables and fruits, sourced daily', 'https://example.com/images/vegetables.jpg', true),
(4, 'Snacks & Beverages', 'Chips, biscuits, cold drinks and juices', 'https://example.com/images/snacks.jpg', true),
(5, 'Household', 'Cleaning, laundry and other household essentials', 'https://example.com/images/household.jpg', true);

INSERT INTO products (id, name, description, price, stock_quantity, unit, image_url, category_id, active) VALUES
(1, 'Amul Toned Milk', 'Amul Toned Milk, pasteurised, 1 litre pouch', 56.00, 120, '1 L', 'https://example.com/images/amul-milk.jpg', 1, true),
(2, 'Amul Curd', 'Amul Masti Dahi, fresh and creamy', 32.00, 150, '400 g', 'https://example.com/images/amul-curd.jpg', 1, true),
(3, 'Amul Gold Milk', 'Amul Gold Full Cream Milk', 33.00, 100, '500 ml', 'https://example.com/images/amul-gold.jpg', 1, true),
(4, 'Amul Paneer', 'Amul Fresh Paneer block', 95.00, 60, '200 g', 'https://example.com/images/amul-paneer.jpg', 1, true),
(5, 'Amul Butter', 'Amul Salted Butter', 58.00, 80, '100 g', 'https://example.com/images/amul-butter.jpg', 1, true),
(6, 'Aashirvaad Atta', 'Aashirvaad Shudh Chakki Atta, whole wheat', 289.00, 50, '5 kg', 'https://example.com/images/aashirvaad-atta.jpg', 2, true),
(7, 'India Gate Basmati Rice', 'India Gate Basmati Rice, long grain', 145.00, 70, '1 kg', 'https://example.com/images/india-gate-rice.jpg', 2, true),
(8, 'Toor Dal', 'Unpolished Toor / Arhar Dal', 168.00, 60, '1 kg', 'https://example.com/images/toor-dal.jpg', 2, true),
(9, 'Tata Salt', 'Tata Salt, iodised', 28.00, 200, '1 kg', 'https://example.com/images/tata-salt.jpg', 2, true),
(10, 'Onion', 'Fresh Onion', 38.00, 180, '1 kg', 'https://example.com/images/onion.jpg', 3, true),
(11, 'Tomato', 'Fresh Tomato, desi', 32.00, 160, '1 kg', 'https://example.com/images/tomato.jpg', 3, true),
(12, 'Banana Robusta', 'Banana Robusta, ripened naturally', 48.00, 90, '1 dozen', 'https://example.com/images/banana.jpg', 3, true),
(13, 'Potato', 'Fresh Potato', 34.00, 200, '1 kg', 'https://example.com/images/potato.jpg', 3, true),
(14, 'Lays Magic Masala', 'Lays Potato Chips, Magic Masala flavour', 20.00, 300, '52 g', 'https://example.com/images/lays.jpg', 4, true),
(15, 'Coca-Cola', 'Coca-Cola Soft Drink, chilled', 40.00, 150, '750 ml', 'https://example.com/images/coca-cola.jpg', 4, true),
(16, 'Britannia Good Day', 'Britannia Good Day Butter Cookies', 35.00, 120, '200 g', 'https://example.com/images/good-day.jpg', 4, true),
(17, 'Surf Excel Easy Wash', 'Surf Excel Easy Wash Detergent Powder', 118.00, 80, '1 kg', 'https://example.com/images/surf-excel.jpg', 5, true),
(18, 'Vim Dishwash Bar', 'Vim Dishwash Bar, lemon', 32.00, 140, '200 g', 'https://example.com/images/vim-bar.jpg', 5, true);

INSERT INTO customers (id, name, email, phone, address, city, pincode) VALUES
(1, 'Arjun Rao', 'arjun.rao@gmail.com', '9845012345', '12, Bull Temple Road, Basavanagudi, near BMSCE', 'Bengaluru', '560004'),
(2, 'Priya Sharma', 'priya.sharma@gmail.com', '9886012346', '45, 27th Cross, Jayanagar 4th Block', 'Bengaluru', '560011'),
(3, 'Rahul Verma', 'rahul.verma@gmail.com', '9901012347', '78, 80 Feet Road, Koramangala 5th Block', 'Bengaluru', '560095'),
(4, 'Sneha Iyer', 'sneha.iyer@gmail.com', '9739012348', '9, 8th Main, Malleshwaram', 'Bengaluru', '560003'),
(5, 'Vikram Shetty', 'vikram.shetty@gmail.com', '9945012349', '22, 27th Main, HSR Layout Sector 2', 'Bengaluru', '560102');

-- Order totals are the sum of (price_at_order x quantity) for their items.
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
