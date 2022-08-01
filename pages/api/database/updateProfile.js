import { getLoginSession } from "../../../lib/cookie-auth";
import { table } from "../utils/userTable";

export default async function updateUser(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    const session = await getLoginSession(req);

    // Retrieved Session
    // Now get user data.....

    if (!session?.issuer) {
        res.status(405).end();
    }

    const userData = await table
        .select({
            filterByFormula: `{userId} = "${session?.issuer}"`,
        })
        .firstPage();

    const id = userData[0].id;
    const prevFields = userData[0].fields;

    // console.log(req.body.name);

    try {
        table.update(
            [
                {
                    id: id,
                    fields: {
                        name: `${req.body.name}`,
                        bio: `${req.body.bio}`,
                        picture: `${req.body.picture}`,
                    },
                },
            ],
            function (err, records) {
                if (err) {
                    console.error(err);
                    return;
                }
                // console.log(records[0].fields);
                res.status(200).json(records[0].fields);
            }
        );
    } catch (err) {
        console.log(err);
    }

    // res.end();
}
