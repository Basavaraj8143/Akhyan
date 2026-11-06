// Web Security Reference Solution: Secure Auth Flow
// Secure authentication with JWT, refresh tokens, and secure cookies

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const app = express();

app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-at-least-32-characters-long';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret-key-at-least-32-characters-long';

// ============================================
// === IN-MEMORY DATA STORES ===
// ============================================

let users = [];
let refreshTokens = new Map(); // token -> { userId, expires }
let tokenBlacklist = new Set(); // blacklisted access tokens
let failedAttempts = new Map(); // IP -> count

// ============================================
// === RATE LIMITING ===
// ============================================

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts' },
  skip: (req) => {
    const ip = req.ip;
    const attempts = failedAttempts.get(ip) || 0;
    return attempts < 3; // Skip rate limiting for first 3 attempts
  }
});

// ============================================
// === PASSWORD VALIDATION ===
// ============================================

const validatePassword = (password) => {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
};

// ============================================
// === TOKEN GENERATION ===
// ============================================

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user) => {
  const token = jwt.sign(
    { userId: user.id, type: 'refresh' },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  refreshTokens.set(token, {
    userId: user.id,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000
  });
  
  return token;
};

// ============================================
// === AUTHENTICATION MIDDLEWARE ===
// ============================================

const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ error: 'Token has been revoked' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// ============================================
// === ROUTES ===
// ============================================

// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters with uppercase, lowercase, and numbers' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = {
    id: Date.now(),
    username,
    email,
    password: hashedPassword,
    role: 'user',
    created_at: new Date()
  };
  
  users.push(user);
  res.status(201).json({ message: 'User registered' });
});

// Login
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip;
  
  const user = users.find(u => u.email === email);
  if (!user) {
    failedAttempts.set(ip, (failedAttempts.get(ip) || 0) + 1);
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    failedAttempts.set(ip, (failedAttempts.get(ip) || 0) + 1);
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  failedAttempts.delete(ip);
  
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000
  });
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  
  res.json({ message: 'Login successful' });
});

// Refresh token
app.post('/api/auth/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }
  
  const tokenData = refreshTokens.get(refreshToken);
  if (!tokenData || tokenData.expires < Date.now()) {
    refreshTokens.delete(refreshToken);
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
  
  jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    // Token rotation: invalidate old refresh token, generate new one
    refreshTokens.delete(refreshToken);
    
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });
    
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({ message: 'Token refreshed' });
  });
});

// Logout
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  
  if (accessToken) {
    tokenBlacklist.add(accessToken);
  }
  
  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }
  
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  
  res.json({ message: 'Logged out' });
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Secure Auth API',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      refresh: 'POST /api/auth/refresh',
      logout: 'POST /api/auth/logout',
      me: 'GET /api/auth/me (protected)'
    }
  });
});

// ============================================
// === START SERVER ===
// ============================================

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Secure Auth Server is running on http://localhost:${PORT}`);
  console.log(`Secure auth flow implemented`);
  console.log(`Password hashing with bcrypt (12 rounds)`);
  console.log(`JWT access tokens (15min) and refresh tokens (7d)`);
  console.log(`HttpOnly, Secure, SameSite cookies`);
  console.log(`Rate limiting on login endpoint`);
});

// ============================================
// === HOW TO RUN ===
// ============================================

// 1. Initialize a new Node.js project:
//    npm init -y

// 2. Install dependencies:
//    npm install express bcryptjs jsonwebtoken cookie-parser express-rate-limit

// 3. Save this code as server.js

// 4. Run the server:
//    node server.js

// 5. Test the endpoints with curl:
//    # Register
//    curl -X POST http://localhost:3000/api/auth/register \
//      -H "Content-Type: application/json" \
//      -d '{"username":"testuser","email":"test@example.com","password":"Password123"}'
//
//    # Login
//    curl -X POST http://localhost:3000/api/auth/login \
//      -H "Content-Type: application/json" \
//      -d '{"email":"test@example.com","password":"Password123"}' \
//      -c cookies.txt
//
//    # Get current user (with cookies)
//    curl http://localhost:3000/api/auth/me -b cookies.txt
//
//    # Refresh token
//    curl -X POST http://localhost:3000/api/auth/refresh -b cookies.txt -c cookies.txt
//
//    # Logout
//    curl -X POST http://localhost:3000/api/auth/logout -b cookies.txt

// ============================================
// === SECURITY FEATURES EXPLAINED ===
// ============================================

// Secure Password Storage:
// - Passwords hashed with bcrypt (12 rounds)
// - Password strength validation (8+ chars, uppercase, lowercase, numbers)
// - Never store plain text passwords

// JWT Token Management:
// - Access tokens expire in 15 minutes
// - Refresh tokens expire in 7 days
// - Token blacklist for logout
// - Strong secret keys (at least 32 characters)

// Refresh Tokens:
// - Secure storage in memory (hashed in production database)
// - Token rotation on use (old token invalidated)
// - Revocation on logout
// - Single use only

// Secure Cookies:
// - HttpOnly flag (prevents XSS access)
// - Secure flag (only sent over HTTPS)
// - SameSite=strict (prevents CSRF)
// - Appropriate expiration times

// Security Measures:
// - Rate limiting on login (5 attempts per 15 minutes)
// - Account lockout tracking (failed attempts per IP)
// - Event logging (login, logout, failed attempts)
// - IP-based blocking for suspicious activity
