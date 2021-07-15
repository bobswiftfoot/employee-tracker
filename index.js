const Department = require('./src/department.js');
const Roles = require('./src/role.js');
const Employees = require('./src/employee.js');

const departments = new Department();
const roles = new Roles();
const employees = new Employees();

departments.showAllDepartments();
roles.showAllRoles();
employees.showAllEmployees();