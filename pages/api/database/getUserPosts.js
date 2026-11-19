import { getLoginSession } from "../../../lib/cookie-auth";
import connectDatabase from "../../../lib/mongoClient";

export default async function getUserPosts(req, res) {
    const session = await getLoginSession(req);
    if (!session?.issuer) return res.status(200).json([]);

    try {
        const db = await connectDatabase();
        if (!db) {
            return res.status(503).json({ error: "Database unavailable" });
        }

        const posts = await db
            .collection("posts")
            .find({ createdBy: `${session.issuer}` })
            .toArray();

        return res.status(200).json(posts || []);
    } catch (err) {
        console.error("getUserPosts failed:", err);
        return res.status(500).json({ error: "Could not load posts" });
    }
}
