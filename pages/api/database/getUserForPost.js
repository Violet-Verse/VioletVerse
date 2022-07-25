import { table } from "../utils/userTable";

export default async function getUserForPost(req, res) {
    const id = req.query.id;
    const userData = await table
        .select({
            filterByFormula: `{userId} = "${id}"`,
        })
        .firstPage();

    // console.log(userData[0].fields);

    res.status(200).json({ user: userData[0]?.fields || null });
}
