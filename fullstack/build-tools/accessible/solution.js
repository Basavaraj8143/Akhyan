// Build Tools Reference Solution: Set up Vite
// This solution demonstrates scaffolding and configuring a project with Vite

// === FILE: vite.config.js ===
import { defineConfig } from 'vite';

export default defineConfig({
  // Server configuration
  server: {
    port: 3000,              // Custom port instead of default 5173
    open: true,              // Automatically open browser on server start
    host: true               // Listen on all addresses (useful for network access)
  },

  // Build configuration
  build: {
    outDir: 'dist',          // Output directory for production builds
    sourcemap: true,         // Generate source maps for debugging
    minify: 'terser',        // Minification tool (terser or esbuild)
    rollupOptions: {
      output: {
        manualChunks: undefined  // No manual chunking for this simple project
      }
    }
  },

  // Other configuration options
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0')  // Define global constants
  }
});

// === FILE: src/main.js ===
import './style.css';
import { createCounter } from './counter.js';

// Initialize the counter component
document.addEventListener('DOMContentLoaded', () => {
  const counterContainer = document.getElementById('app');
  const counter = createCounter();
  counterContainer.appendChild(counter);
});

// === FILE: src/counter.js ===
export function createCounter() {
  const container = document.createElement('div');
  container.className = 'counter';

  const countDisplay = document.createElement('div');
  countDisplay.className = 'count';
  countDisplay.textContent = '0';

  const incrementButton = document.createElement('button');
  incrementButton.textContent = 'Increment';
  incrementButton.className = 'button';

  const decrementButton = document.createElement('button');
  decrementButton.textContent = 'Decrement';
  decrementButton.className = 'button';

  let count = 0;

  incrementButton.addEventListener('click', () => {
    count++;
    countDisplay.textContent = count;
  });

  decrementButton.addEventListener('click', () => {
    if (count > 0) {
      count--;
      countDisplay.textContent = count;
    }
  });

  container.appendChild(countDisplay);
  container.appendChild(incrementButton);
  container.appendChild(decrementButton);

  return container;
}

// === FILE: src/style.css ===
body {
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

#app {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.counter {
  text-align: center;
}

.count {
  font-size: 48px;
  font-weight: bold;
  margin: 20px 0;
  color: #333;
}

.button {
  padding: 12px 24px;
  margin: 0 8px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #667eea;
  color: white;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #5568d3;
}

// === FILE: index.html ===
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite Counter App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>

// === COMMANDS USED ===

// 1. Initialize a new Vite project with vanilla JavaScript template:
//    npm create vite@latest my-vite-app -- --template vanilla
//    or
//    yarn create vite my-vite-app --template vanilla

// 2. Navigate to the project directory:
//    cd my-vite-app

// 3. Install dependencies:
//    npm install
//    or
//    yarn install

// 4. Start the development server:
//    npm run dev
//    or
//    yarn dev
//    This will start the server on port 3000 and automatically open the browser

// 5. Build for production:
//    npm run build
//    or
//    yarn build
//    This creates an optimized production build in the 'dist' directory

// 6. Preview the production build:
//    npm run preview
//    or
//    yarn preview
//    This serves the production build locally for testing

// === CONFIGURATION EXPLANATIONS ===

// server.port: Sets the port for the development server. Default is 5173,
//             but we configured it to 3000 for familiarity.

// server.open: Automatically opens the browser when the dev server starts.
//             This saves a manual step during development.

// server.host: When set to true, listens on all addresses, allowing access
//              from other devices on the network (useful for mobile testing).

// build.outDir: Specifies the output directory for production builds.
//               Default is 'dist', but this can be customized.

// build.sourcemap: Generates source maps that help debug production builds
//                  by mapping minified code back to original source code.

// build.minify: Specifies the minification tool. 'terser' provides better
//               compression than 'esbuild' but is slightly slower.

// define: Allows defining global constants that are replaced at build time.
//         Useful for environment-specific values or version numbers.
