import { getLoginSession } from "../../../lib/cookie-auth";
import { table } from "../utils/postsTable";

export default async function updatePost(req, res) {
    if (req.method !== "PUT") return res.status(405).end();
    const session = await getLoginSession(req);

    // Retrieved Session
    // Now get user data.....

    if (!session?.issuer) {
        return res.status(405).end();
    }

    if (session?.issuer !== req.body.issuer) {
        return res.status(405).end();
    }

    const postData = await table
        .select({
            filterByFormula: `{id} = "${req.body.id}"`,
        })
        .firstPage();

    const id = postData[0].id;

    try {
        table.update(
            [
                {
                    id: id,
                    fields: {
                        title: `${req.body.title}`,
                        subtitle: `${req.body.tldr}`,
                        tldr: `${req.body.tldr}`,
                        category: `${req.body.category}`,
                        body: `${req.body.body}`,
                        noLargeLetter: `${req.body.noLargeLetter}`,
                    },
                },
            ],
            function (err, records) {
                if (err) {
                    console.error(err);
                    return res.status(405).end();
                }
                console.log(records[0].fields);
                return res.status(200).json(records[0].fields || null);
            }
        );
    } catch (err) {
        console.log(err);
        return res.status(405).end();
    }
}
