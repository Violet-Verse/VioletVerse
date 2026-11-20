import { getLoginSession } from "./cookie-auth";
import { getUserByIssuer } from "../pages/api/database/getUser";

// Looks up the signed-in user's role on the server (Airtable users table),
// so API routes never trust a role or issuer sent by the browser.
export async function getSessionUser(req) {
    const session = await getLoginSession(req);
    if (!session?.issuer) return null;
    try {
        const user = await getUserByIssuer(session.issuer);
        return { issuer: session.issuer, role: user?.role || "user" };
    } catch (err) {
        console.error("Role lookup failed:", err);
        return null;
    }
}

export const isAdmin = (u) => u?.role === "admin";
export const canWrite = (u) => u?.role === "admin" || u?.role === "contributor";
