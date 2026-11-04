# Work Log – REST API Design Node

**Domain:** Web Development
**Node:** REST API Design
**Status:** Projects completed with specifications and reference implementations

## 1. Accessible – CRUD API

**Objective:** Build a CRUD REST API with proper status codes.

**Work completed:**
- Designed a CRUD API exercise covering REST principles and HTTP status codes.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria covering CRUD operations, HTTP status codes, REST principles adherence, and response format.
- Prepared a reference implementation with:
  - Express server with JSON parsing middleware
  - Content-Type header set to application/json
  - Products resource with 4 fields (id, name, description, createdAt)
  - POST /api/products for CREATE (201 Created)
  - GET /api/products for READ all (200 OK)
  - GET /api/products/:id for READ by ID (200 OK, 404 Not Found)
  - PUT /api/products/:id for UPDATE (200 OK, 404 Not Found)
  - DELETE /api/products/:id for DELETE (200 OK, 404 Not Found)
  - 400 Bad Request for invalid data
  - 405 Method Not Allowed for unsupported HTTP methods
  - Proper REST principles: nouns for resources, plural for collections, correct HTTP methods
  - Consistent JSON responses
  - Complete REST principles explanation
  - Comprehensive curl command examples

## 2. Core – Validated API

**Objective:** Add rigorous validation and error handling to an API.

**Work completed:**
- Designed a validated API exercise with comprehensive input validation.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for validation implementation, error response format, HTTP status codes and error types, and error handling middleware.
- Prepared a reference implementation with:

  **Custom Error Classes**
  - ValidationError with field, value, constraint details (400)
  - NotFoundError for missing resources (404)
  - UnprocessableEntityError for business logic errors (422)

  **Validation Functions**
  - validateName: required, 2-50 characters, letters only
  - validateEmail: required, valid email format with regex
  - validateAge: optional, 18-120 range
  - validatePhone: optional, valid phone format with regex

  **User Resource**
  - Schema: id, firstName, lastName, email, age, phone
  - In-memory data store with sample users

  **CRUD Operations with Validation**
  - POST /api/users: Validate all required fields
  - GET /api/users: Validate query parameters (limit, offset)
  - GET /api/users/:id: Validate ID format
  - PUT /api/users/:id: Validate all fields (full update)
  - PATCH /api/users/:id: Validate only provided fields (partial update)
  - DELETE /api/users/:id: Validate ID format

  **Error Handling Middleware**
  - Centralized error handling
  - Consistent error response format (error, message, details)
  - Error logging to console
  - Handles all error types appropriately

  - Email uniqueness validation
  - Pagination support with validation
  - Complete validation strategy explanation
  - Comprehensive curl examples for all scenarios

## 3. Stretch – Documented API

**Objective:** Build a versioned, documented API to spec.

**Work completed:**
- Designed a versioned API exercise with OpenAPI documentation.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for API versioning, OpenAPI specification completeness, enhanced features in v2, and response standards.
- Prepared a reference implementation with:

  **API Versioning**
  - URL path versioning: /api/v1/products, /api/v2/products
  - v1: Basic CRUD operations (backward compatible)
  - v2: Enhanced features (pagination, filtering, sorting, field selection, expand)
  - Separate route implementations for each version

  **Products Resource**
  - Schema: id, name, description, price, category, stock, createdAt, updatedAt
  - In-memory data store with sample products

  **V1 Routes (Basic CRUD)**
  - POST /api/v1/products
  - GET /api/v1/products
  - GET /api/v1/products/:id
  - PUT /api/v1/products/:id
  - DELETE /api/v1/products/:id

  **V2 Routes (Enhanced Features)**
  - POST /api/v2/products
  - GET /api/v2/products with query parameters:
    - limit: pagination limit
    - offset: pagination offset
    - filter: JSON filter string (e.g., {"category":"Electronics"})
    - sort: field and order (e.g., price,asc)
    - fields: comma-separated field names
    - expand: include related resources (category)
  - GET /api/v2/products/:id with expand support
  - PUT /api/v2/products/:id
  - DELETE /api/v2/products/:id

  **Enhanced Features Implementation**
  - Pagination with limit and offset
  - Filtering by field values (JSON parsing)
  - Sorting by field with ascending/descending
  - Field selection (partial response)
  - Expand for related resources (category info)
  - Metadata in list responses (count, total, limit, offset)

  **OpenAPI Specification**
  - Complete YAML format specification
  - Complete JSON format specification
  - Documents all v1 and v2 endpoints
  - Includes all parameters, schemas, responses
  - Includes example requests and responses
  - API metadata (title, version, description)
  - Component schemas for Product and ProductInput

  **Response Standards**
  - Consistent response format across all endpoints
  - Metadata in list responses
  - Standardized error responses
  - Content-Type header set to application/json

  - Comprehensive API versioning strategy explanation
  - OpenAPI specification benefits documented
  - Complete curl examples for all features

## Overall Summary

| Difficulty | Project | Status |
|---|---|---|
| Accessible | CRUD API | Completed |
| Core | Validated API | Completed |
| Stretch | Documented API | Completed |

**Deliverables prepared:**
- 3 project specifications (`project.json`)
- 3 reference implementations (`.js` files)
- Evaluation rubrics for all three projects
- Valid alternatives and mistakes-to-check lists
- OpenAPI specification in both YAML and JSON formats
- Complete API documentation

**Key REST API Design concepts covered:**
- REST principles (nouns, plural, HTTP methods)
- CRUD operations (CREATE, READ, UPDATE, DELETE)
- HTTP status codes (200, 201, 400, 404, 405, 422, 500)
- JSON responses and Content-Type headers
- Resource-based URL design
- Input validation with regex patterns
- Custom error classes (ValidationError, NotFoundError, UnprocessableEntityError)
- Centralized error handling middleware
- Consistent error response formats
- Query parameter validation
- API versioning strategies (URL path versioning)
- Backward compatibility
- Pagination (limit, offset)
- Filtering (JSON-based)
- Sorting (field with order)
- Field selection (partial responses)
- Expand (related resources)
- Response metadata
- OpenAPI/Swagger specification
- API documentation best practices
- REST API design patterns

**Next step:** Technical review, execution testing, and verification of all reference implementations before final submission.
