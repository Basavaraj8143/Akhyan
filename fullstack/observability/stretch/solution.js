// Observability Reference Solution: Full Observability
// Logs, metrics, tracing, and alerts

const express = require('express');
const winston = require('winston');
const promClient = require('prom-client');
const { NodeTracer } = require('@opentelemetry/api');

const app = express();
app.use(express.json());

// ============================================
// === LOGGING ===
// ============================================

const logger = winston.createLogger({
  level: 'info',
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
// === METRICS ===
// ============================================

const register = new promClient.Registry();

// HTTP request duration histogram
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// Request counter
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// Error counter
const httpErrorsTotal = new promClient.Counter({
  name: 'http_errors_total',
  help: 'Total number of HTTP errors',
  labelNames: ['method', 'route'],
  registers: [register]
});

// Active connections gauge
const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  registers: [register]
});

// ============================================
// === TRACING ===
// ============================================

const tracer = new NodeTracer();

// ============================================
// === MIDDLEWARE ===
// ============================================

// Track active connections
app.use((req, res, next) => {
  activeConnections.inc();
  res.on('finish', () => activeConnections.dec());
  next();
});

// Track HTTP requests
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration.observe({
      method: req.method,
      route: route,
      status_code: res.statusCode
    }, duration);
    
    httpRequestsTotal.inc({
      method: req.method,
      route: route,
      status_code: res.statusCode
    });
    
    if (res.statusCode >= 400) {
      httpErrorsTotal.inc({
        method: req.method,
        route: route
      });
    }
  });
  
  next();
});

// ============================================
// === ROUTES ===
// ============================================

app.get('/', (req, res) => {
  logger.info('Home page accessed');
  res.json({ message: 'Full observability demo' });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get('/error', (req, res) => {
  logger.error('Simulated error');
  res.status(500).json({ error: 'Simulated error' });
});

// ============================================
// === START SERVER ===
// ============================================

const PORT = 3000;
app.listen(PORT, () => {
  logger.info('Server started', { port: PORT });
  console.log(`Metrics available at http://localhost:${PORT}/metrics`);
});

// === FILE: prometheus.yml ===
# Prometheus configuration

global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'nodejs-app'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'

# === FILE: alert-rules.yml ===
# Prometheus alert rules

groups:
  - name: application_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_errors_total[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is above 10% for 5 minutes"
      
      - alert: HighLatency
        expr: histogram_quantile(0.95, http_request_duration_seconds) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency detected"
          description: "95th percentile latency is above 1 second"

# === SETUP INSTRUCTIONS ===

# 1. Install dependencies:
#    npm install winston prom-client @opentelemetry/api

# 2. Start the application:
#    node solution.js

# 3. Install Prometheus:
#    Download prometheus from https://prometheus.io/download/

# 4. Configure prometheus.yml with the configuration above

# 5. Start Prometheus:
#    ./prometheus --config.file=prometheus.yml

# 6. Install Grafana:
#    Download from https://grafana.com/download/

# 7. Start Grafana:
#    ./bin/grafana-server

# 8. Add Prometheus as data source in Grafana

# 9. Create dashboard with metrics:
#    - HTTP request duration
#    - Error rate
#    - Active connections

# 10. Configure alerts in Prometheus with alert-rules.yml
