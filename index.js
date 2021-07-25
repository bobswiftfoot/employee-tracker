const Department = require('./src/department.js');
const Roles = require('./src/role.js');
const Employees = require('./src/employee.js');
const inquirer = require("inquirer");

const departments = new Department();
const roles = new Roles();
const employees = new Employees();

async function main()
{
    console.log(`
        -----------------------------------------------------
        |  ______                 _                         |
        | |  ____|               | |                        |
        | | |__   _ __ ___  _ __ | | ___  _   _  ___  ___   |
        | |  __| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\  |
        | | |____| | | | | | |_) | | (_) | |_| |  __/  __/  |
        | |______|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|  |
        |                  | |             __/ |            |
        |   _____          |_|            |___/             |
        |  / ____|                         | |              |
        | | |  __  ___ _ __   ___ _ __ __ _| |_ ___  _ __   |
        | | | |_ |/ _ \\ '_ \\ / _ \\ '__/ _\` | __/ _ \\| '__|  |
        | | |__| |  __/ | | |  __/ | | (_| | || (_) | |     | 
        |  \\_____|\\___|_| |_|\\___|_|  \\__,_|\\__\\___/|_|     |
        -----------------------------------------------------`
    );

    askMainQuestion();
}

function askMainQuestion()
{
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'mainChoice',
            choices: [
            'View All Employees', 
            'View All Employees By Department', 
            'View All Employees By Manager', 
            'Add Employee',
            'Remove Employee',
            'Update Employee Role',
            'Update Employee Manager',
            'View All Roles',
            'Add Role',
            'Remove Role',
            'View All Departments',
            'Add Department',
            'Remove Department',
            'View Total Utilized Budget of a Department',
            'Quit']
        }
    ])
        .then(responce => 
            {
                switch(responce.mainChoice)
                {
                    case 'View All Employees':
                        {
                            employees.showAllEmployees().then(result =>
                                {
                                    askMainQuestion();
                                });
                            break;
                        }
                    case 'View All Employees By Department':
                        {
                            employees.showAllEmployeesByDepartment().then(result =>
                                {
                                    askMainQuestion();
                                });
                            break;
                        }
                    case 'View All Employees By Manager':
                        {
                            employees.showAllEmployeesByManager().then(result =>
                                {
                                    askMainQuestion();
                                });
                            break;
                        }
                    case 'Add Employee':
                        {
                            employees.addEmployee().then(result =>
                                {
                                    askMainQuestion();
                                });
                            break;
                        }
                    case 'Remove Employee':
                        {
                            employees.deleteEmployee().then(result =>
                                {
                                    askMainQuestion();
                                });
                            break;
                        }
                    case 'Update Employee Role':
                        {
                            employees.updateEmployeeRole().then(result =>
                                {
                                    askMainQuestion();
                                });
                            break;
                        }
                    case 'Update Employee Manager':
                        {
                            employees.updateEmployeeManager().then(result =>
                                {
                                    askMainQuestion();
                                });
                            break;
                        }
                    case 'View All Roles':
                        {
                            roles.showAllRoles().then(result =>
                                {
                                    askMainQuestion();
                                });
                            break;
                        }
                    case 'Add Role':
                        {                            
                            roles.addRole().then(result =>
                                {
                                    askMainQuestion();
                                });
                            break;
                        }
                    case 'Remove Role':
                        {                            
                            roles.deleteRole().then(result =>
                                {
                                    askMainQuestion();
                                });
                            break;
                        }
                    case 'View All Departments':
                        {
                            departments.showAllDepartments().then(result =>
                                {
                                    askMainQuestion();
                                });
                            break;
                        }
                    case 'Add Department':
                        {                          
                            departments.addDepartment().then(result =>
                                {
                                    askMainQuestion();
                                });
                            break;
                        }
                    case 'Remove Department':
                        {                          
                            departments.deleteDepartment().then(result =>
                                {
                                    askMainQuestion();
                                });
                            break;
                        }
                    case 'View Total Utilized Budget of a Department':
                        {                          
                            departments.showTotalBudget().then(result =>
                                {
                                    askMainQuestion();
                                });
                            break;
                        }
                    case 'Quit':
                        process.exit(0);
                }
            });
}

main();