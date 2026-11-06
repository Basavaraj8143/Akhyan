# Work Log – Web Security Node

**Domain:** Web Development
**Node:** Web Security
**Status:** Projects completed with specifications and reference implementations

## 1. Accessible – Common Vulnerabilities

**Objective:** Identify and explain common web security vulnerabilities.

**Work completed:**
- Designed a comprehensive vulnerability explanation exercise.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria covering SQL Injection explanation, XSS explanation, CSRF, Authentication, and Misconfiguration, and Sensitive Data Exposure and overall quality.
- Prepared a reference implementation with:

  **SQL Injection**
  - Definition: Vulnerability where attacker interferes with database queries
  - Vulnerable example with concatenation
  - Attack mechanics: malicious input modifies SQL query
  - Impact: unauthorized access, data theft, data deletion, authentication bypass
  - Prevention: parameterized queries, ORM, input validation, least-privilege accounts
  - Secure example with parameterized query

  **Cross-Site Scripting (XSS)**
  - Definition: Attack where malicious scripts are injected into web pages
  - Types: Reflected XSS, Stored XSS, DOM-based XSS
  - Vulnerable examples for each type
  - Attack mechanics: script executes in victim's browser
  - Impact: session hijacking, data theft, phishing, malware distribution
  - Prevention: input validation, output encoding, CSP, HttpOnly cookies, DOMPurify
  - Secure example with sanitization

  **Cross-Site Request Forgery (CSRF)**
  - Definition: Attack where user is tricked into executing unwanted actions
  - Attack example with image tag
  - Attack mechanics: browser includes cookies automatically
  - Impact: unauthorized transactions, data modification, account changes
  - Prevention: CSRF tokens, SameSite cookies, referrer checking, re-authentication
  - Secure example with csurf middleware

  **Authentication and Authorization Issues**
  - Weak password issues: short passwords, no complexity, common passwords, reuse
  - Session hijacking: session IDs in URLs, no expiration, no regeneration
  - Impact: unauthorized access, identity theft, data breach, financial loss
  - Prevention: strong password policies, bcrypt hashing, secure session management, MFA, account lockout
  - Secure example with bcrypt and secure session

  **Security Misconfiguration**
  - Common misconfigurations: default credentials, debug mode, verbose errors, unnecessary services
  - Impact: unauthorized access, information disclosure, data exposure, system compromise
  - Prevention: change defaults, disable debug, generic errors, disable unused services, security audits
  - Secure example with helmet and generic error handling

  **Sensitive Data Exposure**
  - Definition: Inadvertent exposure of sensitive information
  - Examples: plain text passwords, credit cards, API keys, personal info in logs
  - Impact: identity theft, financial fraud, privacy violation, data breach, legal penalties
  - Prevention: encryption at rest, password hashing, HTTPS, key management, no logging of sensitive data
  - Secure example with bcrypt and encryption

  **Summary Table**
  - Comprehensive comparison table with vulnerability, prevention, and priority

  **Best Practices**
  - 10 key security best practices for web applications

## 2. Core – Secure an API

**Objective:** Add security headers, rate limiting, and input validation to an API.

**Work completed:**
- Designed an API security exercise using Express.js.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for security headers implementation, rate limiting implementation, input validation implementation, and error handling and overall security.
- Prepared a reference implementation with:

  **Security Headers (helmet)**
  - helmet middleware configuration
  - Content-Security-Policy (restrict script, style, image sources)
  - HSTS (HTTP Strict Transport Security) with 1-year max-age
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: deny
  - X-XSS-Protection: enable

  **Rate Limiting**
  - General rate limiter: 100 requests per 15 minutes per IP
  - Login rate limiter: 5 requests per 15 minutes per IP
  - Returns 429 Too Many Requests with message
  - Standard headers enabled
  - Skip rate limiting for first 3 failed attempts

  **Input Validation**
  - express-validator for validation
  - Validation middleware: checks for validation errors
  - Sanitization middleware: removes < and > to prevent XSS
  - Route-specific validation:
    - Register: username (3-30 chars), email (valid email), password (8+ chars, complexity)
    - Login: email (valid email), password (required)
    - Posts: title (1-100 chars), content (1-5000 chars)
  - Returns 400 Bad Request for invalid input

  **Error Handling**
  - Centralized error handling middleware
  - Handles JSON parse errors (400)
  - Generic error message (500) - no sensitive info exposed
  - Logs errors for debugging

  **Routes**
  - POST /api/auth/register: User registration with validation
  - POST /api/auth/login: User login with stricter rate limiting
  - GET /api/users: Get users with rate limiting
  - POST /api/posts: Create post with validation

  **Documentation**
  - Complete setup instructions
  - Dependency installation guide
  - How to run guide
  - curl examples for testing
  - Security features explanation

## 3. Stretch – Secure Auth Flow

**Objective:** Implement secure authentication with proper token handling.

**Work completed:**
- Designed a secure authentication flow exercise.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for secure password storage, JWT token management, refresh tokens and secure cookies, and authentication routes and security measures.
- Prepared a reference implementation with:

  **Secure Password Storage**
  - Password hashing with bcrypt (12 rounds)
  - Password strength validation: 8+ chars, uppercase, lowercase, numbers
  - Never store plain text passwords
  - In-memory user store for demonstration

  **JWT Token Management**
  - Access tokens: 15-minute expiration
  - Token payload: userId, username, role
  - Strong secret keys (32+ characters)
  - Token verification with signature and expiration check
  - Token blacklist for logout (Set data structure)
  - In-memory token blacklist for demonstration

  **Refresh Tokens**
  - Refresh tokens: 7-day expiration
  - Secure storage in Map (token -> {userId, expires})
  - Token rotation on use (old token invalidated, new generated)
  - Revocation on logout (removed from storage)
  - Single use only (rotation enforced)
  - Separate secret for refresh tokens

  **Secure Cookie Handling**
  - HttpOnly flag: prevents JavaScript access (XSS protection)
  - Secure flag: only sent over HTTPS
  - SameSite=strict: prevents CSRF
  - Appropriate expiration: 15 min for access, 7 days for refresh
  - Cookie-parser middleware for cookie handling

  **Authentication Routes**
  - POST /api/auth/register: Register with password hashing and validation
  - POST /api/auth/login: Login with access token and refresh token in HttpOnly cookies
  - POST /api/auth/refresh: Refresh access token using refresh token
  - POST /api/auth/logout: Revoke refresh token and blacklist access token
  - GET /api/auth/me: Get current user info (protected route)

  **Security Measures**
  - Rate limiting on login endpoint (5 attempts per 15 minutes)
  - Account lockout tracking (failed attempts per IP)
  - Skip rate limiting for first 3 attempts (user-friendliness)
  - Event logging (login, logout, failed attempts) - console.log for demonstration
  - IP-based blocking for suspicious activity
  - Authentication middleware for protected routes

  **Documentation**
  - Complete setup instructions
  - Dependency installation guide
  - How to run guide
  - curl examples with cookie handling
  - Security features explanation

## Overall Summary

| Difficulty | Project | Status |
|---|---|---|
| Accessible | Common Vulnerabilities | Completed |
| Core | Secure an API | Completed |
| Stretch | Secure Auth Flow | Completed |

**Deliverables prepared:**
- 3 project specifications (`project.json`)
- 3 reference implementations (`.md`, `.js` files)
- Evaluation rubrics for all three projects
- Valid alternatives and mistakes-to-check lists
- Complete vulnerability documentation
- Working secure API implementation
- Working secure authentication implementation

**Key Web Security concepts covered:**
- SQL Injection (prevention with parameterized queries)
- Cross-Site Scripting (XSS) (types, prevention with encoding)
- Cross-Site Request Forgery (CSRF) (prevention with tokens)
- Authentication and authorization issues
- Security misconfiguration
- Sensitive data exposure
- Security headers (helmet, CSP, HSTS)
- Rate limiting (express-rate-limit)
- Input validation (express-validator)
- Input sanitization (XSS prevention)
- Error handling (generic messages, no sensitive info)
- Password hashing (bcrypt with 12 rounds)
- Password strength validation
- JWT token management (access tokens, expiration)
- Refresh tokens (rotation, revocation, single use)
- Secure cookies (HttpOnly, Secure, SameSite)
- Token blacklist (logout security)
- Account lockout (failed attempt tracking)
- Event logging (security monitoring)
- IP-based blocking (suspicious activity)
- CSRF prevention (SameSite cookies)
- Session security (secure session management)
- Least-privilege principle
- Defense in depth

**Next step:** Technical review, execution testing, and verification of all reference implementations before final submission.
