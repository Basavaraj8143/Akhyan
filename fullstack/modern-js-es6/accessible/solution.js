/*
 * Project: Refactor to ES6
 * Modernize a Legacy Employee Utility
 *
 * ES6+ features demonstrated:
 * 1. const declarations
 * 2. Arrow functions
 * 3. Array filter()
 * 4. Array map()
 * 5. Template literals
 */

// Employee data
const employees = [
  { name: "Asha", department: "Engineering", active: true, salary: 45000 },
  { name: "Ravi", department: "Support", active: false, salary: 32000 },
  { name: "Meera", department: "Engineering", active: true, salary: 52000 }
];

// Get only active employees
const getActiveEmployees = (list) => {
  return list.filter((employee) => employee.active === true);
};

// Generate employee labels
const createEmployeeLabels = (list) => {
  return list.map(
    (employee) => `${employee.name} (${employee.department})`
  );
};

// Process employee data
const activeEmployees = getActiveEmployees(employees);
const labels = createEmployeeLabels(activeEmployees);

// Display results
console.log(`Active employees: ${activeEmployees.length}`);
console.log(labels);

/*
Expected output:

Active employees: 2
[ 'Asha (Engineering)', 'Meera (Engineering)' ]
*/