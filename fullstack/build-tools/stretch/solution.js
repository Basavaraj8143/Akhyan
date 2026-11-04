// Build Tools Reference Solution: Custom Config
// This solution demonstrates advanced Vite configuration for complex project needs

// === SCENARIO 1: MULTIPLE ENTRY POINTS ===

// Problem: Need to build multiple separate applications/pages from a single codebase
// Solution: Configure Vite with multiple entry points and shared code extraction

// === FILE: vite.config.js ===
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      input: {
        // Multiple entry points
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        dashboard: resolve(__dirname, 'dashboard.html')
      },
      output: {
        // Extract shared code to separate chunks
        manualChunks: (id) => {
          // React and related libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // Shared application code
          if (id.includes('src/shared')) {
            return 'shared';
          }
        }
      }
    }
  }
});

// === FILE: index.html ===
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Main App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

// === FILE: admin.html ===
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Admin Panel</title>
  </head>
  <body>
    <div id="admin-root"></div>
    <script type="module" src="/src/admin.jsx"></script>
  </body>
</html>

// === FILE: dashboard.html ===
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Dashboard</title>
  </head>
  <body>
    <div id="dashboard-root"></div>
    <script type="module" src="/src/dashboard.jsx"></script>
  </body>
</html>

// Explanation:
// - Multiple entry points generate separate bundles for each HTML file
// - Shared code (React, vendor libs, shared components) is extracted to common chunks
// - This reduces redundancy and improves caching
// - Each entry point only loads its specific code plus shared chunks

// === SCENARIO 2: ENVIRONMENT VARIABLES ===

// Problem: Need different configurations for development, staging, and production
// Solution: Use Vite's built-in env support with .env files

// === FILE: .env ===
VITE_APP_TITLE=My App
VITE_API_URL=http://localhost:3000/api

// === FILE: .env.staging ===
VITE_APP_TITLE=My App (Staging)
VITE_API_URL=https://staging.example.com/api

// === FILE: .env.production ===
VITE_APP_TITLE=My App
VITE_API_URL=https://api.example.com

// === FILE: vite.config.js (updated) ===
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      // Expose env variables to client code
      __APP_ENV__: JSON.stringify(env.VITE_APP_TITLE),
      __API_URL__: JSON.stringify(env.VITE_API_URL)
    },
    // ... other config
  };
});

// === FILE: src/config.js ===
export const config = {
  appTitle: import.meta.env.VITE_APP_TITLE,
  apiUrl: import.meta.env.VITE_API_URL,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
};

// === FILE: package.json (scripts) ===
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:staging": "vite build --mode staging",
    "preview": "vite preview"
  }
}

// Explanation:
// - Vite automatically loads .env files based on mode
// - Variables prefixed with VITE_ are exposed to client code
// - Different .env files for different environments
// - Build with --mode flag to specify environment
// - import.meta.env provides access to environment variables in code

// === SCENARIO 3: ASSET HANDLING ===

// Problem: Need to optimize and manage images, fonts, and other static assets
// Solution: Configure Vite's asset handling with custom options

// === FILE: vite.config.js (updated) ===
import { defineConfig } from 'vite';
import { imageMin } from 'vite-plugin-imagemin'; // Hypothetical plugin

export default defineConfig({
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.webp'],

  build: {
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB as base64

    rollupOptions: {
      output: {
        // Custom asset naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js'
      }
    }
  },

  // Server configuration for serving assets
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
  }
});

// Explanation:
// - assetsInlineLimit controls which assets are inlined vs. separate files
// - Custom asset naming organizes files by type (images, fonts, assets)
// - Hash in filenames enables long-term caching
// - fs.allow enables serving assets from parent directories
// - Different asset types get different output directories

// === SCENARIO 4: CSS PREPROCESSING ===

// Problem: Need to use Sass/SCSS for better CSS organization and features
// Solution: Integrate Sass with PostCSS for preprocessing and optimization

// === FILE: package.json (dependencies) ===
{
  "devDependencies": {
    "sass": "^1.63.0",
    "postcss": "^8.4.24",
    "autoprefixer": "^10.4.14",
    "postcss-preset-env": "^8.0.1"
  }
}

// === FILE: vite.config.js (updated) ===
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    // Enable CSS modules for .module.scss files
    modules: {
      localsConvention: 'camelCase'
    },
    // CSS preprocessor options
    preprocessorOptions: {
      scss: {
        // Import variables and mixins globally
        additionalData: `
          @import "@/styles/variables.scss";
          @import "@/styles/mixins.scss";
        `
      }
    },
    // Enable CSS extraction for production
    devSourcemap: true
  }
});

// === FILE: postcss.config.js ===
export default {
  plugins: {
    autoprefixer: {}, // Add vendor prefixes automatically
    'postcss-preset-env': {
      stage: 3, // Use CSS features from stage 3 and above
      features: {
        'nesting-rules': true // Enable CSS nesting
      }
    }
  }
};

// === FILE: src/styles/variables.scss ===
$primary-color: #667eea;
$secondary-color: #764ba2;
$text-color: #333;
$background-color: #fff;

// === FILE: src/styles/mixins.scss ===
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin button-style {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

// === FILE: src/App.module.scss ===
.container {
  @include flex-center;
  min-height: 100vh;
  background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);

  .card {
    background: $background-color;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

    h1 {
      color: $text-color;
      margin-bottom: 20px;
    }

    button {
      @include button-style;
      background-color: $primary-color;
      color: white;

      &:hover {
        background-color: darken($primary-color, 10%);
      }
    }
  }
}

// Explanation:
// - Sass enables variables, mixins, nesting, and other advanced CSS features
// - Global imports eliminate need to import variables in every file
// - PostCSS autoprefixer adds vendor prefixes automatically
// - postcss-preset-env enables future CSS features
// - CSS modules prevent style conflicts
// - CSS extraction creates separate CSS files for production

// === SCENARIO 5: CODE SPLITTING AND LAZY LOADING ===

// Problem: Large initial bundle causes slow page load
// Solution: Implement dynamic imports and lazy loading for routes/components

// === FILE: src/App.jsx ===
import React, { Suspense, lazy } from 'react';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Loading component
const LoadingFallback = () => (
  <div className="loading">Loading...</div>
);

function App() {
  return (
    <div>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/dashboard">Dashboard</a>
      </nav>

      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </div>
  );
}

// === FILE: vite.config.js (updated) ===
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Automatic code splitting for dynamic imports
        manualChunks: (id) => {
          // React vendor chunk
          if (id.includes('node_modules/react')) {
            return 'react-vendor';
          }
          // Page-specific chunks
          if (id.includes('/pages/')) {
            const pageName = id.split('/pages/')[1].split('.')[0];
            return `page-${pageName}`;
          }
        }
      }
    },
    // Enable chunk size warnings
    chunkSizeWarningLimit: 500
  }
});

// Explanation:
// - lazy() and Suspense enable lazy loading of components
// - Components are only loaded when their route is accessed
// - Dynamic imports create separate chunks for each page
// - Loading fallback shows while chunks are being fetched
// - Initial bundle is significantly smaller
// - Manual chunk strategy organizes code by page
// - chunkSizeWarningLimit alerts about large chunks

// === SCENARIO 6: PLUGIN INTEGRATION ===

// Problem: Need additional functionality not provided by Vite out of the box
// Solution: Integrate plugins for PWA, compression, and other features

// === FILE: package.json (devDependencies) ===
{
  "devDependencies": {
    "vite-plugin-pwa": "^0.14.7",
    "vite-plugin-compression": "^0.5.1",
    "@rollup/plugin-image": "^3.0.2",
    "vite-plugin-eslint": "^1.8.1"
  }
}

// === FILE: vite.config.js (updated) ===
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';
import image from '@rollup/plugin-image';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [
    // ESLint plugin for linting during development
    eslint({
      cache: false,
      include: ['src/**/*.js', 'src/**/*.jsx']
    }),

    // Image plugin for optimized image handling
    image({
      // Convert images to data URIs if smaller than limit
      limit: 10000,
      // Enable/disable different image types
      include: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.webp']
    }),

    // Compression plugin for gzip and brotli
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Only compress files larger than 10KB
      deleteOriginFile: false // Keep original files
    }),

    // PWA plugin for progressive web app support
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'My App',
        short_name: 'MyApp',
        description: 'A progressive web app built with Vite',
        theme_color: '#667eea',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Cache strategies
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    })
  ]
});

// Explanation:
// - ESLint plugin: Runs ESLint during development, catches errors early
// - Image plugin: Optimizes images, converts small images to data URIs
// - Compression plugin: Generates gzip compressed versions of assets
// - PWA plugin: Makes the app installable, enables offline support
// - Workbox: Configures service worker caching strategies
// - NetworkFirst for API: Always try network, fallback to cache
// - CacheFirst for images: Serve from cache, update in background
// - Multiple plugins work together without conflicts

// === VERIFICATION ===

// To verify each configuration:

// 1. Multiple Entry Points:
//    - Run: npm run build
//    - Check dist/ directory for multiple HTML files and JS chunks
//    - Verify shared code is in separate chunks

// 2. Environment Variables:
//    - Run: npm run dev (uses .env)
//    - Run: npm run build:staging (uses .env.staging)
//    - Check console for correct API URL and app title

// 3. Asset Handling:
//    - Add images to public/ or src/
//    - Build and check asset organization in dist/
//    - Verify large assets are separate files, small ones are inlined

// 4. CSS Preprocessing:
//    - Create .scss files with variables and mixins
//    - Import and use in components
//    - Build and check compiled CSS output
//    - Verify autoprefixer added vendor prefixes

// 5. Code Splitting:
//    - Build and check for multiple JS chunks
//    - Use network tab to verify lazy loading
//    - Check that initial bundle is smaller

// 6. Plugin Integration:
//    - Check for ESLint errors in console
//    - Verify gzip files are generated (.gz extension)
//    - Test PWA installability in Chrome DevTools
//    - Verify service worker caching in Application tab

// Expected Results:
// - All configurations work without conflicts
// - Build completes successfully
// - Application runs correctly in development and production
// - Bundle size is optimized
// - Assets are properly organized
// - PWA features work (offline support, installability)
