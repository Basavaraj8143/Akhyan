// Angular Reference Solution: Data-Driven UI
// This solution demonstrates an Angular app consuming an API with RxJS

import { Component, Injectable, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, of, throwError } from 'rxjs';

// === MODEL: Post ===
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// === SERVICE: PostService ===
@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  private postsSubject = new BehaviorSubject<Post[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  posts$ = this.postsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<Post[]>(`${this.apiUrl}?_limit=10`).pipe(
      tap(posts => {
        this.postsSubject.next(posts);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(this.handleError(error));
        return of([]);
      })
    );
  }

  updatePost(id: number, data: Partial<Post>): Observable<Post> {
    return this.http.patch<Post>(`${this.apiUrl}/${id}`, data).pipe(
      tap(updatedPost => {
        const currentPosts = this.postsSubject.value;
        const updatedPosts = currentPosts.map(post =>
          post.id === id ? { ...post, ...updatedPost } : post
        );
        this.postsSubject.next(updatedPosts);
      }),
      catchError(error => {
        this.errorSubject.next(this.handleError(error));
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `Client error: ${error.error.message}`;
    } else {
      return `Server error: ${error.status} - ${error.message}`;
    }
  }
}

// === COMPONENT: PostItemComponent ===
@Component({
  selector: 'app-post-item',
  template: `
    <div
      *ngIf="!isEditing"
      style="border: 1px solid #ddd; border-radius: 4px; padding: 16px; margin: 8px 0; background-color: white;"
    >
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="flex: 1;">
          <h4 style="margin: 0 0 8px 0; color: #2196F3;">Post #{{ post.id }}</h4>
          <h3 style="margin: 0 0 8px 0;">{{ post.title }}</h3>
          <p style="margin: 0; color: #666; line-height: 1.5;">{{ post.body }}</p>
        </div>
        <button
          (click)="onEdit.emit(post.id)"
          style="padding: 8px 16px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 16px;"
        >
          Edit
        </button>
      </div>
    </div>

    <div
      *ngIf="isEditing"
      style="border: 1px solid #ddd; border-radius: 4px; padding: 16px; margin: 8px 0; background-color: #f9f9f9;"
    >
      <h4>Edit Post #{{ post.id }}</h4>
      <div style="margin-bottom: 8px;">
        <label style="display: block; margin-bottom: 4px; font-weight: bold;">Title:</label>
        <input
          type="text"
          [(ngModel)]="editedTitle"
          style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;"
        />
      </div>
      <div style="margin-bottom: 8px;">
        <label style="display: block; margin-bottom: 4px; font-weight: bold;">Body:</label>
        <textarea
          [(ngModel)]="editedBody"
          rows="4"
          style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; resize: vertical;"
        ></textarea>
      </div>
      <div>
        <button
          (click)="handleSave()"
          style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;"
        >
          Save
        </button>
        <button
          (click)="onCancel.emit()"
          style="padding: 8px 16px; background-color: #9e9e9e; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          Cancel
        </button>
      </div>
    </div>
  `
})
export class PostItemComponent {
  @Input() post!: Post;
  @Input() isEditing: boolean = false;
  @Output() onEdit = new EventEmitter<number>();
  @Output() onSave = new EventEmitter<{ id: number; title: string; body: string }>();
  @Output() onCancel = new EventEmitter<void>();

  editedTitle: string = '';
  editedBody: string = '';

  ngOnChanges(): void {
    if (this.isEditing) {
      this.editedTitle = this.post.title;
      this.editedBody = this.post.body;
    }
  }

  handleSave(): void {
    this.onSave.emit({
      id: this.post.id,
      title: this.editedTitle,
      body: this.editedBody
    });
  }
}

// === COMPONENT: PostListComponent ===
@Component({
  selector: 'app-post-list',
  template: `
    <div style="max-width: 800px; margin: 40px auto; padding: 20px; font-family: Arial, sans-serif;">
      <h1>Posts from API</h1>
      <p style="color: #666; margin-bottom: 20px;">
        Data fetched from JSONPlaceholder API with edit functionality
      </p>

      <div *ngIf="loading$ | async as loading" style="text-align: center; padding: 40px;">
        <p style="font-size: 18px; color: #666;">Loading posts...</p>
      </div>

      <div
        *ngIf="error$ | async as error"
        style="background-color: #ffebee; border: 1px solid #f44336; border-radius: 4px; padding: 16px; margin-bottom: 20px;"
      >
        <p style="color: #d32f2f; margin: 0;">Error loading posts: {{ error }}</p>
      </div>

      <div *ngIf="!(loading$ | async) && !(error$ | async)">
        <div *ngIf="posts$ | async as posts">
          <div *ngIf="posts.length === 0" style="color: #888; font-style: italic;">
            No posts to display
          </div>

          <app-post-item
            *ngFor="let post of posts"
            [post]="post"
            [isEditing]="editingId === post.id"
            (onEdit)="handleEdit(post.id)"
            (onSave)="handleSave($event)"
            (onCancel)="handleCancel()"
          ></app-post-item>
        </div>
      </div>
    </div>
  `
})
export class PostListComponent {
  posts$ = this.postService.posts$;
  loading$ = this.postService.loading$;
  error$ = this.postService.error$;
  editingId: number | null = null;

  constructor(private postService: PostService) {
    this.postService.getPosts().subscribe();
  }

  handleEdit(id: number): void {
    this.editingId = id;
  }

  handleSave(data: { id: number; title: string; body: string }): void {
    this.postService.updatePost(data.id, { title: data.title, body: data.body }).subscribe({
      next: () => {
        this.editingId = null;
      },
      error: () => {
        // Error is handled by the service
      }
    });
  }

  handleCancel(): void {
    this.editingId = null;
  }
}

// === COMPONENT: AppComponent ===
@Component({
  selector: 'app-root',
  template: `
    <app-post-list></app-post-list>
  `
})
export class AppComponent {}

// To run this application:
// 1. Create an Angular project: ng new my-app
// 2. Import HttpClientModule in app.module.ts or provideHttpClient() in app.config.ts (Angular 15+)
// 3. Import FormsModule in app.module.ts for ngModel
// 4. Declare PostItemComponent and PostListComponent in app.module.ts
// 5. Provide PostService (it's already providedIn: 'root')
// 6. Run: ng serve
// 7. Open http://localhost:4200 in your browser
//
// For standalone components (Angular 14+):
// 1. Create an Angular project: ng new my-app --standalone
// 2. Add standalone: true to each component decorator
// 3. Import CommonModule, FormsModule, and provideHttpClient() in application config
// 4. Import the components in the imports array of AppComponent
// 5. Run: ng serve
//
// Note: The @Output decorator needs to be imported from '@angular/core'
// Add: import { Component, Injectable, Input, Output, EventEmitter } from '@angular/core';
