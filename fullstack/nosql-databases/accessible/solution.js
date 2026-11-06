// NoSQL Databases Reference Solution: Basic CRUD
// Basic CRUD operations with MongoDB

// ============================================
// === SCHEMA (provided for reference) ===
// ============================================

// Users collection: _id, username, email, password_hash, created_at
// Posts collection: _id, title, content, author_id, created_at, updated_at
// Comments collection: _id, post_id, user_id, content, created_at

// ============================================
// === CREATE OPERATIONS ===
// ============================================

// Insert a new user
db.users.insertOne({
  username: 'johndoe',
  email: 'john@example.com',
  password_hash: '$2a$12$hashedpasswordhere',
  created_at: new Date()
});

// Insert multiple posts
db.posts.insertMany([
  {
    title: 'First Post',
    content: 'This is my first post',
    author_id: ObjectId('...'),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    title: 'Second Post',
    content: 'This is my second post',
    author_id: ObjectId('...'),
    created_at: new Date(),
    updated_at: new Date()
  }
]);

// Insert a comment
db.comments.insertOne({
  post_id: ObjectId('...'),
  user_id: ObjectId('...'),
  content: 'Great post!',
  created_at: new Date()
});

// ============================================
// === READ OPERATIONS ===
// ============================================

// Get all users
db.users.find({});

// Get a specific user by email
db.users.findOne({ email: 'john@example.com' });

// Get posts by author
db.posts.find({ author_id: ObjectId('...') });

// Get posts with projection (specific fields only)
db.posts.find(
  { author_id: ObjectId('...') },
  { title: 1, created_at: 1, _id: 0 }
);

// Get posts with multiple conditions
db.posts.find({
  author_id: ObjectId('...'),
  created_at: { $gte: new Date('2024-01-01') }
});

// ============================================
// === UPDATE OPERATIONS ===
// ============================================

// Change user email
db.users.updateOne(
  { _id: ObjectId('...') },
  { $set: { email: 'newemail@example.com' } }
);

// Update all posts by author
db.posts.updateMany(
  { author_id: ObjectId('...') },
  { $set: { updated_at: new Date() } }
);

// Increment a counter (e.g., view count)
db.posts.updateOne(
  { _id: ObjectId('...') },
  { $inc: { view_count: 1 } }
);

// Add to an array (e.g., tags)
db.posts.updateOne(
  { _id: ObjectId('...') },
  { $push: { tags: 'mongodb' } }
);

// Remove from an array
db.posts.updateOne(
  { _id: ObjectId('...') },
  { $pull: { tags: 'old-tag' } }
);

// Update multiple fields
db.users.updateOne(
  { _id: ObjectId('...') },
  {
    $set: {
      email: 'updated@example.com',
      updated_at: new Date()
    }
  }
);

// ============================================
// === DELETE OPERATIONS ===
// ============================================

// Remove a user
db.users.deleteOne({ _id: ObjectId('...') });

// Remove all posts by author
db.posts.deleteMany({ author_id: ObjectId('...') });

// Remove a comment
db.comments.deleteOne({ _id: ObjectId('...') });

// Remove documents older than a date
db.posts.deleteMany({
  created_at: { $lt: new Date('2023-01-01') }
});

// ============================================
// === ADVANCED QUERIES ===
// ============================================

// Comparison operators ($gt, $lt, $gte, $lte)
db.posts.find({
  created_at: {
    $gte: new Date('2024-01-01'),
    $lt: new Date('2024-12-31')
  }
});

// Logical operators ($and, $or, $not)
db.posts.find({
  $and: [
    { author_id: ObjectId('...') },
    { created_at: { $gte: new Date('2024-01-01') } }
  ]
});

db.posts.find({
  $or: [
    { title: /MongoDB/i },
    { content: /database/i }
  ]
});

// $in and $nin operators
db.posts.find({
  author_id: { $in: [ObjectId('...'), ObjectId('...')] }
});

db.posts.find({
  category: { $nin: ['spam', 'deleted'] }
});

// Sort, limit, and skip (pagination)
db.posts.find({})
  .sort({ created_at: -1 })
  .limit(10)
  .skip(0);

// Regular expression search
db.posts.find({
  title: { $regex: 'mongodb', $options: 'i' }
});

// Array contains query
db.posts.find({
  tags: { $all: ['mongodb', 'nodejs'] }
});

// Array size query
db.posts.find({
  tags: { $size: 3 }
});

// Exists operator
db.posts.find({
  view_count: { $exists: true }
});

// Type operator
db.users.find({
  email: { $type: 'string' }
});

// Mod operator (for numeric operations)
db.posts.find({
  view_count: { $mod: [10, 0] } // view_count is divisible by 10
});

// ============================================
// === EXAMPLE: NODE.JS DRIVER SYNTAX ===
// ============================================

/*
const { MongoClient } = require('mongodb');

async function run() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('blog');

  // Create user
  await db.collection('users').insertOne({
    username: 'johndoe',
    email: 'john@example.com',
    password_hash: await bcrypt.hash('password', 12),
    created_at: new Date()
  });

  // Find user
  const user = await db.collection('users').findOne({
    email: 'john@example.com'
  });

  // Update user
  await db.collection('users').updateOne(
    { _id: user._id },
    { $set: { email: 'new@example.com' } }
  );

  // Delete user
  await db.collection('users').deleteOne({ _id: user._id });

  await client.close();
}

run();
*/
