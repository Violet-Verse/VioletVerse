import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let clientPromise = null;

if (uri) {
    const client = new MongoClient(uri);
    if (process.env.NODE_ENV === "development") {
        // In development, use a global variable so connections persist across HMR
        if (!global._mongoClientPromise) {
            global._mongoClientPromise = client.connect();
        }
        clientPromise = global._mongoClientPromise;
    } else {
        clientPromise = client.connect();
    }
}

export default async function connectDatabase() {
    if (!clientPromise) {
        console.warn("MONGODB_URI is not set. Database operations will not work.");
        return null;
    }

    const client = await clientPromise;
    return client.db("vv_blog");
}
