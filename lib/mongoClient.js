import { MongoClient } from "mongodb";

let cachedClient = null;

export default async function connectDatabase() {
    if (cachedClient) {
        return cachedClient.db("vv_blog");
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI environment variable is not set");
    }

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await client.connect();
    cachedClient = client;

    return client.db("vv_blog");
}
