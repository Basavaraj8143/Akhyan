# Work Log – Observability Node

**Domain:** Web Development
**Node:** Observability
**Status:** Projects completed with specifications and reference implementations

## 1. Accessible – Add Logging

**Objective:** Add structured logging to an app and query it.

**Work completed:**
- Designed a structured logging exercise using winston.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for logging library configuration, structured logging implementation, log levels and middleware, and log querying and documentation.
- Prepared a reference implementation with:

  **Logging Library Configuration**
  - Winston logger configuration
  - Log levels: error, warn, info, debug
  - JSON format for machine-readable logs
  - Console and file transports
  - Log rotation configured

  **Structured Logging**
  - Logging in route handlers
  - Context: request ID, user ID, timestamp
  - HTTP details: method, URL, status code
  - Error logging with stack traces
  - Important events logged

  **Log Levels**
  - Error for exceptions and failures
  - Warn for deprecated features
  - Info for normal operations
  - Debug for detailed troubleshooting

  **Log Format**
  - JSON format
  - Timestamp, level, message, context
  - Request ID for tracing
  - User ID when available

  **Express Middleware**
  - Request ID middleware (generate or from header)
  - Request logging middleware
  - Error logging middleware

  **Log Querying**
  - File transport configured
  - grep examples for querying by level, request ID, user ID
  - jq examples for JSON log parsing
  - Time range queries

## 2. Core – Error Monitoring

**Objective:** Wire up error monitoring so failures surface fast.

**Work completed:**
- Designed an error monitoring exercise using Sentry.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for error monitoring SDK configuration, error capture and context, Express middleware, and testing and setup.
- Prepared a reference implementation with:

  **Error Monitoring Service**
  - Sentry SDK configuration
  - API key/DSN configuration
  - Environment configuration
  - Release version configuration
  - Traces sample rate

  **Error Capture**
  - Unhandled exception capture (process.on)
  - Unhandled promise rejection capture
  - Route handler error capture
  - Stack traces included
  - Context included

  **Error Context**
  - Request details: URL, method, headers
  - User information: ID from headers
  - Custom tags and data
  - Environment information
  - Release version

  **Express Middleware**
  - User context middleware
  - Error handling middleware
  - Errors passed to Sentry
  - Errors logged before sending
  - Appropriate error responses

  **Testing**
  - Test route that throws error
  - Verification instructions
  - Dashboard checking

  **Setup Documentation**
  - Sentry account creation
  - Project setup
  - DSN configuration
  - Environment variable setup

## 3. Stretch – Full Observability

**Objective:** Instrument an app with logs, metrics, and alerts.

**Work completed:**
- Designed a full observability exercise using Prometheus + Grafana.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for logging implementation, metrics collection, distributed tracing and alerts, and monitoring stack and documentation.
- Prepared a reference implementation with:

  **Logging**
  - Winston structured logging
  - Application events with context
  - HTTP request timing
  - Error logging with stack traces
  - Log rotation configured

  **Metrics Collection**
  - prom-client for Prometheus metrics
  - Custom metrics: counter, gauge, histogram
  - HTTP request duration histogram
  - Error rate counter
  - Active connections gauge
  - /metrics endpoint exposed

  **Distributed Tracing**
  - OpenTelemetry integration
  - HTTP request tracing
  - Database query tracing
  - External API call tracing
  - Export to Jaeger

  **Alerts**
  - High error rate alert (>10% for 5 minutes)
  - High latency alert (95th percentile > 1 second)
  - Severity levels (critical, warning)
  - Annotations for alert details

  **Monitoring Stack**
  - Prometheus configuration
  - Grafana configuration
  - Dashboard creation
  - Alert rules configuration
  - Data source configuration

  **Documentation**
  - Observability stack documentation
  - Log querying instructions
  - Metrics viewing instructions
  - Alert configuration instructions
  - Setup instructions for Prometheus, Grafana

## Overall Summary

| Difficulty | Project | Status |
|---|---|---|
| Accessible | Add Logging | Completed |
| Core | Error Monitoring | Completed |
| Stretch | Full Observability | Completed |

**Deliverables prepared:**
- 3 project specifications (`project.json`)
- 3 reference implementations (`.js` files)
- Evaluation rubrics for all three projects
- Valid alternatives and mistakes-to-check lists
- Complete logging implementation
- Error monitoring integration
- Full observability stack

**Key Observability concepts covered:**
- Structured logging (winston, pino)
- Log levels (error, warn, info, debug)
- JSON log format
- Context inclusion (request ID, user ID, timestamp)
- Log rotation
- Log querying (grep, jq)
- Error monitoring (Sentry, Rollbar, Bugsnag)
- Unhandled exception capture
- Promise rejection capture
- Error context (request, user, environment)
- Stack traces
- Source maps
- Error grouping
- Alerting
- Metrics collection (prom-client)
- Counter metrics
- Gauge metrics
- Histogram metrics
- HTTP request duration
- Error rate tracking
- Active connections
- Prometheus metrics endpoint
- Distributed tracing (OpenTelemetry)
- Request tracing
- Database query tracing
- External API tracing
- Jaeger tracing
- Prometheus configuration
- Grafana dashboards
- Alert rules
- Critical vs warning alerts
- Metric visualization
- Monitoring stack (Prometheus + Grafana)
- Observability pillars (logs, metrics, traces)
- Three pillars of observability

**Next step:** Technical review, execution testing, and verification of all reference implementations before final submission.
