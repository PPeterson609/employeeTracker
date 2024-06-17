const inquirer = require('inquirer');
const mysql = require('mysql2');

//connect to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employee_db'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the employee_db database.');
  startApp();
});

// Start the application
function startApp() {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View All Departments',
      'View All Roles',
      'View All Employees',
      'Add Department',
      'Add Role',
      'Add Employee',
      'Update Employee Role',
      'Exit'
    ]
  }).then(answer => {
    switch (answer.action) {
      case 'View All Departments':
        viewDepartments();
        break;
      case 'View All Roles':
        viewRoles();
        break;
      case 'View All Employees':
        viewEmployees();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'Exit':
        connection.end();
        break;
    }
  }).catch(err => {
    console.error('Error with inquirer prompt:', err);
    startApp();
  });
}

// View all departments
function viewDepartments() {
  const query = 'SELECT * FROM department';
  connection.query(query, (err, res) => {
    if (err) {
      console.error('Error fetching departments:', err);
    } else {
      console.table(res);
    }
    startApp();
  });
}

// View all roles
function viewRoles() {
  const query = `SELECT role.id, role.title, role.salary, department.name AS department
                 FROM role
                 LEFT JOIN department ON role.department_id = department.id`;
  connection.query(query, (err, res) => {
    if (err) {
      console.error('Error fetching roles:', err);
    } else {
      console.table(res);
    }
    startApp();
  });
}

// View all employees
function viewEmployees() {
  const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id
                 FROM employee
                 LEFT JOIN role ON employee.role_id = role.id
                 LEFT JOIN department ON role.department_id = department.id`;
  connection.query(query, (err, res) => {
    if (err) {
      console.error('Error fetching employees:', err);
    } else {
      console.table(res);
    }
    startApp();
  });
}

// Add a department
function addDepartment() {
  inquirer.prompt({
    name: 'name',
    type: 'input',
    message: 'Enter the name of the department:'
  }).then(answer => {
    const query = 'INSERT INTO department SET ?';
    connection.query(query, { name: answer.name }, (err, res) => {
      if (err) {
        console.error('Error adding department:', err);
      } else {
        console.log('Department added successfully.');
      }
      startApp();
    });
  }).catch(err => {
    console.error('Error with inquirer prompt:', err);
    startApp();
  });
}

// Add a role
function addRole() {
  inquirer.prompt([
    {
      name: 'title',
      type: 'input',
      message: 'Enter the title of the role:'
    },
    {
      name: 'salary',
      type: 'input',
      message: 'Enter the salary of the role:'
    },
    {
      name: 'department_id',
      type: 'input',
      message: 'Enter the department ID for this role:'
    }
  ]).then(answer => {
    const query = 'INSERT INTO role SET ?';
    connection.query(query, {
      title: answer.title,
      salary: answer.salary,
      department_id: answer.department_id
    }, (err, res) => {
      if (err) {
        console.error('Error adding role:', err);
      } else {
        console.log('Role added successfully.');
      }
      startApp();
    });
  }).catch(err => {
    console.error('Error with inquirer prompt:', err);
    startApp();
  });
}

// Add an employee
function addEmployee() {
  inquirer.prompt([
    {
      name: 'first_name',
      type: 'input',
      message: 'Enter the first name of the employee:'
    },
    {
      name: 'last_name',
      type: 'input',
      message: 'Enter the last name of the employee:'
    },
    {
      name: 'role_id',
      type: 'input',
      message: 'Enter the role ID for this employee:'
    },
    {
      name: 'manager_id',
      type: 'input',
      message: 'Enter the manager ID for this employee (leave blank if none):'
    }
  ]).then(answer => {
    const query = 'INSERT INTO employee SET ?';
    connection.query(query, {
      first_name: answer.first_name,
      last_name: answer.last_name,
      role_id: answer.role_id,
      manager_id: answer.manager_id || null
    }, (err, res) => {
      if (err) {
        console.error('Error adding employee:', err);
      } else {
        console.log('Employee added successfully.');
      }
      startApp();
    });
  }).catch(err => {
    console.error('Error with inquirer prompt:', err);
    startApp();
  });
}

// Update an employee role
function updateEmployeeRole() {
  inquirer.prompt([
    {
      name: 'employee_id',
      type: 'input',
      message: 'Enter the ID of the employee whose role you want to update:'
    },
    {
      name: 'role_id',
      type: 'input',
      message: 'Enter the new role ID for this employee:'
    }
  ]).then(answer => {
    const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
    connection.query(query, [answer.role_id, answer.employee_id], (err, res) => {
      if (err) {
        console.error('Error updating employee role:', err);
      } else {
        console.log('Employee role updated successfully.');
      }
      startApp();
    });
  }).catch(err => {
    console.error('Error with inquirer prompt:', err);
    startApp();
  });
}
