const db = require('../db/connection');
const cTable = require('console.table');

class Department
{
    showAllDepartments()
    {
        const sql = `SELECT * FROM departments`;

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

module.exports = Department;