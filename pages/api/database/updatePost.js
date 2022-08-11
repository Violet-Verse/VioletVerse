import { getLoginSession } from "../../../lib/cookie-auth";
import { postTable } from "../utils/postsTable";

export default async function updatePost(req, res) {
    if (req.method !== "PUT") return res.status(405).end();
    const session = await getLoginSession(req);

    // Reject request if no user signed in
    if (!session?.issuer) {
        return res.status(405).end();
    }

    const accessPermission =
        session?.issuer === req.body.issuer || req.body.role === "admin";

    // Reject request if insufficient permissions
    if (!accessPermission) {
        return res.status(405).end();
    }

    // Get Airtable ID of the edited post
    const postData = await postTable
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
    const video = req.body.video;
    const contributor = req.body.contributor;
    const banner = req.body.banner;

    try {
        postTable.update(
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
                        ...(video && { video }),
                        contributor: `${contributor}`,
                        lastEditedBy: `${session?.issuer}`,
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
