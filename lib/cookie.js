import Iron from "@hapi/iron";
import { serialize } from "cookie";

const TOKEN_NAME = "api_token";
export const MAX_AGE = 60 * 60 * 8; // 8 hours

function createCookie(name, data, options = {}) {
    return serialize(name, data, {
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        secure: process.env.NODE_ENV === "production",
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        ...options,
    });
}

function setTokenCookie(res, token) {
    res.setHeader("Set-Cookie", [
        createCookie(TOKEN_NAME, token),
        // createCookie("authed", true, { httpOnly: false }),
    ]);
}

function getAuthToken(cookies) {
    return cookies[TOKEN_NAME];
}

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

export function removeTokenCookie(res) {
    const cookie = serialize(TOKEN_NAME, "", {
        maxAge: -1,
        path: "/",
    });

    res.setHeader("Set-Cookie", cookie);
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
const exports = {
    setTokenCookie,
    getAuthToken,
};

export default exports;
