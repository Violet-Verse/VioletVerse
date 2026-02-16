import Iron from "@hapi/iron";
import { parse } from "cookie";
import { TOKEN_NAME } from "./cookie";

export function parseCookies(req) {
    // For API Routes we don't need to parse the cookies.
    if (req.cookies) return req.cookies;

    // For pages we do need to parse the cookies.
    const cookie = req.headers?.cookie;
    return parse(cookie || "");
}

export function getTokenCookie(req) {
    const cookies = parseCookies(req);
    return cookies[TOKEN_NAME];
}

export async function getLoginSession(req) {
    const token = getTokenCookie(req);

    if (!token) return;

    const session = await Iron.unseal(
        token,
        process.env.TOKEN_SECRET,
        Iron.defaults
    );
    const expiresAt = session.createdAt + session.maxAge * 1000;

    // Validate the expiration date of the session
    if (Date.now() > expiresAt) {
        throw new Error("Session expired");
    }

    return session;
}

export default getTokenCookie;
