import { table } from "../utils/userTable";
import { postTable, minifyRecords } from "../utils/postsTable";

export async function getAuthorForPost(id) {
    const posts = await postTable
        .select({
            filterByFormula: `{slug} = "${id}"`,
        })
        .firstPage();

    if (posts.length === 0) {
        return null;
    }

    const minifiedRecord = minifyRecords(posts);

    const userId = minifiedRecord[0].createdBy;

    const authorData = await table
        .select({
            filterByFormula: `{userId} = "${userId}"`,
        })
        .firstPage();

    return { user: authorData[0]?.fields };
}

export default async function handler(req, res) {
    const id = req.query.id;
    const userData = await table
        .select({
            filterByFormula: `{userId} = "${id}"`,
        })
        .firstPage();

    res.status(200).json({ user: userData[0]?.fields || null });
}
