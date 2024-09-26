const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const argon2 = require('@node-rs/argon2')
const jose = require('jose')
const { MongoClient } = require("mongodb");
const { MongoUserRepository, MongoQuizRepository } = require('./mongo')
// const mysql = require('mysql2/promise')
// const { MySQLUserRepository, MySQLQuizRepository } = require('./db')

const secret = new TextEncoder().encode(
    'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
)
const alg = 'HS256'

/**
 * 
 * @param {MongoUserRepository} userRepository 
 * @param {MongoQuizRepository} quizRepository 
 * @returns {express.Application}
 */
function buildApp(userRepository, quizRepository) {
    const app = express()

    app.use(cors())
    app.use(bodyParser.json())

    app.post('/signin', async (req, res) => {
        const result = await userRepository.getUserByUsername(req.body.username)
        if (!result.ok) {
            console.log("Não encontrou usuário", req.body.username)
            res.status(401).send({ error: "Usuário ou senha inválida" }).end()
            return
        }

        if (!(await argon2.verify(result.user.password, req.body.password))) {
            return res.status(401).send({
                error: "Usuário ou senha inválida"
            }).end()
        }

        const jwt = await new jose.SignJWT()
            .setSubject(result.user.id)
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
        const result = await userRepository.createUser({
            username,
            password: hashedPassword,
        })

        if (!result.ok) {
            console.error(result.error)
            return res.status(405).end()
        }

        const jwt = await new jose.SignJWT()
            .setSubject(result.user.id)
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
            const result = await userRepository.getUserById(payload.sub)
            if (result.ok) {
                return res.send(result.user).end()
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
            const categories = await quizRepository.getCategories()
            return res.send(categories).end()
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
            if (!payload) {
                return res.status(401).end()
            }
            const result = await quizRepository.getCategoryById(req.params.id)
            if (result.ok) {
                return res.send(result.category).end()
            }
            return res.status(404).send(result.error).end()
        } catch (e) {
            console.error(e)
            return res.status(500).end()
        }
    })
    return app
}

async function main() {
    // const pool = await mysql.createPool({
    //     host: 'localhost',
    //     user: 'root',
    //     port: 3306,
    //     password: 'my-secret-pw',
    //     database: 'quiz',
    //     waitForConnections: true,
    //     connectionLimit: 10,
    //     maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    //     idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    //     queueLimit: 0,
    //     enableKeepAlive: true,
    //     keepAliveInitialDelay: 0,
    // })

    // Replace the uri string with your connection string.
    const uri = "mongodb://root:example@localhost:27017";
    const client = new MongoClient(uri);
    const database = client.db('quiz');
    const userCollection = database.collection('users');
    const categoriesCollection = database.collection('categories');

    const userRepository = new MongoUserRepository(userCollection)
    const quizRepository = new MongoQuizRepository(categoriesCollection)

    // const userRepository = new MySQLUserRepository(pool)
    // const quizRepository = new MySQLQuizRepository(pool)

    const app = buildApp(userRepository, quizRepository)

    const server = app.listen(8080, () => {
        console.log("Running http://localhost:8080")
    })

    process.on('SIGTERM', () => {
        console.log("Server closing")
        console.log("DB connections closing")
        server.close(() => {
            console.log("Server closed")
            // pool.end().finally(() => {
            client.end().finally(() => {
                console.log("DB connections closed")
            })
        })
    })
}

main().catch(console.error)