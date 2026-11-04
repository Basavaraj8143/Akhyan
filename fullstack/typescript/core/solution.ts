// TypeScript Reference Solution: Type an App
// This solution converts the TodoApp class to TypeScript with full type annotations

interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

class TodoApp {
  private tasks: Task[];
  private nextId: number;

  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

  addTask(title: string): Task {
    const task: Task = {
      id: this.nextId++,
      title: title,
      completed: false,
      createdAt: new Date()
    };
    this.tasks.push(task);
    return task;
  }

  completeTask(id: number): Task | undefined {
    const task = this.tasks.find((t: Task) => t.id === id);
    if (task) {
      task.completed = true;
    }
    return task;
  }

  deleteTask(id: number): Task | null {
    const index = this.tasks.findIndex((t: Task) => t.id === id);
    if (index !== -1) {
      const deleted = this.tasks.splice(index, 1)[0];
      return deleted;
    }
    return null;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getCompletedTasks(): Task[] {
    return this.tasks.filter((t: Task) => t.completed);
  }
}

// Example usage (for testing):
// const todoApp = new TodoApp();
// const task1 = todoApp.addTask("Learn TypeScript");
// const task2 = todoApp.addTask("Build a project");
// console.log(todoApp.getAllTasks()); // Array with 2 tasks
// todoApp.completeTask(task1.id);
// console.log(todoApp.getCompletedTasks()); // Array with 1 completed task
// const deleted = todoApp.deleteTask(task2.id);
// console.log(deleted); // Deleted task
// console.log(todoApp.getAllTasks()); // Array with 1 task
