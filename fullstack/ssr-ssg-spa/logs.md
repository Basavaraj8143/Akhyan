# Work Log – SSR / SSG / SPA Node

**Domain:** Web Development
**Node:** SSR / SSG / SPA
**Status:** Projects completed with specifications and reference implementations

## 1. Accessible – Understand SSR vs SSG vs SPA

**Objective:** Explain the differences and when to use each rendering approach.

**Work completed:**
- Designed a comprehensive comparison exercise for SSR, SSG, and SPA.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria covering definitions and rendering process, advantages and disadvantages, use cases and technology examples, and comparison table.
- Prepared a reference implementation with:

  **Definitions**
  - SSR: Server-Side Rendering - server generates complete HTML per request
  - SSG: Static Site Generation - HTML pre-generated at build time
  - SPA: Single-Page Application - rendering happens on client with JavaScript
  - Detailed explanation of how each approach renders content
  - Comparison of when rendering happens for each approach

  **Rendering Process Comparison**
  - Rendering location: server, build process, client
  - When rendering happens: request time, build time, runtime
  - Initial content: fully rendered, pre-rendered, minimal shell
  - Subsequent navigation: server renders, serves pre-rendered, JS updates DOM
  - Data fetching: per request, once at build, on demand

  **Advantages and Disadvantages**
  - SSR advantages: SEO friendly, fast initial load, no JS required, better performance on low-end devices
  - SSR disadvantages: server load, slower TTFB, complex deployment, limited caching
  - SSG advantages: best performance, no server load, excellent SEO, easy deployment, high security, low cost
  - SSG disadvantages: build time, limited dynamic content, requires rebuild, not suitable for real-time
  - SPA advantages: excellent UX, high interactivity, separation of concerns, easy deployment, client-side caching
  - SPA disadvantages: poor SEO, slow initial load, requires JS, large bundle size, client-side complexity

  **Use Cases**
  - SSR best for: e-commerce platforms, content-heavy websites, public-facing marketing sites
  - SSG best for: documentation sites, personal blogs, marketing sites
  - SPA best for: web applications, admin dashboards, social media applications
  - Detailed explanations for why each approach fits the use case

  **Technology Examples**
  - SSR: Next.js SSR, Nuxt.js, Angular Universal, Ruby on Rails, Django
  - SSG: Next.js SSG, Gatsby, Hugo, Jekyll, Astro
  - SPA: React, Vue.js, Angular, Svelte, Ember.js

  **Comparison Table**
  - Comprehensive table with rows for: rendering location, initial load time, SEO, caching, server load, interactivity, deployment complexity, dynamic content, use cases, examples

## 2. Core – Implement a Simple SSR App

**Objective:** Build a basic server-rendered page.

**Work completed:**
- Designed an SSR implementation exercise using Express.js and EJS.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for Express server and template engine setup, home page with dynamic data, dynamic post page with data handling, and shared layout and about page.
- Prepared a reference implementation with:

  **Express Server Setup**
  - Express.js server configuration
  - EJS template engine setup
  - Views directory configuration
  - Static file serving (CSS, images)
  - Server listening on port 3000

  **In-Memory Data Store**
  - Sample posts array with 3 posts
  - Each post has: id, title, content, author, date
  - Used for dynamic page rendering

  **Routes**
  - GET / - Home page with dynamic data (userCount, currentDate, recentPosts)
  - GET /about - About page with features list
  - GET /posts/:id - Dynamic post page with 404 handling
  - 404 handler for missing pages

  **Template System (EJS)**
  - Shared layout template (layout.ejs) with header, navigation, footer
  - CSS styling in template (responsive design)
  - Home page template (home.ejs) with dynamic content
  - About page template (about.ejs) with features list
  - Post page template (post.ejs) with post content
  - 404 page template (404.ejs) with error message
  - Template includes and dynamic data injection

  **Data Handling**
  - In-memory data store for posts
  - Dynamic data injection using EJS syntax
  - 404 handling for missing posts
  - Navigation links to all pages

  **Documentation**
  - Complete setup instructions
  - Dependency installation guide
  - Directory structure explanation
  - How to run guide
  - Example URLs for testing

## 3. Stretch – Implement a Simple SSG App

**Objective:** Build a static site generator.

**Work completed:**
- Designed a static site generator exercise using Node.js.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for content structure and parsing, template system, page generation, and build process and directory structure.
- Prepared a reference implementation with:

  **Content Structure**
  - Content files in markdown format with frontmatter
  - Frontmatter includes: title, date, author
  - 4 content files: home.md, about.md, posts/post1.md, posts/post2.md
  - Markdown content with headers, lists, code blocks

  **Generator Implementation**
  - Build script (build.js) for generating static HTML
  - Frontmatter parser (extracts metadata from markdown)
  - Simple markdown to HTML converter
  - Content file reading and processing
  - HTML template with placeholders

  **Template System**
  - HTML template with shared layout (header, navigation, footer)
  - Placeholder syntax: {{title}}, {{content}}, {{navigation}}, {{author}}, {{date}}
  - CSS styling for responsive design
  - Navigation placeholder for auto-generated links

  **Page Generation**
  - Processes each content file
  - Parses frontmatter and markdown content
  - Converts markdown to HTML
  - Replaces template placeholders with content
  - Generates navigation links automatically
  - Outputs HTML files to dist directory
  - Creates subdirectories as needed

  **Build Process**
  - Clears dist directory before building
  - Creates dist directory
  - Generates navigation from content files
  - Logs progress for each generated file
  - Reports total files generated
  - Runnable with `node build.js`

  **Helper Functions**
  - parseFrontmatter: Extracts metadata from markdown files
  - markdownToHtml: Simple markdown to HTML converter (headers, bold, italic, code, lists, links)
  - generateNavigation: Auto-generates navigation links from content files

  **Directory Structure**
  - /content - Source content files
  - /templates - HTML template (optional, can use inline)
  - /dist - Generated static HTML files
  - build.js - Build script

  **Documentation**
  - Complete build process explanation
  - How to run guide
  - Directory structure documentation
  - Deployment instructions (Netlify, Vercel, GitHub Pages)
  - Static file serving instructions
  - Example URLs for testing

## Overall Summary

| Difficulty | Project | Status |
|---|---|---|
| Accessible | Understand SSR vs SSG vs SPA | Completed |
| Core | Implement a Simple SSR App | Completed |
| Stretch | Implement a Simple SSG App | Completed |

**Deliverables prepared:**
- 3 project specifications (`project.json`)
- 3 reference implementations (`.md`, `.js` files)
- Evaluation rubrics for all three projects
- Valid alternatives and mistakes-to-check lists
- Complete comparison documentation
- Working SSR application with EJS
- Working static site generator

**Key SSR / SSG / SPA concepts covered:**
- Server-Side Rendering (SSR) definition and process
- Static Site Generation (SSG) definition and process
- Single-Page Application (SPA) definition and process
- Rendering location and timing comparison
- Advantages and disadvantages of each approach
- SEO implications for each approach
- Performance characteristics
- Use cases for each approach
- Technology stacks for each approach
- Express.js with EJS for SSR
- Template engines (EJS)
- Frontmatter parsing
- Markdown to HTML conversion
- Static site generation build process
- Template placeholder replacement
- Automatic navigation generation
- Directory structure for static sites
- Deployment to static hosting
- Build-time vs runtime rendering
- Client-side vs server-side rendering
- Hydration for SSR/SSG
- Caching strategies
- Content management for static sites

**Next step:** Technical review, execution testing, and verification of all reference implementations before final submission.
