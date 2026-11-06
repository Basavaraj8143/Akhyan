# Work Log – SQL Databases Node

**Domain:** Web Development
**Node:** SQL Databases
**Status:** Projects completed with specifications and reference implementations

## 1. Accessible – Write SQL Queries

**Objective:** Practice basic CRUD queries.

**Work completed:**
- Designed a basic SQL query exercise for an e-commerce schema.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria covering CREATE queries, READ queries, UPDATE and DELETE queries, and Advanced SELECT queries.
- Prepared a reference implementation with:

  **Schema (Provided)**
  - Products table: product_id (PK), name, price, stock_quantity, category
  - Customers table: customer_id (PK), name, email, address
  - Orders table: order_id (PK), customer_id (FK), order_date, total_amount
  - Order_Items table: order_item_id (PK), order_id (FK), product_id (FK), quantity

  **CREATE Queries**
  - INSERT for new product
  - INSERT for new customer
  - INSERT for new order
  - INSERT for order items

  **READ Queries**
  - SELECT all products
  - SELECT products by category
  - SELECT orders for specific customer
  - SELECT order details with product information (using JOIN)

  **UPDATE Queries**
  - UPDATE product price
  - UPDATE stock quantity
  - UPDATE customer address

  **DELETE Queries**
  - DELETE product
  - DELETE customer (with cascade delete)
  - DELETE order

  **Advanced SELECT Queries**
  - SELECT with WHERE clause (filtering)
  - SELECT with ORDER BY (sorting)
  - SELECT with LIMIT (pagination)
  - SELECT with LIKE (pattern matching)
  - SELECT with IN clause
  - SELECT with BETWEEN
  - SELECT with multiple conditions

## 2. Core – Joins and Aggregations

**Objective:** Use joins and aggregations for analytics.

**Work completed:**
- Designed a SQL analytics exercise using joins and aggregations.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for join queries, aggregation queries, GROUP BY and HAVING, and window functions and overall quality.
- Prepared a reference implementation with:

  **Inner Joins**
  - Customer names with order details
  - Product names with order quantities
  - Orders with customer and product information
  - Business questions documented for each query

  **Left/Right Joins**
  - All customers even if no orders (identify inactive customers)
  - All products even if no orders (identify unsold products)
  - Customers with order count including zero
  - NULL handling for missing data

  **Self Joins**
  - Products in same category (related products)
  - Customers with same address (roommates)
  - Self-join conditions to avoid matching same row

  **Aggregations**
  - COUNT total orders
  - SUM total revenue
  - AVG average order value
  - MAX highest priced product
  - MIN lowest priced product

  **GROUP BY and HAVING**
  - Revenue per category
  - Orders per customer
  - Customers with more than 5 orders (HAVING)
  - Categories with revenue over $1000 (HAVING)
  - Group filtering with HAVING

  **Window Functions**
  - ROW_NUMBER to rank products by price
  - RANK to rank customers by order count
  - SUM OVER for running total of revenue
  - AVG OVER for moving average of order values
  - ROWS BETWEEN for window frame

  **Complex Analytics Queries**
  - Top 5 products by revenue
  - Monthly revenue trend
  - Customer lifetime value
  - Business intelligence queries

## 3. Stretch – Transactions and Constraints

**Objective:** Implement transactions and constraints.

**Work completed:**
- Designed a database integrity exercise using transactions and constraints.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for table creation with constraints, foreign key and index configuration, transaction implementation, and stored procedure and trigger.
- Prepared a reference implementation with:

  **Table Creation with Constraints**
  - Products table: PRIMARY KEY, NOT NULL, CHECK (price > 0, stock >= 0), UNIQUE (name)
  - Customers table: PRIMARY KEY, NOT NULL, UNIQUE (email), CHECK (email format)
  - Orders table: PRIMARY KEY, NOT NULL, FOREIGN KEY, CHECK (total_amount >= 0)
  - Order_Items table: PRIMARY KEY, NOT NULL, FOREIGN KEYs, CHECK (quantity > 0), UNIQUE (order_id, product_id)
  - Generated column for subtotal (quantity * unit_price)

  **Foreign Key Constraints**
  - ON DELETE CASCADE for order_items (delete items when order deleted)
  - ON DELETE RESTRICT for orders (prevent deleting customers with orders)
  - ON UPDATE CASCADE for all foreign keys (propagate ID changes)
  - Referential integrity enforcement

  **Indexes for Performance**
  - Index on customer_id in Orders table
  - Index on product_id in Order_Items table
  - Index on email in Customers table
  - Index on order_date in Orders table
  - Index on category in Products table

  **Transaction Implementation**
  - START TRANSACTION, COMMIT, ROLLBACK
  - Atomic order creation with multiple items
  - Stock quantity updates within transaction
  - Order total calculation within transaction
  - Error handling with EXIT HANDLER

  **Stored Procedure**
  - place_order procedure with parameters (customer_id, product_ids, quantities)
  - JSON parameter handling for multiple products
  - Stock availability validation before insertion
  - Stock quantity update after order placement
  - Transaction within procedure
  - Error handling with ROLLBACK
  - DELIMITER for MySQL stored procedure syntax

  **Triggers**
  - prevent_product_deletion: BEFORE DELETE trigger to prevent deleting products with existing orders
  - update_order_total_after_insert: AFTER INSERT trigger to update order total
  - update_order_total_after_update: AFTER UPDATE trigger to update order total
  - update_order_total_after_delete: AFTER DELETE trigger to update order total
  - Referential integrity enforcement at database level

  **Sample Data**
  - Sample products insertion
  - Sample customers insertion
  - Testing data for stored procedure and triggers

  **Documentation**
  - How to use guide
  - Transaction manual rollback/commit
  - Constraint viewing commands
  - Index viewing commands
  - Trigger/stored procedure drop commands

## Overall Summary

| Difficulty | Project | Status |
|---|---|---|
| Accessible | Write SQL Queries | Completed |
| Core | Joins and Aggregations | Completed |
| Stretch | Transactions and Constraints | Completed |

**Deliverables prepared:**
- 3 project specifications (`project.json`)
- 3 reference implementations (`.sql` files)
- Evaluation rubrics for all three projects
- Valid alternatives and mistakes-to-check lists
- Complete CRUD query examples
- Analytics queries with joins and aggregations
- Transaction and constraint implementation
- Stored procedures and triggers

**Key SQL Databases concepts covered:**
- CRUD operations (CREATE, READ, UPDATE, DELETE)
- INSERT statements with column specification
- SELECT statements with various clauses
- UPDATE statements with WHERE clause
- DELETE statements with WHERE clause
- WHERE clause for filtering
- ORDER BY for sorting
- LIMIT for pagination
- LIKE for pattern matching
- IN clause for multiple values
- BETWEEN for range queries
- Inner joins (INNER JOIN)
- Left/Right joins (LEFT JOIN, RIGHT JOIN)
- Self joins (joining table to itself)
- NULL handling in outer joins
- Aggregation functions (COUNT, SUM, AVG, MAX, MIN)
- GROUP BY for grouping
- HAVING for group filtering
- Window functions (ROW_NUMBER, RANK, SUM OVER, AVG OVER)
- Window frames (ROWS BETWEEN)
- Constraints (PRIMARY KEY, NOT NULL, CHECK, UNIQUE, FOREIGN KEY)
- Referential integrity
- ON DELETE CASCADE/RESTRICT
- ON UPDATE CASCADE
- Indexes for performance
- Transactions (START TRANSACTION, COMMIT, ROLLBACK)
- Atomicity
- Error handling in transactions
- Stored procedures
- Parameters and JSON handling
- Triggers (BEFORE/AFTER INSERT/UPDATE/DELETE)
- Business logic at database level
- Generated columns
- Data integrity enforcement
- Database-level validation

**Next step:** Technical review, execution testing, and verification of all reference implementations before final submission.
