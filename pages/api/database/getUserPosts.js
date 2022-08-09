import { getLoginSession } from "../../../lib/cookie-auth";
import { postTable, minifyRecords } from "../utils/postsTable";

export default async function getUserPosts(req, res) {
    const session = await getLoginSession(req);
    const posts = await postTable
        .select({
            filterByFormula: `{createdBy} = "${session?.issuer}"`,
        })
        .firstPage();
    const minifiedRecords = minifyRecords(posts);

    res.status(200).json(minifiedRecords || null);
}
