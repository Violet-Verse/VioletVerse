import crypto from "crypto";

// Signed, expiring links for one-tap publishing from email.
const secret = () => {
    // Trim so a stray space or line break pasted into Vercel doesn't break auth.
    const s = (process.env.EMAIL_DRAFT_SECRET || "").trim();
    if (!s) throw new Error("EMAIL_DRAFT_SECRET isn't set in Vercel.");
    return s;
};
const b64url = (s) => Buffer.from(s).toString("base64url");
const hmac = (data) => crypto.createHmac("sha256", secret()).update(`publish:${data}`).digest("base64url");

export function signPublishToken(postId, days = 14) {
    const data = b64url(`${postId}.${Date.now() + days * 864e5}`);
    return `${data}.${hmac(data)}`;
}

// Returns the post id, or null if the link is invalid or expired.
export function verifyPublishToken(token) {
    const [data, sig] = String(token || "").split(".");
    if (!data || !sig) return null;
    const expected = hmac(data);
    if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const [postId, exp] = Buffer.from(data, "base64url").toString().split(".");
    if (!postId || Date.now() > Number(exp)) return null;
    return postId;
}

export function secretMatches(given) {
    const a = Buffer.from(String(given || "").trim());
    const b = Buffer.from(secret());
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}
