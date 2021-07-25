const db = require('../db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');

class Role
{
    showAllRoles()
    {
        const roleSql = `SELECT roles.id, title, salary, departments.name AS department
                    FROM roles
                    JOIN departments ON roles.department_id = departments.id
                    ORDER BY roles.id`;

        return new Promise((resolve, reject) =>
        {
            db.query(roleSql, (err, rows) =>
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

    addRole()
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

                //Put all the rows into an array
                let departments = [];
                for (let i = 0; i < result.length; i++)
                {
                    departments.push(result[i].id + " " + result[i].name);
                }

                inquirer.prompt([
                    {
                        type: 'input',
                        message: 'Enter the new Role: ',
                        name: 'role',
                    },
                    {
                        type: 'input',
                        message: 'Enter salary for this Role: ',
                        name: 'salary',
                        validate(salary)
                        {
                            if(!isNaN(salary) && salary <= 99999999 && salary > 0)
                                return true;
                            return 'Please enter a valid salary'
                        }
                    },
                    {
                        type: 'list',
                        message: 'Enter the Department of the Role: ',
                        name: 'department',
                        choices: departments,
                    },
                ])
                    .then(response =>
                    {
                        const roleSql =  `INSERT INTO roles (title, salary, department_id)
                                        VALUES (?,?,?)`;
                        const params = [response.role, response.salary, response.department.split(" ")[0]];

                        db.query(roleSql, params, (err, result) =>
                        {
                            if (err)
                            {
                                console.log(err.message);
                                reject(err);
                            }
                            console.log("Added " + response.role + " to the database.");
                            resolve();
                        });
                    });
            });
        });
    }

    deleteRole()
    {
        return new Promise((resolve, reject) =>
        {
            //Get all the role names
            db.query(`SELECT id, title FROM roles`, (err, result) =>
            {
                if (err)
                {
                    console.log(err.message);
                    reject(err);
                }

                //Put all the names into an array
                let roles = [];
                for (let i = 0; i < result.length; i++)
                {
                    roles.push(result[i].id + " " + result[i].title);
                }

                inquirer.prompt([
                    {
                        type: 'list',
                        message: 'Which role do you want to remove?: ',
                        name: 'role',
                        choices: roles
                    }
                ])
                .then(response =>
                {
                    const roleSql = `DELETE FROM roles WHERE id = ?`;
                    const params = [response.role.split(" ")[0]];
                    db.query(roleSql, params, (err, rows) =>
                    {
                        if (err)
                        {
                            console.log(err.message);
                            reject(err);
                        }
                        console.log(response.role + " has been removed.")
                        resolve();
                    });
                });
            });
        });
    }
}

module.exports = Role;