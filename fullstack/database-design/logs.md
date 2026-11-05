# Work Log – Database Design Node

**Domain:** Web Development
**Node:** Database Design
**Status:** Projects completed with specifications and reference implementations

## 1. Accessible – Model a Domain

**Objective:** Design a normalized schema for a real domain.

**Work completed:**
- Designed a database schema exercise for an e-commerce domain.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria covering entity identification and attributes, relationships and foreign keys, normalization to 3NF, and schema documentation.
- Prepared a reference implementation with:
  - E-commerce domain with 5 entities: Customers, Products, Categories, Orders, Order_Items
  - Detailed attribute definitions with appropriate data types
  - Primary keys identified for all entities
  - Relationships: One-to-Many (Customers-Orders, Categories-Products), Many-to-Many (Orders-Products)
  - Junction table (Order_Items) for many-to-many relationship
  - Self-reference in Categories for hierarchical subcategories
  - Normalization to 3NF with explanation of each step
  - ER diagram description showing all relationships
  - Complete table definitions with SQL CREATE TABLE statements
  - Constraints: PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, DEFAULT
  - Design decisions documented (auto-increment, DATETIME, DECIMAL, VARCHAR choices)
  - Intentional denormalization justified (total_amount in Orders)
  - Example queries for common operations
  - Explanation of embedding decisions

## 2. Core – Index for Speed

**Objective:** Add indexes to fix a slow query and prove the gain.

**Work completed:**
- Designed an indexing exercise for an e-commerce order search scenario.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for scenario and slow query identification, index design and creation, performance analysis and execution plans, and trade-off discussion.
- Prepared a reference implementation with:
  - E-commerce order search scenario with large volume (millions of rows)
  - Table structures: Customers and Orders with foreign key relationship
  - Slow query identified: search orders by customer_id, date range, and status
  - Explanation of why query is slow (full table scan on non-indexed columns)
  - Three indexes created:
    - Composite index on (customer_id, order_date, status) - covers all WHERE columns
    - Single-column index on order_date - for date-range queries
    - Single-column index on status - for status filtering
  - Index types: B-tree (default for most databases)
  - Index ordering justification (most selective to least selective)
  - Execution plan analysis before indexes: full table scan, O(n) complexity
  - Execution plan analysis after indexes: index seek + range scan, O(log n) + O(m) complexity
  - Performance improvement calculation: ~10,000x faster for example scenario
  - Query cost reduction explained with concrete numbers
  - Comprehensive trade-off discussion:
    - Increased storage space (30-150 MB for 3 indexes)
    - Slower INSERT/UPDATE/DELETE (10-30% slower)
    - Index maintenance overhead (fragmentation, rebuilding)
    - Memory usage (buffer pool pressure)
  - When indexes are worth the cost (large tables, frequent queries, read-heavy)
  - When indexes might not be worth it (small tables, infrequent queries, write-heavy)
  - Optional enhancements: covering index, partial index
  - Verification steps with EXPLAIN command

## 3. Stretch – SQL vs NoSQL

**Objective:** Justify SQL vs NoSQL for a scenario and model both.

**Work completed:**
- Designed a SQL vs NoSQL comparison exercise for a social media feed scenario.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for scenario analysis and justification, SQL schema design, NoSQL schema design, and comparison and decision.
- Prepared a reference implementation with:

  **Scenario Analysis**
  - Social media feed domain (posts, comments, likes, follows)
  - Data characteristics: semi-structured, high volume, read-heavy, complex relationships
  - Consistency: eventual consistency acceptable
  - Scalability: horizontal scaling needed

  **Justification for NoSQL (MongoDB)**
  - Flexible schema for semi-structured social content
  - High write volume and horizontal scalability
  - Read-heavy with complex access patterns (embedding reduces joins)
  - SQL less suitable: schema migrations, complex joins, ACID not critical

  **SQL Schema Design**
  - 5 tables: Users, Posts, Follows (junction), Comments (self-reference), Likes (junction)
  - Proper normalization with foreign keys
  - Complex query with joins for news feed
  - Recursive CTE for nested comments
  - Full ACID compliance

  **NoSQL Schema Design (MongoDB)**
  - 4 collections: Users, Posts (with embedded comments and recent likes), Follows, Likes
  - Embed vs reference decisions:
    - Comments embedded in posts (read performance)
    - Likes separated (write performance), recent likes embedded
    - Follows separated (independent entity)
  - Compound indexes for performance
  - MongoDB query examples for feed, comments, likes

  **Comparison**
  - Complexity: SQL more complex relationships, NoSQL more flexible
  - Query complexity: SQL joins vs NoSQL embedding
  - Flexibility: NoSQL schema-less, SQL requires migrations
  - Schema evolution: NoSQL natural, SQL requires migrations
  - Performance: NoSQL better for high write volume and horizontal scaling

  **Decision**
  - Chosen: NoSQL (MongoDB) for social media feed
  - Reasoning: semi-structured data, high write volume, read-heavy, horizontal scaling
  - When to switch to SQL: ACID transactions needed, complex analytics, strict integrity
  - Hybrid approach mentioned: NoSQL for feed/posts, SQL for payments/analytics

## Overall Summary

| Difficulty | Project | Status |
|---|---|---|
| Accessible | Model a Domain | Completed |
| Core | Index for Speed | Completed |
| Stretch | SQL vs NoSQL | Completed |

**Deliverables prepared:**
- 3 project specifications (`project.json`)
- 3 reference implementations (`.md`, `.sql` files)
- Evaluation rubrics for all three projects
- Valid alternatives and mistakes-to-check lists
- Complete ER diagrams and schema documentation
- SQL and NoSQL schema designs with explanations

**Key Database Design concepts covered:**
- Entity-Relationship (ER) modeling
- Primary keys and foreign keys
- One-to-one, one-to-many, many-to-many relationships
- Junction tables for many-to-many relationships
- Normalization (1NF, 2NF, 3NF)
- Transitive dependencies
- Database indexes (B-tree, composite, unique)
- Index optimization and query performance
- Execution plans (full table scan vs index seek)
- Query complexity analysis (O(n) vs O(log n))
- Index trade-offs (storage, write performance, maintenance)
- SQL vs NoSQL comparison
- Relational database modeling
- Document database modeling (MongoDB)
- Embed vs reference decisions
- Schema flexibility and evolution
- Horizontal scalability
- Data integrity constraints
- ACID vs eventual consistency
- Hybrid database architectures

**Next step:** Technical review, execution testing, and verification of all reference implementations before final submission.
