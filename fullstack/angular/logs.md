# Work Log – Angular Node

**Domain:** Web Development
**Node:** Angular
**Status:** Projects completed with specifications and reference implementations

## 1. Accessible – First Components

**Objective:** Build Angular components with data binding.

**Work completed:**
- Designed an Angular component exercise focusing on data binding fundamentals.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria covering ButtonComponent with inputs/outputs, CounterComponent with data binding, component reusability/independent state, and Angular best practices.
- Prepared a reference implementation with:
  - ButtonComponent with @Input() for label and disabled, @Output() with EventEmitter for clicks
  - CounterComponent with count property, interpolation for display, increment/decrement methods
  - ButtonComponent usage within CounterComponent
  - Logic to prevent count from going below 0
  - Disabled binding for decrement button when count is 0
  - AppComponent rendering two independent CounterComponent instances

## 2. Core – Interactive App

**Objective:** Build a routed, service-driven Angular app.

**Work completed:**
- Designed a task management Angular application with routing and service architecture.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for TaskService with RxJS, component implementation with DI, routing configuration and navigation, and UI implementation.
- Prepared a reference implementation with:
  - Task interface for type safety
  - TaskService with BehaviorSubject for state management
  - Observable methods: getTasks(), addTask(), toggleTask(), deleteTask()
  - TaskListComponent with async pipe for subscriptions
  - TaskFormComponent with ngModel for two-way binding
  - AppComponent with navigation menu
  - Routing configuration for '/tasks' and '/add' routes
  - Task CRUD operations through service
  - Visual distinction for completed tasks
  - Task count display (total and completed)
  - Proper dependency injection

## 3. Stretch – Data-Driven UI

**Objective:** Build an Angular app consuming an API with RxJS.

**Work completed:**
- Designed an API-integrated Angular application using HttpClient and RxJS.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for API integration with HttpClient and RxJS, RxJS state management and async pipe, data display and edit functionality, and error handling.
- Prepared a reference implementation with:
  - Post interface for type safety
  - PostService with HttpClient integration
  - BehaviorSubject for posts, loading, and error state
  - RxJS operators: tap, catchError, of, throwError
  - getPosts() method with loading/error state management
  - updatePost() method with optimistic UI updates
  - PostItemComponent for displaying and editing posts
  - PostListComponent with async pipe for subscriptions
  - Inline edit form with title and body fields
  - Save and Cancel functionality
  - HTTP error handling with user-friendly messages
  - Loading indicator and error message display
  - Proper error handling with RxJS operators

## Overall Summary

| Difficulty | Project | Status |
|---|---|---|
| Accessible | First Components | Completed |
| Core | Interactive App | Completed |
| Stretch | Data-Driven UI | Completed |

**Deliverables prepared:**
- 3 project specifications (`project.json`)
- 3 reference implementations (`.ts` files)
- Evaluation rubrics for all three projects
- Valid alternatives and mistakes-to-check lists
- Detailed comments explaining component structure and setup
- Routing configuration examples
- Both NgModule and standalone component instructions

**Key Angular concepts covered:**
- Component decorators (@Component)
- Input and Output decorators (@Input, @Output)
- EventEmitter for component communication
- Interpolation for data binding
- Dependency Injection (@Injectable, providedIn)
- Services with providedIn: 'root'
- RxJS BehaviorSubject and Observable
- Async pipe for template subscriptions
- Routing (@NgModule with RouterModule, routerLink)
- Forms (ngModel, FormsModule)
- HttpClient for API integration
- RxJS operators (tap, catchError, of, throwError, map)
- Error handling with HttpErrorResponse
- Component lifecycle hooks (ngOnChanges)
- Standalone components (Angular 14+)
- State management patterns with RxJS

**Next step:** Technical review, execution testing, and verification of all reference implementations before final submission.
