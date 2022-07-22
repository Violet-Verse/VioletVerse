import { getLoginSession } from "../../../lib/cookie-auth";
import { table } from "../utils/Airtable";

export default async function getUser(req, res) {
    const session = await getLoginSession(req);

    // Retrieved Session
    // Now get user data.....

    const userData = await table
        .select({
            filterByFormula: `{userId} = "${session?.issuer}"`,
        })
        .firstPage();

    // console.log(userData[0].fields);

    res.status(200).json({ user: userData[0]?.fields || null });
}
