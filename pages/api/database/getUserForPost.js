import { table } from "../utils/userTable";

export async function getAuthorForPost(post) {
    try {
        const userId = post?.createdBy;
        if (!userId) return null;
        if (!table) return { user: null };

        const authorData = await table
            .select({
                filterByFormula: `{userId} = "${userId}"`,
            })
            .firstPage();

        return { user: authorData[0]?.fields || null };
    } catch (error) {
        console.error("Error getting author for post:", error.message);
        return null;
    }
}

export async function getContributorForPost(post) {
    try {
        const email = post?.contributor;
        if (!email) return null;
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
