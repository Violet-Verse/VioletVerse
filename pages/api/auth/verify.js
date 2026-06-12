import { PrivyClient } from "@privy-io/node";
import Iron from "@hapi/iron";
import CookieService, { MAX_AGE } from "../../../lib/cookie";
import { table } from "../utils/userTable";
import fetch from "node-fetch";

let _privyClient = null;

function getPrivyClient() {
    if (_privyClient) return _privyClient;

    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
    const appSecret = process.env.PRIVY_APP_SECRET;

    if (!appId || !appSecret) {
        throw new Error(
            "Privy environment variables are not set (NEXT_PUBLIC_PRIVY_APP_ID, PRIVY_APP_SECRET)"
        );
    }

    _privyClient = new PrivyClient({ appId, appSecret });
    return _privyClient;
}

// Helper: find user by email in Airtable
async function findUserByEmail(email) {
    if (!email) return null;
    const records = await table
        .select({
            filterByFormula: `{email} = "${email}"`,
        })
        .firstPage();
    return records[0]?.fields || null;
}

// Helper: find user by userId in Airtable
async function findUserByUserId(userId) {
    if (!userId) return null;
    const records = await table
        .select({
            filterByFormula: `{userId} = "${userId}"`,
        })
        .firstPage();
    return records[0]?.fields || null;
}

// Helper: create new user in Airtable
function createUser(userId, email) {
    return new Promise((resolve, reject) => {
        table.create(
            [
                {
                    fields: {
                        userId: userId,
                        email: email || "",
                        role: "user",
                        flowAddress: "",
                        username: userId,
                        name: userId,
                    },
                },
            ],
            (err, records) => {
                if (err) return reject(err);
                resolve(records[0].fields);
            }
        );
    });
}

// Helper: create Stardust player
async function createStardustPlayer(userId, email) {
    try {
        const res = await fetch("https://core-api.stardust.gg/v1/player/create", {
            method: "POST",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                "x-api-key": process.env.STARDUST_KEY,
            },
            body: JSON.stringify({ userId, email }),
        });
        return await res.json();
    } catch (err) {
        console.error("Stardust.gg create error:", err);
        return null;
    }
}

// Helper: get Stardust player
async function getStardustPlayer(userId) {
    try {
        const res = await fetch(
            `https://core-api.stardust.gg/v1/player/get?playerId=${userId}`,
            {
                method: "GET",
                headers: {
                    accept: "application/json",
                    "x-api-key": process.env.STARDUST_KEY,
                },
            }
        );
        return await res.json();
    } catch (err) {
        console.error("Stardust.gg get error:", err);
        return null;
    }
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { accessToken } = req.body;

    if (!accessToken) {
        return res.status(400).json({ error: "Missing access token" });
    }

    try {
        // 1. Verify the Privy access token
        const privyClient = getPrivyClient();
        const verifiedClaims = await privyClient
            .utils()
            .auth()
            .verifyAccessToken(accessToken);
        const privyUserId = verifiedClaims.user_id;

        // 2. Get the full Privy user to extract email and wallet info
        const privyUser = await privyClient.users()._get(privyUserId);

        const email =
            privyUser.linked_accounts?.find((a) => a.type === "email")
                ?.address || null;

        const walletAddress =
            privyUser.linked_accounts?.find((a) => a.type === "wallet")
                ?.address || null;

        // 3. Migration: try to find existing user by email first
        let existingUser = null;

        if (email) {
            existingUser = await findUserByEmail(email);
        }

        // 4. If no match by email, try by Privy user ID (for returning Privy users)
        if (!existingUser) {
            existingUser = await findUserByUserId(privyUserId);
        }

        if (existingUser) {
            // Existing user found -- use their existing userId as issuer
            const sessionUser = {
                issuer: existingUser.userId,
                address: existingUser.userId,
                email: email || existingUser.email,
                createdAt: Date.now(),
                maxAge: MAX_AGE,
            };

            const token = await Iron.seal(
                sessionUser,
                process.env.TOKEN_SECRET,
                Iron.defaults
            );
            CookieService(res, token);

            const stardustData = await getStardustPlayer(existingUser.userId);

            return res.status(200).json({
                userData: existingUser,
                registration: false,
                stardustData,
            });
        } else {
            // 5. New user -- create in Airtable with Privy user ID as userId
            const newUser = await createUser(privyUserId, email);

            const sessionUser = {
                issuer: privyUserId,
                address: privyUserId,
                email: email || "",
                createdAt: Date.now(),
                maxAge: MAX_AGE,
            };

            const token = await Iron.seal(
                sessionUser,
                process.env.TOKEN_SECRET,
                Iron.defaults
            );
            CookieService(res, token);

            const stardustData = await createStardustPlayer(
                privyUserId,
                email
            );

            return res.status(200).json({
                userData: newUser,
                registration: true,
                stardustData,
            });
        }
    } catch (err) {
        console.error("Privy verify error:", err);
        return res.status(401).json({ error: "Authentication failed" });
    }
}
