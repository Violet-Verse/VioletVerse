import { MongoClient } from "mongodb";

let client = null;
let connected = false;

export default async function connectDatabase() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.warn("MONGODB_URI is not set. Database operations will not work.");
        return null;
    }

    try {
        if (!client) {
            client = new MongoClient(uri);
        }
        if (!connected) {
            await client.connect();
            connected = true;
        }
        return client.db("vv_blog");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        client = null;
        connected = false;
        return null;
    }
}
