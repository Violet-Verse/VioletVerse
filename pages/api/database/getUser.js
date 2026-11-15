import { getLoginSession } from "../../../lib/cookie-auth";
import { table } from "../utils/userTable";

export async function getUserByIssuer(issuer) {
    if (!table) return null;

    try {
        const userData = await table
            .select({
                filterByFormula: `{userId} = "${issuer}"`,
            })
            .firstPage();

        return userData[0]?.fields;
    } catch (error) {
        console.error("Error getting user by issuer:", error.message);
        return null;
    }
}

export async function getUserByUsername(username) {
    if (!table) return null;

    try {
        const userData = await table
            .select({
                filterByFormula: `{username} = "${username}"`,
            })
            .firstPage();

        return userData[0]?.fields;
    } catch (error) {
        console.error("Error getting user by username:", error.message);
        return null;
    }
}

export default async function handler(req, res) {
    try {
        const session = await getLoginSession(req);

        if (!table) {
            return res.status(200).json({ user: null });
        }

        const userData = await getUserByIssuer(session?.issuer);

        res.status(200).json({ user: userData || null });
    } catch (error) {
        console.error("Error in getUser handler:", error.message);
        res.status(200).json({ user: null });
    }
}
