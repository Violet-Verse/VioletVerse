import { getLoginSession } from "../../../lib/cookie-auth";
import { postTable } from "../utils/postsTable";

export default async function handler(req, res) {
    if (req.method !== "PUT") {
        res.status(405).end();
        return;
    }

    const session = await getLoginSession(req);

    if (!session?.issuer) {
        res.status(405).end();
        return;
    }

    try {
        const postData = await postTable
            .select({
                filterByFormula: `{slug} = "${req.body.slug}"`,
            })
            .firstPage();

        if (postData.length === 0) {
            res.status(404).end();
            return;
        }

        const { id } = postData[0];
        const { hidden } = req.body;
        const fields = { hidden };

        const updateResult = await postTable.update([{ id, fields }]);

        res.status(200).json(updateResult[0].fields);
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
}

export const config = {
    api: {
        externalResolver: true,
    },
};
