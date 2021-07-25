INSERT INTO departments (name)
VALUES
    ('Engineering'),
    ('Art'),
    ('QA');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Programmer', 60000.00, 1),
    ('Artist', 50000.00, 2),
    ('QA Engineer', 40000.00, 3),
    ('Lead Programmer', 100000, 1),
    ('Lead Artist', 100000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
    ('James', 'Fraser', 4, null),
    ('Jack', 'London', 5, null),
    ('Robert', 'Bruce', 3, 1),
    ('Peter', 'Greenaway', 2, 2),
    ('Derek', 'Jarman', 1, 1),
    ('Paolo', 'Pasolini', 2, 2);