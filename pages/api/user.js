import { getLoginSession } from "../../lib/cookie";
import { table } from "./utils/Airtable";

export default async function user(req, res) {
    const session = await getLoginSession(req);
    // After getting the session you may want to fetch for the user instead
    // of sending the session's payload directly, this example doesn't have a DB
    // so it won't matter in this case

    const userData = await table
        .select({
            filterByFormula: `{userId} = "${session?.issuer}"`,
        })
        .firstPage();
    // console.log(userData[0].fields);

    res.status(200).json({ user: userData[0]?.fields || null });
}
