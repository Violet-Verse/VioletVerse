import { table, minifyRecords } from "../utils/postsTable";

export default async function getPostsByID(req, res) {
    const posts = await table
        .select({
            filterByFormula: `{id} = "${req.query.id}"`,
        })
        .firstPage();

    const minifiedRecords = minifyRecords(posts);

    res.status(200).json(minifiedRecords || null);
}
