// Authentication Reference Solution: Role-Based Access Control
// RBAC implementation with JWT for Express API

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

app.use(express.json());

const JWT_SECRET = 'your-secret-key';
const JWT_EXPIRATION = '1h';

// ============================================
// === ROLE DEFINITIONS AND PERMISSIONS ===
// ============================================

const ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user'
};

const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 3,
  [ROLES.MODERATOR]: 2,
  [ROLES.USER]: 1
};

const PERMISSIONS = {
  [ROLES.ADMIN]: {
    canReadPosts: true,
    canCreatePosts: true,
    canUpdateAnyPost: true,
    canDeleteAnyPost: true,
    canDeleteUsers: true,
    canListUsers: true,
    canChangeRoles: true
  },
  [ROLES.MODERATOR]: {
    canReadPosts: true,
    canCreatePosts: true,
    canUpdateAnyPost: true,
    canDeleteAnyPost: true,
    canDeleteUsers: false,
    canListUsers: false,
    canChangeRoles: false
  },
  [ROLES.USER]: {
    canReadPosts: true,
    canCreatePosts: true,
    canUpdateAnyPost: false,
    canDeleteAnyPost: false,
    canDeleteUsers: false,
    canListUsers: false,
    canChangeRoles: false
  }
};

// ============================================
// === DATA STORE ===
// ============================================

let users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
    role: ROLES.ADMIN,
    created_at: new Date()
  },
  {
    id: 2,
    username: 'moderator',
    email: 'moderator@example.com',
    password: bcrypt.hashSync('mod123', 10),
    role: ROLES.MODERATOR,
    created_at: new Date()
  },
  {
    id: 3,
    username: 'user1',
    email: 'user1@example.com',
    password: bcrypt.hashSync('user123', 10),
    role: ROLES.USER,
    created_at: new Date()
  }
];

let posts = [
  { id: 1, title: 'Post 1', content: 'Content 1', author_id: 1, created_at: new Date() },
  { id: 2, title: 'Post 2', content: 'Content 2', author_id: 2, created_at: new Date() },
  { id: 3, title: 'Post 3', content: 'Content 3', author_id: 3, created_at: new Date() }
];

// ============================================
// === HELPER FUNCTIONS ===
// ============================================

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );
};

const hasPermission = (role, permission) => {
  return PERMISSIONS[role] && PERMISSIONS[role][permission];
};

const hasRole = (userRole, requiredRole) => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

// ============================================
// === JWT MIDDLEWARE ===
// ============================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = decoded;
    next();
  });
};

// ============================================
// === AUTHORIZATION MIDDLEWARE ===
// ============================================

const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!hasRole(req.user.role, requiredRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// ============================================
// === AUTH ROUTES ===
// ============================================

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, role = ROLES.USER } = req.body;
  
  // Validate role
  if (!Object.values(ROLES).includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now(),
    username,
    email,
    password: hashedPassword,
    role,
    created_at: new Date()
  };
  
  users.push(user);
  
  const { password: _, ...userWithoutPassword } = user;
  const token = generateToken(user);
  
  res.status(201).json({
    message: 'User registered',
    user: userWithoutPassword,
    token
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = generateToken(user);
  
  const { password: _, ...userWithoutPassword } = user;
  res.json({
    message: 'Login successful',
    user: userWithoutPassword,
    token
  });
});

// ============================================
// === PROTECTED ROUTES ===
// ============================================

// All authenticated users can read posts
app.get('/api/posts', authenticateToken, (req, res) => {
  res.json({
    count: posts.length,
    posts: posts
  });
});

// Admin and moderator can create posts
app.post('/api/posts', authenticateToken, requirePermission('canCreatePosts'), (req, res) => {
  const { title, content } = req.body;
  
  const post = {
    id: Date.now(),
    title,
    content,
    author_id: req.user.userId,
    created_at: new Date()
  };
  
  posts.push(post);
  
  res.status(201).json({
    message: 'Post created',
    post
  });
});

// Admin and moderator can update any post
app.put('/api/posts/:id', authenticateToken, requirePermission('canUpdateAnyPost'), (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  const { title, content } = req.body;
  
  if (title) post.title = title;
  if (content) post.content = content;
  
  res.json({
    message: 'Post updated',
    post
  });
});

// User can update own post, admin and moderator can update any post
app.put('/api/posts/:id/own', authenticateToken, (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  // Check ownership or elevated role
  if (post.author_id !== req.user.userId && !hasPermission(req.user.role, 'canUpdateAnyPost')) {
    return res.status(403).json({ error: 'You can only update your own posts' });
  }
  
  const { title, content } = req.body;
  
  if (title) post.title = title;
  if (content) post.content = content;
  
  res.json({
    message: 'Post updated',
    post
  });
});

// Admin and moderator can delete any post
app.delete('/api/posts/:id', authenticateToken, requirePermission('canDeleteAnyPost'), (req, res) => {
  const index = posts.findIndex(p => p.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  const deletedPost = posts.splice(index, 1)[0];
  
  res.json({
    message: 'Post deleted',
    post: deletedPost
  });
});

// User can delete own post, admin and moderator can delete any post
app.delete('/api/posts/:id/own', authenticateToken, (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  // Check ownership or elevated role
  if (post.author_id !== req.user.userId && !hasPermission(req.user.role, 'canDeleteAnyPost')) {
    return res.status(403).json({ error: 'You can only delete your own posts' });
  }
  
  const index = posts.findIndex(p => p.id === parseInt(req.params.id));
  const deletedPost = posts.splice(index, 1)[0];
  
  res.json({
    message: 'Post deleted',
    post: deletedPost
  });
});

// Only admin can list all users
app.get('/api/users', authenticateToken, requirePermission('canListUsers'), (req, res) => {
  const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  res.json({
    count: usersWithoutPasswords.length,
    users: usersWithoutPasswords
  });
});

// Only admin can delete users
app.delete('/api/users/:id', authenticateToken, requirePermission('canDeleteUsers'), (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const deletedUser = users.splice(index, 1)[0];
  
  res.json({
    message: 'User deleted',
    user: deletedUser
  });
});

// Only admin can change user roles
app.put('/api/users/:id/role', authenticateToken, requirePermission('canChangeRoles'), (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { role } = req.body;
  
  if (!Object.values(ROLES).includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  
  user.role = role;
  
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    message: 'User role updated',
    user: userWithoutPassword
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'RBAC API',
    roles: ROLES,
    permissions: PERMISSIONS,
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      posts: 'GET /api/posts (all authenticated)',
      createPost: 'POST /api/posts (admin, moderator)',
      updatePost: 'PUT /api/posts/:id (admin, moderator)',
      updateOwnPost: 'PUT /api/posts/:id/own (owner, admin, moderator)',
      deletePost: 'DELETE /api/posts/:id (admin, moderator)',
      deleteOwnPost: 'DELETE /api/posts/:id/own (owner, admin, moderator)',
      listUsers: 'GET /api/users (admin)',
      deleteUser: 'DELETE /api/users/:id (admin)',
      changeRole: 'PUT /api/users/:id/role (admin)'
    }
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`RBAC API Server is running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  POST   /api/auth/register`);
  console.log(`  POST   /api/auth/login`);
  console.log(`  GET    /api/posts (authenticated)`);
  console.log(`  POST   /api/posts (admin, moderator)`);
  console.log(`  PUT    /api/posts/:id (admin, moderator)`);
  console.log(`  PUT    /api/posts/:id/own (owner, admin, moderator)`);
  console.log(`  DELETE /api/posts/:id (admin, moderator)`);
  console.log(`  DELETE /api/posts/:id/own (owner, admin, moderator)`);
  console.log(`  GET    /api/users (admin)`);
  console.log(`  DELETE /api/users/:id (admin)`);
  console.log(`  PUT    /api/users/:id/role (admin)`);
});

// === HOW TO RUN ===

// 1. Initialize a new Node.js project:
//    npm init -y

// 2. Install dependencies:
//    npm install express jsonwebtoken bcryptjs

// 3. Save this code as server.js

// 4. Run the server:
//    node server.js

// 5. Test the endpoints using curl:
//    # Register users with different roles
//    curl -X POST http://localhost:3000/api/auth/register \
//      -H "Content-Type: application/json" \
//      -d '{"username":"admin","email":"admin@example.com","password":"admin123","role":"admin"}'
//
//    curl -X POST http://localhost:3000/api/auth/register \
//      -H "Content-Type: application/json" \
//      -d '{"username":"moderator","email":"mod@example.com","password":"mod123","role":"moderator"}'
//
//    curl -X POST http://localhost:3000/api/auth/register \
//      -H "Content-Type: application/json" \
//      -d '{"username":"user1","email":"user1@example.com","password":"user123","role":"user"}'
//
//    # Login as user
//    curl -X POST http://localhost:3000/api/auth/login \
//      -H "Content-Type: application/json" \
//      -d '{"email":"user1@example.com","password":"user123"}'
//
//    # Get posts (authenticated)
//    curl http://localhost:3000/api/posts \
//      -H "Authorization: Bearer YOUR_TOKEN"
//
//    # Create post (will fail for user)
//    curl -X POST http://localhost:3000/api/posts \
//      -H "Authorization: Bearer USER_TOKEN" \
//      -H "Content-Type: application/json" \
//      -d '{"title":"My Post","content":"My Content"}'
//
//    # Create post (will succeed for admin)
//    curl -X POST http://localhost:3000/api/posts \
//      -H "Authorization: Bearer ADMIN_TOKEN" \
//      -H "Content-Type: application/json" \
//      -d '{"title":"Admin Post","content":"Admin Content"}'

// === RBAC SYSTEM EXPLANATION ===

// Role-Based Access Control (RBAC) Overview:
// RBAC is an approach to restricting system access to authorized users based on their roles within an organization.

// Role Hierarchy:
// - Admin (level 3): Full access to all resources
// - Moderator (level 2): Content management access
// - User (level 1): Basic user access

// Permission Matrix:
// - admin: Can do everything
// - moderator: Can manage content but not users
// - user: Can read and create, but limited to own content

// JWT with Role Information:
// - JWT payload includes: userId, username, role
// - Middleware extracts role from token
// - Role is attached to request object for authorization

// Authorization Middleware:
// - requireRole(requiredRole): Checks if user has required role or higher
// - requirePermission(permission): Checks if user's role has specific permission
// - Returns 401 if not authenticated
// - Returns 403 if permission denied

// Ownership Checking:
// - For user-specific operations (update own post), we check both role and ownership
// - Elevated roles (admin, moderator) can bypass ownership check
// - Regular users can only operate on their own resources

// Benefits of RBAC:
// - Centralized permission management
// - Easy to add new roles and permissions
// - Clear separation of concerns
// - Scalable for complex applications
// - Audit-friendly (role-based access logs)
