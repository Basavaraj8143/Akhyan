# Work Log – Docker & Containers Node

**Domain:** Web Development
**Node:** Docker & Containers
**Status:** Projects completed with specifications and reference implementations

## 1. Accessible – Dockerize an App

**Objective:** Create a Dockerfile for a simple app.

**Work completed:**
- Designed a Dockerfile exercise for containerizing a Node.js app.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for base image and Dockerfile structure, Dockerfile stages and optimization, application and dependencies, and .dockerignore and commands.
- Prepared a reference implementation with:

  **Dockerfile**
  - Multi-stage build with builder stage
  - Base image: node:18-alpine (lightweight)
  - Working directory setup
  - Package files copied first for layer caching
  - npm ci --only=production
  - Application code copied
  - PORT 3000 exposed
  - CMD to start application

  **.dockerignore**
  - node_modules excluded
  - npm-debug.log excluded
  - .git excluded
  - .env files excluded
  - Other unnecessary files excluded

  **Application**
  - Simple Express server
  - GET / endpoint with JSON response
  - GET /health endpoint for health checks
  - package.json with express dependency

  **Build and Run Commands**
  - docker build with tag
  - docker run with port mapping
  - docker stop and rm commands
  - docker ps for viewing containers
  - docker logs for viewing logs
  - docker exec for running commands in container

## 2. Core – Multi-Container App

**Objective:** Use Docker Compose for a multi-service app.

**Work completed:**
- Designed a Docker Compose exercise for multi-container orchestration.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for Docker Compose structure and services, service configuration, volumes and networks, and Dockerfile and application.
- Prepared a reference implementation with:

  **Docker Compose Configuration**
  - Version 3.8
  - Web service (Node.js Express)
  - Database service (PostgreSQL 15-alpine)
  - Cache service (Redis 7-alpine)
  - Service dependencies (depends_on)
  - Environment variables for all services
  - Volume mounts for data persistence
  - Port mappings for debugging
  - Restart policy (unless-stopped)
  - Custom network (app-network)
  - Named volumes (postgres-data, redis-data)

  **Web Service**
  - Build from Dockerfile
  - Port 3000 exposed
  - Environment variables for DB and cache connection
  - Depends on database and cache
  - Restart policy

  **Database Service**
  - PostgreSQL image
  - Environment variables for credentials
  - Volume mount for data persistence
  - Port 5432 exposed
  - Restart policy

  **Cache Service**
  - Redis image
  - Volume mount for data persistence
  - Port 6379 exposed
  - Restart policy

  **Application**
  - Express app with PostgreSQL and Redis connections
  - GET / endpoint
  - GET /db-test endpoint
  - GET /cache-test endpoint
  - pg library for PostgreSQL
  - redis library for Redis

  **Docker Compose Commands**
  - docker-compose up -d --build
  - docker-compose logs -f
  - docker-compose down
  - docker-compose down -v
  - docker-compose restart
  - docker-compose scale
  - docker-compose exec
  - docker-compose ps

## 3. Stretch – Production Deployment

**Objective:** Deploy to production with optimizations.

**Work completed:**
- Designed a production deployment exercise with security and monitoring.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for Dockerfile production optimizations, security hardening, health checks and resource limits, and CI/CD and monitoring.
- Prepared a reference implementation with:

  **Production Dockerfile**
  - Multi-stage build (builder + production)
  - Base image: node:18-alpine
  - npm ci with cache clean
  - Non-root user creation (nodejs:1001)
  - Copy with proper ownership
  - Switch to non-root user
  - HEALTHCHECK instruction with interval/timeout/retries
  - Read-only filesystem configuration

  **Production Docker Compose**
  - Build target: production
  - Image tagging with IMAGE_TAG
  - Secrets management (db_password)
  - Health checks for all services
  - Service health conditions
  - Resource limits (CPU, memory)
  - Resource reservations
  - Logging configuration (max-size, max-file)
  - Read-only filesystem
  - tmpfs for /tmp
  - Custom network
  - Named volumes

  **Security Hardening**
  - Non-root user
  - Secrets management (secrets in Docker Compose)
  - Read-only root filesystem
  - Health checks for all services
  - Image scanning with Trivy
  - Security scanning in CI/CD
  - Least privilege principle

  **Health Checks**
  - HEALTHCHECK instruction in Dockerfile
  - Health endpoint in application
  - Health check in docker-compose
  - Intervals, timeouts, retries configured
  - Service health conditions (depends_on)

  **Resource Limits**
  - CPU limits (0.5 for web, 1.0 for database, 0.5 for cache)
  - Memory limits (512M for web, 1G for database, 256M for cache)
  - CPU reservations
  - Memory reservations
  - Logging configuration (max-size 10m, max-file 3)

  **CI/CD Integration**
  - GitHub Actions workflow
  - Docker Buildx setup
  - Image build with Git SHA tag
  - Trivy security scanning
  - SARIF upload for security results
  - Docker Hub login
  - Image push with Git SHA and latest tags
  - Branch-based deployment (main only)

  **Monitoring Setup**
  - Prometheus configuration example
  - Grafana configuration example
  - Network configuration for monitoring
  - Volume for Grafana data

  **Production Commands**
  - Build with Git commit SHA tag
  - Rolling update deployment
  - Blue-green deployment strategy
  - Docker scan for vulnerabilities
  - docker stats for resource usage
  - Run with security options (read-only, no-new-privileges)

## Overall Summary

| Difficulty | Project | Status |
|---|---|---|
| Accessible | Dockerize an App | Completed |
| Core | Multi-Container App | Completed |
| Stretch | Production Deployment | Completed |

**Deliverables prepared:**
- 3 project specifications (`project.json`)
- 3 reference implementations (`.txt` files)
- Evaluation rubrics for all three projects
- Valid alternatives and mistakes-to-check lists
- Complete Dockerfile examples
- Docker Compose configurations
- Production deployment strategies
- CI/CD integration
- Security hardening measures
- Monitoring setup

**Key Docker & Containers concepts covered:**
- Dockerfile structure and syntax
- Base image selection and version pinning
- Multi-stage builds
- Layer caching optimization
- .dockerignore for image size reduction
- Docker commands (build, run, stop, rm, ps, logs, exec)
- Port mapping
- Docker Compose configuration
- Service orchestration
- Service dependencies (depends_on)
- Environment variables
- Volume mounts for data persistence
- Custom networks
- Named volumes
- Service health checks
- Restart policies
- Scaling services
- Non-root user security
- Secrets management
- Read-only filesystem
- Resource limits (CPU, memory)
- Logging configuration
- CI/CD integration (GitHub Actions)
- Image tagging strategies
- Security scanning (Trivy)
- Rolling updates
- Blue-green deployment
- Monitoring (Prometheus, Grafana)
- Health check endpoints
- Production optimizations
- Security hardening
- Least privilege principle
- Container orchestration

**Next step:** Technical review, execution testing, and verification of all reference implementations before final submission.
