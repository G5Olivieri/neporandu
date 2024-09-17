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
conn.end()