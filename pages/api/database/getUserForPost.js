import { table } from "../utils/userTable";
import { postTable, minifyRecords } from "../utils/postsTable";
import connectDatabase from "../../../lib/mongoClient";

export async function getAuthorForPost(id) {
    try {
        const db = await connectDatabase();
        if (!db) return null;

        const collection = db.collection("posts");
        const posts = await collection.find({ slug: id }).toArray();

        if (posts.length === 0) {
            return null;
        }

        const userId = posts[0].createdBy;

        if (!table) return { user: null };

        const authorData = await table
            .select({
                filterByFormula: `{userId} = "${userId}"`,
            })
            .firstPage();

        return { user: authorData[0]?.fields };
    } catch (error) {
        console.error("Error getting author for post:", error.message);
        return null;
    }
}

export async function getContributorForPost(id) {
    try {
        const db = await connectDatabase();
        if (!db) return null;

        const collection = db.collection("posts");
        const posts = await collection.find({ slug: id }).toArray();

        if (posts.length === 0) {
            return null;
        }

        const email = posts[0].contributor;

        if (!table) return { user: null };

        const contributorData = await table
            .select({
                filterByFormula: `{email} = "${email}"`,
            })
            .firstPage();

        return { user: contributorData[0]?.fields || null };
    } catch (error) {
        console.error("Error getting contributor for post:", error.message);
        return null;
    }
}

export default async function handler(req, res) {
    if (!table) {
        return res.status(503).json({ user: null, error: "Airtable not configured" });
    }

    const id = req.query.id;
    const userData = await table
        .select({
            filterByFormula: `{userId} = "${id}"`,
        })
        .firstPage();

    res.status(200).json({ user: userData[0]?.fields || null });
}
