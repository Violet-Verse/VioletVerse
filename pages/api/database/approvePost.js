import { getSessionUser, isAdmin } from "../../../lib/authz";
import { ObjectId } from "mongodb";
import connectDatabase from "../../../lib/mongoClient";

export default async function handler(req, res) {
    if (req.method !== "PUT") { res.status(405).end(); return; }
    // Only admins can publish or hide posts.
    const user = await getSessionUser(req);
    if (!isAdmin(user)) { res.status(403).end(); return; }

    const hidden = req.body.hidden === true;
    const fields = { hidden };

    try {
        const db = await connectDatabase();
        if (!db) { res.status(503).end(); return; }
        await db.collection("posts").updateOne(
            { _id: new ObjectId(req.body._id) },
            { $set: fields }
        );
        return res.status(200).json(fields || null);
    } catch (err) {
        console.log(err);
        return res.status(405).end();
    }
}

export const config = { api: { externalResolver: true } };
