// REST API Design Reference Solution: CRUD API
// This solution demonstrates building a CRUD REST API with proper status codes

const express = require('express');
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Set Content-Type for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// In-memory data store for products
let products = [
  { id: 1, name: 'Laptop', description: 'High-performance laptop', createdAt: new Date('2024-01-01') },
  { id: 2, name: 'Mouse', description: 'Wireless mouse', createdAt: new Date('2024-01-02') },
  { id: 3, name: 'Keyboard', description: 'Mechanical keyboard', createdAt: new Date('2024-01-03') }
];

// Helper function to find product by ID
const findProductById = (id) => {
  return products.find(product => product.id === parseInt(id));
};

// Helper function to generate new ID
const generateId = () => {
  const maxId = products.reduce((max, product) => Math.max(max, product.id), 0);
  return maxId + 1;
};

// === CRUD OPERATION: CREATE ===
// POST /api/products - Create a new product
app.post('/api/products', (req, res) => {
  const { name, description } = req.body;

  // Validation
  if (!name || !description) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Name and description are required'
    });
  }

  // Create new product
  const newProduct = {
    id: generateId(),
    name,
    description,
    createdAt: new Date()
  };

  products.push(newProduct);

  // Return 201 Created with the created resource
  res.status(201).json({
    message: 'Product created successfully',
    product: newProduct
  });
});

// === CRUD OPERATION: READ (ALL) ===
// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  res.status(200).json({
    count: products.length,
    products: products
  });
});

// === CRUD OPERATION: READ (BY ID) ===
// GET /api/products/:id - Get a specific product by ID
app.get('/api/products/:id', (req, res) => {
  const product = findProductById(req.params.id);

  if (!product) {
    // Return 404 Not Found
    return res.status(404).json({
      error: 'Not Found',
      message: `Product with ID ${req.params.id} does not exist`
    });
  }

  // Return 200 OK with the resource
  res.status(200).json(product);
});

// === CRUD OPERATION: UPDATE ===
// PUT /api/products/:id - Update a product (full update)
app.put('/api/products/:id', (req, res) => {
  const product = findProductById(req.params.id);

  if (!product) {
    // Return 404 Not Found
    return res.status(404).json({
      error: 'Not Found',
      message: `Product with ID ${req.params.id} does not exist`
    });
  }

  const { name, description } = req.body;

  // Validation
  if (!name || !description) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Name and description are required'
    });
  }

  // Full update (replace all fields)
  product.name = name;
  product.description = description;

  // Return 200 OK with the updated resource
  res.status(200).json({
    message: 'Product updated successfully',
    product: product
  });
});

// === CRUD OPERATION: DELETE ===
// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res) => {
  const productIndex = products.findIndex(product => product.id === parseInt(req.params.id));

  if (productIndex === -1) {
    // Return 404 Not Found
    return res.status(404).json({
      error: 'Not Found',
      message: `Product with ID ${req.params.id} does not exist`
    });
  }

  const deletedProduct = products.splice(productIndex, 1)[0];

  // Return 200 OK with the deleted resource
  res.status(200).json({
    message: 'Product deleted successfully',
    product: deletedProduct
  });
});

// Handle unsupported HTTP methods (405 Method Not Allowed)
app.all('/api/products', (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({
      error: 'Method Not Allowed',
      message: `Method ${req.method} is not allowed for this endpoint`,
      allowedMethods: ['GET', 'POST']
    });
  }
});

app.all('/api/products/:id', (req, res) => {
  if (req.method !== 'GET' && req.method !== 'PUT' && req.method !== 'DELETE') {
    res.status(405).json({
      error: 'Method Not Allowed',
      message: `Method ${req.method} is not allowed for this endpoint`,
      allowedMethods: ['GET', 'PUT', 'DELETE']
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'RESTful CRUD API',
    version: '1.0.0',
    endpoints: {
      create: 'POST /api/products',
      readAll: 'GET /api/products',
      readOne: 'GET /api/products/:id',
      update: 'PUT /api/products/:id',
      delete: 'DELETE /api/products/:id'
    }
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`REST API Server is running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  POST   /api/products - Create a product`);
  console.log(`  GET    /api/products - Get all products`);
  console.log(`  GET    /api/products/:id - Get a product by ID`);
  console.log(`  PUT    /api/products/:id - Update a product`);
  console.log(`  DELETE /api/products/:id - Delete a product`);
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
//    # CREATE - POST /api/products
//    curl -X POST http://localhost:3000/api/products \
//      -H "Content-Type: application/json" \
//      -d '{"name":"Monitor","description":"27-inch 4K monitor"}'
//
//    # READ ALL - GET /api/products
//    curl http://localhost:3000/api/products
//
//    # READ ONE - GET /api/products/:id
//    curl http://localhost:3000/api/products/1
//
//    # UPDATE - PUT /api/products/:id
//    curl -X PUT http://localhost:3000/api/products/1 \
//      -H "Content-Type: application/json" \
//      -d '{"name":"Gaming Laptop","description":"High-performance gaming laptop"}'
//
//    # DELETE - DELETE /api/products/:id
//    curl -X DELETE http://localhost:3000/api/products/1

// === REST PRINCIPLES FOLLOWED ===

// 1. Use nouns for resource names (not verbs)
//    - Correct: /api/products
//    - Incorrect: /api/getProducts, /api/createProduct
//
// 2. Use plural nouns for collections
//    - Correct: /api/products
//    - Incorrect: /api/product
//
// 3. Use HTTP methods correctly
//    - GET: Retrieve resources
//    - POST: Create new resources
//    - PUT: Update/replace resources
//    - DELETE: Remove resources
//
// 4. Use appropriate HTTP status codes
//    - 200 OK: Successful GET, PUT, DELETE
//    - 201 Created: Successful POST
//    - 400 Bad Request: Invalid request data
//    - 404 Not Found: Resource not found
//    - 405 Method Not Allowed: Unsupported HTTP method
//    - 500 Internal Server Error: Server errors
//
// 5. Return JSON responses
//    - All responses are in JSON format
//    - Content-Type header set to application/json
//
// 6. Use resource identifiers in URLs
//    - /api/products/:id for specific resources
//    - ID is part of the URL path, not query parameter
//
// 7. Statelessness
//    - Each request contains all information needed
//    - No server-side session state
//
// 8. Uniform interface
//    - Consistent URL patterns
//    - Consistent response formats
//    - Consistent error handling
