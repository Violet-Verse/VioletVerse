import { getSessionUser, canWrite, isAdmin } from "../../../lib/authz";
import { ObjectId } from "mongodb";
import connectDatabase from "../../../lib/mongoClient";

export default async function deletePost(req, res) {
    if (req.method !== "DELETE") return res.status(405).end();
    const user = await getSessionUser(req);
    if (!canWrite(user)) return res.status(403).end();

    try {
        const db = await connectDatabase();
        const posts = db.collection("posts");
        // Only the post's author or an admin can delete it.
        const existing = await posts.findOne({ _id: new ObjectId(req.body.id) });
        if (!existing) return res.status(404).end();
        if (!isAdmin(user) && existing.createdBy !== user.issuer) {
            return res.status(403).end();
        }
        await posts.deleteOne({
            _id: new ObjectId(req.body.id),
        });
        return res.status(200).json("");
    } catch (err) {
        console.log(err);
        return res.status(405).end();
    }
    return res.status(200).json("");
}
