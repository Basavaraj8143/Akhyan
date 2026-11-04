// Angular Reference Solution: Interactive App
// This solution demonstrates a routed, service-driven Angular application

import { Component, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

// === MODEL: Task ===
export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// === SERVICE: TaskService ===
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor() {
    // Initialize with some sample data
    this.tasks = [
      { id: 1, title: 'Learn Angular', completed: false },
      { id: 2, title: 'Build a project', completed: false },
      { id: 3, title: 'Master RxJS', completed: true }
    ];
    this.tasksSubject.next(this.tasks);
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  addTask(title: string): Observable<Task> {
    const newTask: Task = {
      id: Date.now(),
      title: title,
      completed: false
    };
    this.tasks = [...this.tasks, newTask];
    this.tasksSubject.next(this.tasks);
    return new Observable(observer => {
      observer.next(newTask);
      observer.complete();
    });
  }

  toggleTask(id: number): Observable<Task> {
    this.tasks = this.tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    this.tasksSubject.next(this.tasks);
    const updatedTask = this.tasks.find(task => task.id === id)!;
    return new Observable(observer => {
      observer.next(updatedTask);
      observer.complete();
    });
  }

  deleteTask(id: number): Observable<void> {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.tasksSubject.next(this.tasks);
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }
}

// === COMPONENT: TaskListComponent ===
@Component({
  selector: 'app-task-list',
  template: `
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; font-family: Arial, sans-serif;">
      <h1>Task Manager</h1>

      <div style="margin-bottom: 20px;">
        <button
          routerLink="/add"
          style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          Add New Task
        </button>
      </div>

      <div *ngIf="tasks$ | async as tasks" style="border: 1px solid #ddd; border-radius: 4px; padding: 16px;">
        <div *ngIf="tasks.length === 0" style="color: #888; font-style: italic;">
          No tasks to display
        </div>

        <div
          *ngFor="let task of tasks"
          [style.text-decoration]="task.completed ? 'line-through' : 'none'"
          [style.color]="task.completed ? '#888' : '#000'"
          style="display: flex; align-items: center; padding: 8px; border-bottom: 1px solid #eee;"
        >
          <input
            type="checkbox"
            [checked]="task.completed"
            (change)="toggleTask(task.id)"
            style="margin-right: 8px;"
          />
          <span style="flex: 1;">{{ task.title }}</span>
          <button
            (click)="deleteTask(task.id)"
            style="padding: 4px 8px; background-color: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >
            Delete
          </button>
        </div>
      </div>

      <div style="margin-top: 20px; color: #666;">
        <p>Total tasks: {{ (tasks$ | async)?.length || 0 }} | Completed: {{ (tasks$ | async)?.filter(t => t.completed).length || 0 }}</p>
      </div>
    </div>
  `
})
export class TaskListComponent {
  tasks$ = this.taskService.getTasks();

  constructor(private taskService: TaskService) {}

  toggleTask(id: number): void {
    this.taskService.toggleTask(id).subscribe();
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe();
  }
}

// === COMPONENT: TaskFormComponent ===
@Component({
  selector: 'app-task-form',
  template: `
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; font-family: Arial, sans-serif;">
      <h1>Add New Task</h1>

      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Task Title:</label>
        <input
          type="text"
          [(ngModel)]="taskTitle"
          (keyup.enter)="addTask()"
          placeholder="Enter task title..."
          style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; font-size: 16px;"
        />
      </div>

      <div style="margin-bottom: 20px;">
        <button
          (click)="addTask()"
          [disabled]="!taskTitle || taskTitle.trim() === ''"
          style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;"
        >
          Add Task
        </button>
        <button
          routerLink="/tasks"
          style="padding: 8px 16px; background-color: #9e9e9e; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          Cancel
        </button>
      </div>
    </div>
  `
})
export class TaskFormComponent {
  taskTitle: string = '';

  constructor(private taskService: TaskService, private router: Router) {}

  addTask(): void {
    if (this.taskTitle && this.taskTitle.trim() !== '') {
      this.taskService.addTask(this.taskTitle.trim()).subscribe(() => {
        this.taskTitle = '';
        this.router.navigate(['/tasks']);
      });
    }
  }
}

// === COMPONENT: AppComponent ===
@Component({
  selector: 'app-root',
  template: `
    <div style="font-family: Arial, sans-serif;">
      <nav style="background-color: #333; padding: 16px;">
        <a
          routerLink="/tasks"
          routerLinkActive="active"
          style="color: white; text-decoration: none; margin-right: 20px; cursor: pointer;"
        >
          Tasks
        </a>
        <a
          routerLink="/add"
          routerLinkActive="active"
          style="color: white; text-decoration: none; cursor: pointer;"
        >
          Add Task
        </a>
      </nav>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .active {
      font-weight: bold;
      text-decoration: underline;
    }
  `]
})
export class AppComponent {}

// === ROUTING CONFIGURATION ===
// Add this to your AppRoutingModule or app-routing.module.ts:
//
// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { TaskListComponent } from './task-list.component';
// import { TaskFormComponent } from './task-form.component';
//
// const routes: Routes = [
//   { path: 'tasks', component: TaskListComponent },
//   { path: 'add', component: TaskFormComponent },
//   { path: '', redirectTo: '/tasks', pathMatch: 'full' }
// ];
//
// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule {}

// To run this application:
// 1. Create an Angular project with routing: ng new my-app --routing
// 2. Import FormsModule in app.module.ts for ngModel
// 3. Declare the components in app.module.ts
// 4. Provide TaskService in app.module.ts (it's already providedIn: 'root')
// 5. Set up routing as shown above
// 6. Run: ng serve
// 7. Open http://localhost:4200 in your browser
//
// For standalone components (Angular 14+):
// 1. Create an Angular project: ng new my-app --standalone
// 2. Add standalone: true to each component decorator
// 3. Import CommonModule, FormsModule, and RouterModule in component imports arrays
// 4. Configure routes in the application config
// 5. Run: ng serve
