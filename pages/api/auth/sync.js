import { table } from "../utils/userTable";

// POST /api/auth/sync
// Syncs Privy user data (wallet, email) to Airtable.
// - If user exists (by wallet or email), returns their record with role.
// - If user is new, creates a record with role "user".
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    if (!table) {
        // Airtable not configured -- return a default user role so the app still works
        return res.status(200).json({
            user: {
                role: "user",
                synced: false,
            },
        });
    }

    const { wallet, email, privyId } = req.body;

    if (!wallet && !email) {
        return res.status(400).json({ error: "wallet or email required" });
    }

    try {
        // Try to find existing user by wallet address first, then email
        let existingUser = null;

        if (wallet) {
            const byWallet = await table
                .select({
                    filterByFormula: `{wallet} = "${wallet}"`,
                    maxRecords: 1,
                })
                .firstPage();
            if (byWallet.length > 0) {
                existingUser = byWallet[0];
            }
        }

        if (!existingUser && email) {
            const byEmail = await table
                .select({
                    filterByFormula: `{email} = "${email}"`,
                    maxRecords: 1,
                })
                .firstPage();
            if (byEmail.length > 0) {
                existingUser = byEmail[0];
            }
        }

        if (existingUser) {
            // Update existing record with latest wallet/email if missing
            const updates = {};
            if (wallet && !existingUser.fields.wallet) {
                updates.wallet = wallet;
            }
            if (email && !existingUser.fields.email) {
                updates.email = email;
            }
            if (privyId && !existingUser.fields.privyId) {
                updates.privyId = privyId;
            }

            if (Object.keys(updates).length > 0) {
                await table.update(existingUser.id, updates);
            }

            return res.status(200).json({
                user: {
                    ...existingUser.fields,
                    airtableId: existingUser.id,
                    synced: true,
                },
            });
        }

        // Create new user record in Airtable
        const newRecord = await table.create({
            wallet: wallet || "",
            email: email || "",
            privyId: privyId || "",
            role: "user", // Default role for new users
            name: email || (wallet ? wallet.slice(0, 8) + "..." : "New User"),
        });

        return res.status(200).json({
            user: {
                ...newRecord.fields,
                airtableId: newRecord.id,
                synced: true,
            },
        });
    } catch (error) {
        console.error("Error syncing user to Airtable:", error.message);
        return res.status(500).json({
            error: "Failed to sync user",
            user: { role: "user", synced: false },
        });
    }
}
