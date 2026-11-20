import { getLoginSession } from "../../../lib/cookie-auth";
import { ObjectId } from "mongodb";
import connectDatabase from "../../../lib/mongoClient";

export default async function updatePost(req, res) {
    if (req.method !== "PUT") return res.status(405).end("Method Not Allowed");
    const session = await getLoginSession(req);
    if (!session?.issuer) return res.status(405).end("Access Denied");

    const accessPermission =
        session?.issuer === req.body.issuer || req.body.role === "admin";
    if (!accessPermission) return res.status(405).end("Access Denied");

    const { title, subtitle, tldr, category, body, largeLetter, hidden, video, contributor, tokenPrice, banner, id } = req.body;

    const postData = {
        ...(title && { title }),
        ...(subtitle && { subtitle }),
        tldr,
        ...(category && { category }),
        ...(body && { body }),
        largeLetter,
        hidden,
        ...(banner && { banner }),
        ...(video && { video }),
        contributor,
        tokenPrice,
        lastUpdated: new Date().toISOString(),
    };

    try {
        const db = await connectDatabase();
        if (!db) return res.status(503).end("Database not available");
        await db.collection("posts").updateOne({ _id: new ObjectId(id) }, { $set: postData });
        return res.status(200).json(postData || null);
    } catch (error) {
        return res.status(405).end("Error Updating Post");
    }
}
