import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

// Cache the client promise across hot-reloads in development
let cachedClient = null;
let cachedDb = null;

export default async function connectDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    if (!cachedClient) {
        cachedClient = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    await cachedClient.connect();
    cachedDb = cachedClient.db("vv_blog");
    return cachedDb;
}
