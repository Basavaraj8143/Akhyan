// React Reference Solution: Lift State with Context
// This solution demonstrates managing shared state across components with React Context

import React, { createContext, useContext, useState } from 'react';

// === CONTEXT: ThemeContext ===
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

// === COMPONENT: ThemeProvider ===
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// === COMPONENT: Header ===
function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const headerStyle = {
    padding: '20px',
    backgroundColor: theme === 'light' ? '#f0f0f0' : '#333',
    color: theme === 'light' ? '#000' : '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: theme === 'light' ? '#2196F3' : '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  return (
    <header style={headerStyle}>
      <h1 style={{ margin: 0 }}>My App</h1>
      <div>
        <span style={{ marginRight: '16px' }}>
          Current theme: {theme}
        </span>
        <button onClick={toggleTheme} style={buttonStyle}>
          Toggle Theme
        </button>
      </div>
    </header>
  );
}

// === COMPONENT: Content ===
function Content() {
  const { theme } = useContext(ThemeContext);

  const contentStyle = {
    padding: '40px 20px',
    backgroundColor: theme === 'light' ? '#fff' : '#444',
    color: theme === 'light' ? '#000' : '#fff',
    minHeight: '300px'
  };

  return (
    <main style={contentStyle}>
      <h2>Welcome to the App</h2>
      <p>
        This is a demonstration of React Context for managing shared state.
        The theme is shared across all components through the ThemeContext.
      </p>
      <p>
        Try clicking the "Toggle Theme" button in the header to see how
        all components update simultaneously when the context value changes.
      </p>
    </main>
  );
}

// === COMPONENT: Footer ===
function Footer() {
  const { theme } = useContext(ThemeContext);

  const footerStyle = {
    padding: '20px',
    backgroundColor: theme === 'light' ? '#f0f0f0' : '#333',
    color: theme === 'light' ? '#000' : '#fff',
    textAlign: 'center'
  };

  return (
    <footer style={footerStyle}>
      <p style={{ margin: 0 }}>
        Current theme: {theme} | Built with React Context
      </p>
    </footer>
  );
}

// === COMPONENT: App ===
function App() {
  return (
    <ThemeProvider>
      <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>
        <Header />
        <Content />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;

// To run this application:
// 1. Create a React project: npx create-react-app my-app
// 2. Replace the contents of src/App.js with this code
// 3. Run: npm start
// 4. Open http://localhost:3000 in your browser
