const db = require('../db/connection');
const cTable = require('console.table');

class Department
{
    showAllDepartments()
    {
        const sql = `SELECT * FROM departments
                    ORDER BY departments.id`;

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

    addDepartment(name)
    {
        const sql = `INSERT INTO departments (name)
                    VALUES (?)`;
        const params = [name];

        db.query(sql, params, (err, result) =>
        {
            if (err)
            {
                console.log(err.message);
                return;
            }
            console.log("Added " + name + " to the database.");
        });
    }
}

module.exports = Department;