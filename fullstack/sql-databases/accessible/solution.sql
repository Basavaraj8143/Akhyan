-- SQL Databases Reference Solution: Write SQL Queries
-- Basic CRUD queries for e-commerce schema

-- ============================================
-- === SCHEMA (provided for reference) ===
-- ============================================

-- Products table: product_id (PK), name, price, stock_quantity, category
-- Customers table: customer_id (PK), name, email, address
-- Orders table: order_id (PK), customer_id (FK), order_date, total_amount
-- Order_Items table: order_item_id (PK), order_id (FK), product_id (FK), quantity

-- ============================================
-- === CREATE QUERIES ===
-- ============================================

-- Insert a new product
INSERT INTO Products (name, price, stock_quantity, category)
VALUES ('Laptop', 999.99, 50, 'Electronics');

-- Insert a new customer
INSERT INTO Customers (name, email, address)
VALUES ('John Doe', 'john@example.com', '123 Main St, City');

-- Insert a new order
INSERT INTO Orders (customer_id, order_date, total_amount)
VALUES (1, '2024-01-15', 1999.98);

-- Insert order items for the order
INSERT INTO Order_Items (order_id, product_id, quantity)
VALUES (1, 1, 2);

-- ============================================
-- === READ QUERIES ===
-- ============================================

-- Get all products
SELECT product_id, name, price, stock_quantity, category
FROM Products;

-- Get products by category
SELECT product_id, name, price, stock_quantity
FROM Products
WHERE category = 'Electronics';

-- Get orders for a specific customer
SELECT o.order_id, o.order_date, o.total_amount
FROM Orders o
WHERE o.customer_id = 1;

-- Get order details with product information
SELECT oi.order_item_id, o.order_date, p.name AS product_name, oi.quantity, p.price
FROM Order_Items oi
JOIN Orders o ON oi.order_id = o.order_id
JOIN Products p ON oi.product_id = p.product_id
WHERE o.order_id = 1;

-- ============================================
-- === UPDATE QUERIES ===
-- ============================================

-- Change product price
UPDATE Products
SET price = 899.99
WHERE product_id = 1;

-- Update stock quantity
UPDATE Products
SET stock_quantity = stock_quantity - 2
WHERE product_id = 1;

-- Change customer address
UPDATE Customers
SET address = '456 New St, City'
WHERE customer_id = 1;

-- ============================================
-- === DELETE QUERIES ===
-- ============================================

-- Remove a product
DELETE FROM Products
WHERE product_id = 1;

-- Remove a customer (and their orders using cascade delete)
DELETE FROM Customers
WHERE customer_id = 1;

-- Remove an order
DELETE FROM Orders
WHERE order_id = 1;

-- ============================================
-- === ADVANCED SELECT QUERIES ===
-- ============================================

-- SELECT with WHERE clause (filtering)
SELECT product_id, name, price
FROM Products
WHERE price > 500 AND stock_quantity > 10;

-- SELECT with ORDER BY (sorting)
SELECT product_id, name, price
FROM Products
ORDER BY price DESC;

-- SELECT with LIMIT (pagination)
SELECT product_id, name, price
FROM Products
ORDER BY product_id
LIMIT 10 OFFSET 0;

-- SELECT with LIKE (pattern matching)
SELECT product_id, name, category
FROM Products
WHERE name LIKE '%Laptop%';

-- SELECT with IN clause
SELECT product_id, name, category
FROM Products
WHERE category IN ('Electronics', 'Computers');

-- SELECT with BETWEEN
SELECT product_id, name, price
FROM Products
WHERE price BETWEEN 100 AND 1000;

-- SELECT with multiple conditions
SELECT product_id, name, price, stock_quantity
FROM Products
WHERE category = 'Electronics'
  AND price > 500
  AND stock_quantity > 0
ORDER BY price ASC
LIMIT 20;
