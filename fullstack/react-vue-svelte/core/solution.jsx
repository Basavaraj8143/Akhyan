// React Reference Solution: Interactive SPA
// This solution demonstrates a stateful single-page task management application

import React, { useState } from 'react';

// === COMPONENT: TaskItem ===
function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div
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
        onChange={() => onToggle(task.id)}
        style={{ marginRight: '8px' }}
      />
      <span style={{ flex: 1 }}>{task.title}</span>
      <button
        onClick={() => onDelete(task.id)}
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
  );
}

// === COMPONENT: TaskList ===
function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return <p style={{ color: '#888', fontStyle: 'italic' }}>No tasks to display</p>;
  }

  return (
    <div>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

// === COMPONENT: App ===
function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('All');

  const addTask = () => {
    if (inputValue.trim() === '') return;

    const newTask = {
      id: Date.now(),
      title: inputValue.trim(),
      completed: false
    };

    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Active') return !task.completed;
    if (filter === 'Completed') return task.completed;
    return true;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Task Manager</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          style={{
            padding: '8px',
            marginRight: '8px',
            width: '300px',
            fontSize: '16px'
          }}
        />
        <button
          onClick={addTask}
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
          Add
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setFilter('All')}
          style={{
            padding: '6px 12px',
            marginRight: '8px',
            backgroundColor: filter === 'All' ? '#2196F3' : '#ddd',
            color: filter === 'All' ? 'white' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter('Active')}
          style={{
            padding: '6px 12px',
            marginRight: '8px',
            backgroundColor: filter === 'Active' ? '#2196F3' : '#ddd',
            color: filter === 'Active' ? 'white' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('Completed')}
          style={{
            padding: '6px 12px',
            marginRight: '8px',
            backgroundColor: filter === 'Completed' ? '#2196F3' : '#ddd',
            color: filter === 'Completed' ? 'white' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
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

      <div style={{ marginBottom: '20px', color: '#666' }}>
        <p>Total tasks: {totalTasks} | Completed: {completedTasks}</p>
      </div>

      <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '16px' }}>
        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      </div>
    </div>
  );
}

export default App;

// To run this application:
// 1. Create a React project: npx create-react-app my-app
// 2. Replace the contents of src/App.js with this code
// 3. Run: npm start
// 4. Open http://localhost:3000 in your browser
