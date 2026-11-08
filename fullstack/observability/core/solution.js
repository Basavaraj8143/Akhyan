// Observability Reference Solution: Error Monitoring
// Error monitoring with Sentry

const express = require('express');
const Sentry = require('@sentry/node');

// ============================================
// === SENTRY CONFIGURATION ===
// ============================================

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  release: process.env.RELEASE_VERSION || '1.0.0',
  tracesSampleRate: 1.0
});

// ============================================
// === ERROR CAPTURE ===
// ============================================

// Capture unhandled exceptions
process.on('uncaughtException', (err) => {
  Sentry.captureException(err);
  console.error('Uncaught exception:', err);
  process.exit(1);
});

// Capture unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  Sentry.captureException(reason);
  console.error('Unhandled rejection:', reason);
});

const app = express();
app.use(express.json());

// ============================================
// === MIDDLEWARE ===
// ============================================

// Add user context from headers
app.use((req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (userId) {
    Sentry.setUser({ id: userId });
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Log error
  console.error('Error:', err);
  
  // Send to Sentry with context
  Sentry.withScope((scope) => {
    scope.setTag('method', req.method);
    scope.setTag('url', req.url);
    scope.setExtra('headers', req.headers);
    scope.setExtra('body', req.body);
    Sentry.captureException(err);
  });
  
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// === ROUTES ===
// ============================================

app.get('/', (req, res) => {
  res.json({ message: 'Error monitoring demo' });
});

app.get('/error', (req, res) => {
  throw new Error('Test error for Sentry');
});

app.post('/users', (req, res) => {
  try {
    // Simulate error
    if (!req.body.email) {
      throw new Error('Email is required');
    }
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    next(err);
  }
});

// ============================================
// === START SERVER ===
// ============================================

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Visit /error to test Sentry integration');
});

// === SETUP INSTRUCTIONS ===

// 1. Create Sentry account at sentry.io
// 2. Create new project
// 3. Get DSN from project settings
// 4. Set SENTRY_DSN environment variable
// 5. Visit /error to test error capture
// 6. Check Sentry dashboard for errors
