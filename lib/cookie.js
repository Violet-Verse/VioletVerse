import { serialize } from "cookie";

export const TOKEN_NAME = "api_token";
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

export function removeTokenCookie(res) {
    const cookie = serialize(TOKEN_NAME, "", {
        maxAge: -1,
        path: "/",
    });

    res.setHeader("Set-Cookie", cookie);
}

export default setTokenCookie;
