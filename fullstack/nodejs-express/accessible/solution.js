// Node.js & Express Reference Solution: First Server
// This solution demonstrates building an Express server with routes

const express = require('express');
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory data store for users
let users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' }
];

// Helper function to find user by ID
const findUserById = (id) => {
  return users.find(user => user.id === parseInt(id));
};

// Helper function to generate new ID
const generateId = () => {
  const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
  return maxId + 1;
};

// === ROUTE: GET / ===
// Returns a welcome message with server info
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Express Server',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      userById: '/api/users/:id'
    }
  });
});

// === ROUTE: GET /api/users ===
// Returns an array of all users
app.get('/api/users', (req, res) => {
  res.json({
    count: users.length,
    users: users
  });
});

// === ROUTE: GET /api/users/:id ===
// Returns a specific user by ID or 404 if not found
app.get('/api/users/:id', (req, res) => {
  const user = findUserById(req.params.id);

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: `User with ID ${req.params.id} does not exist`
    });
  }

  res.json(user);
});

// === ROUTE: POST /api/users ===
// Accepts JSON data (name, email) and creates a new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;

  // Validate request body
  if (!name || !email) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Name and email are required'
    });
  }

  // Check if email already exists
  const emailExists = users.some(user => user.email === email);
  if (emailExists) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Email already exists'
    });
  }

  // Create new user
  const newUser = {
    id: generateId(),
    name,
    email
  };

  users.push(newUser);

  res.status(201).json({
    message: 'User created successfully',
    user: newUser
  });
});

// === ROUTE: PUT /api/users/:id ===
// Updates an existing user by ID
app.put('/api/users/:id', (req, res) => {
  const user = findUserById(req.params.id);

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: `User with ID ${req.params.id} does not exist`
    });
  }

  const { name, email } = req.body;

  // Validate request body
  if (!name || !email) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Name and email are required'
    });
  }

  // Update user
  user.name = name;
  user.email = email;

  res.json({
    message: 'User updated successfully',
    user: user
  });
});

// === ROUTE: DELETE /api/users/:id ===
// Deletes a user by ID
app.delete('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(user => user.id === parseInt(req.params.id));

  if (userIndex === -1) {
    return res.status(404).json({
      error: 'User not found',
      message: `User with ID ${req.params.id} does not exist`
    });
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  res.json({
    message: 'User deleted successfully',
    user: deletedUser
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET    /`);
  console.log(`  GET    /api/users`);
  console.log(`  GET    /api/users/:id`);
  console.log(`  POST   /api/users`);
  console.log(`  PUT    /api/users/:id`);
  console.log(`  DELETE /api/users/:id`);
});

// === HOW TO RUN ===

// 1. Initialize a new Node.js project:
//    npm init -y

// 2. Install Express:
//    npm install express

// 3. Save this code as server.js

// 4. Run the server:
//    node server.js

// 5. Test the endpoints using curl or a tool like Postman:
//    curl http://localhost:3000
//    curl http://localhost:3000/api/users
//    curl http://localhost:3000/api/users/1
//    curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com"}'
//    curl -X PUT http://localhost:3000/api/users/1 -H "Content-Type: application/json" -d '{"name":"Alice Updated","email":"alice.updated@example.com"}'
//    curl -X DELETE http://localhost:3000/api/users/1
