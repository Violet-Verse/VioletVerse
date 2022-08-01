import { getLoginSession } from "../../../lib/cookie-auth";
import { table } from "../utils/postsTable";

export default async function createPost(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    const session = await getLoginSession(req);

    // Retrieved Session
    // Now get user data.....

    if (!session?.issuer) {
        res.status(405).end();
    }

    try {
        table.create(
            [
                {
                    fields: {
                        title: `${req.body.title}`,
                        subtitle: `${req.body.tldr}`,
                        tldr: `${req.body.tldr}`,
                        category: `${req.body.category}`,
                        body: `${req.body.body}`,
                        noLargeLetter: `${req.body.noLargeLetter}`,
                        banner: `https://i.imgur.com/DGN3WU9.png`,
                        createdBy: `${session?.issuer}`,
                    },
                },
            ],
            function (err, records) {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(records[0].fields);
                res.status(200).json(records[0].fields || null);
            }
        );
    } catch (err) {
        console.log(err);
    }

    // res.redirect(307, "/dashboard");
}
