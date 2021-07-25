const db = require('../db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');

class Employee
{
    showAllEmployees()
    {
        const employeeSql = `SELECT e.id, e.first_name, e.last_name, roles.title AS title, departments.name AS department, roles.salary AS salary, IFNULL(CONCAT(m.first_name, ' ', m.last_name),null) AS manager
                    FROM employees e
                    INNER JOIN roles ON e.role_id = roles.id
                    INNER JOIN departments ON roles.department_id = departments.id
                    LEFT JOIN employees m ON e.manager_id = m.id
                    ORDER BY e.id`;

        return new Promise((resolve, reject) =>
        {
            db.query(employeeSql, (err, rows) =>
            {
                if (err)
                {
                    console.log(err.message);
                    reject(err);
                }
                console.table(rows);
                resolve();
            });
        });
    }

    showAllEmployeesByDepartment()
    {
        return new Promise((resolve, reject) =>
        {
            //First get all the departments
            db.query(`SELECT id, name FROM departments`, (err, result) =>
            {
                if (err)
                {
                    console.log(err.message);
                    reject(err);
                }

                //Put all the departments into an array
                let departments = [];
                for (let i = 0; i < result.length; i++)
                {
                    departments.push(result[i].id + " " + result[i].name);
                }

                inquirer.prompt([
                    {
                        type: 'list',
                        message: 'Which department to look at?',
                        name: 'department',
                        choices: departments,
                    }
                ])
                    .then(response =>
                    {
                        const employeeSql = `SELECT e.id, e.first_name, e.last_name, roles.title AS title, departments.name AS department, roles.salary AS salary, IFNULL(CONCAT(m.first_name, ' ', m.last_name),null) AS manager
                                    FROM employees e
                                    INNER JOIN roles ON e.role_id = roles.id
                                    INNER JOIN departments ON roles.department_id = departments.id AND departments.id = ?
                                    LEFT JOIN employees m ON e.manager_id = m.id
                                    ORDER BY e.id`;

                        const params = [response.department.split(" ")[0]];

                        db.query(employeeSql, params, (err, rows) =>
                        {
                            if (err)
                            {
                                console.log(err.message);
                                reject(err);
                            }
                            console.table(rows);
                            resolve();
                        });
                    });

            });
        });
    }

    showAllEmployeesByManager()
    {
        return new Promise((resolve, reject) =>
        {
            //First get all the employees
            db.query(`SELECT id, first_name, last_name FROM employees`, (err, result) =>
            {
                if (err)
                {
                    console.log(err.message);
                    reject(err);
                }

                //Put all the managers into an array
                let managers = [];
                for (let i = 0; i < result.length; i++)
                {
                    managers.push(result[i].id + " " + result[i].first_name + " " + result[i].last_name);
                }

                inquirer.prompt([
                    {
                        type: 'list',
                        message: 'Which manager to look at?',
                        name: 'mananger',
                        choices: managers,
                    }
                ])
                    .then(response =>
                    {
                        const employeeSql = `SELECT e.id, e.first_name, e.last_name, roles.title AS title, departments.name AS department, roles.salary AS salary, IFNULL(CONCAT(m.first_name, ' ', m.last_name),null) AS manager
                                    FROM employees e
                                    INNER JOIN roles ON e.role_id = roles.id
                                    INNER JOIN departments ON roles.department_id = departments.id 
                                    INNER JOIN employees m ON e.manager_id = m.id AND e.manager_id = ? 
                                    ORDER BY e.id`;

                        const params = [response.mananger.split(" ")[0]];

                        db.query(employeeSql, params, (err, rows) =>
                        {
                            if (err)
                            {
                                console.log(err.message);
                                reject(err);
                            }
                            console.table(rows);
                            resolve();
                        });
                    });

            });
        });
    }

    addEmployee()
    {
        return new Promise((resolve, reject) =>
        {
            //First get all the roles
            db.query(`SELECT id, title FROM roles`, (err, result) =>
            {
                if (err)
                {
                    console.log(err.message);
                    reject(err);
                }

                //Put all the rows into an array
                let roles = [];
                for (let i = 0; i < result.length; i++)
                {
                    roles.push(result[i].id + " " + result[i].title);
                }

                //Get all the employee names
                db.query(`SELECT id, first_name, last_name FROM employees`, (err, result) =>
                {
                    if (err)
                    {
                        console.log(err.message);
                        reject(err);
                    }

                    //Put all the names into an array, with None as an option
                    let managers = [];
                    for (let i = 0; i < result.length; i++)
                    {
                        managers.push(result[i].id + " " + result[i].first_name + " " + result[i].last_name);
                    }
                    managers.push('None');

                    inquirer.prompt([
                        {
                            type: 'input',
                            message: 'Enter the first name of the Employee: ',
                            name: 'first_name',
                        },
                        {
                            type: 'input',
                            message: 'Enter the last name of the Employee: ',
                            name: 'last_name',
                        },
                        {
                            type: 'list',
                            message: 'Enter the Role of the Employee: ',
                            name: 'role',
                            choices: roles,
                        },
                        {
                            type: 'list',
                            message: 'Who does this employee report to?',
                            name: 'manager',
                            choices: managers,
                        }
                    ])
                        .then(response =>
                        {
                            let employeeSql = '';
                            let params = '';
                            if (response.employee_manager === "None")
                            {
                                employeeSql = `INSERT INTO employees (first_name, last_name, role_id)
                                                VALUES (?,?,?)`;
                                params = [response.first_name, response.last_name, response.role.split(" ")[0]];
                            }
                            else
                            {
                                employeeSql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                                                VALUES (?,?,?,?)`;
                                params = [response.first_name, response.last_name, response.role.split(" ")[0], response.manager.split(" ")[0]];
                            }

                            db.query(employeeSql, params, (err, result) =>
                            {
                                if (err)
                                {
                                    console.log(err.message);
                                    reject(err);
                                }
                                console.log("Added " + response.first_name + " " + response.last_name + " to the database.");
                                resolve();
                            });
                        });
                });
            });
        });
    }

    updateEmployeeRole()
    {
        return new Promise((resolve, reject) =>
        {
            //First get all the roles
            db.query(`SELECT id, title FROM roles`, (err, result) =>
            {
                if (err)
                {
                    console.log(err.message);
                    reject(err);
                }

                //Put all the rows into an array
                let roles = [];
                for (let i = 0; i < result.length; i++)
                {
                    roles.push(result[i].id + " " + result[i].title);
                }

                //Get all the employee names
                db.query(`SELECT id, first_name, last_name FROM employees`, (err, result) =>
                {
                    if (err)
                    {
                        console.log(err.message);
                        reject(err);
                    }

                    //Put all the names into an array
                    let employees = [];
                    for (let i = 0; i < result.length; i++)
                    {
                        employees.push(result[i].id + " " + result[i].first_name + " " + result[i].last_name);
                    }

                    inquirer.prompt([
                        {
                            type: 'list',
                            message: 'Which employee to update?',
                            name: 'employee',
                            choices: employees,
                        },
                        {
                            type: 'list',
                            message: 'Enter the new Role of the Employee: ',
                            name: 'role',
                            choices: roles,
                        }
                    ])
                        .then(response =>
                        {
                            const employeeSql =  `UPDATE employees SET role_id = ? 
                                            WHERE id = ?`;
                            const params = [response.role.split(" ")[0], response.employee.split(" ")[0]];

                            db.query(employeeSql, params, (err, result) =>
                            {
                                if (err)
                                {
                                    console.log(err.message);
                                    reject(err);
                                }
                                console.log("Updated employee.");
                                resolve();
                            });
                        });
                });
            });
        });
    }

    updateEmployeeManager()
    {
        return new Promise((resolve, reject) =>
        {
            //Get all the employee names
            db.query(`SELECT id, first_name, last_name FROM employees`, (err, result) =>
            {
                if (err)
                {
                    console.log(err.message);
                    reject(err);
                }

                //Put all the names into an array
                let employees = [];
                for (let i = 0; i < result.length; i++)
                {
                    employees.push(result[i].id + " " + result[i].first_name + " " + result[i].last_name);
                }
                let managers = [...employees];
                managers.push('None');

                inquirer.prompt([
                    {
                        type: 'list',
                        message: 'Which employee to update?',
                        name: 'employee',
                        choices: employees,
                    },
                    {
                        type: 'list',
                        message: 'Enter the new Manager of the Employee: ',
                        name: 'manager',
                        choices: managers,
                    }
                ])
                    .then(response =>
                    {
                        const employeeSql =  `UPDATE employees SET manager_id = ? 
                                        WHERE id = ?`;
                        const params = [response.manager.split(" ")[0], response.employee.split(" ")[0]];

                        db.query(employeeSql, params, (err, result) =>
                        {
                            if (err)
                            {
                                console.log(err.message);
                                reject(err);
                            }
                            console.log("Updated employee.");
                            resolve();
                        });
                    });
            });
        });
    }

    deleteEmployee()
    {
        return new Promise((resolve, reject) =>
        {
            //Get all the employee names
            db.query(`SELECT id, first_name, last_name FROM employees`, (err, result) =>
            {
                if (err)
                {
                    console.log(err.message);
                    reject(err);
                }

                //Put all the names into an array, with None as an option
                let employees = [];
                for (let i = 0; i < result.length; i++)
                {
                    employees.push(result[i].id + " " + result[i].first_name + " " + result[i].last_name);
                }

                inquirer.prompt([
                    {
                        type: 'list',
                        message: 'Which employee do you want to remove?: ',
                        name: 'employee',
                        choices: employees
                    }
                ])
                .then(response =>
                {
                    const employeeSql = `DELETE FROM employees WHERE id = ?`;
                    const params = [response.employee.split(" ")[0]];
                    db.query(employeeSql, params, (err, rows) =>
                    {
                        if (err)
                        {
                            console.log(err.message);
                            reject(err);
                        }
                        console.log("Employee has been removed.")
                        resolve();
                    });
                });
            });
        });
    }
}

module.exports = Employee;