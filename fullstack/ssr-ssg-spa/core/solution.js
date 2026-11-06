// SSR Reference Solution: Implement a Simple SSR App
// Server-side rendered web application with Express and EJS

const express = require('express');
const app = express();

// Configure EJS template engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Serve static files (CSS, images)
app.use(express.static('public'));

// ============================================
// === IN-MEMORY DATA STORE ===
// ============================================

const posts = [
  {
    id: 1,
    title: 'Getting Started with Server-Side Rendering',
    content: 'Server-Side Rendering (SSR) is a technique where the server generates the complete HTML for a page...',
    author: 'John Doe',
    date: '2024-01-15'
  },
  {
    id: 2,
    title: 'Why Choose Express.js for SSR',
    content: 'Express.js is a minimal and flexible Node.js web application framework that provides robust features...',
    author: 'Jane Smith',
    date: '2024-01-20'
  },
  {
    id: 3,
    title: 'EJS Template Engine Basics',
    content: 'EJS (Embedded JavaScript templating) is a simple templating language that lets you generate HTML markup...',
    author: 'Bob Johnson',
    date: '2024-01-25'
  }
];

// ============================================
// === ROUTES ===
// ============================================

// Home page
app.get('/', (req, res) => {
  const data = {
    title: 'Home',
    userCount: 150,
    currentDate: new Date().toLocaleDateString(),
    recentPosts: posts.slice(0, 3)
  };
  res.render('home', data);
});

// About page
app.get('/about', (req, res) => {
  const data = {
    title: 'About',
    description: 'This is a simple server-side rendered application built with Express.js and EJS.',
    features: [
      'Server-side rendering with Express.js',
      'EJS template engine for dynamic content',
      'Responsive design with CSS',
      'Fast initial page load',
      'SEO-friendly structure'
    ]
  };
  res.render('about', data);
});

// Post page
app.get('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).render('404', { title: '404 - Not Found' });
  }
  
  res.render('post', { title: post.title, post });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Not Found' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`SSR Server is running on http://localhost:${PORT}`);
});

// ============================================
// === TEMPLATES (EJS) ===
// ============================================

// === FILE: views/layout.ejs ===
/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %></title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      background-color: #f4f4f4;
    }
    header {
      background-color: #333;
      color: #fff;
      padding: 1rem 0;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 20px;
    }
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    nav ul {
      list-style: none;
      display: flex;
    }
    nav ul li {
      margin-left: 20px;
    }
    nav a {
      color: #fff;
      text-decoration: none;
    }
    nav a:hover {
      text-decoration: underline;
    }
    main {
      padding: 2rem 0;
      background-color: #fff;
      margin: 20px auto;
      max-width: 800px;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .container-main {
      padding: 0 20px;
    }
    footer {
      text-align: center;
      padding: 1rem 0;
      background-color: #333;
      color: #fff;
      margin-top: 20px;
    }
    h1 {
      color: #333;
      margin-bottom: 1rem;
    }
    h2 {
      color: #555;
      margin-bottom: 0.5rem;
    }
    p {
      margin-bottom: 1rem;
    }
    .post-card {
      border: 1px solid #ddd;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 5px;
    }
    .post-meta {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
    .btn {
      display: inline-block;
      padding: 0.5rem 1rem;
      background-color: #007bff;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
      margin-right: 0.5rem;
    }
    .btn:hover {
      background-color: #0056b3;
    }
    ul {
      margin-left: 20px;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <nav>
        <h1>SSR App</h1>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    </div>
  </header>
  <main>
    <div class="container-main">
      <%- body %>
    </div>
  </main>
  <footer>
    <div class="container">
      <p>&copy; 2024 SSR App. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>
*/

// === FILE: views/home.ejs ===
/*
<%- include('layout', { body: `
  <h1>Welcome to SSR App</h1>
  <p>This is a server-side rendered application built with Express.js and EJS.</p>
  
  <h2>Quick Stats</h2>
  <ul>
    <li>Total Users: <strong><%= userCount %></strong></li>
    <li>Current Date: <strong><%= currentDate %></strong></li>
    <li>Total Posts: <strong><%= recentPosts.length %></strong></li>
  </ul>
  
  <h2>Recent Posts</h2>
  <% recentPosts.forEach(post => { %>
    <div class="post-card">
      <h3><%= post.title %></h3>
      <div class="post-meta">
        By <%= post.author %> on <%= post.date %>
      </div>
      <p><%= post.content.substring(0, 100) %>...</p>
      <a href="/posts/<%= post.id %>" class="btn">Read More</a>
    </div>
  <% }); %>
` }) %>
*/

// === FILE: views/about.ejs ===
/*
<%- include('layout', { body: `
  <h1>About This App</h1>
  <p><%= description %></p>
  
  <h2>Features</h2>
  <ul>
    <% features.forEach(feature => { %>
      <li><%= feature %></li>
    <% }); %>
  </ul>
  
  <h2>Technology Stack</h2>
  <ul>
    <li>Node.js - JavaScript runtime</li>
    <li>Express.js - Web framework</li>
    <li>EJS - Template engine</li>
    <li>CSS - Styling</li>
  </ul>
` }) %>
*/

// === FILE: views/post.ejs ===
/*
<%- include('layout', { body: `
  <h1><%= post.title %></h1>
  <div class="post-meta">
    By <%= post.author %> on <%= post.date %>
  </div>
  <p><%= post.content %></p>
  
  <a href="/" class="btn">Back to Home</a>
` }) %>
*/

// === FILE: views/404.ejs ===
/*
<%- include('layout', { body: `
  <h1>404 - Page Not Found</h1>
  <p>Sorry, the page you are looking for does not exist.</p>
  <a href="/" class="btn">Back to Home</a>
` }) %>
*/

// ============================================
// === HOW TO RUN ===
// ============================================

// 1. Initialize a new Node.js project:
//    npm init -y

// 2. Install dependencies:
//    npm install express ejs

// 3. Create directory structure:
//    /views - Place template files here
//    /public - Place static files (CSS, images) here

// 4. Save this code as server.js

// 5. Create the template files (layout.ejs, home.ejs, about.ejs, post.ejs, 404.ejs) in the /views directory
//    Use the template code provided in comments above

// 6. Run the server:
//    node server.js

// 7. Open your browser and visit:
//    http://localhost:3000/ - Home page
//    http://localhost:3000/about - About page
//    http://localhost:3000/posts/1 - Post page
//    http://localhost:3000/posts/999 - 404 page
