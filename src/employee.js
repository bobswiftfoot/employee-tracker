const db = require('../db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');

class Employee
{
    showAllEmployees()
    {
        const sql = `SELECT e.id, e.first_name, e.last_name, roles.title AS title, departments.name AS department, roles.salary AS salary, IFNULL(CONCAT(m.first_name, ' ', m.last_name),null) AS manager
                    FROM employees e
                    INNER JOIN roles ON e.role_id = roles.id
                    INNER JOIN departments ON roles.department_id = departments.id
                    LEFT JOIN employees m ON e.manager_id = m.id
                    ORDER BY e.id`;

        return new Promise((resolve, reject) =>
        {
            db.query(sql, (err, rows) =>
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
                            name: 'employee_role',
                            choices: roles,
                        },
                        {
                            type: 'list',
                            message: 'Who does this employee report to?',
                            name: 'employee_manager',
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
                                params = [response.first_name, response.last_name, response.employee_role.split(" ")[0]];
                            }
                            else
                            {
                                employeeSql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                                                VALUES (?,?,?,?)`;
                                params = [response.first_name, response.last_name, response.employee_role.split(" ")[0], response.employee_manager.split(" ")[0]];
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

    updateEmployee(employee_id, role_id)
    {
        const sql = `UPDATE employees SET role_id = ? 
                    WHERE id = ?`;
        const params = [role_id, employee_id];

        db.query(sql, params, (err, result) =>
        {
            if (err)
            {
                console.log(err.message);
            }
            else if (!result.affectedRows)
            {
                console.log("Candidate not found");
            }
            else
            {
                console.log("Updated employee.");
            }
        });
    }
}

module.exports = Employee;