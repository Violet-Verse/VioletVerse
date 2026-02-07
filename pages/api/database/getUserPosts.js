import { getLoginSession } from "../../../lib/cookie-auth";
import connectDatabase from "../../../lib/mongoClient";

export default async function getUserPosts(req, res) {
    try {
        const session = await getLoginSession(req);

        const db = await connectDatabase();
        if (!db) {
            return res.status(503).json({ error: "Database not configured" });
        }

        const collection = db.collection("posts");
        const posts = await collection
            .find({ createdBy: `${session?.issuer}` })
            .toArray();

        res.status(200).json(posts || null);
    } catch (error) {
        console.error("Error getting user posts:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
