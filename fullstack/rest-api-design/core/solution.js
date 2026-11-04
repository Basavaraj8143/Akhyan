// REST API Design Reference Solution: Validated API
// This solution demonstrates rigorous validation and error handling

const express = require('express');
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Set Content-Type for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// ============================================
// === CUSTOM ERROR CLASSES ===
// ============================================

class ValidationError extends Error {
  constructor(message, field, value, constraint) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.field = field;
    this.value = value;
    this.constraint = constraint;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class UnprocessableEntityError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnprocessableEntityError';
    this.statusCode = 422;
  }
}

// ============================================
// === VALIDATION FUNCTIONS ===
// ============================================

const validateName = (value, fieldName) => {
  if (!value || typeof value !== 'string') {
    throw new ValidationError(
      `${fieldName} is required and must be a string`,
      fieldName,
      value,
      'required and string type'
    );
  }
  if (value.length < 2 || value.length > 50) {
    throw new ValidationError(
      `${fieldName} must be between 2 and 50 characters`,
      fieldName,
      value,
      'length: 2-50'
    );
  }
  if (!/^[a-zA-Z]+$/.test(value)) {
    throw new ValidationError(
      `${fieldName} must contain only letters`,
      fieldName,
      value,
      'letters only'
    );
  }
  return true;
};

const validateEmail = (value) => {
  if (!value || typeof value !== 'string') {
    throw new ValidationError(
      'Email is required and must be a string',
      'email',
      value,
      'required and string type'
    );
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    throw new ValidationError(
      'Email must be a valid email address',
      'email',
      value,
      'valid email format'
    );
  }
  return true;
};

const validateAge = (value) => {
  if (value !== undefined && value !== null) {
    if (typeof value !== 'number') {
      throw new ValidationError(
        'Age must be a number',
        'age',
        value,
        'number type'
      );
    }
    if (value < 18 || value > 120) {
      throw new ValidationError(
        'Age must be between 18 and 120',
        'age',
        value,
        'range: 18-120'
      );
    }
  }
  return true;
};

const validatePhone = (value) => {
  if (value !== undefined && value !== null) {
    if (typeof value !== 'string') {
      throw new ValidationError(
        'Phone must be a string',
        'phone',
        value,
        'string type'
      );
    }
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(value)) {
      throw new ValidationError(
        'Phone must be a valid phone number',
        'phone',
        value,
        'valid phone format'
      );
    }
  }
  return true;
};

// ============================================
// === DATA STORE ===
// ============================================

let users = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 30, phone: '+1234567890' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', age: 25, phone: null },
  { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', age: 35, phone: '+9876543210' }
];

const findUserById = (id) => {
  return users.find(user => user.id === parseInt(id));
};

const generateId = () => {
  const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
  return maxId + 1;
};

// ============================================
// === ERROR HANDLING MIDDLEWARE ===
// ============================================

const errorHandlingMiddleware = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  const statusCode = err.statusCode || 500;
  const errorResponse = {
    error: err.name || 'Error',
    message: err.message || 'An unexpected error occurred'
  };

  // Add details for validation errors
  if (err.name === 'ValidationError') {
    errorResponse.details = {
      field: err.field,
      value: err.value,
      constraint: err.constraint
    };
  }

  res.status(statusCode).json(errorResponse);
};

// ============================================
// === ROUTES ===
// ============================================

// === CREATE - POST /api/users ===
app.post('/api/users', (req, res, next) => {
  try {
    const { firstName, lastName, email, age, phone } = req.body;

    // Validate all fields
    validateName(firstName, 'firstName');
    validateName(lastName, 'lastName');
    validateEmail(email);
    validateAge(age);
    validatePhone(phone);

    // Check if email already exists
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
      throw new UnprocessableEntityError('Email already exists');
    }

    // Create new user
    const newUser = {
      id: generateId(),
      firstName,
      lastName,
      email,
      age: age || null,
      phone: phone || null
    };

    users.push(newUser);

    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    next(error);
  }
});

// === READ ALL - GET /api/users ===
app.get('/api/users', (req, res, next) => {
  try {
    // Validate query parameters
    const { limit, offset } = req.query;

    if (limit !== undefined) {
      const limitNum = parseInt(limit);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        throw new ValidationError(
          'Limit must be a number between 1 and 100',
          'limit',
          limit,
          'range: 1-100'
        );
      }
    }

    if (offset !== undefined) {
      const offsetNum = parseInt(offset);
      if (isNaN(offsetNum) || offsetNum < 0) {
        throw new ValidationError(
          'Offset must be a non-negative number',
          'offset',
          offset,
          'minimum: 0'
        );
      }
    }

    let result = users;

    // Apply pagination
    if (offset !== undefined) {
      result = result.slice(parseInt(offset));
    }
    if (limit !== undefined) {
      result = result.slice(0, parseInt(limit));
    }

    res.status(200).json({
      count: result.length,
      total: users.length,
      users: result
    });
  } catch (error) {
    next(error);
  }
});

// === READ ONE - GET /api/users/:id ===
app.get('/api/users/:id', (req, res, next) => {
  try {
    // Validate ID format
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) {
      throw new ValidationError(
        'Invalid user ID',
        'id',
        req.params.id,
        'must be a positive integer'
      );
    }

    const user = findUserById(id);

    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// === UPDATE - PUT /api/users/:id ===
app.put('/api/users/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) {
      throw new ValidationError(
        'Invalid user ID',
        'id',
        req.params.id,
        'must be a positive integer'
      );
    }

    const user = findUserById(id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    const { firstName, lastName, email, age, phone } = req.body;

    // Validate all fields (full update)
    validateName(firstName, 'firstName');
    validateName(lastName, 'lastName');
    validateEmail(email);
    validateAge(age);
    validatePhone(phone);

    // Check if email already exists (excluding current user)
    const emailExists = users.some(
      u => u.email === email && u.id !== id
    );
    if (emailExists) {
      throw new UnprocessableEntityError('Email already exists');
    }

    // Full update
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.age = age || null;
    user.phone = phone || null;

    res.status(200).json({
      message: 'User updated successfully',
      user: user
    });
  } catch (error) {
    next(error);
  }
});

// === PARTIAL UPDATE - PATCH /api/users/:id ===
app.patch('/api/users/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) {
      throw new ValidationError(
        'Invalid user ID',
        'id',
        req.params.id,
        'must be a positive integer'
      );
    }

    const user = findUserById(id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    const { firstName, lastName, email, age, phone } = req.body;

    // Validate only provided fields
    if (firstName !== undefined) validateName(firstName, 'firstName');
    if (lastName !== undefined) validateName(lastName, 'lastName');
    if (email !== undefined) {
      validateEmail(email);
      const emailExists = users.some(u => u.email === email && u.id !== id);
      if (emailExists) {
        throw new UnprocessableEntityError('Email already exists');
      }
    }
    if (age !== undefined) validateAge(age);
    if (phone !== undefined) validatePhone(phone);

    // Partial update
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) user.email = email;
    if (age !== undefined) user.age = age;
    if (phone !== undefined) user.phone = phone;

    res.status(200).json({
      message: 'User updated successfully',
      user: user
    });
  } catch (error) {
    next(error);
  }
});

// === DELETE - DELETE /api/users/:id ===
app.delete('/api/users/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) {
      throw new ValidationError(
        'Invalid user ID',
        'id',
        req.params.id,
        'must be a positive integer'
      );
    }

    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    const deletedUser = users.splice(index, 1)[0];

    res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser
    });
  } catch (error) {
    next(error);
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Validated REST API',
    version: '1.0.0',
    validation: {
      firstName: 'required, 2-50 characters, letters only',
      lastName: 'required, 2-50 characters, letters only',
      email: 'required, valid email format',
      age: 'optional, 18-120',
      phone: 'optional, valid phone format'
    }
  });
});

// Apply error handling middleware
app.use(errorHandlingMiddleware);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Validated REST API Server is running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  POST   /api/users - Create a user`);
  console.log(`  GET    /api/users - Get all users (with pagination)`);
  console.log(`  GET    /api/users/:id - Get a user by ID`);
  console.log(`  PUT    /api/users/:id - Update a user (full)`);
  console.log(`  PATCH  /api/users/:id - Update a user (partial)`);
  console.log(`  DELETE /api/users/:id - Delete a user`);
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
//    # CREATE with valid data
//    curl -X POST http://localhost:3000/api/users \
//      -H "Content-Type: application/json" \
//      -d '{"firstName":"Alice","lastName":"Brown","email":"alice@example.com","age":28,"phone":"+1555123456"}'
//
//    # CREATE with invalid email (should return 400)
//    curl -X POST http://localhost:3000/api/users \
//      -H "Content-Type: application/json" \
//      -d '{"firstName":"Alice","lastName":"Brown","email":"invalid-email"}'
//
//    # CREATE with age under 18 (should return 400)
//    curl -X POST http://localhost:3000/api/users \
//      -H "Content-Type: application/json" \
//      -d '{"firstName":"Alice","lastName":"Brown","email":"alice@example.com","age":15}'
//
//    # GET with pagination
//    curl http://localhost:3000/api/users?limit=2&offset=0
//
//    # GET with invalid limit (should return 400)
//    curl http://localhost:3000/api/users?limit=200
//
//    # PATCH with partial update
//    curl -X PATCH http://localhost:3000/api/users/1 \
//      -H "Content-Type: application/json" \
//      -d '{"age":31}'
//
//    # GET non-existent user (should return 404)
//    curl http://localhost:3000/api/users/999

// === VALIDATION STRATEGY EXPLANATION ===

// 1. Custom Error Classes:
//    - ValidationError: For input validation failures (400)
//    - NotFoundError: For resource not found (404)
//    - UnprocessableEntityError: For business logic errors (422)
//
// 2. Validation Functions:
//    - Separate functions for each field type
//    - Throw ValidationError with details (field, value, constraint)
//    - Reusable across different operations
//
// 3. Error Response Format:
//    - Consistent format: { error, message, details? }
//    - Details include field, value, and constraint for validation errors
//    - HTTP status codes match error types
//
// 4. Validation Coverage:
//    - POST: Validate all required fields
//    - PUT: Validate all fields (full update)
//    - PATCH: Validate only provided fields (partial update)
//    - GET: Validate query parameters (limit, offset)
//    - GET by ID: Validate ID format
//    - DELETE: Validate ID format
//
// 5. Error Handling Middleware:
//    - Centralized error handling
//    - Logs errors to console
//    - Returns consistent error responses
//    - Handles all error types appropriately
