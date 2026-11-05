-- Database Design Reference Solution: Index for Speed
-- This solution demonstrates adding indexes to fix a slow query

-- ============================================
-- SCENARIO: E-commerce Order Search
-- ============================================

-- Business Scenario:
-- An e-commerce platform needs to allow customers to search their order history
-- by date range and status. The Orders table has millions of records, and queries
-- are slow because they require filtering on non-indexed columns.

-- ============================================
-- TABLE STRUCTURE
-- ============================================

CREATE TABLE Customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_date DATETIME NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL, -- pending, processing, shipped, delivered, cancelled
    shipping_address VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Sample data (representing 10,000+ rows in production)
-- In production, this table would have millions of records

-- ============================================
-- SLOW QUERY IDENTIFICATION
-- ============================================

-- Slow Query: Search orders by date range and status for a customer
-- This query is slow because:
-- 1. It filters on order_date (non-indexed column)
-- 2. It filters on status (non-indexed column)
-- 3. It filters on customer_id (non-indexed column)
-- 4. Without indexes, the database must perform a full table scan

SELECT order_id, order_date, total_amount, status
FROM Orders
WHERE customer_id = 12345
  AND order_date BETWEEN '2024-01-01' AND '2024-12-31'
  AND status = 'delivered'
ORDER BY order_date DESC;

-- Expected Execution Plan BEFORE Indexes:
-- 1. Full Table Scan: The database scans all rows in the Orders table
-- 2. Filter: Applies the WHERE conditions row by row
-- 3. Sort: Sorts the results by order_date
-- Time Complexity: O(n) where n = total number of rows
-- With millions of rows, this could take several seconds

-- ============================================
-- INDEX CREATION
-- ============================================

-- Index 1: Composite index on (customer_id, order_date, status)
-- Type: B-tree index (default for most databases)
-- Why chosen: This index covers all three WHERE clause columns
-- The order of columns matters: customer_id first (most selective), then order_date (range query), then status (equality)
-- This allows the database to use the index for all filtering conditions

CREATE INDEX idx_customer_date_status ON Orders(customer_id, order_date, status);

-- Index 2: Single-column index on order_date
-- Type: B-tree index
-- Why chosen: This index speeds up queries that filter by date range alone
-- Useful for reporting queries that don't filter by customer or status
-- Provides flexibility for different query patterns

CREATE INDEX idx_order_date ON Orders(order_date);

-- Index 3: Single-column index on status
-- Type: B-tree index
-- Why chosen: This index speeds up queries that filter by status alone
-- Useful for administrative queries (e.g., "show all pending orders")
-- Can be combined with other indexes by the query optimizer

CREATE INDEX idx_status ON Orders(status);

-- ============================================
-- PERFORMANCE ANALYSIS AFTER INDEXES
-- ============================================

-- Expected Execution Plan AFTER Indexes:
-- 1. Index Seek: The database uses idx_customer_date_status index
-- 2. Range Scan: Scans only the matching index entries for the date range
-- 3. Filter: Applies the status filter using the index
-- 4. Sort: May use the index for sorting if it's in the right order
-- Time Complexity: O(log n) for index seek + O(m) for range scan
-- where n = total rows, m = matching rows
-- With millions of rows, this reduces query time from seconds to milliseconds

-- Query Cost Reduction:
-- Before: Full table scan (cost: proportional to total rows)
-- After: Index seek + range scan (cost: proportional to matching rows)
-- For a customer with 100 orders out of 1,000,000 total:
-- Before: Scans 1,000,000 rows
-- After: Seeks index to find customer, then scans ~100 matching rows
-- Improvement: ~10,000x faster for this query

-- ============================================
-- TRADE-OFFS OF ADDING INDEXES
-- ============================================

-- 1. Increased Storage Space:
-- - Each index requires additional disk space
-- - For a table with 1 million rows, each index might add 10-50 MB
-- - With 3 indexes, this could add 30-150 MB of storage
-- - Trade-off: Storage is cheap, query performance is critical for user experience

-- 2. Slower INSERT/UPDATE/DELETE Operations:
-- - Every INSERT must update all indexes
-- - Every UPDATE on indexed columns must update the index
-- - Every DELETE must remove entries from all indexes
-- - This can slow down write operations by 10-30%
-- - Trade-off: This system is read-heavy (many more order searches than order inserts), so the benefit outweighs the cost

-- 3. Index Maintenance Overhead:
-- - The database must keep indexes in sync with the table
-- - Index fragmentation can occur over time
-- - Requires periodic index rebuilding or reorganizing
-- - Trade-off: Maintenance is manageable with scheduled jobs

-- 4. Memory Usage:
-- - Indexes are loaded into memory (buffer pool) for fast access
-- - More indexes mean more memory pressure
-- - Trade-off: Sufficient memory is available, and indexes are frequently used

-- When Indexes Are Worth the Cost:
-- - The table is large (thousands to millions of rows)
-- - Queries are frequent (run many times per second/minute)
-- - Queries are slow (taking more than 100ms)
-- - The read-to-write ratio is high (more reads than writes)
-- - The indexed columns are used in WHERE, JOIN, or ORDER BY clauses

-- When Indexes Might Not Be Worth It:
-- - The table is small (less than a few thousand rows)
-- - Queries are infrequent (run once a day or less)
-- - The table is write-heavy (many more inserts/updates than reads)
-- - Memory is constrained
-- - The indexed columns are rarely used in queries

-- ============================================
-- ADDITIONAL CONSIDERATIONS
-- ============================================

-- Covering Index (Optional Enhancement):
-- If we frequently select total_amount along with the filtering columns,
-- we could create a covering index that includes the selected column:

-- CREATE INDEX idx_customer_date_status_amount ON Orders(customer_id, order_date, status, total_amount);

-- This allows the query to be satisfied entirely from the index without
-- accessing the table data (index-only scan), which is even faster.

-- Partial Index (Optional Enhancement):
-- If we only care about recent orders (e.g., last 2 years), we could use a partial index:

-- CREATE INDEX idx_recent_orders ON Orders(customer_id, order_date, status)
-- WHERE order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 2 YEAR);

-- This reduces index size and maintenance overhead for old data.

-- ============================================
-- VERIFICATION
-- ============================================

-- To verify the performance improvement:
-- 1. Run EXPLAIN on the query before and after adding indexes
-- 2. Compare the query execution time
-- 3. Check the execution plan type (scan vs. seek)
-- 4. Monitor the index usage statistics

-- Example EXPLAIN command (MySQL):
-- EXPLAIN SELECT order_id, order_date, total_amount, status
-- FROM Orders
-- WHERE customer_id = 12345
--   AND order_date BETWEEN '2024-01-01' AND '2024-12-31'
--   AND status = 'delivered'
-- ORDER BY order_date DESC;

-- Before indexes: type = ALL (full table scan), rows = 1,000,000
-- After indexes: type = ref (index lookup), rows = 100
