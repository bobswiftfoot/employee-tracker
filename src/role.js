const db = require('../db/connection');
const cTable = require('console.table');

class Role
{
    showAllRoles()
    {
        const sql = `SELECT roles.id, title, salary, departments.name AS department
                    FROM roles
                    JOIN departments ON roles.department_id = departments.id
                    ORDER BY roles.id`;

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

    addRole(title, salary, department_id)
    {
        const sql = `INSERT INTO roles (title, salary, department_id)
                    VALUES (?,?,?)`;
        const params = [title, salary, department_id];

        db.query(sql, params, (err, result) =>
        {
            if (err)
            {
                console.log(err.message);
                return;
            }
            console.log("Added " + title + " to the database.");
        });
    }
}

module.exports = Role;