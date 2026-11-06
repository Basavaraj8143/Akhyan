// SSG Reference Solution: Implement a Simple Static Site Generator
// Build script that reads content files and generates static HTML

const fs = require('fs');
const path = require('path');

// ============================================
// === CONFIGURATION ===
// ============================================

const CONTENT_DIR = path.join(__dirname, 'content');
const TEMPLATES_DIR = path.join(__dirname, 'templates');
const DIST_DIR = path.join(__dirname, 'dist');

// ============================================
// === CONTENT FILES (in-memory for demo) ===
// ============================================

const contentFiles = {
  'home.md': `---
title: Home
date: 2024-01-15
author: John Doe
---

Welcome to My Static Site

This is a simple static site generator built with Node.js. It reads markdown files, processes them, and generates static HTML files.

## Features

- Server-side generation at build time
- Markdown to HTML conversion
- Automatic navigation generation
- Fast static file serving
- SEO-friendly output
`,

  'about.md': `---
title: About
date: 2024-01-20
author: Jane Smith
---

About This Site

This site is generated using a custom static site generator. The generator processes markdown files and produces static HTML that can be deployed to any static hosting service.

## How It Works

1. Read content files from the content directory
2. Parse frontmatter (metadata) and markdown content
3. Convert markdown to HTML
4. Apply HTML template
5. Generate static HTML files in the dist directory
6. Deploy to static hosting (Netlify, Vercel, GitHub Pages)
`,

  'posts/post1.md': `---
title: Getting Started with Static Site Generators
date: 2024-01-25
author: Bob Johnson
---

Getting Started with Static Site Generators

Static site generators are tools that build static HTML files from templates and content. They offer excellent performance, security, and SEO benefits.

## Why Use a Static Site Generator?

- Performance: Pre-generated files serve instantly
- Security: No server-side code execution
- Cost: Free hosting on CDNs
- SEO: Fully rendered HTML for search engines
- Simplicity: Easy to deploy and maintain

## Popular Static Site Generators

- Next.js (SSG mode)
- Gatsby
- Hugo
- Jekyll
- Astro
`,

  'posts/post2.md': `---
title: Markdown for Content
date: 2024-01-30
author: Alice Williams
---

Markdown for Content

Markdown is a lightweight markup language that allows you to write formatted text in plain text editors. It's perfect for static site content.

## Markdown Basics

- **Bold text** with asterisks
- *Italic text* with underscores
- # Headings with hash symbols
- - Lists with dashes
- \`Code\` with backticks

## Why Markdown?

- Easy to write and read
- Converts to HTML easily
- Portable across platforms
- Supports code blocks, tables, and more
- Version control friendly
`
};

// ============================================
// === HTML TEMPLATE ===
// ============================================

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
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
    .post-meta {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    code {
      background-color: #f4f4f4;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-family: monospace;
    }
    pre {
      background-color: #f4f4f4;
      padding: 1rem;
      border-radius: 5px;
      overflow-x: auto;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <nav>
        <h1>Static Site</h1>
        <ul>
          {{navigation}}
        </ul>
      </nav>
    </div>
  </header>
  <main>
    <div class="container-main">
      <h1>{{title}}</h1>
      <div class="post-meta">
        By {{author}} on {{date}}
      </div>
      <div class="content">
        {{content}}
      </div>
    </div>
  </main>
  <footer>
    <div class="container">
      <p>&copy; 2024 Static Site. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;

// ============================================
// === HELPER FUNCTIONS ===
// ============================================

// Parse frontmatter from markdown file
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  
  const frontmatterLines = match[1].split('\n');
  const frontmatter = {};
  
  frontmatterLines.forEach(line => {
    const [key, value] = line.split(':').map(s => s.trim());
    if (key && value) {
      frontmatter[key] = value.replace(/^["']|["']$/g, '');
    }
  });
  
  return { frontmatter, body: match[2] };
}

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Lists
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre>)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');
  
  return html;
}

// Generate navigation links
function generateNavigation(contentFiles) {
  const navItems = [];
  
  Object.keys(contentFiles).forEach(filePath => {
    const content = contentFiles[filePath];
    const { frontmatter } = parseFrontmatter(content);
    
    if (frontmatter.title) {
      const url = filePath.replace('.md', '.html');
      navItems.push(`<li><a href="/${url}">${frontmatter.title}</a></li>`);
    }
  });
  
  return navItems.join('');
}

// ============================================
// === BUILD PROCESS ===
// ============================================

function build() {
  console.log('🚀 Starting build process...\n');
  
  // Clear dist directory
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
    console.log('🗑️  Cleared dist directory');
  }
  
  // Create dist directory
  fs.mkdirSync(DIST_DIR, { recursive: true });
  console.log('📁 Created dist directory\n');
  
  // Generate navigation
  const navigation = generateNavigation(contentFiles);
  console.log('🔗 Generated navigation\n');
  
  // Process each content file
  let fileCount = 0;
  
  Object.keys(contentFiles).forEach(filePath => {
    const content = contentFiles[filePath];
    const { frontmatter, body } = parseFrontmatter(content);
    
    // Convert markdown to HTML
    const htmlContent = markdownToHtml(body);
    
    // Replace template placeholders
    let html = htmlTemplate;
    html = html.replace(/{{title}}/g, frontmatter.title || 'Untitled');
    html = html.replace(/{{author}}/g, frontmatter.author || 'Unknown');
    html = html.replace(/{{date}}/g, frontmatter.date || new Date().toISOString().split('T')[0]);
    html = html.replace(/{{content}}/g, htmlContent);
    html = html.replace(/{{navigation}}/g, navigation);
    
    // Determine output path
    const outputPath = path.join(DIST_DIR, filePath.replace('.md', '.html'));
    const outputDir = path.dirname(outputPath);
    
    // Create subdirectories if needed
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write HTML file
    fs.writeFileSync(outputPath, html);
    console.log(`✅ Generated: ${filePath.replace('.md', '.html')}`);
    
    fileCount++;
  });
  
  console.log(`\n✨ Build complete! Generated ${fileCount} file(s) in dist directory.`);
  console.log(`📂 Output directory: ${DIST_DIR}`);
}

// Run build
build();

// ============================================
// === HOW TO RUN ===
// ============================================

// 1. Save this code as build.js

// 2. Run the build script:
//    node build.js

// 3. The static HTML files will be generated in the dist directory

// 4. To serve the static files, you can use any static file server:
//    npx serve dist
//    or
//    python -m http.server 8000 --directory dist

// 5. Open your browser and visit:
//    http://localhost:3000/home.html
//    http://localhost:3000/about.html
//    http://localhost:3000/posts/post1.html
//    http://localhost:3000/posts/post2.html

// 6. To deploy to static hosting:
//    - Netlify: Drag and drop the dist folder
//    - Vercel: vercel deploy dist
//    - GitHub Pages: Push dist folder to gh-pages branch

// ============================================
// === DIRECTORY STRUCTURE ===
// ============================================

// /project-root
//   ├── build.js (this file)
//   ├── content/
//   │   ├── home.md
//   │   ├── about.md
//   │   └── posts/
//   │       ├── post1.md
//   │       └── post2.md
//   ├── templates/
//   │   └── layout.html (optional, can use inline template)
//   └── dist/
//       ├── home.html (generated)
//       ├── about.html (generated)
//       └── posts/
//           ├── post1.html (generated)
//           └── post2.html (generated)
