const {ObjectId} = require("mongodb")

const withId = (doc) => ({ ...doc, id: doc._id })

class MongoUserRepository {
    constructor(userCollection) {
        this.userCollection = userCollection
    }

    getUserByUsername = async (username) => {
        const user = await this.userCollection.findOne({ username })
        if (!user) {
            return {
                ok: false,
                error: "Not Found"
            }
        }
        return {
            ok: true,
            user: withId(user)
        }
    }

    createUser = async (user) => {
        const userDoc = await this.userCollection.insertOne(user)
        if (!userDoc) {
            return {
                ok: false,
                error: "Error create user"
            }
        }
        return {
            ok: true,
            user: withId(userDoc),
        }
    }

    getUserById = async (id) => {
        const user = await this.userCollection.findOne({ _id: new ObjectId(id) })
        if (!user) {
            return {
                ok: false,
                error: "User not found"
            }
        }
        return {
            ok: true,
            user: withId(user),
        }
    }
}

class MongoQuizRepository {
    constructor(categoriesCollection) {
        this.categoriesCollection = categoriesCollection
    }

    async getCategories() {
        const categories = []
        const categoriesCursor = await this.categoriesCollection.find();
        for await (const doc of categoriesCursor) {
            categories.push(withId(doc));
        }
        return categories
    }

    async getCategoryById(id) {
        const category = await this.categoriesCollection.findOne({ _id: new ObjectId(id) })
        if (!category) {
            return {
                ok: false,
                error: "Category not found"
            }
        }
        return {
            ok: true,
            category: withId(category)
        }
    }
}

module.exports = {
    MongoUserRepository,
    MongoQuizRepository
}