const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri = "mongodb://root:example@localhost:27017";
const client = new MongoClient(uri);
async function run() {
    try {
        const database = client.db('quiz');
        const userCollection = database.collection('users');
        const categoriesCollection = database.collection('categories');
        const usersCursor = await userCollection.find()
        const categoriesCursor = await categoriesCollection.find();
        for await (const doc of usersCursor) {
            console.dir(doc);
        }
        for await (const doc of categoriesCursor) {
            console.dir(doc);
        }
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);