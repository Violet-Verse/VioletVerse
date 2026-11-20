import { getSessionUser, canWrite } from "../../../lib/authz";
import { nanoid } from "nanoid";
import connectDatabase from "../../../lib/mongoClient";

function string_to_slug(str) {
    str = str.replace(/^\s+|\s+$/g, "");
    str = str.toLowerCase();
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }
    str = str
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    return str;
}

export default async function createPost(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    const user = await getSessionUser(req);
    if (!canWrite(user)) return res.status(403).end();
    const session = { issuer: user.issuer };

    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const tldr = req.body.tldr;
    const category = req.body.category;
    const body = req.body.body;
    const largeLetter = req.body.largeLetter || false;
    // Contributors can only submit drafts; an admin approves them.
    const hidden = user.role === "contributor" ? true : req.body.hidden;
    const video = req.body.video;
    const contributor = req.body.contributor;
    const tokenPrice = req.body.tokenPrice;
    const banner = !req.body.banner && !req.body.video
        ? "https://i.ibb.co/tDBm1Vj/Squared.png"
        : req.body.banner;

    const preSlug = string_to_slug(req.body.title);
    const slug = `${preSlug}-${nanoid(10)}`;

    const postData = {
        id: Date.now(),
        ...(title && { title }),
        ...(subtitle && { subtitle }),
        ...(tldr && { tldr }),
        ...(category && { category }),
        ...(body && { body }),
        ...(largeLetter && { largeLetter }),
        ...(hidden && { hidden }),
        ...(banner && { banner }),
        ...(video && { video }),
        ...(contributor && { contributor }),
        tokenPrice: tokenPrice,
        createdBy: `${session?.issuer}`,
        slug: `${slug}`,
        created: new Date(Date.now()).toISOString(),
        lastUpdated: new Date(Date.now()).toISOString(),
    };

    try {
        const db = await connectDatabase();
        if (!db) return res.status(503).json({ error: "Database not available" });
        const collection = db.collection("posts");
        const post = await collection.insertOne(postData);
        console.log(post);
        return res.status(200).json(postData || null);
    } catch (err) {
        console.log(err);
    }
}
