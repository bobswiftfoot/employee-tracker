const db = require('../db/connection');
const cTable = require('console.table');

class Role
{
    showAllRoles()
    {
        const sql = `SELECT roles.id, title, salary, departments.name AS department
                    FROM roles
                    JOIN departments ON roles.department_id = departments.id`;

        db.query(sql, (err, rows) =>
        {
            if(err)
            {
                console.log(err.message);
                return;
            }
            console.table(rows);
        });
    }
}

module.exports = Role;