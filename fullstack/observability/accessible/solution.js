// Observability Reference Solution: Add Logging
// Structured logging with winston

const express = require('express');
const winston = require('winston');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// ============================================
// === LOGGING CONFIGURATION ===
// ============================================

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

// ============================================
// === MIDDLEWARE ===
// ============================================

// Add request ID to request
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuidv4();
  next();
});

// Log incoming requests
app.use((req, res, next) => {
  logger.info('Incoming request', {
    requestId: req.id,
    method: req.method,
    url: req.url,
    ip: req.ip
  });
  next();
});

// Error logging middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    requestId: req.id,
    error: err.message,
    stack: err.stack
  });
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// === ROUTES ===
// ============================================

app.get('/', (req, res) => {
  logger.info('Home page accessed', {
    requestId: req.id,
    userId: req.headers['x-user-id']
  });
  res.json({ message: 'Logging demo' });
});

app.post('/users', (req, res) => {
  logger.info('User created', {
    requestId: req.id,
    userId: req.headers['x-user-id'],
    userData: req.body
  });
  res.status(201).json({ message: 'User created' });
});

app.get('/error', (req, res) => {
  logger.error('Simulated error', {
    requestId: req.id,
    userId: req.headers['x-user-id']
  });
  res.status(500).json({ error: 'Simulated error' });
});

// ============================================
// === LOG QUERY EXAMPLES ===
// ============================================

// Query logs by level
// grep '"level":"error"' logs/app.log

// Query logs by request ID
// grep '"requestId":"abc-123"' logs/app.log

// Query logs by user ID
// grep '"userId":"user-123"' logs/app.log

// Query logs with jq
// cat logs/app.log | jq '. | select(.level == "error")'

// Query logs for specific time range
// grep '"timestamp":"2024-11-08"' logs/app.log

// ============================================
// === START SERVER ===
// ============================================

const PORT = 3000;
app.listen(PORT, () => {
  logger.info('Server started', { port: PORT });
});
