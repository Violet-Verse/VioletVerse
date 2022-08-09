import { postTable, minifyRecords } from "../utils/postsTable";

export async function getAllPosts() {
    const posts = await postTable
        .select({ filterByFormula: `{hidden} != "true"` })
        .firstPage();

    const minifiedRecords = minifyRecords(posts);
    return minifiedRecords;
}

export default async function handler(req, res) {
    const jsonData = await getAllPosts();

    res.status(200).json(jsonData || null);
}
