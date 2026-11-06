-- SQL Databases Reference Solution: Joins and Aggregations
-- Joins and aggregations for analytics on e-commerce schema

-- ============================================
-- === INNER JOINS ===
-- ============================================

-- Get customer names with their order details
-- Business question: What orders has each customer placed?
SELECT c.customer_id, c.name, o.order_id, o.order_date, o.total_amount
FROM Customers c
INNER JOIN Orders o ON c.customer_id = o.customer_id
ORDER BY c.name, o.order_date;

-- Get product names with their order quantities
-- Business question: How many units of each product have been ordered?
SELECT p.product_id, p.name, SUM(oi.quantity) AS total_quantity_ordered
FROM Products p
INNER JOIN Order_Items oi ON p.product_id = oi.product_id
GROUP BY p.product_id, p.name
ORDER BY total_quantity_ordered DESC;

-- Get orders with customer and product information
-- Business question: What are the details of each order?
SELECT o.order_id, o.order_date, c.name AS customer_name, p.name AS product_name, oi.quantity, p.price
FROM Orders o
INNER JOIN Customers c ON o.customer_id = c.customer_id
INNER JOIN Order_Items oi ON o.order_id = oi.order_id
INNER JOIN Products p ON oi.product_id = p.product_id
ORDER BY o.order_date DESC;

-- ============================================
-- === LEFT/RIGHT JOINS ===
-- ============================================

-- Get all customers even if they have no orders
-- Business question: Which customers have not placed any orders?
SELECT c.customer_id, c.name, c.email, o.order_id
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;

-- Get all products even if they have no orders
-- Business question: Which products have never been ordered?
SELECT p.product_id, p.name, p.category, oi.order_item_id
FROM Products p
LEFT JOIN Order_Items oi ON p.product_id = oi.product_id
WHERE oi.order_item_id IS NULL;

-- Get customers with order count (including zero)
-- Business question: How many orders has each customer placed?
SELECT c.customer_id, c.name, c.email, COUNT(o.order_id) AS order_count
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name, c.email
ORDER BY order_count DESC;

-- ============================================
-- === SELF JOINS ===
-- ============================================

-- Find products in the same category
-- Business question: What other products are in the same category as a given product?
SELECT p1.product_id, p1.name AS product_name, p2.name AS related_product, p1.category
FROM Products p1
INNER JOIN Products p2 ON p1.category = p2.category AND p1.product_id != p2.product_id
WHERE p1.product_id = 1;

-- Find customers with the same address
-- Business question: Which customers live at the same address?
SELECT c1.customer_id, c1.name AS customer_name, c2.name AS roommate, c1.address
FROM Customers c1
INNER JOIN Customers c2 ON c1.address = c2.address AND c1.customer_id != c2.customer_id
ORDER BY c1.address;

-- ============================================
-- === AGGREGATIONS ===
-- ============================================

-- Count total orders
-- Business question: How many orders have been placed in total?
SELECT COUNT(*) AS total_orders
FROM Orders;

-- Calculate total revenue
-- Business question: What is the total revenue from all orders?
SELECT SUM(total_amount) AS total_revenue
FROM Orders;

-- Calculate average order value
-- Business question: What is the average value of an order?
SELECT AVG(total_amount) AS average_order_value
FROM Orders;

-- Find highest priced product
-- Business question: What is the most expensive product?
SELECT product_id, name, price
FROM Products
ORDER BY price DESC
LIMIT 1;

-- Find lowest priced product
-- Business question: What is the least expensive product?
SELECT product_id, name, price
FROM Products
ORDER BY price ASC
LIMIT 1;

-- ============================================
-- === GROUP BY AND HAVING ===
-- ============================================

-- Calculate revenue per category
-- Business question: What is the revenue for each product category?
SELECT p.category, SUM(oi.quantity * p.price) AS category_revenue
FROM Products p
INNER JOIN Order_Items oi ON p.product_id = oi.product_id
GROUP BY p.category
ORDER BY category_revenue DESC;

-- Count orders per customer
-- Business question: How many orders has each customer placed?
SELECT c.customer_id, c.name, COUNT(o.order_id) AS order_count
FROM Customers c
INNER JOIN Orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name
ORDER BY order_count DESC;

-- Find customers with more than 5 orders
-- Business question: Who are our most loyal customers (more than 5 orders)?
SELECT c.customer_id, c.name, COUNT(o.order_id) AS order_count
FROM Customers c
INNER JOIN Orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name
HAVING COUNT(o.order_id) > 5
ORDER BY order_count DESC;

-- Find categories with revenue over $1000
-- Business question: Which product categories generate more than $1000 in revenue?
SELECT p.category, SUM(oi.quantity * p.price) AS category_revenue
FROM Products p
INNER JOIN Order_Items oi ON p.product_id = oi.product_id
GROUP BY p.category
HAVING SUM(oi.quantity * p.price) > 1000
ORDER BY category_revenue DESC;

-- ============================================
-- === WINDOW FUNCTIONS ===
-- ============================================

-- Rank products by price
-- Business question: What is the price ranking of each product?
SELECT product_id, name, price,
       ROW_NUMBER() OVER (ORDER BY price DESC) AS price_rank
FROM Products
ORDER BY price DESC;

-- Rank customers by order count
-- Business question: Who are our top customers by order count?
SELECT customer_id, name,
       COUNT(order_id) AS order_count,
       RANK() OVER (ORDER BY COUNT(order_id) DESC) AS customer_rank
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
GROUP BY customer_id, name
ORDER BY order_count DESC;

-- Calculate running total of revenue
-- Business question: What is the cumulative revenue over time?
SELECT order_id, order_date, total_amount,
       SUM(total_amount) OVER (ORDER BY order_date) AS running_total
FROM Orders
ORDER BY order_date;

-- Calculate moving average of order values
-- Business question: What is the 3-order moving average of order values?
SELECT order_id, order_date, total_amount,
       AVG(total_amount) OVER (ORDER BY order_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg
FROM Orders
ORDER BY order_date;

-- ============================================
-- === COMPLEX ANALYTICS QUERIES ===
-- ============================================

-- Top 5 products by revenue
-- Business question: Which products generate the most revenue?
SELECT p.product_id, p.name, p.category,
       SUM(oi.quantity * p.price) AS total_revenue
FROM Products p
INNER JOIN Order_Items oi ON p.product_id = oi.product_id
GROUP BY p.product_id, p.name, p.category
ORDER BY total_revenue DESC
LIMIT 5;

-- Monthly revenue trend
-- Business question: What is the revenue trend by month?
SELECT DATE_TRUNC('month', order_date) AS month,
       SUM(total_amount) AS monthly_revenue
FROM Orders
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;

-- Customer lifetime value
-- Business question: What is the total value of each customer?
SELECT c.customer_id, c.name, c.email,
       SUM(o.total_amount) AS customer_lifetime_value
FROM Customers c
INNER JOIN Orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name, c.email
ORDER BY customer_lifetime_value DESC;
