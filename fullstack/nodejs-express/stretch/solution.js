// Node.js & Express Reference Solution: Structured Backend
// This solution demonstrates a backend with routes, controllers, and services (MVC pattern)

const express = require('express');
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// ============================================
// === FILE: models/user.model.js ===
// ============================================

class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }
}

class Task {
  constructor(id, title, completed, userId) {
    this.id = id;
    this.title = title;
    this.completed = completed || false;
    this.userId = userId;
    this.createdAt = new Date();
  }
}

// ============================================
// === FILE: errors/custom-errors.js ===
// ============================================

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

// ============================================
// === FILE: services/user.service.js ===
// ============================================

class UserService {
  constructor() {
    // In-memory data store
    this.users = [
      new User(1, 'Alice Johnson', 'alice@example.com'),
      new User(2, 'Bob Smith', 'bob@example.com'),
      new User(3, 'Charlie Brown', 'charlie@example.com')
    ];
    this.nextId = 4;
  }

  getAllUsers() {
    return this.users;
  }

  getUserById(id) {
    const user = this.users.find(user => user.id === parseInt(id));
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    return user;
  }

  createUser(name, email) {
    // Validation
    if (!name || !email) {
      throw new ValidationError('Name and email are required');
    }

    // Check if email already exists
    const emailExists = this.users.some(user => user.email === email);
    if (emailExists) {
      throw new ValidationError('Email already exists');
    }

    const user = new User(this.nextId++, name, email);
    this.users.push(user);
    return user;
  }

  updateUser(id, name, email) {
    const user = this.getUserById(id);

    // Validation
    if (!name || !email) {
      throw new ValidationError('Name and email are required');
    }

    // Check if email already exists (excluding current user)
    const emailExists = this.users.some(
      user => user.email === email && user.id !== parseInt(id)
    );
    if (emailExists) {
      throw new ValidationError('Email already exists');
    }

    user.name = name;
    user.email = email;
    return user;
  }

  deleteUser(id) {
    const index = this.users.findIndex(user => user.id === parseInt(id));
    if (index === -1) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    const deletedUser = this.users.splice(index, 1)[0];
    return deletedUser;
  }
}

// ============================================
// === FILE: services/task.service.js ===
// ============================================

class TaskService {
  constructor() {
    // In-memory data store
    this.tasks = [
      new Task(1, 'Complete project', false, 1),
      new Task(2, 'Review code', true, 1),
      new Task(3, 'Write documentation', false, 2)
    ];
    this.nextId = 4;
  }

  getAllTasks() {
    return this.tasks;
  }

  getTasksByUserId(userId) {
    return this.tasks.filter(task => task.userId === parseInt(userId));
  }

  getTaskById(id) {
    const task = this.tasks.find(task => task.id === parseInt(id));
    if (!task) {
      throw new NotFoundError(`Task with ID ${id} not found`);
    }
    return task;
  }

  createTask(title, completed, userId) {
    // Validation
    if (!title) {
      throw new ValidationError('Title is required');
    }

    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const task = new Task(this.nextId++, title, completed, parseInt(userId));
    this.tasks.push(task);
    return task;
  }

  updateTask(id, title, completed) {
    const task = this.getTaskById(id);

    // Validation
    if (!title) {
      throw new ValidationError('Title is required');
    }

    task.title = title;
    task.completed = completed !== undefined ? completed : task.completed;
    return task;
  }

  deleteTask(id) {
    const index = this.tasks.findIndex(task => task.id === parseInt(id));
    if (index === -1) {
      throw new NotFoundError(`Task with ID ${id} not found`);
    }
    const deletedTask = this.tasks.splice(index, 1)[0];
    return deletedTask;
  }
}

// ============================================
// === FILE: controllers/user.controller.js ===
// ============================================

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  getAllUsers(req, res) {
    const users = this.userService.getAllUsers();
    res.json({
      count: users.length,
      users: users
    });
  }

  getUserById(req, res, next) {
    try {
      const user = this.userService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  createUser(req, res, next) {
    try {
      const { name, email } = req.body;
      const user = this.userService.createUser(name, email);
      res.status(201).json({
        message: 'User created successfully',
        user: user
      });
    } catch (error) {
      next(error);
    }
  }

  updateUser(req, res, next) {
    try {
      const { name, email } = req.body;
      const user = this.userService.updateUser(req.params.id, name, email);
      res.json({
        message: 'User updated successfully',
        user: user
      });
    } catch (error) {
      next(error);
    }
  }

  deleteUser(req, res, next) {
    try {
      const user = this.userService.deleteUser(req.params.id);
      res.json({
        message: 'User deleted successfully',
        user: user
      });
    } catch (error) {
      next(error);
    }
  }
}

// ============================================
// === FILE: controllers/task.controller.js ===
// ============================================

class TaskController {
  constructor(taskService) {
    this.taskService = taskService;
  }

  getAllTasks(req, res) {
    const tasks = this.taskService.getAllTasks();
    res.json({
      count: tasks.length,
      tasks: tasks
    });
  }

  getTaskById(req, res, next) {
    try {
      const task = this.taskService.getTaskById(req.params.id);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  createTask(req, res, next) {
    try {
      const { title, completed, userId } = req.body;
      const task = this.taskService.createTask(title, completed, userId);
      res.status(201).json({
        message: 'Task created successfully',
        task: task
      });
    } catch (error) {
      next(error);
    }
  }

  updateTask(req, res, next) {
    try {
      const { title, completed } = req.body;
      const task = this.taskService.updateTask(req.params.id, title, completed);
      res.json({
        message: 'Task updated successfully',
        task: task
      });
    } catch (error) {
      next(error);
    }
  }

  deleteTask(req, res, next) {
    try {
      const task = this.taskService.deleteTask(req.params.id);
      res.json({
        message: 'Task deleted successfully',
        task: task
      });
    } catch (error) {
      next(error);
    }
  }

  getTasksByUserId(req, res, next) {
    try {
      const tasks = this.taskService.getTasksByUserId(req.params.userId);
      res.json({
        count: tasks.length,
        tasks: tasks
      });
    } catch (error) {
      next(error);
    }
  }
}

// ============================================
// === FILE: routes/user.routes.js ===
// ============================================

function setupUserRoutes(app, userController) {
  app.get('/api/users', (req, res, next) => userController.getAllUsers(req, res));
  app.get('/api/users/:id', (req, res, next) => userController.getUserById(req, res, next));
  app.post('/api/users', (req, res, next) => userController.createUser(req, res, next));
  app.put('/api/users/:id', (req, res, next) => userController.updateUser(req, res, next));
  app.delete('/api/users/:id', (req, res, next) => userController.deleteUser(req, res, next));
}

// ============================================
// === FILE: routes/task.routes.js ===
// ============================================

function setupTaskRoutes(app, taskController) {
  app.get('/api/tasks', (req, res, next) => taskController.getAllTasks(req, res));
  app.get('/api/tasks/:id', (req, res, next) => taskController.getTaskById(req, res, next));
  app.post('/api/tasks', (req, res, next) => taskController.createTask(req, res, next));
  app.put('/api/tasks/:id', (req, res, next) => taskController.updateTask(req, res, next));
  app.delete('/api/tasks/:id', (req, res, next) => taskController.deleteTask(req, res, next));
  app.get('/api/users/:userId/tasks', (req, res, next) => taskController.getTasksByUserId(req, res, next));
}

// ============================================
// === FILE: middleware/error-handler.js ===
// ============================================

function errorHandlingMiddleware(err, req, res, next) {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  const statusCode = err.statusCode || 500;
  const errorName = err.name || 'Error';

  res.status(statusCode).json({
    error: errorName,
    message: err.message
  });
}

// ============================================
// === FILE: server.js (Main entry point) ===
// ============================================

// Initialize services
const userService = new UserService();
const taskService = new TaskService();

// Initialize controllers
const userController = new UserController(userService);
const taskController = new TaskController(taskService);

// Setup routes
setupUserRoutes(app, userController);
setupTaskRoutes(app, taskController);

// Apply error handling middleware at the end
app.use(errorHandlingMiddleware);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Structured Backend API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      userById: '/api/users/:id',
      tasks: '/api/tasks',
      taskById: '/api/tasks/:id',
      userTasks: '/api/users/:userId/tasks'
    }
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
  console.log(`  GET    /api/tasks`);
  console.log(`  GET    /api/tasks/:id`);
  console.log(`  POST   /api/tasks`);
  console.log(`  PUT    /api/tasks/:id`);
  console.log(`  DELETE /api/tasks/:id`);
  console.log(`  GET    /api/users/:userId/tasks`);
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
//    # Get all users
//    curl http://localhost:3000/api/users
//
//    # Get user by ID
//    curl http://localhost:3000/api/users/1
//
//    # Create user
//    curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com"}'
//
//    # Update user
//    curl -X PUT http://localhost:3000/api/users/1 -H "Content-Type: application/json" -d '{"name":"Alice Updated","email":"alice.updated@example.com"}'
//
//    # Delete user
//    curl -X DELETE http://localhost:3000/api/users/1
//
//    # Get all tasks
//    curl http://localhost:3000/api/tasks
//
//    # Get task by ID
//    curl http://localhost:3000/api/tasks/1
//
//    # Create task
//    curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"New Task","completed":false,"userId":1}'
//
//    # Get tasks by user ID
//    curl http://localhost:3000/api/users/1/tasks

// === MVC PATTERN EXPLANATION ===

// This backend follows the MVC (Model-View-Controller) pattern with clear separation of concerns:
//
// MODELS (models/):
// - Define data structures (User, Task classes)
// - No business logic, just data definitions
//
// SERVICES (services/):
// - Contain business logic and data operations
// - Handle validation and data manipulation
// - Do NOT know about HTTP (no req/res objects)
// - Throw custom errors for validation and not-found cases
//
// CONTROLLERS (controllers/):
// - Handle HTTP requests and responses
// - Call services to perform business logic
// - Format HTTP responses with appropriate status codes
// - Do NOT contain business logic
// - Pass errors to next() for centralized error handling
//
// ROUTES (routes/):
// - Map URL patterns to controller methods
// - Thin layer that just connects HTTP to controllers
//
// MIDDLEWARE (middleware/):
// - Cross-cutting concerns like error handling
// - Applied globally or to specific routes
//
// BENEFITS:
// - Clear separation of concerns
// - Easy to test (services can be tested without HTTP)
// - Easy to maintain (changes in one layer don't affect others)
// - Reusable (services can be used by multiple controllers)
// - Scalable (easy to add new features following the pattern)
