const db = require('../db/connection');
const cTable = require('console.table');

class Employee
{
    showAllEmployees()
    {
        const sql = `SELECT * FROM employees`;

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