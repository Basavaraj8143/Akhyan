// TypeScript Reference Solution: Type a Function
// This solution adds appropriate type annotations to the utility functions

interface Item {
  price: number;
}

interface User {
  id: number;
  isActive: boolean;
}

function calculateTotal(items: Item[]): number {
  return items.reduce((sum: number, item: Item) => sum + item.price, 0);
}

function filterActive(users: User[]): User[] {
  return users.filter((user: User) => user.isActive);
}

function greet(name: string, age: number): string {
  return `Hello, ${name}! You are ${age} years old.`;
}

function findUserById(users: User[], id: number): User | undefined {
  return users.find((user: User) => user.id === id);
}

// Example usage (for testing):
// const items: Item[] = [{ price: 10 }, { price: 20 }, { price: 30 }];
// console.log(calculateTotal(items)); // 60

// const users: User[] = [
//   { id: 1, isActive: true },
//   { id: 2, isActive: false },
//   { id: 3, isActive: true }
// ];
// console.log(filterActive(users)); // [{ id: 1, isActive: true }, { id: 3, isActive: true }]
// console.log(greet("Alice", 25)); // "Hello, Alice! You are 25 years old."
// console.log(findUserById(users, 2)); // { id: 2, isActive: false }
// console.log(findUserById(users, 99)); // undefined
