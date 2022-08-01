import { table, minifyRecords } from "../utils/postsTable";

export default async function getAllPosts(req, res) {
    const posts = await table
        .select({ filterByFormula: `{hidden} != "true"` })
        .firstPage();

    const minifiedRecords = minifyRecords(posts);

    res.status(200).json(minifiedRecords || null);
}
