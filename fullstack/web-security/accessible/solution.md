# Common Web Security Vulnerabilities

## SQL Injection

**What is SQL Injection?**
SQL Injection (SQLi) is a vulnerability where an attacker interferes with the queries an application makes to its database. By inserting malicious SQL statements into entry fields, an attacker can trick the database into revealing, modifying, or deleting data.

**Vulnerable Example:**
```javascript
// Vulnerable code
const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
db.execute(query);

// Attack: username = "admin' OR '1'='1"
// Result: SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = '...'
// This returns the admin user regardless of password
```

**How the Attack Works:**
1. Attacker enters malicious input into a form field
2. The application concatenates the input directly into a SQL query
3. The database executes the modified query
4. The attacker can bypass authentication, steal data, or delete data

**Impact:**
- Unauthorized access to data
- Data theft (passwords, personal information)
- Data deletion or modification
- Authentication bypass
- Complete database compromise

**Prevention:**
- Use parameterized queries (prepared statements)
- Use ORM frameworks (Sequelize, TypeORM, Mongoose)
- Validate and sanitize all user input
- Use least-privilege database accounts
- Implement input validation

**Secure Example:**
```javascript
// Secure code with parameterized query
const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
db.execute(query, [username, hashedPassword]);
```

## Cross-Site Scripting (XSS)

**What is XSS?**
Cross-Site Scripting (XSS) is a vulnerability where attackers inject malicious scripts into web pages viewed by other users. When the page loads, the malicious script executes in the victim's browser.

**Types of XSS:**

1. **Reflected XSS**: Malicious script is reflected off a web server
```javascript
// Vulnerable code
app.get('/search', (req, res) => {
  res.send(`Results for: ${req.query.q}`);
});

// Attack: /search?q=<script>alert('XSS')</script>
```

2. **Stored XSS**: Malicious script is stored on the server and served to users
```javascript
// Vulnerable code
app.post('/comments', (req, res) => {
  comments.push(req.body.comment);
  res.send('Comment saved');
});

// Attack: Submit comment with <script>stealCookies()</script>
```

3. **DOM-based XSS**: Vulnerability exists in client-side code
```javascript
// Vulnerable code
const name = urlParams.get('name');
document.getElementById('welcome').innerHTML = `Welcome ${name}`;
```

**How the Attack Works:**
1. Attacker injects malicious script into a web application
2. The application stores or reflects the script without sanitization
3. Other users view the page containing the malicious script
4. The script executes in the victim's browser
5. The attacker can steal cookies, session tokens, or perform actions

**Impact:**
- Session hijacking (stealing cookies)
- Data theft (localStorage, sessionStorage)
- Phishing attacks
- Malware distribution
- Defacement of websites

**Prevention:**
- Validate and sanitize all input (whitelist approach)
- Encode output (HTML entity encoding)
- Use Content Security Policy (CSP)
- Use HTTPOnly cookies (prevents JavaScript access)
- Use textContent instead of innerHTML
- Implement XSS sanitization libraries (DOMPurify)

**Secure Example:**
```javascript
// Secure code with output encoding
const safe = require('sanitize-html');
app.get('/search', (req, res) => {
  const sanitized = safe(req.query.q);
  res.send(`Results for: ${sanitized}`);
});
```

## Cross-Site Request Forgery (CSRF)

**What is CSRF?**
Cross-Site Request Forgery (CSRF) is an attack where an attacker tricks a user into executing unwanted actions on a web application where they are authenticated.

**Example Attack:**
```html
<!-- Malicious website -->
<img src="https://bank.com/transfer?to=attacker&amount=10000" />
```

**How the Attack Works:**
1. User logs into legitimate website (e.g., bank.com)
2. User visits malicious website while still logged in
3. Malicious website sends request to legitimate website
4. Browser includes user's cookies automatically
5. Legitimate website executes the action
6. User's money is transferred to attacker

**Impact:**
- Unauthorized transactions
- Data modification
- Account changes
- Unauthorized actions performed on behalf of user

**Prevention:**
- Use CSRF tokens (unique, unpredictable tokens)
- Validate CSRF tokens on state-changing requests
- Use SameSite cookie attribute (Strict or Lax)
- Implement referrer checking
- Require re-authentication for sensitive actions
- Use double-submit cookie pattern

**Secure Example:**
```javascript
// Generate CSRF token
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.post('/transfer', csrfProtection, (req, res) => {
  // CSRF token is validated automatically
  // Transfer logic here
});
```

## Authentication and Authorization Issues

**Weak Password Issues:**
- Short passwords (less than 8 characters)
- No complexity requirements (no numbers, symbols)
- Common passwords (password123, qwerty)
- Password reuse across sites

**Session Hijacking:**
- Session IDs in URLs
- Session IDs without expiration
- Session IDs without regeneration after login
- Unencrypted session IDs

**Impact:**
- Unauthorized account access
- Identity theft
- Data breach
- Financial loss
- Privacy violation

**Prevention:**
- Enforce strong password policies (minimum 8 characters, complexity)
- Hash passwords with bcrypt (10-12 rounds)
- Use salt when hashing passwords
- Implement secure session management (HttpOnly cookies)
- Regenerate session IDs after login
- Implement session expiration
- Use multi-factor authentication (MFA)
- Implement account lockout after failed attempts

**Secure Example:**
```javascript
// Secure password hashing
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash(password, 12);

// Secure session
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour
  }
}));
```

## Security Misconfiguration

**Common Misconfigurations:**
- Default credentials (admin/admin)
- Debug mode enabled in production
- Verbose error messages exposing stack traces
- Unnecessary services enabled
- Open ports and services
- Directory listing enabled
- CORS misconfiguration (allowing all origins)

**Impact:**
- Unauthorized access to systems
- Information disclosure
- Data exposure
- System compromise
- Denial of service

**Prevention:**
- Change default credentials immediately
- Disable debug mode in production
- Use generic error messages (hide stack traces)
- Disable unnecessary services
- Close unused ports
- Disable directory listing
- Configure CORS properly (specific origins)
- Use security frameworks (helmet)
- Regular security audits
- Automated security scanning

**Secure Example:**
```javascript
// Secure configuration
const helmet = require('helmet');
app.use(helmet());

// Generic error message
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error' });
});
```

## Sensitive Data Exposure

**What is Sensitive Data Exposure?**
Sensitive data exposure occurs when an application inadvertently exposes sensitive information such as passwords, credit card numbers, personal information, or API keys.

**Examples:**
- Credit card numbers stored in plain text
- Passwords stored in plain text
- API keys in client-side code
- Personal information (SSN, addresses) in logs
- Encryption keys in code
- Session tokens in URLs

**Impact:**
- Identity theft
- Financial fraud
- Privacy violation
- Account compromise
- Data breach
- Legal and regulatory penalties (GDPR, PCI-DSS)

**Prevention:**
- Encrypt sensitive data at rest
- Hash passwords (never store plain text)
- Use HTTPS for all communications
- Implement proper key management
- Never log sensitive information
- Tokenize credit card numbers
- Use environment variables for secrets
- Implement data retention policies
- Implement data encryption in transit (TLS)
- Use secure protocols (HTTPS, TLS 1.2+)

**Secure Example:**
```javascript
// Secure password storage
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash(password, 12);

// Secure data encryption
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update(data, 'utf8', 'hex');
encrypted += cipher.final('hex');
```

## Summary

| Vulnerability | Prevention | Priority |
|---------------|-------------|----------|
| SQL Injection | Parameterized queries, ORM | High |
| XSS | Input validation, output encoding, CSP | High |
| CSRF | CSRF tokens, SameSite cookies | High |
| Weak Auth | Strong passwords, bcrypt, MFA | High |
| Misconfiguration | Security audits, disable defaults | Medium |
| Data Exposure | Encryption, hashing, HTTPS | High |

## Best Practices

1. **Never trust user input** - Always validate and sanitize
2. **Use parameterized queries** - Prevent SQL injection
3. **Encode output** - Prevent XSS
4. **Use HTTPS** - Encrypt all communications
5. **Hash passwords** - Never store plain text
6. **Use security headers** - helmet, CSP, HSTS
7. **Implement rate limiting** - Prevent brute force
8. **Log security events** - Monitor for attacks
9. **Regular security audits** - Scan for vulnerabilities
10. **Keep dependencies updated** - Patch known vulnerabilities
