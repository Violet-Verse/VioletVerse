import { getLoginSession } from "../../../lib/cookie-auth";
import { table } from "../utils/userTable";

export default async function updateUser(req, res) {
    if (req.method !== "PUT") return res.status(405).end();
    const session = await getLoginSession(req);

    // Retrieved Session
    // Now get user data.....

    if (!session?.issuer) {
        return res.status(405).end();
    }

    const userData = await table
        .select({
            filterByFormula: `{userId} = "${session?.issuer}"`,
        })
        .firstPage();

    const id = userData[0].id;

    const name = req.body.name;
    const bio = req.body.bio;
    const picture = req.body.picture;

    try {
        table.update(
            [
                {
                    id: id,
                    fields: {
                        ...(name && { name }),
                        ...(bio && { bio }),
                        ...(picture && { picture }),
                    },
                },
            ],
            function (err, records) {
                if (err) {
                    console.error(err);
                    return res.status(405).end();
                } else {
                    // console.log(records[0].fields);
                    return res.status(200).json(records[0].fields || null);
                }
            }
        );
    } catch (err) {
        console.log(err);
        return res.status(405).end();
    }
}
