const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql2/promise')
const argon2 = require('@node-rs/argon2')
const jose = require('jose')

const secret = new TextEncoder().encode(
    'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
)
const alg = 'HS256'

/**
 * 
 * @param {mysql.Pool} pool 
 * @returns {express.Application}
 */
function buildApp(pool) {
    const app = express()

    app.use(cors())
    app.use(bodyParser.json())

    app.post('/signin', async (req, res) => {
        const [results, fields] = await pool.query("SELECT * FROM users WHERE username=?", [req.body.username])
        if (results.length === 0) {
            console.log("Não encontrou usuário", req.body.username)
            res.status(401).send({ error: "Usuário ou senha inválida" }).end()
            return
        }

        if (!(await argon2.verify(results[0].password, req.body.password))) {
            return res.status(401).send({
                error: "Usuário ou senha inválida"
            }).end()
        }


        const jwt = await new jose.SignJWT()
            .setSubject(results[0].id)
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(secret)

        return res.send({
            "accessToken": jwt,
            "expiresIn": 7200,
            "tokenType": "Bearer"
        }).end()
    })

    app.post('/signup', async (req, res) => {
        const { username, password } = req.body
        const hashedPassword = await argon2.hash(password, {
            memoryCost: 47104,
            timeCost: 1,
            parallelism: 1
        })
        try {
            const [results, fields] = await pool.execute('INSERT INTO users(username, password) VALUES(?, ?)', [username, hashedPassword])

            const jwt = await new jose.SignJWT()
                .setSubject(results.insertId)
                .setProtectedHeader({ alg })
                .setIssuedAt()
                .setExpirationTime('2h')
                .sign(secret)

            return res.send({
                "accessToken": jwt,
                "expiresIn": 7200,
                "tokenType": "Bearer"
            }).end()
        } catch (e) {
            console.error(e)
            if (e.code == 'ER_DUP_ENTRY') {
                return res.status(409).end()
            }
            return res.status(500).end()
        }
    })

    app.get('/userinfo', async (req, res) => {
        const authorizationHeader = req.header('authorization')
        const [scheme, token] = authorizationHeader.split(' ')
        if (scheme.toLowerCase() !== 'bearer') {
            return res.status(401).end()
        }
        try {
            const { payload } = await jose.jwtVerify(token, secret)
            if (!payload) {
                return res.status(401).end()
            }
            const [results, fields] = await pool.query('SELECT username FROM users WHERE id=?', [payload.sub])
            if (results.length > 0) {
                return res.send(results[0]).end()
            }
            return res.status(401).end()
        } catch (e) {
            console.error(e)
            return res.status(500).end()
        }
    })

    app.get('/categories', async (req, res) => {
        const authorizationHeader = req.header('authorization')
        const [scheme, token] = authorizationHeader.split(' ')
        if (scheme.toLowerCase() !== 'bearer') {
            return res.status(401).end()
        }
        try {
            const { payload } = await jose.jwtVerify(token, secret)
            if (!payload) {
                return res.status(401).end()
            }
            const [results, fields] = await pool.query('SELECT id, name FROM categories')
            return res.send(results).end()
        } catch (e) {
            console.error(e)
            return res.status(500).end()
        }
    })

    app.get('/categories/:id', async (req, res) => {
        const authorizationHeader = req.header('authorization')
        const [scheme, token] = authorizationHeader.split(' ')
        if (scheme.toLowerCase() !== 'bearer') {
            return res.status(401).end()
        }
        try {
            const { payload } = await jose.jwtVerify(token, secret)
            const category = {}
            if (!payload) {
                return res.status(401).end()
            }
            const [results] = await pool.query('SELECT id, name FROM categories WHERE id=?', [req.params.id])
            if (results.length === 0) {
                return res.status(404).end()
            }
            category['id'] = results[0].id
            category['name'] = results[0].name
            category['questions'] = []
            const [questionsResults] = await pool.query('SELECT id, question FROM questions WHERE category_id=?', [req.params.id])
            for (let questionResult of questionsResults) {
                question = { id: questionResult.id, question: questionResult.question }
                const [optionsResults] = await pool.query('SELECT id, value, correct FROM options WHERE question_id=?', [questionResult.id])
                question['options'] = optionsResults
                category['questions'].push(question)
            }
            return res.send(category).end()
        } catch (e) {
            console.error(e)
            return res.status(500).end()
        }
    })
    return app
}

async function main() {
    const pool = await mysql.createPool({
        host: 'localhost',
        user: 'root',
        port: 3306,
        password: 'my-secret-pw',
        database: 'quiz',
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
        idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
    })

    const app = buildApp(pool)

    const server = app.listen(8080, () => {
        console.log("Running http://localhost:8080")
    })

    process.on('SIGTERM', () => {
        console.log("Server closing")
        console.log("DB connections closing")
        pool.end().finally(() => {
            console.log("DB connections closed")
            server.close(() => {
                console.log("Server closed")
            })
        })
    })
}

main().catch(console.error)