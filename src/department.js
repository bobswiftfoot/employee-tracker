const db = require('../db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');

class Department
{
    showAllDepartments()
    {
        const departmentSql = `SELECT * FROM departments
                    ORDER BY departments.id`;

        return new Promise((resolve, reject) =>
        {
            db.query(departmentSql, (err, rows) =>
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

    addDepartment()
    {
        return new Promise((resolve, reject) =>
        {
            inquirer.prompt([
                {
                    type: 'input',
                    message: 'Enter the name of the Department: ',
                    name: 'name',
                },
            ])
                .then(response =>
                {
                    const departmentSql = `INSERT INTO departments (name)
                                    VALUES (?)`
                    const params = [response.name];

                    db.query(departmentSql, params, (err, result) =>
                    {
                        if (err)
                        {
                            console.log(err.message);
                            reject(err);
                        }
                        console.log("Added " + response.name + " to the database.");
                        resolve();
                    });
                });
        });
    }
    deleteDepartment()
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

                //Put all the names into an array
                let departments = [];
                for (let i = 0; i < result.length; i++)
                {
                    departments.push(result[i].id + " " + result[i].name);
                }

                inquirer.prompt([
                    {
                        type: 'list',
                        message: 'Which department do you want to remove?: ',
                        name: 'department',
                        choices: departments
                    }
                ])
                .then(response =>
                {
                    const departmentSql = `DELETE FROM departments WHERE id = ?`;
                    const params = [response.department.split(" ")[0]];
                    db.query(departmentSql, params, (err, rows) =>
                    {
                        if (err)
                        {
                            console.log(err.message);
                            reject(err);
                        }
                        console.log(response.department + " has been removed.")
                        resolve();
                    });
                });
            });
        });
    }

    showTotalBudget()
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
                        const departmentSql = `SELECT SUM(roles.salary) AS total_budget
                                                FROM employees e
                                                INNER JOIN roles ON e.role_id = roles.id
                                                INNER JOIN departments ON roles.department_id = departments.id AND departments.id = ?
                                                LEFT JOIN employees m ON e.manager_id = m.id
                                                ORDER BY e.id`;

                        const params = [response.department.split(" ")[0]];

                        db.query(departmentSql, params, (err, rows) =>
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
}

module.exports = Department;