import { table, minifyRecords } from "../utils/postsTable";

export default async function getAllPosts(req, res) {
    const posts = await table.select({}).firstPage();

    const minifiedRecords = minifyRecords(posts);

    // console.log(posts);

    res.status(200).json(minifiedRecords || null);
}
