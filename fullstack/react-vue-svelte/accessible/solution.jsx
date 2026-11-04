// React Reference Solution: First Components
// This solution demonstrates reusable components with props and state

import React, { useState } from 'react';

// === COMPONENT: Button ===
function Button({ label, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '8px 16px',
        margin: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1
      }}
    >
      {label}
    </button>
  );
}

// === COMPONENT: Counter ===
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', margin: '8px' }}>
      <h3>Counter</h3>
      <p>Count: {count}</p>
      <Button label="Increment" onClick={increment} />
      <Button label="Decrement" onClick={decrement} disabled={count === 0} />
    </div>
  );
}

// === COMPONENT: App ===
function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>React Components Demo</h1>
      <p>Demonstrating reusable components with props and state</p>
      <Counter />
      <Counter />
    </div>
  );
}

export default App;

// To run this application:
// 1. Create a React project: npx create-react-app my-app
// 2. Replace the contents of src/App.js with this code
// 3. Run: npm start
// 4. Open http://localhost:3000 in your browser
