// Authentication Reference Solution: OAuth Login
// OAuth 2.0 social login with Google and GitHub

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(passport.initialize());

// Environment variables (in production, use process.env)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'your-github-client-id';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'your-github-client-secret';
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';
const JWT_EXPIRATION = '1h';
const CALLBACK_URL = 'http://localhost:3000';

// In-memory user store
let users = [];

// ============================================
// === GOOGLE OAUTH STRATEGY ===
// ============================================

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `${CALLBACK_URL}/auth/google/callback`,
},
  (accessToken, refreshToken, profile, done) => {
    // Find or create user
    let user = users.find(u => u.provider_id === profile.id);
    
    if (!user) {
      user = {
        id: Date.now(),
        provider: 'google',
        provider_id: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
        profile_image: profile.photos[0].value,
        created_at: new Date(),
        last_login: new Date()
      };
      users.push(user);
    } else {
      user.last_login = new Date();
    }
    
    return done(null, user);
  }
));

// ============================================
// === GITHUB OAUTH STRATEGY ===
// ============================================

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: `${CALLBACK_URL}/auth/github/callback`,
},
  (accessToken, refreshToken, profile, done) => {
    // Find or create user
    let user = users.find(u => u.provider_id === profile.id.toString());
    
    if (!user) {
      user = {
        id: Date.now(),
        provider: 'github',
        provider_id: profile.id.toString(),
        username: profile.username,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
        profile_image: profile.photos[0].value,
        created_at: new Date(),
        last_login: new Date()
      };
      users.push(user);
    } else {
      user.last_login = new Date();
    }
    
    return done(null, user);
  }
));

// ============================================
// === OAUTH ROUTES ===
// ============================================

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: req.user.id,
        username: req.user.username,
        provider: req.user.provider
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );
    
    // Return token to client (in production, redirect to frontend with token)
    res.json({
      message: 'Login successful',
      token: token,
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        provider: req.user.provider
      }
    });
  }
);

// GitHub OAuth routes
app.get('/auth/github', passport.authenticate('github', {
  scope: ['user:email']
}));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: req.user.id,
        username: req.user.username,
        provider: req.user.provider
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );
    
    res.json({
      message: 'Login successful',
      token: token,
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        provider: req.user.provider
      }
    });
  }
);

// ============================================
// === JWT VERIFICATION MIDDLEWARE ===
// ============================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = decoded;
    next();
  });
};

// ============================================
// === PROTECTED ROUTE EXAMPLE ===
// ============================================

app.get('/api/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    provider: user.provider,
    profile_image: user.profile_image
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'OAuth Login API',
    endpoints: {
      google: '/auth/google',
      googleCallback: '/auth/google/callback',
      github: '/auth/github',
      githubCallback: '/auth/github/callback',
      profile: '/api/profile (protected)'
    }
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`OAuth Login Server is running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET    /auth/google - Redirect to Google OAuth`);
  console.log(`  GET    /auth/google/callback - Handle Google callback`);
  console.log(`  GET    /auth/github - Redirect to GitHub OAuth`);
  console.log(`  GET    /auth/github/callback - Handle GitHub callback`);
  console.log(`  GET    /api/profile - Protected route (requires JWT)`);
});

// === HOW TO RUN ===

// 1. Initialize a new Node.js project:
//    npm init -y

// 2. Install dependencies:
//    npm install express passport passport-google-oauth20 passport-github2 jsonwebtoken

// 3. Save this code as server.js

// 4. Set environment variables:
//    export GOOGLE_CLIENT_ID='your-google-client-id'
//    export GOOGLE_CLIENT_SECRET='your-google-client-secret'
//    export GITHUB_CLIENT_ID='your-github-client-id'
//    export GITHUB_CLIENT_SECRET='your-github-client-secret'
//    export JWT_SECRET='your-jwt-secret'

// 5. Run the server:
//    node server.js

// 6. Set up OAuth apps:
//    - Google: https://console.cloud.google.com/apis/credentials
//    - GitHub: https://github.com/settings/developers
//    - Set callback URL to: http://localhost:3000/auth/google/callback
//    - Set callback URL to: http://localhost:3000/auth/github/callback

// === OAUTH FLOW EXPLANATION ===

// OAuth 2.0 Authorization Code Flow:
// 1. User clicks "Login with Google/GitHub"
// 2. Application redirects to provider's authorization page
// 3. User grants permission
// 4. Provider redirects back with authorization code
// 5. Application exchanges code for access token
// 6. Application uses access token to fetch user profile
// 7. Application creates/updates user account
// 8. Application generates JWT token for session
// 9. JWT token is returned to client
// 10. Client includes JWT in Authorization header for subsequent requests

// Benefits of OAuth:
// - No need to store user passwords
// - Users can use existing accounts
// - Simplified registration process
// - Social proof and trust
// - Access to rich profile data
