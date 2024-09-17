const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql2/promise')

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

        // TODO: compare hashes instead
        if (results[0].password !== req.body.password) {
            return res.status(401).send({
                error: "Usuário ou senha inválida"
            }).end()
        }

        return res.send({
            "access_token": "LOGGED",
            "expires_in": 3600,
            "token_type": "Bearer"
        }).end()
    })

    app.post('/signup', (req, res) => {
        res.end("Sign up")
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