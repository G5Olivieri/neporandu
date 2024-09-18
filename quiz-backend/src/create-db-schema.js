const mysql = require('mysql2')

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'my-secret-pw',
    database: 'quiz'
})

conn.execute(`
create table if not exists users(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username varchar(256) NOT NULL UNIQUE,
    password varchar(1024) NOT NULL
);
`, (err, results, fields) => {
    console.log(err, results, fields)
})

conn.execute(`
create table if not exists categories(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name varchar(256) NOT NULL UNIQUE
);
`, (err, results, fields) => {
    console.log(err, results, fields)
})

conn.execute(`
create table if not exists questions(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    question varchar(256) NOT NULL,
    category_id int not null,
    foreign key(category_id) references categories(id)
);
`, (err, results, fields) => {
    console.log(err, results, fields)
})

conn.execute(`
create table if not exists options(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    question_id int not null,
    value varchar(256) not null,
    correct boolean not null,
    foreign key(question_id) references questions(id)
);
`, (err, results, fields) => {
    console.log(err, results, fields)
})

conn.end()