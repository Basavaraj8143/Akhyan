# Work Log – Authentication Node

**Domain:** Web Development
**Node:** Authentication
**Status:** Projects completed with specifications and reference implementations

## 1. Accessible – JWT Auth

**Objective:** Add JWT-based login to an API.

**Work completed:**
- Designed a JWT authentication exercise for an Express API.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria covering user registration and password hashing, JWT login implementation, JWT middleware and token verification, and protected routes and error handling.
- Prepared a reference implementation with:
  - Express.js API with jsonwebtoken and bcryptjs
  - User registration endpoint: POST /api/auth/register
  - Password hashing using bcrypt (10 rounds)
  - User storage in memory with hashed passwords
  - User login endpoint: POST /api/auth/login
  - Password verification using bcrypt.compare
  - JWT token generation with user_id, username, iat, exp
  - JWT secret key and 1-hour expiration
  - JWT middleware (authenticateToken) for token verification
  - Token extraction from Authorization header (Bearer token)
  - Token verification with jsonwebtoken.verify
  - User info attached to request object
  - 401 Unauthorized for invalid/missing tokens
  - Protected routes: GET /api/users/profile, PUT /api/users/profile
  - Complete error handling for authentication failures
  - In-memory user store for demonstration
  - JWT workflow explanation in comments

## 2. Core – OAuth Login

**Objective:** Add social login (OAuth) to an app.

**Work completed:**
- Designed an OAuth social login exercise using Passport.js.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for OAuth flow implementation, user management with provider info, JWT token generation, and environment variables and security.
- Prepared a reference implementation with:

  **OAuth Flow Implementation**
  - OAuth 2.0 authorization code flow using Passport
  - Google OAuth strategy (passport-google-oauth20)
  - GitHub OAuth strategy (passport-github2)
  - Redirect to provider's authorization page
  - Handle OAuth callback with authorization code
  - Exchange code for access token (handled by Passport)
  - Fetch user profile from provider
  - Google scopes: profile, email
  - GitHub scopes: user:email

  **User Management**
  - Check for existing users by provider_id
  - Create new user if not found
  - Update last_login timestamp on login
  - Store provider_id, provider name, profile info
  - In-memory user store with provider info
  - Username, email, profile_image stored

  **Session Management**
  - JWT token generation after successful OAuth
  - Token payload: userId, username, provider
  - 1-hour expiration
  - Token returned to client in JSON response
  - JWT verification middleware for protected routes

  **Environment Variables**
  - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
  - GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
  - JWT_SECRET
  - No hardcoded credentials
  - Environment variable documentation
  - Security best practices emphasized

  **Routes**
  - GET /auth/google - Redirect to Google OAuth
  - GET /auth/google/callback - Handle Google callback
  - GET /auth/github - Redirect to GitHub OAuth
  - GET /auth/github/callback - Handle GitHub callback
  - GET /api/profile - Protected route example

  **Documentation**
  - Complete OAuth 2.0 flow explanation
  - Setup instructions for Google and GitHub OAuth apps
  - How to run guide with dependencies
  - Benefits of OAuth listed
  - Environment variable setup instructions

## 3. Stretch – Role-Based Access

**Objective:** Implement roles and authorization across an API.

**Work completed:**
- Designed a role-based access control (RBAC) exercise for an Express API.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for role and permission definition, JWT with role information, authorization middleware implementation, and protected routes and permission checking.
- Prepared a reference implementation with:

  **Role and Permission Definition**
  - Three roles: admin, moderator, user
  - Role hierarchy with numeric levels (admin=3, moderator=2, user=1)
  - Permission matrix for each role:
    - admin: Full access (read, create, update any, delete any, delete users, list users, change roles)
    - moderator: Content management (read, create, update any, delete any)
    - user: Basic access (read, create, update own, delete own)
  - Roles stored in user accounts
  - Permission checking functions implemented

  **JWT with Role Information**
  - JWT payload includes: userId, username, role
  - Middleware extracts role from token
  - Role attached to request object
  - Token generation with role info
  - Role-based session management

  **Authorization Middleware**
  - authenticateToken: Verifies JWT and attaches user to request
  - requireRole(requiredRole): Checks if user has required role or higher
  - requirePermission(permission): Checks if user's role has specific permission
  - Role hierarchy support (higher roles have lower role permissions)
  - 401 Unauthorized for missing authentication
  - 403 Forbidden for insufficient permissions
  - Reusable middleware functions

  **Protected Routes with Authorization**
  - GET /api/posts: All authenticated users can read
  - POST /api/posts: Admin and moderator can create
  - PUT /api/posts/:id: Admin and moderator can update any
  - PUT /api/posts/:id/own: Owner can update own, admin/moderator can update any
  - DELETE /api/posts/:id: Admin and moderator can delete any
  - DELETE /api/posts/:id/own: Owner can delete own, admin/moderator can delete any
  - GET /api/users: Only admin can list all users
  - DELETE /api/users/:id: Only admin can delete users
  - PUT /api/users/:id/role: Only admin can change user roles

  **Permission Checking**
  - Ownership checking for user-specific operations
  - Combined role and ownership checks
  - Appropriate error responses (401, 403, 404)
  - Clear permission denial messages

  **Role Management**
  - Admin can change user roles
  - Role validation against valid roles
  - Complete user management for admin

  **Documentation**
  - Complete RBAC system explanation
  - Role hierarchy and permission matrix
  - JWT with role information workflow
  - Authorization middleware usage
  - Ownership checking logic
  - Benefits of RBAC listed
  - How to run guide with curl examples
  - Test cases for different roles

## Overall Summary

| Difficulty | Project | Status |
|---|---|---|
| Accessible | JWT Auth | Completed |
| Core | OAuth Login | Completed |
| Stretch | Role-Based Access | Completed |

**Deliverables prepared:**
- 3 project specifications (`project.json`)
- 3 reference implementations (`.js` files)
- Evaluation rubrics for all three projects
- Valid alternatives and mistakes-to-check lists
- Complete authentication workflows
- Security best practices emphasized

**Key Authentication concepts covered:**
- JWT (JSON Web Token) authentication
- Password hashing with bcrypt
- Token generation and verification
- JWT payload structure (userId, username, iat, exp)
- Token expiration handling
- Authorization header (Bearer token)
- JWT middleware for route protection
- OAuth 2.0 authorization code flow
- Passport.js OAuth strategies
- Google OAuth integration
- GitHub OAuth integration
- Provider_id for social login
- User management with provider info
- Session management with JWT
- Environment variables for security
- Role-Based Access Control (RBAC)
- Role hierarchy and permission matrix
- Authorization middleware (requireRole, requirePermission)
- Ownership checking
- Combined role and ownership checks
- HTTP status codes (401 Unauthorized, 403 Forbidden)
- Token extraction and verification
- Security best practices (no hardcoded credentials, password hashing)
- Authentication vs Authorization distinction
- Permission-based access control
- Centralized permission management

**Next step:** Technical review, execution testing, and verification of all reference implementations before final submission.
