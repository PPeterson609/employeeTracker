-- Create Database
CREATE DATABASE employee_db;

USE employee_db;

-- create department table
CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY LEY,
    name VARCHAR(30) NOT NULL
);

-- TABLE ROLE
CREATE TABLE ROLE (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department (id)
);

-- EMPLOYEE TABLE
CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL, 
    last_name VARCHAR(30) NOT NULL, 
    role_id INT, 
    manager_id INT, 
    FOREIGN KEY (role_id) REFERENCES role (id),
    FOREIGN KEY (manager_id) REFERENCES employee(id),
);



