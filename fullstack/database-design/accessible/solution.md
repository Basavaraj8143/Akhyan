# Database Design Reference Solution: Model a Domain
# This solution demonstrates designing a normalized schema for an e-commerce domain

## Domain: E-commerce System

## Entities and Attributes

### 1. Customers
- customer_id: INT (Primary Key)
- first_name: VARCHAR(50)
- last_name: VARCHAR(50)
- email: VARCHAR(100) UNIQUE
- phone: VARCHAR(20)
- address: VARCHAR(255)
- city: VARCHAR(50)
- state: VARCHAR(50)
- zip_code: VARCHAR(10)
- country: VARCHAR(50)
- created_at: DATETIME
- updated_at: DATETIME

### 2. Products
- product_id: INT (Primary Key)
- name: VARCHAR(100)
- description: TEXT
- price: DECIMAL(10, 2)
- stock_quantity: INT
- category_id: INT (Foreign Key)
- sku: VARCHAR(50) UNIQUE
- created_at: DATETIME
- updated_at: DATETIME

### 3. Categories
- category_id: INT (Primary Key)
- name: VARCHAR(50)
- description: TEXT
- parent_category_id: INT (Foreign Key, Self-reference)
- created_at: DATETIME

### 4. Orders
- order_id: INT (Primary Key)
- customer_id: INT (Foreign Key)
- order_date: DATETIME
- total_amount: DECIMAL(10, 2)
- status: VARCHAR(20) - (pending, processing, shipped, delivered, cancelled)
- shipping_address: VARCHAR(255)
- created_at: DATETIME
- updated_at: DATETIME

### 5. Order_Items (Junction Table for Many-to-Many)
- order_item_id: INT (Primary Key)
- order_id: INT (Foreign Key)
- product_id: INT (Foreign Key)
- quantity: INT
- unit_price: DECIMAL(10, 2)
- subtotal: DECIMAL(10, 2)

## Relationships

1. Customers to Orders: One-to-Many
   - One customer can place many orders
   - One order belongs to one customer
   - Foreign Key: customer_id in Orders

2. Categories to Products: One-to-Many
   - One category can have many products
   - One product belongs to one category
   - Foreign Key: category_id in Products
   - Self-reference: parent_category_id in Categories for subcategories

3. Orders to Products: Many-to-Many
   - One order can contain many products
   - One product can be in many orders
   - Junction Table: Order_Items
   - Foreign Keys: order_id, product_id in Order_Items

## Normalization to 3NF

### First Normal Form (1NF)
- All attributes have atomic values (no repeating groups)
- Each table has a primary key
- All tables are in 1NF

### Second Normal Form (2NF)
- All non-key attributes are fully dependent on the primary key
- In Order_Items, unit_price depends on product_id, so it could be moved
- However, we keep unit_price in Order_Items to capture the price at time of order (price changes over time)
- This is a business decision, not a normalization violation

### Third Normal Form (3NF)
- No transitive dependencies
- In Categories, name and description depend only on category_id
- In Products, name, description, price depend only on product_id
- In Orders, total_amount could be derived from Order_Items, but we store it for performance (denormalization)
- This is an intentional denormalization for query performance
- All other tables are in 3NF

## ER Diagram Description

```
Customers (1) ----< (N) Orders (N) ----< (M) Products (N) ----< (1) Categories
                                                |
                                                (1)
                                                |
                                             Categories (self-reference for subcategories)
```

- Customers has a one-to-many relationship with Orders
- Orders has a many-to-many relationship with Products through Order_Items
- Products has a one-to-many relationship with Categories
- Categories has a self-referencing one-to-many relationship for subcategories

## Table Definitions

### Table: Customers
```sql
CREATE TABLE Customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    country VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Table: Categories
```sql
CREATE TABLE Categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    parent_category_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES Categories(category_id)
);
```

### Table: Products
```sql
CREATE TABLE Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    category_id INT NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);
```

### Table: Orders
```sql
CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    shipping_address VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);
```

### Table: Order_Items
```sql
CREATE TABLE Order_Items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    UNIQUE (order_id, product_id)
);
```

## Design Decisions

1. **Auto-increment Primary Keys**: Simplifies key management and ensures uniqueness
2. **DATETIME for timestamps**: Captures both date and time for accurate tracking
3. **DECIMAL(10,2) for price**: Ensures precise decimal arithmetic for monetary values
4. **VARCHAR with appropriate lengths**: Balances storage efficiency with flexibility
5. **UNIQUE constraints**: Ensures data integrity (email, sku)
6. **FOREIGN KEY constraints**: Enforces referential integrity
7. **CHECK constraint**: Ensures quantity is positive
8. **GENERATED column for subtotal**: Automatic calculation reduces manual errors
9. **Denormalized total_amount in Orders**: Improves query performance (common read pattern)
10. **Self-reference in Categories**: Enables hierarchical category structure

## Example Queries

### Get all orders for a customer
```sql
SELECT o.order_id, o.order_date, o.total_amount, o.status
FROM Orders o
WHERE o.customer_id = 123;
```

### Get products in a category
```sql
SELECT p.product_id, p.name, p.price, p.stock_quantity
FROM Products p
WHERE p.category_id = 5;
```

### Get order details with customer and products
```sql
SELECT 
    o.order_id,
    o.order_date,
    c.first_name,
    c.last_name,
    p.name AS product_name,
    oi.quantity,
    oi.unit_price
FROM Orders o
JOIN Customers c ON o.customer_id = c.customer_id
JOIN Order_Items oi ON o.order_id = oi.order_id
JOIN Products p ON oi.product_id = p.product_id
WHERE o.order_id = 456;
```

### Get category hierarchy
```sql
SELECT 
    c1.category_id,
    c1.name AS category,
    c2.name AS parent_category
FROM Categories c1
LEFT JOIN Categories c2 ON c1.parent_category_id = c2.category_id;
```
