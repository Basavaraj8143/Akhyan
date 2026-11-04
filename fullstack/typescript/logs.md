# Work Log – TypeScript Node

**Domain:** Web Development
**Node:** TypeScript
**Status:** Projects completed with specifications and reference implementations

## 1. Accessible – Type a Function

**Objective:** Add correct types to a set of functions.

**Work completed:**
- Designed a type-annotation exercise for utility functions (calculateTotal, filterActive, greet, findUserById).
- Prepared the project specification (`project.json`).
- Defined evaluation criteria covering function parameter types, return type annotations, interface/type definitions, and type safety.
- Prepared a reference implementation using interfaces (Item, User), explicit type annotations for parameters and returns, and type-safe implementations.

## 2. Core – Type an App

**Objective:** Convert a small JavaScript app to TypeScript.

**Work completed:**
- Designed a TypeScript conversion project for a TodoApp class.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria for Task interface definition, class property types, method parameter and return types, and type safety.
- Prepared a reference implementation with:
  - Task interface defining id, title, completed, and createdAt types
  - Fully typed TodoApp class with private properties
  - Type-annotated methods (addTask, completeTask, deleteTask, getAllTasks, getCompletedTasks)
  - Proper handling of nullable returns (Task | undefined, Task | null)

## 3. Stretch – Generic Utilities

**Objective:** Write reusable generic typed utilities.

**Work completed:**
- Designed a generic utilities project implementing five reusable functions.
- Prepared the project specification (`project.json`).
- Defined evaluation criteria covering generic type parameters and constraints, type annotations and inference, function implementation correctness, and type safety/reusability.
- Prepared a reference implementation with the following generic utilities:
  - `first<T>` - Returns first element or undefined
  - `last<T>` - Returns last element or undefined
  - `mapObject<K, V, U>` - Transforms object values with a mapper function
  - `pluck<T, K extends keyof T>` - Extracts property values from object array
  - `zip<T, U>` - Combines two arrays into pairs
- Included comprehensive example usage for each utility.

## Overall Summary

| Difficulty | Project | Status |
|---|---|---|
| Accessible | Type a Function | Completed |
| Core | Type an App | Completed |
| Stretch | Generic Utilities | Completed |

**Deliverables prepared:**
- 3 project specifications (`project.json`)
- 3 reference implementations (`.ts` files)
- Evaluation rubrics for all three projects
- Valid alternatives and mistakes-to-check lists
- Example usage comments in solutions

**Key TypeScript concepts covered:**
- Basic type annotations (string, number, boolean, Date)
- Interface definitions
- Generic type parameters
- Type constraints (extends)
- Nullable types (| undefined, | null)
- Array typing with generics
- Record types
- Type inference
- Keyof operator

**Next step:** Technical review, execution testing, and verification of all reference implementations before final submission.
