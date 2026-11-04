// React Reference Solution: Server State with React Query
// This solution demonstrates managing server state cleanly with React Query (TanStack Query)

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

// === SETUP: QueryClient ===
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: true,
      retry: 1
    }
  }
});

// === API FUNCTIONS ===
const fetchPosts = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

const addPost = async (newPost) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newPost)
  });
  if (!response.ok) {
    throw new Error('Failed to add post');
  }
  return response.json();
};

const updatePost = async ({ id, ...data }) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to update post');
  }
  return response.json();
};

const deletePost = async (id) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete post');
  }
  return id;
};

// === HOOK: usePosts ===
function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts
  });
}

// === COMPONENT: PostList ===
function PostList({ searchTerm }) {
  const { data: posts, isLoading, error, refetch } = usePosts();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ fontSize: '18px', color: '#666' }}>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
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
          Error loading posts: {error.message}
        </p>
        <button
          onClick={() => refetch()}
          style={{
            marginTop: '8px',
            padding: '6px 12px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredPosts.length === 0) {
    return <p style={{ color: '#888', fontStyle: 'italic' }}>No posts to display</p>;
  }

  return (
    <div>
      {filteredPosts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}

// === COMPONENT: PostItem ===
function PostItem({ post }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedBody, setEditedBody] = useState(post.body);

  // Delete mutation with optimistic update
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
      queryClient.setQueryData(['posts'], (old) =>
        old.filter(p => p.id !== deletedId)
      );
      return { previousPosts };
    },
    onError: (err, deletedId, context) => {
      queryClient.setQueryData(['posts'], context.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  // Update mutation with optimistic update
  const updateMutation = useMutation({
    mutationFn: updatePost,
    onMutate: async (updatedData) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
      queryClient.setQueryData(['posts'], (old) =>
        old.map(p => p.id === updatedData.id ? { ...p, ...updatedData } : p)
      );
      return { previousPosts };
    },
    onError: (err, updatedData, context) => {
      queryClient.setQueryData(['posts'], context.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  const handleSave = () => {
    updateMutation.mutate({ id: post.id, title: editedTitle, body: editedBody });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(post.title);
    setEditedBody(post.body);
    setIsEditing(false);
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
            disabled={updateMutation.isLoading}
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
            {updateMutation.isLoading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleCancel}
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
        <div style={{ marginLeft: '16px' }}>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '8px',
              display: 'block'
            }}
          >
            Edit
          </button>
          <button
            onClick={() => deleteMutation.mutate(post.id)}
            disabled={deleteMutation.isLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'block'
            }}
          >
            {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// === COMPONENT: PostForm ===
function PostForm() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // Add mutation with optimistic update
  const addMutation = useMutation({
    mutationFn: addPost,
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
      const optimisticPost = { ...newPost, id: Date.now() };
      queryClient.setQueryData(['posts'], (old) => [...old, optimisticPost]);
      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      queryClient.setQueryData(['posts'], context.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && body.trim()) {
      addMutation.mutate({ title, body, userId: 1 });
      setTitle('');
      setBody('');
    }
  };

  return (
    <div style={{ marginBottom: '20px', padding: '16px', border: '1px solid #ddd', borderRadius: '4px' }}>
      <h3>Add New Post</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            Title:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
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
        <button
          type="submit"
          disabled={addMutation.isLoading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {addMutation.isLoading ? 'Adding...' : 'Add Post'}
        </button>
      </form>
    </div>
  );
}

// === COMPONENT: FilterControls ===
function FilterControls({ searchTerm, setSearchTerm }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search posts..."
        style={{
          padding: '8px',
          width: '100%',
          boxSizing: 'border-box',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '16px'
        }}
      />
    </div>
  );
}

// === COMPONENT: App ===
function App() {
  // UI state (managed with useState)
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Posts with React Query</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Server state management with React Query (TanStack Query)
      </p>

      <PostForm />
      <FilterControls searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <PostList searchTerm={searchTerm} />
    </div>
  );
}

// === ROOT COMPONENT ===
function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

export default Root;

// To run this application:
// 1. Create a React project: npx create-react-app my-app
// 2. Install React Query: npm install @tanstack/react-query
// 3. Replace the contents of src/App.js with this code
// 4. Run: npm start
// 5. Open http://localhost:3000 in your browser
//
// Note: This solution uses React Query (TanStack Query) for server state management.
// React Query provides:
// - Automatic caching and background refetching
// - Optimistic updates with rollback on error
// - Loading and error states
// - Cache invalidation strategies
// - Separation of server state (React Query) from UI state (useState)
