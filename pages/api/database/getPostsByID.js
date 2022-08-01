import { table, minifyRecords } from "../utils/postsTable";

export default async function getPostsByID(req, res) {
    const posts = await table
        .select({
            filterByFormula: `{id} = "${req.query.id}"`,
        })
        .firstPage();

    if (posts.length === 0) {
        res.status(200).json(null);
    }

    const minifiedRecords = minifyRecords(posts);

    res.status(200).json(minifiedRecords || null);
}
