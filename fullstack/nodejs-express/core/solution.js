// Node.js & Express Reference Solution: Middleware Chain
// This solution demonstrates building middleware for logging, auth, and error handling

const express = require('express');
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// === MIDDLEWARE: Logging ===
// Logs request method, URL, timestamp, status code, and response time
const loggingMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Store original res.json to intercept responses
  const originalJson = res.json;

  // Override res.json to log status code
  res.json = function(data) {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
    return originalJson.call(this, data);
  };

  next();
};

// === MIDDLEWARE: Authentication ===
// Validates Authorization header and protects routes
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authorization header is missing'
    });
  }

  // Simple token validation (in production, use proper JWT or session)
  const token = authHeader.replace('Bearer ', '');

  if (token !== 'secret-token') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token'
    });
  }

  // Token is valid, proceed to next middleware
  next();
};

// === MIDDLEWARE: Error Handling ===
// Catches errors and returns consistent error responses
const errorHandlingMiddleware = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Handle different error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }

  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'Not Found',
      message: err.message
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong'
  });
};

// === ROUTE: GET /api/public ===
// Public route (no auth required)
app.get('/api/public', (req, res) => {
  res.json({
    message: 'This is a public endpoint',
    timestamp: new Date().toISOString()
  });
});

// === ROUTE: GET /api/protected ===
// Protected route (auth required)
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'This is a protected endpoint',
    timestamp: new Date().toISOString(),
    user: 'Authenticated User'
  });
});

// === ROUTE: GET /api/error ===
// Route that intentionally throws an error
app.get('/api/error', (req, res, next) => {
  const error = new Error('This is an intentional error');
  next(error);
});

// === ROUTE: POST /api/users ===
// Route with validation (requires name and email)
app.post('/api/users', (req, res, next) => {
  const { name, email } = req.body;

  // Validation
  if (!name || !email) {
    const error = new Error('Name and email are required');
    error.name = 'ValidationError';
    return next(error);
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const error = new Error('Invalid email format');
    error.name = 'ValidationError';
    return next(error);
  }

  // Success response
  res.status(201).json({
    message: 'User created successfully',
    user: { name, email }
  });
});

// Apply logging middleware globally (before all routes)
app.use(loggingMiddleware);

// Apply error handling middleware at the end (after all routes)
app.use(errorHandlingMiddleware);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET    /api/public (no auth required)`);
  console.log(`  GET    /api/protected (auth required)`);
  console.log(`  GET    /api/error (intentional error)`);
  console.log(`  POST   /api/users (with validation)`);
  console.log(`\nTo access protected routes, include Authorization header:`);
  console.log(`  Authorization: Bearer secret-token`);
});

// === HOW TO RUN ===

// 1. Initialize a new Node.js project:
//    npm init -y

// 2. Install Express:
//    npm install express

// 3. Save this code as server.js

// 4. Run the server:
//    node server.js

// 5. Test the endpoints using curl:
//    # Public route (no auth)
//    curl http://localhost:3000/api/public
//
//    # Protected route (with valid token)
//    curl http://localhost:3000/api/protected -H "Authorization: Bearer secret-token"
//
//    # Protected route (without token - should return 401)
//    curl http://localhost:3000/api/protected
//
//    # Protected route (with invalid token - should return 401)
//    curl http://localhost:3000/api/protected -H "Authorization: Bearer wrong-token"
//
//    # Error route (should return 500)
//    curl http://localhost:3000/api/error
//
//    # POST with valid data
//    curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com"}'
//
//    # POST with missing data (should return 400)
//    curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"name":"John Doe"}'
//
//    # POST with invalid email (should return 400)
//    curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"name":"John Doe","email":"invalid-email"}'

// === MIDDLEWARE CHAIN EXPLANATION ===

// Express middleware functions are executed in the order they are defined:
//
// 1. Request arrives
// 2. express.json() - Parses JSON body
// 3. loggingMiddleware - Logs request details
// 4. Route handler - Processes the request
//    - If route is protected, authMiddleware runs first
// 5. If error occurs, errorHandlingMiddleware catches it
// 6. Response sent to client
//
// The loggingMiddleware uses res.json override to capture the status code
// because the status code is set after the route handler executes.
//
// The authMiddleware is applied only to specific routes using
// app.get('/api/protected', authMiddleware, handler).
//
// The errorHandlingMiddleware has 4 parameters (err, req, res, next)
// which Express recognizes as an error handling middleware.
