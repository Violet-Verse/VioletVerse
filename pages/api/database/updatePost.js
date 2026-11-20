import { getSessionUser, canWrite, isAdmin } from "../../../lib/authz";
import { ObjectId } from "mongodb";
import connectDatabase from "../../../lib/mongoClient";

export default async function updatePost(req, res) {
    if (req.method !== "PUT") return res.status(405).end("Method Not Allowed");
    const user = await getSessionUser(req);
    if (!canWrite(user)) return res.status(403).end("Access Denied");

    const { title, subtitle, tldr, category, body, largeLetter, hidden, video, contributor, tokenPrice, banner, id } = req.body;

    // Contributors can't make a post live by editing it.
    const safeHidden = isAdmin(user) ? hidden : true;

    const postData = {
        ...(title && { title }),
        ...(subtitle && { subtitle }),
        tldr,
        ...(category && { category }),
        ...(body && { body }),
        largeLetter,
        hidden: safeHidden,
        ...(banner && { banner }),
        ...(video && { video }),
        contributor,
        tokenPrice,
        lastUpdated: new Date().toISOString(),
    };

    try {
        const db = await connectDatabase();
        if (!db) return res.status(503).end("Database not available");
        const posts = db.collection("posts");
        // Permission comes from the stored post, not from what the browser sends.
        const existing = await posts.findOne({ _id: new ObjectId(id) });
        if (!existing) return res.status(404).end("Post not found");
        if (!isAdmin(user) && existing.createdBy !== user.issuer) {
            return res.status(403).end("Access Denied");
        }
        await posts.updateOne({ _id: new ObjectId(id) }, { $set: postData });
        return res.status(200).json(postData || null);
    } catch (error) {
        return res.status(405).end("Error Updating Post");
    }
}
