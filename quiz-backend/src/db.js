class MySQLUserRepository {
    constructor(pool) {
        this.pool = pool
    }

    getUserByUsername = async (username) => {
        const [results] = await this.pool.query("SELECT * FROM users WHERE username=?", [username])

        if (results.length === 0) {
            return {
                ok: false,
                error: "User not found"
            }
        }

        return {
            ok: true,
            user: results[0]
        }
    }

    createUser = async (user) => {
        try {
            const [results] = await this.pool.execute('INSERT INTO users(username, password) VALUES(?, ?)', [user.username, user.password])
            return { ok: true, id: results.insertId }
        } catch (err) {
            return {
                ok: false,
                error: err
            }
        }
    }

    getUserById = async (id) => {
        const [results] = await this.pool.query('SELECT username FROM users WHERE id=?', [id])
        if (results.length === 0) {
            return {
                ok: false,
                error: "User not found"
            }
        }

        return {
            ok: true,
            user: results[0]
        }
    }
}

class MySQLQuizRepository {
    constructor(pool) {
        this.pool = pool
    }

    async getCategories() {
        const [results] = await this.pool.query('SELECT id, name FROM categories')
        return results
    }

    async getCategoryById(id) {
        const category = {}
        const [results] = await this.pool.query('SELECT id, name FROM categories WHERE id=?', [id])
        if (results.length === 0) {
            return {
                ok: false,
                error: "Category not found"
            }
        }
        category['id'] = results[0].id
        category['name'] = results[0].name
        category['questions'] = []
        const [questionsResults] = await this.pool.query('SELECT id, question FROM questions WHERE category_id=?', [id])
        for (let questionResult of questionsResults) {
            const question = { id: questionResult.id, question: questionResult.question }
            const [optionsResults] = await this.pool.query('SELECT id, value, correct FROM options WHERE question_id=?', [questionResult.id])
            question['options'] = optionsResults
            category['questions'].push(question)
        }
        return {
            ok: true,
            category
        }
    }
}

module.exports = {
    MySQLUserRepository,
    MySQLQuizRepository
}