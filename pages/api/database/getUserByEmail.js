import { table } from "../utils/userTable";

export default async function getUserbyEmail(req, res) {
    const email = req.query.id;
    const userData = await table
        .select({
            filterByFormula: `{email} = "${email}"`,
        })
        .firstPage();

    res.status(200).json({ user: userData[0]?.fields || null });
}
