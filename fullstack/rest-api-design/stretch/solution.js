// REST API Design Reference Solution: Documented API
// This solution demonstrates a versioned, documented API with OpenAPI specification

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
// === DATA STORE ===
// ============================================

let products = [
  { id: 1, name: 'Laptop', description: 'High-performance laptop', price: 999.99, category: 'Electronics', stock: 50, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 2, name: 'Mouse', description: 'Wireless mouse', price: 29.99, category: 'Electronics', stock: 200, createdAt: new Date('2024-01-02'), updatedAt: new Date('2024-01-02') },
  { id: 3, name: 'Keyboard', description: 'Mechanical keyboard', price: 79.99, category: 'Electronics', stock: 100, createdAt: new Date('2024-01-03'), updatedAt: new Date('2024-01-03') },
  { id: 4, name: 'Monitor', description: '27-inch 4K monitor', price: 449.99, category: 'Electronics', stock: 30, createdAt: new Date('2024-01-04'), updatedAt: new Date('2024-01-04') },
  { id: 5, name: 'Headphones', description: 'Noise-cancelling headphones', price: 199.99, category: 'Audio', stock: 75, createdAt: new Date('2024-01-05'), updatedAt: new Date('2024-01-05') }
];

const findProductById = (id) => {
  return products.find(product => product.id === parseInt(id));
};

const generateId = () => {
  const maxId = products.reduce((max, product) => Math.max(max, product.id), 0);
  return maxId + 1;
};

// ============================================
// === V1 ROUTES (Basic CRUD) ===
// ============================================

// V1: POST /api/v1/products - Create a product
app.post('/api/v1/products', (req, res) => {
  const { name, description, price, category, stock } = req.body;

  if (!name || !description || !price || !category) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Name, description, price, and category are required'
    });
  }

  const newProduct = {
    id: generateId(),
    name,
    description,
    price: parseFloat(price),
    category,
    stock: stock || 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  products.push(newProduct);

  res.status(201).json({
    message: 'Product created successfully',
    product: newProduct
  });
});

// V1: GET /api/v1/products - Get all products
app.get('/api/v1/products', (req, res) => {
  res.status(200).json({
    count: products.length,
    products: products
  });
});

// V1: GET /api/v1/products/:id - Get a product by ID
app.get('/api/v1/products/:id', (req, res) => {
  const product = findProductById(req.params.id);

  if (!product) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Product with ID ${req.params.id} does not exist`
    });
  }

  res.status(200).json(product);
});

// V1: PUT /api/v1/products/:id - Update a product
app.put('/api/v1/products/:id', (req, res) => {
  const product = findProductById(req.params.id);

  if (!product) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Product with ID ${req.params.id} does not exist`
    });
  }

  const { name, description, price, category, stock } = req.body;

  if (!name || !description || !price || !category) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Name, description, price, and category are required'
    });
  }

  product.name = name;
  product.description = description;
  product.price = parseFloat(price);
  product.category = category;
  product.stock = stock || 0;
  product.updatedAt = new Date();

  res.status(200).json({
    message: 'Product updated successfully',
    product: product
  });
});

// V1: DELETE /api/v1/products/:id - Delete a product
app.delete('/api/v1/products/:id', (req, res) => {
  const index = products.findIndex(product => product.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Product with ID ${req.params.id} does not exist`
    });
  }

  const deletedProduct = products.splice(index, 1)[0];

  res.status(200).json({
    message: 'Product deleted successfully',
    product: deletedProduct
  });
});

// ============================================
// === V2 ROUTES (Enhanced Features) ===
// ============================================

// V2: POST /api/v2/products - Create a product
app.post('/api/v2/products', (req, res) => {
  const { name, description, price, category, stock } = req.body;

  if (!name || !description || !price || !category) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Name, description, price, and category are required'
    });
  }

  const newProduct = {
    id: generateId(),
    name,
    description,
    price: parseFloat(price),
    category,
    stock: stock || 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  products.push(newProduct);

  res.status(201).json({
    message: 'Product created successfully',
    product: newProduct
  });
});

// V2: GET /api/v2/products - Get all products with enhanced features
app.get('/api/v2/products', (req, res) => {
  const { limit, offset, filter, sort, fields, expand } = req.query;

  let result = [...products];

  // Filtering
  if (filter) {
    const filterObj = JSON.parse(filter);
    result = result.filter(product => {
      return Object.keys(filterObj).every(key => {
        return product[key] === filterObj[key];
      });
    });
  }

  // Sorting
  if (sort) {
    const [field, order] = sort.split(',');
    result.sort((a, b) => {
      if (order === 'desc') {
        return b[field] > a[field] ? 1 : -1;
      }
      return a[field] > b[field] ? 1 : -1;
    });
  }

  // Metadata
  const total = result.length;
  const offsetNum = offset ? parseInt(offset) : 0;
  const limitNum = limit ? parseInt(limit) : total;

  // Pagination
  result = result.slice(offsetNum, offsetNum + limitNum);

  // Field selection
  if (fields) {
    const selectedFields = fields.split(',');
    result = result.map(product => {
      const selected = {};
      selectedFields.forEach(field => {
        if (product[field] !== undefined) {
          selected[field] = product[field];
        }
      });
      return selected;
    });
  }

  // Expand (include related resources - simplified for this example)
  if (expand === 'category') {
    const categories = [...new Set(products.map(p => p.category))];
    result = result.map(product => ({
      ...product,
      categoryInfo: {
        name: product.category,
        count: products.filter(p => p.category === product.category).length
      }
    }));
  }

  res.status(200).json({
    count: result.length,
    total: total,
    limit: limitNum,
    offset: offsetNum,
    products: result
  });
});

// V2: GET /api/v2/products/:id - Get a product by ID with expand
app.get('/api/v2/products/:id', (req, res) => {
  const { expand } = req.query;
  const product = findProductById(req.params.id);

  if (!product) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Product with ID ${req.params.id} does not exist`
    });
  }

  let result = { ...product };

  // Expand
  if (expand === 'category') {
    const categoryProducts = products.filter(p => p.category === product.category);
    result.categoryInfo = {
      name: product.category,
      count: categoryProducts.length,
      products: categoryProducts.map(p => ({ id: p.id, name: p.name }))
    };
  }

  res.status(200).json(result);
});

// V2: PUT /api/v2/products/:id - Update a product
app.put('/api/v2/products/:id', (req, res) => {
  const product = findProductById(req.params.id);

  if (!product) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Product with ID ${req.params.id} does not exist`
    });
  }

  const { name, description, price, category, stock } = req.body;

  if (!name || !description || !price || !category) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Name, description, price, and category are required'
    });
  }

  product.name = name;
  product.description = description;
  product.price = parseFloat(price);
  product.category = category;
  product.stock = stock || 0;
  product.updatedAt = new Date();

  res.status(200).json({
    message: 'Product updated successfully',
    product: product
  });
});

// V2: DELETE /api/v2/products/:id - Delete a product
app.delete('/api/v2/products/:id', (req, res) => {
  const index = products.findIndex(product => product.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Product with ID ${req.params.id} does not exist`
    });
  }

  const deletedProduct = products.splice(index, 1)[0];

  res.status(200).json({
    message: 'Product deleted successfully',
    product: deletedProduct
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Versioned REST API',
    versions: {
      v1: '/api/v1/products (Basic CRUD)',
      v2: '/api/v2/products (Enhanced with pagination, filtering, sorting, field selection, expand)'
    },
    documentation: '/api-docs'
  });
});

// Documentation endpoint
app.get('/api-docs', (req, res) => {
  res.json({
    message: 'OpenAPI specification available at /openapi.yaml or /openapi.json'
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Versioned REST API Server is running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  V1:`);
  console.log(`    POST   /api/v1/products`);
  console.log(`    GET    /api/v1/products`);
  console.log(`    GET    /api/v1/products/:id`);
  console.log(`    PUT    /api/v1/products/:id`);
  console.log(`    DELETE /api/v1/products/:id`);
  console.log(`  V2 (Enhanced):`);
  console.log(`    POST   /api/v2/products`);
  console.log(`    GET    /api/v2/products?limit=10&offset=0&filter={"category":"Electronics"}&sort=price,asc&fields=id,name,price&expand=category`);
  console.log(`    GET    /api/v2/products/:id?expand=category`);
  console.log(`    PUT    /api/v2/products/:id`);
  console.log(`    DELETE /api/v2/products/:id`);
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
//    # V1 - Basic CRUD
//    curl http://localhost:3000/api/v1/products
//    curl http://localhost:3000/api/v1/products/1
//
//    # V2 - Enhanced features
//    # Pagination
//    curl http://localhost:3000/api/v2/products?limit=2&offset=0
//
//    # Filtering
//    curl "http://localhost:3000/api/v2/products?filter={\"category\":\"Electronics\"}"
//
//    # Sorting
//    curl http://localhost:3000/api/v2/products?sort=price,asc
//    curl http://localhost:3000/api/v2/products?sort=price,desc
//
//    # Field selection
//    curl http://localhost:3000/api/v2/products?fields=id,name,price
//
//    # Expand
//    curl http://localhost:3000/api/v2/products?expand=category
//    curl http://localhost:3000/api/v2/products/1?expand=category

// === OPENAPI SPECIFICATION (YAML FORMAT) ===
// Save this as openapi.yaml

/*
openapi: 3.0.0
info:
  title: Products API
  version: 2.0.0
  description: A versioned REST API for managing products with enhanced features in v2

servers:
  - url: http://localhost:3000
    description: Development server

paths:
  /api/v1/products:
    get:
      summary: Get all products (v1)
      operationId: getProductsV1
      tags:
        - Products V1
      responses:
        '200':
          description: List of products
          content:
            application/json:
              schema:
                type: object
                properties:
                  count:
                    type: integer
                  products:
                    type: array
                    items:
                      $ref: '#/components/schemas/Product'
    post:
      summary: Create a product (v1)
      operationId: createProductV1
      tags:
        - Products V1
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductInput'
      responses:
        '201':
          description: Product created
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  product:
                    $ref: '#/components/schemas/Product'
        '400':
          description: Bad request

  /api/v1/products/{id}:
    get:
      summary: Get a product by ID (v1)
      operationId: getProductByIdV1
      tags:
        - Products V1
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Product found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '404':
          description: Product not found
    put:
      summary: Update a product (v1)
      operationId: updateProductV1
      tags:
        - Products V1
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductInput'
      responses:
        '200':
          description: Product updated
        '404':
          description: Product not found
    delete:
      summary: Delete a product (v1)
      operationId: deleteProductV1
      tags:
        - Products V1
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Product deleted
        '404':
          description: Product not found

  /api/v2/products:
    get:
      summary: Get all products with enhanced features (v2)
      operationId: getProductsV2
      tags:
        - Products V2
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
        - name: filter
          in: query
          schema:
            type: string
          description: JSON string for filtering (e.g., {"category":"Electronics"})
        - name: sort
          in: query
          schema:
            type: string
          description: Sort by field with order (e.g., price,asc)
        - name: fields
          in: query
          schema:
            type: string
          description: Comma-separated field names to return
        - name: expand
          in: query
          schema:
            type: string
          enum: [category]
          description: Expand related resources
      responses:
        '200':
          description: List of products with metadata
          content:
            application/json:
              schema:
                type: object
                properties:
                  count:
                    type: integer
                  total:
                    type: integer
                  limit:
                    type: integer
                  offset:
                    type: integer
                  products:
                    type: array
                    items:
                      $ref: '#/components/schemas/Product'
    post:
      summary: Create a product (v2)
      operationId: createProductV2
      tags:
        - Products V2
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductInput'
      responses:
        '201':
          description: Product created
        '400':
          description: Bad request

  /api/v2/products/{id}:
    get:
      summary: Get a product by ID with expand (v2)
      operationId: getProductByIdV2
      tags:
        - Products V2
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
        - name: expand
          in: query
          schema:
            type: string
          enum: [category]
      responses:
        '200':
          description: Product found
        '404':
          description: Product not found
    put:
      summary: Update a product (v2)
      operationId: updateProductV2
      tags:
        - Products V2
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductInput'
      responses:
        '200':
          description: Product updated
        '404':
          description: Product not found
    delete:
      summary: Delete a product (v2)
      operationId: deleteProductV2
      tags:
        - Products V2
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Product deleted
        '404':
          description: Product not found

components:
  schemas:
    Product:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        description:
          type: string
        price:
          type: number
          format: float
        category:
          type: string
        stock:
          type: integer
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    ProductInput:
      type: object
      required:
        - name
        - description
        - price
        - category
      properties:
        name:
          type: string
        description:
          type: string
        price:
          type: number
          format: float
        category:
          type: string
        stock:
          type: integer
*/

// === OPENAPI SPECIFICATION (JSON FORMAT) ===
// Save this as openapi.json

/*
{
  "openapi": "3.0.0",
  "info": {
    "title": "Products API",
    "version": "2.0.0",
    "description": "A versioned REST API for managing products with enhanced features in v2"
  },
  "servers": [
    {
      "url": "http://localhost:3000",
      "description": "Development server"
    }
  ],
  "paths": {
    "/api/v1/products": {
      "get": {
        "summary": "Get all products (v1)",
        "operationId": "getProductsV1",
        "tags": ["Products V1"],
        "responses": {
          "200": {
            "description": "List of products",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "count": { "type": "integer" },
                    "products": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/Product" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "summary": "Create a product (v1)",
        "operationId": "createProductV1",
        "tags": ["Products V1"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ProductInput" }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Product created"
          },
          "400": {
            "description": "Bad request"
          }
        }
      }
    },
    "/api/v1/products/{id}": {
      "get": {
        "summary": "Get a product by ID (v1)",
        "operationId": "getProductByIdV1",
        "tags": ["Products V1"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "integer" }
          }
        ],
        "responses": {
          "200": {
            "description": "Product found",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/Product" }
              }
            }
          },
          "404": {
            "description": "Product not found"
          }
        }
      },
      "put": {
        "summary": "Update a product (v1)",
        "operationId": "updateProductV1",
        "tags": ["Products V1"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "integer" }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ProductInput" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Product updated"
          },
          "404": {
            "description": "Product not found"
          }
        }
      },
      "delete": {
        "summary": "Delete a product (v1)",
        "operationId": "deleteProductV1",
        "tags": ["Products V1"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "integer" }
          }
        ],
        "responses": {
          "200": {
            "description": "Product deleted"
          },
          "404": {
            "description": "Product not found"
          }
        }
      }
    },
    "/api/v2/products": {
      "get": {
        "summary": "Get all products with enhanced features (v2)",
        "operationId": "getProductsV2",
        "tags": ["Products V2"],
        "parameters": [
          {
            "name": "limit",
            "in": "query",
            "schema": { "type": "integer", "default": 10 }
          },
          {
            "name": "offset",
            "in": "query",
            "schema": { "type": "integer", "default": 0 }
          },
          {
            "name": "filter",
            "in": "query",
            "schema": { "type": "string" },
            "description": "JSON string for filtering"
          },
          {
            "name": "sort",
            "in": "query",
            "schema": { "type": "string" },
            "description": "Sort by field with order"
          },
          {
            "name": "fields",
            "in": "query",
            "schema": { "type": "string" },
            "description": "Comma-separated field names"
          },
          {
            "name": "expand",
            "in": "query",
            "schema": { "type": "string", "enum": ["category"] },
            "description": "Expand related resources"
          }
        ],
        "responses": {
          "200": {
            "description": "List of products with metadata"
          }
        }
      },
      "post": {
        "summary": "Create a product (v2)",
        "operationId": "createProductV2",
        "tags": ["Products V2"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ProductInput" }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Product created"
          },
          "400": {
            "description": "Bad request"
          }
        }
      }
    },
    "/api/v2/products/{id}": {
      "get": {
        "summary": "Get a product by ID with expand (v2)",
        "operationId": "getProductByIdV2",
        "tags": ["Products V2"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "integer" }
          },
          {
            "name": "expand",
            "in": "query",
            "schema": { "type": "string", "enum": ["category"] }
          }
        ],
        "responses": {
          "200": {
            "description": "Product found"
          },
          "404": {
            "description": "Product not found"
          }
        }
      },
      "put": {
        "summary": "Update a product (v2)",
        "operationId": "updateProductV2",
        "tags": ["Products V2"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "integer" }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ProductInput" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Product updated"
          },
          "404": {
            "description": "Product not found"
          }
        }
      },
      "delete": {
        "summary": "Delete a product (v2)",
        "operationId": "deleteProductV2",
        "tags": ["Products V2"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "integer" }
          }
        ],
        "responses": {
          "200": {
            "description": "Product deleted"
          },
          "404": {
            "description": "Product not found"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Product": {
        "type": "object",
        "properties": {
          "id": { "type": "integer" },
          "name": { "type": "string" },
          "description": { "type": "string" },
          "price": { "type": "number", "format": "float" },
          "category": { "type": "string" },
          "stock": { "type": "integer" },
          "createdAt": { "type": "string", "format": "date-time" },
          "updatedAt": { "type": "string", "format": "date-time" }
        }
      },
      "ProductInput": {
        "type": "object",
        "required": ["name", "description", "price", "category"],
        "properties": {
          "name": { "type": "string" },
          "description": { "type": "string" },
          "price": { "type": "number", "format": "float" },
          "category": { "type": "string" },
          "stock": { "type": "integer" }
        }
      }
    }
  }
}
*/

// === API VERSIONING STRATEGY EXPLANATION ===

// 1. URL Path Versioning:
//    - /api/v1/resources for version 1
//    - /api/v2/resources for version 2
//    - Clear and explicit version in URL
//    - Easy to route to different implementations
//
// 2. Backward Compatibility:
//    - v1 remains functional and unchanged
//    - v2 adds new features without breaking v1
//    - Clients can migrate at their own pace
//
// 3. Enhanced Features in v2:
//    - Pagination: limit and offset query parameters
//    - Filtering: filter by field values (JSON format)
//    - Sorting: sort by field with ascending/descending
//    - Field Selection: select specific fields to return
//    - Expand: include related resources (category info)
//
// 4. Response Standards:
//    - Consistent format across all endpoints
//    - Metadata in list responses (count, total, limit, offset)
//    - Standardized error responses
//    - Content-Type header set to application/json
//
// 5. OpenAPI Specification:
//    - Documents all endpoints for both v1 and v2
//    - Includes request/response schemas
//    - Documents query parameters and their types
//    - Provides example usage
//    - Can be used with Swagger UI for interactive documentation
//
// 6. Benefits:
//    - Clear API evolution path
//    - Clients can choose which version to use
//    - Documentation ensures consistency
//    - Versioning allows breaking changes without affecting existing clients
