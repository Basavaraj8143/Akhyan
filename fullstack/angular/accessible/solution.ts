// Angular Reference Solution: First Components
// This solution demonstrates Angular components with data binding

import { Component, Input, Output, EventEmitter } from '@angular/core';

// === COMPONENT: ButtonComponent ===
@Component({
  selector: 'app-button',
  template: `
    <button
      (click)="onClick.emit()"
      [disabled]="disabled"
      [style.opacity]="disabled ? 0.5 : 1"
      [style.cursor]="disabled ? 'not-allowed' : 'pointer'"
      style="padding: 8px 16px; margin: 4px;"
    >
      {{ label }}
    </button>
  `
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Output() onClick = new EventEmitter<void>();
}

// === COMPONENT: CounterComponent ===
@Component({
  selector: 'app-counter',
  template: `
    <div style="border: 1px solid #ccc; padding: 16px; margin: 8px;">
      <h3>Counter</h3>
      <p>Count: {{ count }}</p>
      <app-button
        label="Increment"
        (onClick)="increment()"
      ></app-button>
      <app-button
        label="Decrement"
        (onClick)="decrement()"
        [disabled]="count === 0"
      ></app-button>
    </div>
  `
})
export class CounterComponent {
  count: number = 0;

  increment(): void {
    this.count++;
  }

  decrement(): void {
    if (this.count > 0) {
      this.count--;
    }
  }
}

// === COMPONENT: AppComponent ===
@Component({
  selector: 'app-root',
  template: `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>Angular Components Demo</h1>
      <p>Demonstrating components with data binding</p>
      <app-counter></app-counter>
      <app-counter></app-counter>
    </div>
  `
})
export class AppComponent {}

// To run this application:
// 1. Create an Angular project: ng new my-app
// 2. Choose your preferred configuration (CSS/SCSS, routing, etc.)
// 3. Replace the contents of src/app/app.component.ts with this code
// 4. Update src/app/app.module.ts to declare ButtonComponent and CounterComponent
// 5. Run: ng serve
// 6. Open http://localhost:4200 in your browser
//
// For standalone components (Angular 14+):
// 1. Create an Angular project: ng new my-app --standalone
// 2. Replace the contents of src/app/app.component.ts with this code
// 3. Add standalone: true to each component decorator
// 4. Import the components in the imports array of AppComponent
// 5. Run: ng serve
