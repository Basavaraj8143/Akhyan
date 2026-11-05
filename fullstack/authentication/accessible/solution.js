// Authentication Reference Solution: JWT Auth
// JWT-based login for Express API

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

app.use(express.json());

const JWT_SECRET = 'your-secret-key';
const JWT_EXPIRATION = '1h';

// In-memory user store
let users = [];

// === REGISTER ===
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), username, email, password: hashedPassword };
  users.push(user);
  
  const { password: _, ...userWithoutPassword } = user;
  res.status(201).json({ message: 'User registered', user: userWithoutPassword });
});

// === LOGIN ===
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  
  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
});

// === JWT MIDDLEWARE ===
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// === PROTECTED ROUTES ===
app.get('/api/users/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.put('/api/users/profile', authenticateToken, async (req, res) => {
  const { username, email } = req.body;
  const user = users.find(u => u.id === req.user.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  if (username) user.username = username;
  if (email) user.email = email;
  
  const { password: _, ...userWithoutPassword } = user;
  res.json({ message: 'Profile updated', user: userWithoutPassword });
});

app.listen(3000, () => console.log('Server running on port 3000'));
