import { getLoginSession } from "../../../lib/cookie-auth";
import { table, getMinifiedRecord } from "../utils/postsTable";

export default async function deletePost(req, res) {
    if (req.method !== "DELETE") return res.status(405).end();
    const session = await getLoginSession(req);

    // Reject request if no user signed in
    if (!session?.issuer) {
        return res.status(405).end();
    }

    // Reject request if user is not the author
    if (session?.issuer !== req.body.issuer) {
        return res.status(405).end();
    }

    // Get Airtable ID of the edited post
    const postData = await table
        .select({
            filterByFormula: `{id} = "${req.body.id}"`,
        })
        .firstPage();
    const id = postData[0].id;

    try {
        await table.destroy([id]);
        return res.status(200).json("");
    } catch (err) {
        console.log(err);
        return res.status(405).end();
    }
    return res.status(200).json("");
}
