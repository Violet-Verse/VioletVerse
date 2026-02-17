import { getLoginSession } from "../../../lib/cookie-auth";
import { table } from "../utils/userTable";

export async function getUserByIssuer(issuer) {
    const userData = await table
        .select({
            filterByFormula: `{userId} = "${issuer}"`,
        })
        .firstPage();

    return userData[0]?.fields;
}

export async function getUserByUsername(username) {
    const userData = await table
        .select({
            filterByFormula: `{username} = "${username}"`,
        })
        .firstPage();

    return userData[0]?.fields;
}

export default async function handler(req, res) {
    try {
        const session = await getLoginSession(req);
        const userData = await getUserByIssuer(session?.issuer);
        res.status(200).json({ user: userData || null });
    } catch (err) {
        res.status(200).json({ user: null });
    }
}
