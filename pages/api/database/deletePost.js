import { getLoginSession } from "../../../lib/cookie-auth";
import { ObjectId } from "mongodb";
import connectDatabase from "../../../lib/mongoClient";

export default async function deletePost(req, res) {
    if (req.method !== "DELETE") return res.status(405).end();
    const session = await getLoginSession(req);

    // Reject request if no user signed in
    if (!session?.issuer) {
        return res.status(405).end();
    }

    // Reject request if user is not the author
    if (session?.issuer !== req.body.issuer) {
        return res.status(405).end();
    }

    try {
        const db = await connectDatabase();
        await db.collection("posts").deleteOne({
            _id: new ObjectId(req.body.id),
        });
        return res.status(200).json("");
    } catch (err) {
        console.log(err);
        return res.status(405).end();
    }
    return res.status(200).json("");
}
