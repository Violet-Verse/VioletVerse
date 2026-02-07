import { MongoClient } from "mongodb";

let client = null;

export default async function connectDatabase() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.warn("MONGODB_URI is not set. Database operations will not work.");
        return null;
    }

    if (!client) {
        client = new MongoClient(uri);
    }

    await client.connect();
    return client.db("vv_blog");
}
