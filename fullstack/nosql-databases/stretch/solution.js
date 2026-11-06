// NoSQL Databases Reference Solution: Sharding and Replication
// MongoDB cluster architecture with sharding and replication

// ============================================
// === REPLICA SET CONFIGURATION ===
// ============================================

// Replica set configuration file (rs.conf)
const replicaSetConfig = {
  _id: 'blog-replica-set',
  members: [
    {
      _id: 0,
      host: 'mongodb1.example.com:27017',
      priority: 2, // Higher priority to become primary
      votes: 1
    },
    {
      _id: 1,
      host: 'mongodb2.example.com:27017',
      priority: 1,
      votes: 1
    },
    {
      _id: 2,
      host: 'mongodb3.example.com:27017',
      priority: 1,
      votes: 1
    }
  ],
  settings: {
    heartbeatIntervalMillis: 2000,
    electionTimeoutMillis: 10000,
    writeConcernMajorityJournalDefault: true
  }
};

// Initialize replica set
// Run this on the primary node
rs.initiate(replicaSetConfig);

// Write concern configuration
// Most writes require majority acknowledgment
const writeConcern = {
  w: 'majority',
  j: true, // Journaling enabled
  wtimeout: 5000 // 5 second timeout
};

// Read concern configuration
// Reads from primary for consistency
const readConcern = {
  level: 'majority'
};

// Automatic failover is enabled by default
// When primary fails, secondary with highest priority becomes new primary

// ============================================
// === SHARDING CONFIGURATION ===
// ============================================

// Start config server replica set (3 members)
// Config servers store cluster metadata
const configServerConfig = {
  _id: 'config-replica-set',
  members: [
    { _id: 0, host: 'config1.example.com:27019' },
    { _id: 1, host: 'config2.example.com:27019' },
    { _id: 2, host: 'config3.example.com:27019' }
  ]
};

// Start config servers
mongod --configsvr --replSet config-replica-set --port 27019 --dbpath /data/config1

// Initialize config server replica set
rs.initiate(configServerConfig);

// Start query routers (mongos instances)
// mongos routes client requests to appropriate shards
mongos --configdb config-replica-set/config1.example.com:27019,config2.example.com:27019,config3.example.com:27019 --port 27017

// Start shard replica sets (3 shards, each with 3 members)
// Shard 1
mongod --shardsvr --replSet shard1 --port 27018 --dbpath /data/shard1
rs.initiate({ _id: 'shard1', members: [{ _id: 0, host: 'shard1a:27018' }, { _id: 1, host: 'shard1b:27018' }, { _id: 2, host: 'shard1c:27018' }] });

// Shard 2
mongod --shardsvr --replSet shard2 --port 27020 --dbpath /data/shard2
rs.initiate({ _id: 'shard2', members: [{ _id: 0, host: 'shard2a:27020' }, { _id: 1, host: 'shard2b:27020' }, { _id: 2, host: 'shard2c:27020' }] });

// Shard 3
mongod --shardsvr --replSet shard3 --port 27021 --dbpath /data/shard3
rs.initiate({ _id: 'shard3', members: [{ _id: 0, host: 'shard3a:27021' }, { _id: 1, host: 'shard3b:27021' }, { _id: 2, host: 'shard3c:27021' }] });

// Add shards to cluster (connect to mongos)
sh.addShard('shard1/shard1a:27018,shard1b:27018,shard1c:27018');
sh.addShard('shard2/shard2a:27020,shard2b:27020,shard2c:27020');
sh.addShard('shard3/shard3a:27021,shard3b:27021,shard3c:27021');

// Enable sharding for database
sh.enableSharding('blog');

// Shard key selection for posts collection
// Choice: author_id (for user-scoped queries) or created_at (for time-series queries)
// For a blog, author_id is often better as it keeps a user's posts on the same shard
sh.shardCollection('blog.posts', { author_id: 1 });

// Hashed shard key alternative (for even distribution)
// sh.shardCollection('blog.posts', { author_id: 'hashed' });

// ============================================
// === INDEX OPTIMIZATION ===
// ============================================

// Create index for shard key (required)
db.posts.createIndex({ author_id: 1 });

// Compound indexes for common queries
db.posts.createIndex({ author_id: 1, created_at: -1 });
db.posts.createIndex({ created_at: -1, author_id: 1 });

// Text index for search
db.posts.createIndex({ title: 'text', content: 'text' });

// Index strategy for sharded collections:
// - Shard key must be part of any index that supports queries
// - For range queries on shard key, ensure index covers the range
// - For non-shard key queries, use scatter-gather (all shards)
// - Consider creating partial indexes for common query patterns

// Example: Partial index for active posts
db.posts.createIndex(
  { created_at: -1 },
  { partialFilterExpression: { status: 'published' } }
);

// ============================================
// === BACKUP AND RECOVERY ===
// ============================================

// Automated backup using mongodump
// For non-sharded cluster
mongodump --host mongodb1.example.com --port 27017 --db blog --out /backups/$(date +%Y%m%d)

// For sharded cluster (backup from config servers and each shard)
mongodump --host config1.example.com --port 27019 --out /backups/config
mongodump --host shard1a.example.com --port 27018 --db blog --out /backups/shard1
mongodump --host shard2a.example.com --port 27020 --db blog --out /backups/shard2
mongodump --host shard3a.example.com --port 27021 --db blog --out /backups/shard3

// Backup strategy for sharded cluster:
// 1. Stop balancer before backup (sh.stopBalancer())
// 2. Backup config servers (metadata)
// 3. Backup each shard's data
// 4. Restart balancer (sh.startBalancer())
// 5. Schedule regular backups (e.g., daily at off-peak hours)

// Restore using mongorestore
mongorestore --host mongodb1.example.com --port 27017 --db blog /backups/20240105/blog

// Point-in-time recovery using oplog
// Requires oplog replay (advanced, usually for critical systems)

// ============================================
// === MONITORING AND MAINTENANCE ===
// ============================================

// Check replica set status
rs.status();
rs.conf();

// Check if node is primary
db.isMaster();

// Check sharding status
sh.status();

// Check cluster health
db.adminCommand({ serverStatus: 1 });
db.adminCommand({ replSetGetStatus: 1 });

// Check balancer status
sh.getBalancerState();
sh.isBalancerRunning();

// Check chunk distribution
db.chunks.find({ ns: 'blog.posts' });

// Maintenance procedures:
// 1. Balancing: MongoDB automatically balances chunks between shards
// 2. Chunk migration: Move chunks manually if needed (sh.moveChunk())
// 3. Adding/removing shards: sh.addShard() / sh.removeShard()
// 4. Chunk size: Default 64MB, can be adjusted for workload
// 5. Splitting chunks: sh.splitAt() / sh.splitFind()

// Move chunk manually
sh.moveChunk('blog.posts', { author_id: ObjectId('...') }, 'shard2');

// ============================================
// === SECURITY CONFIGURATION ===
// ============================================

// Enable authentication
// Create admin user
use admin;
db.createUser({
  user: 'admin',
  pwd: passwordPrompt(),
  roles: ['root']
});

// Enable authentication in mongod.conf
security:
  authorization: enabled

// Role-based access control (RBAC)
// Create application user
use blog;
db.createUser({
  user: 'appUser',
  pwd: passwordPrompt(),
  roles: [
    { role: 'readWrite', db: 'blog' }
  ]
});

// Create read-only user
db.createUser({
  user: 'readUser',
  pwd: passwordPrompt(),
  roles: [
    { role: 'read', db: 'blog' }
  ]
});

// Enable encryption at rest
// Configure in mongod.conf
security:
  encryptionAtRestProvider: 'awsKms'  // or 'localKeyFile'

// Enable TLS/SSL for connections
// Configure in mongod.conf
net:
  ssl:
    mode: requireSSL
    PEMKeyFile: /path/to/mongodb.pem
    CAFile: /path/to/ca.pem

// Connect with TLS
mongo --ssl --host mongodb1.example.com --port 27017

// IP whitelisting
// Configure in mongod.conf
net:
  bindIp: 127.0.0.1,10.0.0.1  // Only allow from specific IPs

// Firewall rules (iptables)
iptables -A INPUT -p tcp --dport 27017 -s 10.0.0.0/8 -j ACCEPT
iptables -A INPUT -p tcp --dport 27017 -j DROP

// ============================================
// === EXAMPLE: CONNECTION STRING ===
// ============================================

// Connection string for replica set
const replicaSetUri = 'mongodb://mongodb1.example.com:27017,mongodb2.example.com:27017,mongodb3.example.com:27017/blog?replicaSet=blog-replica-set&w=majority&readConcern=majority';

// Connection string for sharded cluster
const shardedUri = 'mongodb://mongos1.example.com:27017,mongos2.example.com:27017/blog?readPreference=primary&w=majority';

// Connection string with TLS and auth
const secureUri = 'mongodb://appUser:password@mongodb1.example.com:27017/blog?ssl=true&authSource=admin';

// ============================================
// === SETUP SCRIPT ===
// ============================================

/*
// Node.js script to check cluster health
const { MongoClient } = require('mongodb');

async function checkClusterHealth() {
  const client = new MongoClient('mongodb://mongos1.example.com:27017');
  await client.connect();
  const admin = client.db('admin');

  // Check replica set status
  const replStatus = await admin.command({ replSetGetStatus: 1 });
  console.log('Replica Set Status:', replStatus);

  // Check sharding status
  const shardingStatus = await admin.command({ listShards: 1 });
  console.log('Sharding Status:', shardingStatus);

  // Check balancer
  const balancerStatus = await admin.command({ balancerStatus: 1 });
  console.log('Balancer Status:', balancerStatus);

  await client.close();
}

checkClusterHealth();
*/
