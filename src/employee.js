const db = require('../db/connection');
const cTable = require('console.table');

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

module.exports = Employee;