import Iron from "@hapi/iron";
import CookieService, { MAX_AGE } from "../../../lib/cookie";
import { table } from "../utils/userTable";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, adminKey } = req.body;

    if (!email || !adminKey) {
        return res.status(400).json({ error: "Email and admin key are required" });
    }

    if (adminKey !== process.env.ADMIN_LOGIN_SECRET) {
        return res.status(401).json({ error: "Invalid admin key" });
    }

    try {
        const records = await table
            .select({
                filterByFormula: `{email} = "${email}"`,
            })
            .firstPage();

        const existingUser = records[0]?.fields;

        if (!existingUser) {
            return res.status(404).json({ error: "No user found with that email" });
        }

        if (existingUser.role !== "admin" && existingUser.role !== "contributor") {
            return res.status(403).json({ error: "User does not have dashboard access" });
        }

        const sessionUser = {
            issuer: existingUser.userId,
            address: existingUser.userId,
            email: email,
            createdAt: Date.now(),
            maxAge: MAX_AGE,
        };

        const token = await Iron.seal(
            sessionUser,
            process.env.TOKEN_SECRET,
            Iron.defaults
        );
        CookieService(res, token);

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Direct login error:", err);
        return res.status(500).json({ error: "Login failed. Please try again." });
    }
}
