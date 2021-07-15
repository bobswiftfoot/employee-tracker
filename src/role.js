const db = require('../db/connection');
const cTable = require('console.table');

class Role
{
    showAllRoles()
    {
        const sql = `SELECT * FROM roles`;

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