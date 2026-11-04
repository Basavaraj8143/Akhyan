# Work Log – React (Vue/Svelte) Node

**Domain:** Web Development
**Node:** React (Vue/Svelte)
**Status:** Projects completed with specifications and reference implementations

## 1. Accessible – First Components

**Objective:** Build reusable components with props and state.

**Work completed:**
- Designed a React component exercise focusing on props and state fundamentals.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria covering Button component with props, Counter component with state, component reusability/composition, and React best practices.
- Prepared a reference implementation with:
  - Button component accepting label, onClick, and optional disabled props
  - Counter component using useState for count management
  - Button components used within Counter for increment/decrement
  - Logic to prevent count from going below 0
  - App component rendering two independent Counter components

## 2. Core – Interactive SPA

**Objective:** Build a stateful single-page app with React.

**Work completed:**
- Designed a task management SPA with full CRUD operations and filtering.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for task state management, task filtering and display, user interaction and input handling, and UI implementation.
- Prepared a reference implementation with:
  - TaskItem component for individual task display with toggle and delete
  - TaskList component for rendering task collections
  - App component with full task management functionality
  - useState for tasks array, input value, and filter state
  - Add, toggle completion, delete, and clear completed operations
  - Filter functionality (All/Active/Completed)
  - Task count display (total and completed)
  - Visual distinction for completed tasks (strikethrough and gray color)
  - Empty state message when no tasks match filter
  - Input validation preventing empty tasks

## 3. Stretch – Data-Driven UI

**Objective:** Build a UI that fetches, displays, and updates from an API.

**Work completed:**
- Designed an API-integrated React application using JSONPlaceholder.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for API data fetching with useEffect, loading and error state handling, data display and edit functionality, and state management.
- Prepared a reference implementation with:
  - PostItem component for displaying and editing individual posts
  - PostList component for rendering post collections
  - App component with full API integration
  - useEffect hook to fetch data on component mount
  - useState for posts, loading, error, and editing state
  - Loading indicator while fetching
  - Error message display for failed requests
  - Inline edit form for post title and body
  - Save and Cancel functionality
  - Local state updates for edited posts
  - Proper async/await error handling with try/catch/finally

## Overall Summary

| Difficulty | Project | Status |
|---|---|---|
| Accessible | First Components | Completed |
| Core | Interactive SPA | Completed |
| Stretch | Data-Driven UI | Completed |

**Deliverables prepared:**
- 3 project specifications (`project.json`)
- 3 reference implementations (`.jsx` files)
- Evaluation rubrics for all three projects
- Valid alternatives and mistakes-to-check lists
- Detailed comments explaining component structure

**Key React concepts covered:**
- Functional components
- React hooks (useState, useEffect)
- Props and prop validation
- State management and state updates
- Component composition and reusability
- Conditional rendering
- Event handling
- List rendering with keys
- Controlled components
- API integration with Fetch
- Loading and error states
- Form handling
- Immutable state updates
- Component lifecycle with useEffect

**Next step:** Technical review, execution testing, and verification of all reference implementations before final submission.
