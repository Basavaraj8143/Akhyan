# Work Log – Node.js & Express Node

**Domain:** Web Development
**Node:** Node.js & Express
**Status:** Projects completed with specifications and reference implementations

## 1. Accessible – First Server

**Objective:** Build an Express server with a few routes.

**Work completed:**
- Designed a basic Express server exercise covering routing fundamentals.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria covering server setup and configuration, route implementation, data handling and HTTP status codes, and error handling.
- Prepared a reference implementation with:
  - Express server initialization on port 3000
  - express.json() middleware for parsing JSON bodies
  - In-memory data store for users
  - Helper functions for finding users and generating IDs
  - GET / route returning welcome message and endpoint info
  - GET /api/users route returning all users
  - GET /api/users/:id route returning specific user or 404
  - POST /api/users route creating new users with validation
  - PUT /api/users/:id route updating users with validation
  - DELETE /api/users/:id route deleting users
  - Appropriate HTTP status codes (200, 201, 400, 404)
  - JSON responses for all routes
  - Error handling for invalid IDs and missing data
  - Complete curl command examples for testing

## 2. Core – Middleware Chain

**Objective:** Build middleware for logging, auth, and error handling.

**Work completed:**
- Designed an Express middleware chain exercise covering custom middleware implementation.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for logging middleware, authentication middleware, error handling middleware, and middleware chain configuration.
- Prepared a reference implementation with:
  - Logging middleware that logs method, URL, timestamp, status code, and response time
  - Logging middleware uses res.json override to capture status code
  - Authentication middleware that validates Authorization header
  - Simple token validation (token must be 'secret-token')
  - Auth middleware returns 401 for invalid/missing tokens
  - Error handling middleware that catches and logs errors
  - Custom error classes (ValidationError, NotFoundError)
  - Error handling middleware returns consistent error responses
  - GET /api/public route (no auth required)
  - GET /api/protected route (auth required)
  - GET /api/error route (intentionally throws error)
  - POST /api/users route with validation
  - Email format validation using regex
  - Proper middleware chain order (logging globally, auth on protected routes, error handling at end)
  - Comprehensive middleware chain explanation
  - Complete curl command examples with auth headers

## 3. Stretch – Structured Backend

**Objective:** Structure a backend cleanly with routes, controllers, services.

**Work completed:**
- Designed a structured backend exercise following MVC pattern with clear separation of concerns.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for module structure and separation of concerns, service layer implementation, controller layer implementation, and routes and error handling.
- Prepared a reference implementation with:

  **Models (models/)**
  - User class with id, name, email, createdAt
  - Task class with id, title, completed, userId, createdAt

  **Custom Errors (errors/)**
  - NotFoundError class with 404 status
  - ValidationError class with 400 status

  **Services (services/)**
  - UserService with CRUD operations and validation
  - TaskService with CRUD operations and filtering by userId
  - Services throw custom errors (ValidationError, NotFoundError)
  - Services do not handle HTTP concerns (no req/res)
  - Business logic encapsulated in services

  **Controllers (controllers/)**
  - UserController with methods for all user operations
  - TaskController with methods for all task operations
  - Controllers call services and format HTTP responses
  - Controllers use try/catch and pass errors to next()
  - Controllers do not contain business logic

  **Routes (routes/)**
  - setupUserRoutes function mapping user endpoints to controller
  - setupTaskRoutes function mapping task endpoints to controller
  - All required routes implemented (CRUD for both users and tasks)
  - Special route: GET /api/users/:userId/tasks

  **Middleware (middleware/)**
  - Centralized error handling middleware
  - Logs errors and returns consistent error responses
  - Handles custom error classes appropriately

  **Main Server (server.js)**
  - Service initialization
  - Controller initialization with dependency injection
  - Route setup
  - Error handling middleware application
  - Server startup on port 3000

  - Comprehensive MVC pattern explanation
  - Benefits of separation of concerns documented
  - Complete curl command examples for all endpoints

## Overall Summary

| Difficulty | Project | Status |
|---|---|---|
| Accessible | First Server | Completed |
| Core | Middleware Chain | Completed |
| Stretch | Structured Backend | Completed |

**Deliverables prepared:**
- 3 project specifications (`project.json`)
- 3 reference implementations (`.js` files)
- Evaluation rubrics for all three projects
- Valid alternatives and mistakes-to-check lists
- Detailed MVC pattern explanation
- Complete testing examples

**Key Node.js & Express concepts covered:**
- Express application initialization
- express.json() middleware for body parsing
- Route definition with HTTP methods (GET, POST, PUT, DELETE)
- Route parameters (/:id)
- HTTP status codes (200, 201, 400, 404, 401, 500)
- JSON responses
- In-memory data storage
- Request validation
- Error handling
- Custom middleware functions
- Middleware chain execution order
- next() function for passing control
- res.json override for response interception
- Authentication middleware
- Authorization header validation
- Custom error classes
- Error handling middleware (4 parameters)
- MVC (Model-View-Controller) pattern
- Separation of concerns
- Service layer (business logic)
- Controller layer (HTTP handling)
- Route layer (URL mapping)
- Dependency injection
- Custom error propagation
- try/catch in controllers
- Centralized error handling

**Next step:** Technical review, execution testing, and verification of all reference implementations before final submission.
