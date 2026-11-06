# Work Log – NoSQL Databases Node

**Domain:** Web Development
**Node:** NoSQL Databases
**Status:** Projects completed with specifications and reference implementations

## 1. Accessible – Basic CRUD

**Objective:** Practice basic CRUD with MongoDB.

**Work completed:**
- Designed a basic MongoDB CRUD exercise for a blog schema.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria covering CREATE operations, READ operations, UPDATE and DELETE operations, and Advanced queries.
- Prepared a reference implementation with:

  **Schema (Provided)**
  - Users collection: _id, username, email, password_hash, created_at
  - Posts collection: _id, title, content, author_id, created_at, updated_at
  - Comments collection: _id, post_id, user_id, content, created_at

  **CREATE Operations**
  - insertOne for new user
  - insertMany for multiple posts
  - insertOne for comment

  **READ Operations**
  - find for all users
  - findOne for specific user by email
  - find with query for posts by author
  - find with projection for specific fields

  **UPDATE Operations**
  - updateOne to change user email
  - updateMany to update all posts by author
  - updateOne with $inc to increment counter
  - updateOne with $push to add to array
  - updateOne with $pull to remove from array

  **DELETE Operations**
  - deleteOne to remove user
  - deleteMany to remove all posts by author
  - deleteOne to remove comment
  - deleteMany for documents older than date

  **Advanced Queries**
  - Comparison operators ($gt, $lt, $gte, $lte)
  - Logical operators ($and, $or, $not)
  - $in and $nin operators
  - Sort, limit, skip (pagination)
  - Regular expression search
  - Array contains query ($all)
  - Array size query ($size)
  - Exists operator
  - Type operator
  - Mod operator

  **Node.js Driver Example**
  - Complete example with MongoClient
  - CRUD operations in async/await

## 2. Core – Aggregations

**Objective:** Use MongoDB aggregations for analytics.

**Work completed:**
- Designed a MongoDB aggregation exercise for analytics.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for basic aggregations, count and sum aggregations, array operations and complex pipelines, and advanced aggregations.
- Prepared a reference implementation with:

  **Basic Aggregations**
  - $match to filter documents (posts in 2024)
  - $group to group by field (posts per user)
  - $project to reshape documents (user names and email)
  - $sort to sort results (posts by date)

  **Count and Sum Aggregations**
  - Count posts per user
  - Sum comment counts per post
  - Count total users
  - Sum of post lengths (word count)

  **Average and Extreme Values**
  - Calculate average post length
  - Find most commented posts
  - Find most active users (posts + comments)
  - Find longest posts

  **Array Operations**
  - $unwind to flatten arrays (all tags from posts)
  - $lookup to join collections (posts with author info)
  - $push to create arrays (comment authors)
  - $addToSet to create unique arrays (unique comment authors)

  **Complex Pipelines**
  - Posts with comment counts
  - Users with post and comment counts
  - Monthly post statistics
  - User activity summary

  **Advanced Aggregations**
  - $facet to run multiple aggregations in parallel (post statistics)
  - $bucket to categorize data (posts by length)
  - $redact to filter based on document structure (posts with >5 comments)

  **Node.js Driver Example**
  - Complete example with aggregation pipeline

## 3. Stretch – Sharding and Replication

**Objective:** Design a sharded and replicated MongoDB cluster.

**Work completed:**
- Designed a MongoDB cluster architecture exercise.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for replica set configuration, sharding configuration, index optimization and backup, and monitoring and security.
- Prepared a reference implementation with:

  **Replica Set Configuration**
  - 3-node replica set (1 primary, 2 secondaries)
  - Configuration file with members, priority, votes
  - Write concern configuration (majority, journaling)
  - Read concern configuration (majority)
  - Automatic failover enabled
  - Initialization commands

  **Sharding Configuration**
  - 3-shard cluster design
  - Shard key selection (author_id for user-scoped queries)
  - Config server replica set (3 members)
  - Query routers (mongos instances)
  - Shard replica sets (3 shards, each with 3 members)
  - Shard addition commands
  - Database sharding enablement
  - Collection sharding with shard key
  - Hashed shard key alternative

  **Index Optimization**
  - Index for shard key (required)
  - Compound indexes for common queries
  - Text index for search
  - Partial index for active posts
  - Index strategy for sharded collections
  - Index selection guidelines

  **Backup and Recovery**
  - Automated backup with mongodump
  - Non-sharded cluster backup
  - Sharded cluster backup (config servers + each shard)
  - Backup strategy for sharded cluster
  - Restore with mongorestore
  - Point-in-time recovery (oplog)
  - Balancer control for backups

  **Monitoring and Maintenance**
  - Replica set status checks (rs.status, rs.conf)
  - Primary check (db.isMaster)
  - Sharding status (sh.status)
  - Cluster health commands
  - Balancer status checks
  - Chunk distribution check
  - Maintenance procedures (balancing, chunk migration)
  - Manual chunk movement

  **Security Configuration**
  - Authentication enablement
  - Admin user creation
  - Role-based access control (RBAC)
  - Application user creation
  - Read-only user creation
  - Encryption at rest (AWS KMS, local key file)
  - TLS/SSL for connections
  - IP whitelisting
  - Firewall rules (iptables)
  - Connection strings for different configurations

  **Setup Script**
  - Node.js script to check cluster health
  - Replica set status monitoring
  - Sharding status monitoring
  - Balancer status monitoring

## Overall Summary

| Difficulty | Project | Status |
|---|---|---|
| Accessible | Basic CRUD | Completed |
| Core | Aggregations | Completed |
| Stretch | Sharding and Replication | Completed |

**Deliverables prepared:**
- 3 project specifications (`project.json`)
- 3 reference implementations (`.js` files)
- Evaluation rubrics for all three projects
- Valid alternatives and mistakes-to-check lists
- Complete CRUD operations examples
- Aggregation pipeline examples
- Cluster architecture design
- Security and monitoring configuration

**Key NoSQL Databases concepts covered:**
- MongoDB document structure (BSON)
- CRUD operations (insertOne, insertMany, find, findOne, updateOne, updateMany, deleteOne, deleteMany)
- Comparison operators ($gt, $lt, $gte, $lte, $ne)
- Logical operators ($and, $or, $not, $nor)
- Element operators ($exists, $type)
- Array operators ($in, $nin, $all, $size, $elemMatch)
- Evaluation operators ($regex, $mod)
- Update operators ($set, $inc, $push, $pull, $unset)
- Query operators ($where, $text)
- Projection in find
- Sort, limit, skip (pagination)
- Aggregation framework
- Aggregation stages ($match, $group, $project, $sort, $limit, $skip)
- Aggregation operators ($sum, $avg, $min, $max, $first, $last)
- Array aggregations ($unwind, $lookup, $push, $addToSet)
- $facet for parallel aggregations
- $bucket for categorization
- $redact for conditional filtering
- Replica sets (primary, secondary, arbiter)
- Automatic failover
- Write concern (w, j, wtimeout)
- Read concern (level)
- Sharding (shard key, chunks, balancer)
- Config servers
- Query routers (mongos)
- Shard key selection
- Hashed shard keys
- Indexing strategy for sharded collections
- Compound indexes
- Text indexes
- Partial indexes
- Backup and recovery (mongodump, mongorestore)
- Point-in-time recovery (oplog)
- Cluster monitoring
- Balancer management
- Chunk migration
- Authentication and authorization
- Role-based access control (RBAC)
- Encryption at rest
- TLS/SSL
- IP whitelisting
- Connection strings
- High availability
- Horizontal scaling
- Data distribution

**Next step:** Technical review, execution testing, and verification of all reference implementations before final submission.
