// React Reference Solution: Global Store with Zustand
// This solution demonstrates app-wide state management using Zustand

import React, { useState } from 'react';
import { create } from 'zustand';

// === STORE: Zustand Setup ===
const useTaskStore = create((set) => ({
  tasks: [
    { id: 1, title: 'Learn Zustand', completed: false },
    { id: 2, title: 'Build a project', completed: false },
    { id: 3, title: 'Master state management', completed: true }
  ],
  filter: 'all',

  addTask: (title) => set((state) => ({
    tasks: [...state.tasks, {
      id: Date.now(),
      title,
      completed: false
    }]
  })),

  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    )
  })),

  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),

  setFilter: (filter) => set({ filter }),

  clearCompleted: () => set((state) => ({
    tasks: state.tasks.filter(task => !task.completed)
  }))
}));

// === COMPONENT: TaskList ===
function TaskList() {
  const tasks = useTaskStore((state) => state.tasks);
  const filter = useTaskStore((state) => state.filter);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '16px' }}>
      {filteredTasks.length === 0 ? (
        <p style={{ color: '#888', fontStyle: 'italic' }}>No tasks to display</p>
      ) : (
        filteredTasks.map(task => (
          <div
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              borderBottom: '1px solid #eee',
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? '#888' : '#000'
            }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              style={{ marginRight: '8px' }}
            />
            <span style={{ flex: 1 }}>{task.title}</span>
            <button
              onClick={() => deleteTask(task.id)}
              style={{
                padding: '4px 8px',
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

// === COMPONENT: TaskForm ===
function TaskForm() {
  const [inputValue, setInputValue] = useState('');
  const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      addTask(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a new task..."
        style={{
          padding: '8px',
          marginRight: '8px',
          width: '300px',
          fontSize: '16px'
        }}
      />
      <button
        type="submit"
        style={{
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Add Task
      </button>
    </form>
  );
}

// === COMPONENT: FilterControls ===
function FilterControls() {
  const filter = useTaskStore((state) => state.filter);
  const setFilter = useTaskStore((state) => state.setFilter);
  const clearCompleted = useTaskStore((state) => state.clearCompleted);

  const buttonStyle = (isActive) => ({
    padding: '6px 12px',
    marginRight: '8px',
    backgroundColor: isActive ? '#2196F3' : '#ddd',
    color: isActive ? 'white' : '#000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  });

  return (
    <div style={{ marginBottom: '20px' }}>
      <button
        onClick={() => setFilter('all')}
        style={buttonStyle(filter === 'all')}
      >
        All
      </button>
      <button
        onClick={() => setFilter('active')}
        style={buttonStyle(filter === 'active')}
      >
        Active
      </button>
      <button
        onClick={() => setFilter('completed')}
        style={buttonStyle(filter === 'completed')}
      >
        Completed
      </button>
      <button
        onClick={clearCompleted}
        style={{
          padding: '6px 12px',
          backgroundColor: '#ff9800',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Clear Completed
      </button>
    </div>
  );
}

// === COMPONENT: TaskStats ===
function TaskStats() {
  const tasks = useTaskStore((state) => state.tasks);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <div style={{ marginBottom: '20px', color: '#666' }}>
      <p>Total tasks: {totalTasks} | Completed: {completedTasks}</p>
    </div>
  );
}

// === COMPONENT: App ===
function App() {
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Task Manager with Zustand</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Global state management using Zustand
      </p>

      <TaskForm />
      <FilterControls />
      <TaskStats />
      <TaskList />
    </div>
  );
}

export default App;

// To run this application:
// 1. Create a React project: npx create-react-app my-app
// 2. Install Zustand: npm install zustand
// 3. Replace the contents of src/App.js with this code
// 4. Run: npm start
// 5. Open http://localhost:3000 in your browser
//
// Note: This solution uses Zustand for state management.
// Zustand is a lightweight state management library that provides
// a simple API for managing global state without the boilerplate of Redux.
