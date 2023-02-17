import { getLoginSession } from "../../../lib/cookie-auth";
import connectDatabase from "../../../lib/mongoClient";

export default async function getUserPosts(req, res) {
    const session = await getLoginSession(req);

    const db = await connectDatabase();

    const collection = db.collection("posts");
    const posts = await collection
        .find({ createdBy: `${session?.issuer}` })
        .toArray();

    res.status(200).json(posts || null);
}
