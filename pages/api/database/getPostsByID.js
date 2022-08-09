import { table, minifyRecords } from "../utils/postsTable";

export async function getPostsByID(id) {
    const posts = await table
        .select({
            filterByFormula: `{id} = "${id}"`,
        })
        .firstPage();

    if (posts.length === 0) {
        return null;
    }

    const minifiedRecords = minifyRecords(posts);

    return minifiedRecords;
}

export async function getPostsBySlug(id) {
    const posts = await table
        .select({
            filterByFormula: `{slug} = "${id}"`,
        })
        .firstPage();

    if (posts.length === 0) {
        return null;
    }

    const minifiedRecords = minifyRecords(posts);

    return minifiedRecords;
}

export default async function handler(req, res) {
    const jsonData = await getPostsByID(req.query.id);

    res.status(200).json(jsonData || null);
}
