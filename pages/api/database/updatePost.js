import { getLoginSession } from "../../../lib/cookie-auth";
import { table } from "../utils/postsTable";

export default async function updatePost(req, res) {
    if (req.method !== "PUT") return res.status(405).end();
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

    // Allowed Parameters
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const tldr = req.body.tldr;
    const category = req.body.category;
    const body = req.body.body;
    const largeLetter = req.body.largeLetter;
    const hidden = req.body.hidden;
    const banner = req.body.banner;

    try {
        table.update(
            [
                {
                    id: id,
                    fields: {
                        ...(title && { title }),
                        ...(subtitle && { subtitle }),
                        ...(tldr && { tldr }),
                        ...(category && { category }),
                        ...(body && { body }),
                        ...(largeLetter && { largeLetter }),
                        ...(hidden && { hidden }),
                        ...(banner && { banner }),
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
