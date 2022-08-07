import { getLoginSession } from "../../../lib/cookie-auth";
import { table } from "../utils/postsTable";

export default async function createPost(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    const session = await getLoginSession(req);

    // Reject request if no user signed in
    if (!session?.issuer) {
        return res.status(405).end();
    }

    // Allowed Parameters
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const tldr = req.body.tldr;
    const category = req.body.category;
    const body = req.body.body;
    const largeLetter = req.body.largeLetter || "false";
    const hidden = req.body.hidden;
    const video = req.body.video;
    const contributor = req.body.contributor;
    const banner =
        !req.body.banner && !req.body.video
            ? "https://i.ibb.co/tDBm1Vj/Squared.png"
            : req.body.banner;
    // const banner = req.body.banner || "https://i.ibb.co/tDBm1Vj/Squared.png";

    try {
        table.create(
            [
                {
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
                        createdBy: `${session?.issuer}`,
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
    }
}
