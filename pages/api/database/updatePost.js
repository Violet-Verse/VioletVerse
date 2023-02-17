import { getLoginSession } from "../../../lib/cookie-auth";
import { ObjectId } from "mongodb";
import connectDatabase from "../../../lib/mongoClient";

export default async function updatePost(req, res) {
    if (req.method !== "PUT") return res.status(405).end();
    const session = await getLoginSession(req);

    // Reject request if no user signed in
    if (!session?.issuer) {
        return res.status(405).end();
    }

    const accessPermission =
        session?.issuer === req.body.issuer || req.body.role === "admin";

    // Reject request if insufficient permissions
    if (!accessPermission) {
        return res.status(405).end();
    }

    // Allowed Parameters
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const tldr = req.body.tldr;
    const category = req.body.category;
    const body = req.body.body;
    const largeLetter = req.body.largeLetter;
    const hidden = req.body.hidden;
    const video = req.body.video;
    const contributor = req.body.contributor;
    const tokenPrice = req.body.tokenPrice;
    const banner = req.body.banner;

    // Final Object
    const postData = {
        ...(title && { title }),
        ...(subtitle && { subtitle }),
        ...(tldr && { tldr }),
        ...(category && { category }),
        ...(body && { body }),
        largeLetter: largeLetter,
        hidden: hidden,
        ...(banner && { banner }),
        ...(video && { video }),
        ...(contributor && { contributor }),
        ...(tokenPrice && { tokenPrice }),
        lastUpdated: new Date(Date.now()).toISOString(),
    };

    try {
        const db = await connectDatabase();
        await db.collection("posts").updateOne(
            {
                _id: new ObjectId(req.body.id),
            },
            {
                $set: postData,
            }
        );
        console.log(postData);
        return res.status(200).json(postData || null);
    } catch (err) {
        console.log(err);
        return res.status(405).end();
    }
}
