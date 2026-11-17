import { MongoClient } from "mongodb";

let cachedClient = null;
let cachedDb = null;

export default async function connectDatabase() {
    if (cachedDb) return cachedDb;

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('connectDatabase: MONGODB_URI is not set');
        return null;
    }

    try {
        if (!cachedClient) {
            cachedClient = new MongoClient(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }
        await cachedClient.connect();
        cachedDb = cachedClient.db("vv_blog");
        return cachedDb;
    } catch (err) {
        console.error('connectDatabase: connection failed:', err.message);
        cachedClient = null;
        cachedDb = null;
        return null;
    }
}
