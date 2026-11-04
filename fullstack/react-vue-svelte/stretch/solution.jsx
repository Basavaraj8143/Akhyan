// React Reference Solution: Data-Driven UI
// This solution demonstrates a UI that fetches, displays, and updates data from an API

import React, { useState, useEffect } from 'react';

// === COMPONENT: PostItem ===
function PostItem({ post, onEdit, isEditing, onSave, onCancel }) {
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedBody, setEditedBody] = useState(post.body);

  const handleSave = () => {
    onSave(post.id, editedTitle, editedBody);
  };

  if (isEditing) {
    return (
      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '16px',
          margin: '8px 0',
          backgroundColor: '#f9f9f9'
        }}
      >
        <h4>Edit Post #{post.id}</h4>
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            Title:
          </label>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            Body:
          </label>
          <textarea
            value={editedBody}
            onChange={(e) => setEditedBody(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
              border: '1px solid #ccc',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
        </div>
        <div>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '8px'
            }}
          >
            Save
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              backgroundColor: '#9e9e9e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '16px',
        margin: '8px 0',
        backgroundColor: 'white'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#2196F3' }}>
            Post #{post.id}
          </h4>
          <h3 style={{ margin: '0 0 8px 0' }}>{post.title}</h3>
          <p style={{ margin: 0, color: '#666', lineHeight: '1.5' }}>{post.body}</p>
        </div>
        <button
          onClick={() => onEdit(post.id)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '16px'
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
}

// === COMPONENT: PostList ===
function PostList({ posts, editingId, onEdit, onSave, onCancel }) {
  if (posts.length === 0) {
    return <p style={{ color: '#888', fontStyle: 'italic' }}>No posts to display</p>;
  }

  return (
    <div>
      {posts.map(post => (
        <PostItem
          key={post.id}
          post={post}
          onEdit={onEdit}
          isEditing={editingId === post.id}
          onSave={onSave}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
}

// === COMPONENT: App ===
function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = (id, editedTitle, editedBody) => {
    setPosts(posts.map(post =>
      post.id === id
        ? { ...post, title: editedTitle, body: editedBody }
        : post
    ));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Posts from API</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Data fetched from JSONPlaceholder API with edit functionality
      </p>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>Loading posts...</p>
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: '4px',
            padding: '16px',
            marginBottom: '20px'
          }}
        >
          <p style={{ color: '#d32f2f', margin: 0 }}>
            Error loading posts: {error}
          </p>
        </div>
      )}

      {!loading && !error && (
        <PostList
          posts={posts}
          editingId={editingId}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default App;

// To run this application:
// 1. Create a React project: npx create-react-app my-app
// 2. Replace the contents of src/App.js with this code
// 3. Run: npm start
// 4. Open http://localhost:3000 in your browser
