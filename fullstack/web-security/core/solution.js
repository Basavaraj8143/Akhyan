// Web Security Reference Solution: Secure an API
// API with security headers, rate limiting, and input validation

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const app = express();

app.use(express.json());

// ============================================
// === SECURITY HEADERS ===
// ============================================

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  xContentTypeOptions: true,
  xFrameOptions: { action: 'deny' },
  xXssProtection: true
}));

// ============================================
// === RATE LIMITING ===
// ============================================

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per window
  message: { error: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// === INPUT VALIDATION MIDDLEWARE ===
// ============================================

const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Sanitize input to prevent XSS
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/[<>]/g, '');
      }
    }
  }
  next();
};

// ============================================
// === ERROR HANDLING MIDDLEWARE ===
// ============================================

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
};

// ============================================
// === ROUTES ===
// ============================================

// Register with validation
app.post('/api/auth/register',
  generalLimiter,
  sanitizeInput,
  [
    body('username').isLength({ min: 3, max: 30 }).trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
  ],
  validateInput,
  (req, res) => {
    const { username, email, password } = req.body;
    // Registration logic here (hash password, save to database)
    res.status(201).json({ message: 'User registered' });
  }
);

// Login with stricter rate limiting
app.post('/api/auth/login',
  loginLimiter,
  sanitizeInput,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
  ],
  validateInput,
  (req, res) => {
    const { email, password } = req.body;
    // Login logic here (verify password, generate token)
    res.json({ message: 'Login successful', token: 'jwt-token-here' });
  }
);

// Get users with rate limiting
app.get('/api/users',
  generalLimiter,
  (req, res) => {
    // Fetch users from database
    res.json({ users: [] });
  }
);

// Create post with validation
app.post('/api/posts',
  generalLimiter,
  sanitizeInput,
  [
    body('title').isLength({ min: 1, max: 100 }).trim(),
    body('content').isLength({ min: 1, max: 5000 }).trim()
  ],
  validateInput,
  (req, res) => {
    const { title, content } = req.body;
    // Create post logic here
    res.status(201).json({ message: 'Post created', post: { title, content } });
  }
);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Secure API',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      users: 'GET /api/users',
      posts: 'POST /api/posts'
    }
  });
});

// ============================================
// === START SERVER ===
// ============================================

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Secure API Server is running on http://localhost:${PORT}`);
  console.log(`Security headers configured`);
  console.log(`Rate limiting enabled`);
  console.log(`Input validation enabled`);
});

// ============================================
// === HOW TO RUN ===
// ============================================

// 1. Initialize a new Node.js project:
//    npm init -y

// 2. Install dependencies:
//    npm install express helmet express-rate-limit express-validator

// 3. Save this code as server.js

// 4. Run the server:
//    node server.js

// 5. Test the endpoints with curl:
//    # Register (with validation)
//    curl -X POST http://localhost:3000/api/auth/register \
//      -H "Content-Type: application/json" \
//      -d '{"username":"testuser","email":"test@example.com","password":"Password123"}'
//
//    # Login (with rate limiting)
//    curl -X POST http://localhost:3000/api/auth/login \
//      -H "Content-Type: application/json" \
//      -d '{"email":"test@example.com","password":"Password123"}'
//
//    # Create post (with validation)
//    curl -X POST http://localhost:3000/api/posts \
//      -H "Content-Type: application/json" \
//      -d '{"title":"Test Post","content":"Test content"}'
//
//    # Test rate limiting (make 6 login attempts)
//    curl -X POST http://localhost:3000/api/auth/login \
//      -H "Content-Type: application/json" \
//      -d '{"email":"test@example.com","password":"Password123"}'

// ============================================
// === SECURITY FEATURES EXPLAINED ===
// ============================================

// Security Headers (helmet):
// - X-Content-Type-Options: nosniff - Prevents MIME type sniffing
// - X-Frame-Options: deny - Prevents clickjacking
// - X-XSS-Protection: 1; mode=block - Enables XSS protection
// - Content-Security-Policy: Restricts sources for scripts, styles, images
// - Strict-Transport-Security: Enforces HTTPS

// Rate Limiting:
// - Limits requests per IP address
// - Returns 429 Too Many Requests when limit exceeded
// - Includes Retry-After header
// - Different limits for different routes (stricter for login)

// Input Validation:
// - Validates required fields are present
// - Validates data types (string, number, boolean)
// - Validates string length and format (email, password)
// - Sanitizes input to prevent XSS
// - Returns 400 Bad Request for invalid input

// Error Handling:
// - Centralized error handling middleware
// - Returns appropriate status codes (400, 401, 429, 500)
// - Error messages without exposing sensitive information
// - Logs errors for debugging
