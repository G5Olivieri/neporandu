const quizes = [{
    category: 'Javascript',
    questions: [
        {
            question: 'Inside which HTML element do we put the JavaScript?',
            options: [
                {
                    value: '<script>',
                    correct: true,
                },
                {
                    value: '<javascript>',
                    correct: false,
                },
                {
                    value: '<scripting>',
                    correct: false,
                },
                {
                    value: '<js>',
                    correct: false,
                },
            ]
        },
        {
            question: 'What is the correct JavaScript syntax to change the content of the HTML element below?\n\n<p id="demo">This is a demonstration.</p>',
            options: [
                {
                    value: '#demo.innerHTML = "Hello World!";',
                    correct: false,
                },
                {
                    value: 'document.getElement("p").innerHTML = "Hello World!";',
                    correct: false,
                },
                {
                    value: 'document.getElementById("demo").innerHTML = "Hello World!";',
                    correct: true,
                },
                {
                    value: 'document.getElementByName("p").innerHTML = "Hello World!";',
                    correct: false,
                },
            ]
        },
        {
            question: 'Where is the correct place to insert a JavaScript?',
            options: [
                {
                    value: 'The <head> section',
                    correct: false,
                },
                {
                    value: 'The <body> section',
                    correct: false,
                },
                {
                    value: 'Both the <head> section and the <body> section are correct',
                    correct: true,
                },
            ]
        },
        {
            question: 'What is the correct syntax for referring to an external script called "xxx.js"?',
            options: [
                {
                    value: '<script src="xxx.js">',
                    correct: true,
                },
                {
                    value: '<script href="xxx.js">',
                    correct: false,
                },
                {
                    value: '<script name="xxx.js">',
                    correct: false,
                },
            ]
        },
        {
            question: 'The external JavaScript file must contain the <script> tag.',
            options: [
                {
                    value: 'False',
                    correct: true,
                },
                {
                    value: 'True',
                    correct: false,
                },
            ]
        }
    ]
}]

const mysql = require('mysql2')

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'my-secret-pw',
    database: 'quiz'
})

for (let quiz of quizes) {
    conn.execute('INSERT INTO categories(name) VALUES(?)', [quiz.category], (err, results, fields) => {
        if (err) {
            console.error(err)
            return
        }
        for (let question of quiz.questions) {
            conn.execute('INSERT INTO questions(category_id, question) VALUES(?, ?)', [results.insertId, question.question], (err, results, fields) => {
                if (err) {
                    console.error(err)
                    return
                }
                sql = `INSERT INTO options(question_id, value, correct) VALUES${question.options.map(() => ['(?,?,?)']).join(',')};`
                values = question.options.reduce((acc, cur) => [...acc, results.insertId, cur.value, cur.correct], [])
                conn.execute(sql, values, (err, results, fields) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
            })
        }
    })
}
