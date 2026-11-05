# Database Design Reference Solution: SQL vs NoSQL
# This solution demonstrates comparing SQL and NoSQL database designs

## Scenario: Social Media Feed

### Scenario Analysis

**Data Characteristics:**
- **Structure**: Semi-structured (users have structured profiles, posts have structured content, but comments and likes can vary)
- **Volume**: High growth rate (millions of posts, comments, likes added daily)
- **Query Patterns**: Read-heavy (news feed display is the most common operation), write-heavy (new posts, comments, likes)
- **Relationships**: Complex (users follow users, posts have comments and likes, many-to-many relationships)
- **Consistency**: Eventual consistency acceptable (it's okay if a like takes a few seconds to appear)
- **Scalability**: Needs to scale horizontally for millions of concurrent users

## Justification: NoSQL (MongoDB) is Better for This Scenario

### Reasons for Choosing NoSQL:

1. **Flexible Schema for Social Content**
   - Social media data is naturally semi-structured
   - Posts can have varying content types (text, images, videos, polls)
   - Comments can have nested replies, reactions, and metadata
   - NoSQL document model accommodates this flexibility without schema migrations
   - SQL would require complex JSON columns or many related tables

2. **High Write Volume and Scalability**
   - Millions of posts, comments, and likes per day
   - NoSQL databases scale horizontally more easily
   - Sharding by user_id or timestamp is straightforward
   - SQL databases require complex sharding and master-slave configurations
   - Write performance is critical for social media feeds

3. **Read-Heavy with Complex Access Patterns**
   - News feed needs to fetch posts from followed users
   - Nested comments and likes need to be displayed efficiently
   - Document embedding reduces join operations
   - SQL would require many joins for a single feed query
   - NoSQL can embed related data (comments, likes) in the post document

### Why SQL Would Be Less Suitable:

- Schema migrations would be frequent as features evolve
- Complex many-to-many relationships would require many junction tables
- Joins would be expensive for feed queries
- Horizontal scaling is more complex
- ACID transactions are less critical for social media (eventual consistency is acceptable)

### Trade-offs of NoSQL Choice:

- **Less Strict Data Integrity**: No referential integrity, but application-level validation can compensate
- **Limited Query Capabilities**: Complex aggregations are harder, but MongoDB's aggregation framework is powerful
- **Eventual Consistency**: Not ideal for financial transactions, but acceptable for social media
- **Learning Curve**: Teams need to learn document modeling patterns

## SQL Schema Design (Relational)

### Tables:

#### Users
```sql
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    bio TEXT,
    profile_image_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Posts
```sql
CREATE TABLE Posts (
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    post_type VARCHAR(20) DEFAULT 'text', -- text, image, video, poll
    media_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
```

#### Follows (Junction Table for Many-to-Many)
```sql
CREATE TABLE Follows (
    follower_id INT NOT NULL,
    following_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES Users(user_id),
    FOREIGN KEY (following_id) REFERENCES Users(user_id),
    CHECK (follower_id != following_id)
);
```

#### Comments
```sql
CREATE TABLE Comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_comment_id INT, -- Self-reference for nested comments
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Posts(post_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (parent_comment_id) REFERENCES Comments(comment_id)
);
```

#### Likes (Junction Table for Many-to-Many)
```sql
CREATE TABLE Likes (
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id)
);
```

### Example Queries:

#### Get news feed for a user (posts from followed users)
```sql
SELECT p.post_id, p.content, p.post_type, p.media_url, p.created_at,
       u.username, u.profile_image_url,
       (SELECT COUNT(*) FROM Likes l WHERE l.post_id = p.post_id) AS like_count,
       (SELECT COUNT(*) FROM Comments c WHERE c.post_id = p.post_id) AS comment_count
FROM Posts p
JOIN Users u ON p.user_id = u.user_id
WHERE p.user_id IN (
    SELECT following_id FROM Follows WHERE follower_id = 123
)
ORDER BY p.created_at DESC
LIMIT 20;
```

#### Get post with nested comments
```sql
WITH RECURSIVE CommentTree AS (
    SELECT comment_id, post_id, user_id, parent_comment_id, content, created_at, 1 AS level
    FROM Comments
    WHERE post_id = 456 AND parent_comment_id IS NULL
    
    UNION ALL
    
    SELECT c.comment_id, c.post_id, c.user_id, c.parent_comment_id, c.content, c.created_at, ct.level + 1
    FROM Comments c
    JOIN CommentTree ct ON c.parent_comment_id = ct.comment_id
)
SELECT ct.*, u.username
FROM CommentTree ct
JOIN Users u ON ct.user_id = u.user_id
ORDER BY ct.created_at;
```

## NoSQL Schema Design (MongoDB)

### Collections and Document Structures:

#### Users Collection
```javascript
{
  _id: ObjectId("..."),
  username: "johndoe",
  email: "john@example.com",
  password_hash: "...",
  bio: "Software developer",
  profile_image_url: "https://...",
  followers_count: 150,
  following_count: 75,
  created_at: ISODate("2024-01-01T00:00:00Z"),
  updated_at: ISODate("2024-01-15T00:00:00Z")
}
```

#### Posts Collection (with embedded comments and likes)
```javascript
{
  _id: ObjectId("..."),
  user_id: ObjectId("..."),
  username: "johndoe",
  profile_image_url: "https://...",
  content: "Hello world!",
  post_type: "text",
  media_url: null,
  likes_count: 25,
  comments_count: 5,
  created_at: ISODate("2024-01-10T00:00:00Z"),
  updated_at: ISODate("2024-01-10T00:00:00Z"),
  
  // Embedded comments (for read performance)
  comments: [
    {
      comment_id: ObjectId("..."),
      user_id: ObjectId("..."),
      username: "janedoe",
      content: "Great post!",
      created_at: ISODate("2024-01-10T01:00:00Z"),
      // Nested comments (limited depth)
      replies: [
        {
          comment_id: ObjectId("..."),
          user_id: ObjectId("..."),
          username: "johndoe",
          content: "Thanks!",
          created_at: ISODate("2024-01-10T02:00:00Z")
        }
      ]
    }
  ],
  
  // Embedded likes (for read performance, limited to recent 20)
  recent_likes: [
    {
      user_id: ObjectId("..."),
      username: "janedoe",
      liked_at: ISODate("2024-01-10T01:30:00Z")
    }
  ]
}
```

#### Follows Collection
```javascript
{
  _id: ObjectId("..."),
  follower_id: ObjectId("..."),
  following_id: ObjectId("..."),
  created_at: ISODate("2024-01-05T00:00:00Z")
}

// Compound index on {follower_id: 1, following_id: 1} for uniqueness
// Index on {follower_id: 1} for fast lookup of who a user follows
```

#### Likes Collection (separate for write performance)
```javascript
{
  _id: ObjectId("..."),
  user_id: ObjectId("..."),
  post_id: ObjectId("..."),
  created_at: ISODate("2024-01-10T01:00:00Z")
}

// Compound index on {user_id: 1, post_id: 1} for uniqueness
// Index on {post_id: 1} for fast lookup of who liked a post
```

### Embed vs Reference Decisions:

1. **Comments Embedded in Posts**:
   - Decision: Embed top-level comments (with limited nested replies)
   - Reason: Feed display needs comments immediately (read-heavy)
   - Trade-off: Document size increases, but reduces join operations

2. **Likes Separated**:
   - Decision: Keep likes in separate collection, only embed recent likes (20) in post
   - Reason: Likes are write-heavy, embedding all would make documents huge
   - Trade-off: Additional lookup for full like list, but reasonable for social media

3. **Follows Separated**:
   - Decision: Keep follows in separate collection
   - Reason: Follows are independent entities, can grow very large
   - Trade-off: Requires lookup for feed generation, but enables efficient follow/unfollow

### Example Queries (MongoDB):

#### Get news feed for a user
```javascript
db.posts.find({
  user_id: { $in: db.follows.find({ follower_id: ObjectId("...") }).map(f => f.following_id) }
})
.sort({ created_at: -1 })
.limit(20);
```

#### Get post with comments
```javascript
db.posts.findOne(
  { _id: ObjectId("...") },
  { projection: { comments: 1, comments_count: 1 } }
);
```

#### Check if user liked a post
```javascript
db.likes.findOne({
  user_id: ObjectId("..."),
  post_id: ObjectId("...")
});
```

## Comparison

### Complexity of Relationships:
- **SQL**: Requires explicit junction tables for many-to-many relationships, foreign keys enforce integrity
- **NoSQL**: Relationships are modeled through embedded documents or references, no foreign key constraints
- **Winner**: SQL for complex relationships with strict integrity, NoSQL for flexibility

### Query Complexity:
- **SQL**: Complex queries require joins, recursive CTEs for nested data
- **NoSQL**: Embedded data reduces joins, but complex aggregations can be challenging
- **Winner**: NoSQL for read-heavy nested data (social feeds), SQL for complex analytical queries

### Data Modeling Flexibility:
- **SQL**: Schema must be defined upfront, migrations required for changes
- **NoSQL**: Schema-less, documents can vary, easy to evolve
- **Winner**: NoSQL for rapidly changing requirements, SQL for stable domains

### Schema Evolution:
- **SQL**: Requires migrations, can be complex for large tables
- **NoSQL**: Schema evolution is natural, no migrations needed
- **Winner**: NoSQL for agile development, SQL for regulated environments

### Performance Characteristics:
- **SQL**: Excellent for complex queries with joins, ACID transactions
- **NoSQL**: Excellent for high write volume, horizontal scaling, read performance with embedding
- **Winner**: NoSQL for social media (high write volume, read-heavy, horizontal scaling needed)

## Decision

**Chosen Database:** NoSQL (MongoDB)

**Reasoning:**
The social media feed scenario is best served by MongoDB because:
1. The semi-structured nature of social content fits the document model
2. High write volume (millions of posts/comments/likes per day) requires horizontal scalability
3. Read-heavy feed queries benefit from embedded data (comments, likes)
4. Schema flexibility allows rapid feature evolution without migrations
5. Eventual consistency is acceptable for social media interactions

**When to Switch to SQL:**
I would switch to SQL if:
- The application requires strict ACID transactions (e.g., financial features)
- Complex analytical queries are needed (e.g., detailed reporting, analytics)
- Data relationships become very complex with many interdependencies
- Regulatory requirements demand strict data integrity and auditing
- The team has strong SQL expertise and limited NoSQL experience

**Hybrid Approach:**
Many large social media platforms use a hybrid approach:
- NoSQL for the feed, posts, comments, likes (high write volume, flexible schema)
- SQL for user accounts, payments, analytics (structured data, complex queries)
- This leverages the strengths of both database types
