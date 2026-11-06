-- SQL Databases Reference Solution: Transactions and Constraints
-- Database transactions and constraints for data integrity

-- ============================================
-- === TABLE CREATION WITH CONSTRAINTS ===
-- ============================================

-- Create Products table with constraints
CREATE TABLE Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    category VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (name)
);

-- Create Customers table with constraints
CREATE TABLE Customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(255),
    phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CHECK (email LIKE '%@%.%')
);

-- Create Orders table with constraints
CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    status VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Create Order_Items table with constraints
CREATE TABLE Order_Items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    UNIQUE (order_id, product_id)
);

-- ============================================
-- === INDEXES FOR PERFORMANCE ===
-- ============================================

-- Index on customer_id in Orders table
CREATE INDEX idx_orders_customer_id ON Orders(customer_id);

-- Index on product_id in Order_Items table
CREATE INDEX idx_order_items_product_id ON Order_Items(product_id);

-- Index on email in Customers table
CREATE INDEX idx_customers_email ON Customers(email);

-- Index on order_date in Orders table
CREATE INDEX idx_orders_date ON Orders(order_date);

-- Index on category in Products table
CREATE INDEX idx_products_category ON Products(category);

-- ============================================
-- === TRANSACTION IMPLEMENTATION ===
-- ============================================

-- Transaction to create an order with multiple items
-- This ensures atomicity: either all items are added or none
START TRANSACTION;

-- Insert the order
INSERT INTO Orders (customer_id, total_amount, status)
VALUES (1, 0, 'pending');

SET @order_id = LAST_INSERT_ID();

-- Insert order items
INSERT INTO Order_Items (order_id, product_id, quantity, unit_price)
VALUES (@order_id, 1, 2, 999.99);

INSERT INTO Order_Items (order_id, product_id, quantity, unit_price)
VALUES (@order_id, 2, 1, 49.99);

-- Update order total
UPDATE Orders
SET total_amount = (SELECT SUM(subtotal) FROM Order_Items WHERE order_id = @order_id)
WHERE order_id = @order_id;

-- Update stock quantities
UPDATE Products
SET stock_quantity = stock_quantity - 2
WHERE product_id = 1;

UPDATE Products
SET stock_quantity = stock_quantity - 1
WHERE product_id = 2;

-- Commit the transaction
COMMIT;

-- ============================================
-- === TRANSACTION WITH ERROR HANDLING ===
-- ============================================

-- Transaction with error handling (stored procedure example)
DELIMITER //

CREATE PROCEDURE place_order(
    IN p_customer_id INT,
    IN p_product_ids JSON,
    IN p_quantities JSON
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error placing order' AS message;
    END;
    
    START TRANSACTION;
    
    -- Insert the order
    INSERT INTO Orders (customer_id, total_amount, status)
    VALUES (p_customer_id, 0, 'pending');
    
    SET @order_id = LAST_INSERT_ID();
    SET @total_amount = 0;
    
    -- Process each product
    SET @i = 0;
    WHILE @i < JSON_LENGTH(p_product_ids) DO
        SET @product_id = JSON_EXTRACT(p_product_ids, CONCAT('$[', @i, ']'));
        SET @quantity = JSON_EXTRACT(p_quantities, CONCAT('$[', @i, ']'));
        
        -- Check stock availability
        SELECT stock_quantity INTO @stock FROM Products WHERE product_id = @product_id;
        
        IF @stock < @quantity THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient stock';
        END IF;
        
        -- Get product price
        SELECT price INTO @price FROM Products WHERE product_id = @product_id;
        
        -- Insert order item
        INSERT INTO Order_Items (order_id, product_id, quantity, unit_price)
        VALUES (@order_id, @product_id, @quantity, @price);
        
        -- Update stock
        UPDATE Products
        SET stock_quantity = stock_quantity - @quantity
        WHERE product_id = @product_id;
        
        -- Add to total
        SET @total_amount = @total_amount + (@quantity * @price);
        
        SET @i = @i + 1;
    END WHILE;
    
    -- Update order total
    UPDATE Orders
    SET total_amount = @total_amount
    WHERE order_id = @order_id;
    
    COMMIT;
    
    SELECT @order_id AS order_id, @total_amount AS total_amount;
END //

DELIMITER ;

-- ============================================
-- === TRIGGER: PREVENT DELETING PRODUCTS WITH ORDERS ===
-- ============================================

DELIMITER //

CREATE TRIGGER prevent_product_deletion
BEFORE DELETE ON Products
FOR EACH ROW
BEGIN
    DECLARE order_count INT;
    
    SELECT COUNT(*) INTO order_count
    FROM Order_Items
    WHERE product_id = OLD.product_id;
    
    IF order_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete product with existing orders';
    END IF;
END //

DELIMITER ;

-- ============================================
-- === TRIGGER: UPDATE ORDER TOTAL ===
-- ============================================

DELIMITER //

CREATE TRIGGER update_order_total_after_insert
AFTER INSERT ON Order_Items
FOR EACH ROW
BEGIN
    UPDATE Orders
    SET total_amount = (SELECT SUM(subtotal) FROM Order_Items WHERE order_id = NEW.order_id)
    WHERE order_id = NEW.order_id;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER update_order_total_after_update
AFTER UPDATE ON Order_Items
FOR EACH ROW
BEGIN
    UPDATE Orders
    SET total_amount = (SELECT SUM(subtotal) FROM Order_Items WHERE order_id = NEW.order_id)
    WHERE order_id = NEW.order_id;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER update_order_total_after_delete
AFTER DELETE ON Order_Items
FOR EACH ROW
BEGIN
    UPDATE Orders
    SET total_amount = (SELECT SUM(subtotal) FROM Order_Items WHERE order_id = OLD.order_id)
    WHERE order_id = OLD.order_id;
END //

DELIMITER ;

-- ============================================
-- === SAMPLE DATA INSERTION ===
-- ============================================

-- Insert sample products
INSERT INTO Products (name, price, stock_quantity, category) VALUES
('Laptop', 999.99, 50, 'Electronics'),
('Mouse', 29.99, 200, 'Electronics'),
('Keyboard', 79.99, 150, 'Electronics'),
('Monitor', 349.99, 75, 'Electronics'),
('Headphones', 149.99, 100, 'Electronics');

-- Insert sample customers
INSERT INTO Customers (name, email, address, phone) VALUES
('John Doe', 'john@example.com', '123 Main St, City', '555-1234'),
('Jane Smith', 'jane@example.com', '456 Oak Ave, Town', '555-5678'),
('Bob Johnson', 'bob@example.com', '789 Pine Rd, Village', '555-9012');

-- ============================================
-- === TESTING THE STORED PROCEDURE ===
-- ============================================

-- Place an order using the stored procedure
CALL place_order(
    1, 
    '[1, 2, 3]', 
    '[1, 2, 1]'
);

-- ============================================
-- === TESTING THE TRIGGERS ===
-- ============================================

-- Test order total update trigger
INSERT INTO Order_Items (order_id, product_id, quantity, unit_price)
VALUES (1, 4, 1, 349.99);

-- Check that order total was updated
SELECT total_amount FROM Orders WHERE order_id = 1;

-- Test product deletion prevention trigger
-- This should fail with an error
DELETE FROM Products WHERE product_id = 1;

-- ============================================
-- === HOW TO USE ===
-- ============================================

-- 1. Execute the table creation scripts first
-- 2. Execute the index creation scripts
-- 3. Execute the stored procedure creation
-- 4. Execute the trigger creation
-- 5. Insert sample data
-- 6. Test the stored procedure and triggers

-- To rollback a transaction manually:
-- ROLLBACK;

-- To commit a transaction manually:
-- COMMIT;

-- To view constraints on a table:
-- SHOW CREATE TABLE Products;

-- To view indexes on a table:
-- SHOW INDEX FROM Orders;

-- To drop a trigger:
-- DROP TRIGGER prevent_product_deletion;

-- To drop a stored procedure:
-- DROP PROCEDURE place_order;
