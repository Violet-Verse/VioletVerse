import { minifyRecords } from "../utils/postsTable";
import { table } from "../utils/userTable";

export async function getUsersByRole(role) {
    if (!table) {
        console.warn("Airtable user table not configured. Returning empty array.");
        return [];
    }

    try {
        const userData = await table
            .select({
                filterByFormula: `{role} = "${role}"`,
            })
            .firstPage();

        const minifiedRecords = minifyRecords(userData);
        return minifiedRecords;
    } catch (error) {
        console.error("Error fetching users by role:", error.message);
        return [];
    }
}

export default async function getUserbyEmail(req, res) {
    if (!table) {
        return res.status(503).json({ user: null, error: "Airtable not configured" });
    }

    const email = req.query.id;
    const userData = await table
        .select({
            filterByFormula: `{email} = "${email}"`,
        })
        .firstPage();

    res.status(200).json({ user: userData[0]?.fields || null });
}
